import { RemoveableRef } from "@vueuse/core";
import { sendMessage, onMessage } from "webext-bridge";
import { tabs } from "webextension-polyfill";
import { MediaQueueDetails, MediaStatus } from "@/logic/types";
import {
  numPlayingTabs,
  mediaQueue,
  autoPause,
  mediaQueueDetails,
} from "@/logic";

const rebuildDetailsList = async (
  dependency: number[],
  target: RemoveableRef<MediaQueueDetails[]>
) => {
  try {
    const values = await Promise.all(
      dependency.map(async (id, i) => {
        const {
          title: pageTitle = "Title",
          favIconUrl = "",
          url = "",
          windowId = 0,
        } = await tabs.get(id);
        const { title } = await sendMessage(
          "check-title",
          {},
          `content-script@${id}`
        );
        const status =
          i < numPlayingTabs.value ? MediaStatus.PLAYING : MediaStatus.PAUSED;
        return {
          pageTitle,
          favIconUrl,
          title,
          tabId: id,
          status,
          windowId,
          url,
        };
      })
    );
    target.value = values;
  } catch {}
};

export const registerMediaModule = () => {
  onMessage("add-to-playing-queue", ({ sender }) => {
    const playingQueue = mediaQueue.value.slice(0, numPlayingTabs.value);
    // already in playing queue, no action required
    if (playingQueue.includes(sender.tabId)) return;

    // remove all instances from queue
    const filteredQueue = mediaQueue.value.filter((id) => id !== sender.tabId);

    if (autoPause.value) {
      // pause all other playing media
      playingQueue.forEach((id) => {
        sendMessage("pause-media", {}, `content-script@${id}`);
      });
    }
    mediaQueue.value = [sender.tabId, ...filteredQueue];
    numPlayingTabs.value = numPlayingTabs.value + 1;
  });

  onMessage("add-to-paused-queue", ({ sender }) => {
    const pausedQueue = mediaQueue.value.slice(numPlayingTabs.value);
    // already in paused queue, no action required
    if (pausedQueue.includes(sender.tabId)) return;

    const filteredQueue = mediaQueue.value.filter((id) => id !== sender.tabId);

    numPlayingTabs.value = numPlayingTabs.value - 1;
    // insert tab after playing tabs
    filteredQueue.splice(numPlayingTabs.value, 0, sender.tabId);
    mediaQueue.value = filteredQueue;
  });

  onMessage("remove-from-queue", ({ sender }) => {
    mediaQueue.value = mediaQueue.value.filter((id) => id !== sender.tabId);
  });

  watch(mediaQueue, async (value) => {
    rebuildDetailsList(value, mediaQueueDetails);
  });
};
