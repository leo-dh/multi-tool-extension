import { sendMessage } from "webext-bridge";
import { runtime } from "webextension-polyfill";
import { mediaQueue, numPlayingTabs } from "@/logic";
import { MediaStatus } from "@/logic/types";

export const registerPopupModule = () => {
  runtime.onMessage.addListener(async (message) => {
    switch (message.type) {
      case "check-media": {
        const promises = await Promise.allSettled(
          mediaQueue.value.map(async (tab) => {
            const { status } = await sendMessage(
              "check-media",
              {},
              `content-script@${tab}`
            );
            return { tabId: tab, status };
          })
        );
        const fulfilled = promises.filter(
          (
            promise
          ): promise is PromiseFulfilledResult<{
            tabId: number;
            status: MediaStatus;
          }> => promise.status === "fulfilled"
        );
        // rebuild mediaQueue
        mediaQueue.value = fulfilled.map((result) => result.value.tabId);
        // recalculate numPlayingTabs
        numPlayingTabs.value = fulfilled.filter(
          (result) => result.value.status === MediaStatus.PLAYING
        ).length;

        break;
      }

      case "pause-all-media": {
        mediaQueue.value.slice(0, numPlayingTabs.value).forEach((tab) => {
          sendMessage("pause-media", {}, `content-script@${tab}`);
        });

        break;
      }
      case "play-media": {
        sendMessage("play-media", {}, `content-script@${message.tabId}`);
        break;
      }
      case "pause-media": {
        sendMessage("pause-media", {}, `content-script@${message.tabId}`);
      }
    }
  });
};
