import { sendMessage } from "webext-bridge";
import { runtime } from "webextension-polyfill";
import { mediaQueue, numPlayingTabs } from "@/logic";

export const registerPopupModule = () => {
  runtime.onMessage.addListener(async (message) => {
    switch (message.type) {
      case "check-media": {
        mediaQueue.value.forEach((tab) => {
          sendMessage("check-media", {}, `content-script@${tab}`);
        });
        // force rebuild queue details
        mediaQueue.value = [...mediaQueue.value];

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
