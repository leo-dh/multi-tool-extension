import { onMessage, sendMessage } from "webext-bridge";
import { MediaStatus } from "@/logic/types";

const testLocation = () => {
  const HOSTNAME_REGEX = /https:\/\/.*(soundcloud|youtube)\.com.*/;
  return HOSTNAME_REGEX.test(window.location.href);
};

export const initMediaModule = () => {
  if (!testLocation()) return;
  const MediaScript: Record<string, any> = {};
  // https://github.com/StoPlay/stoplay-ext/blob/develop/src/content/index.js
  const checkStatus = () => {
    let status = MediaStatus.PAUSED;
    switch (window.location.hostname) {
      case "soundcloud.com":
        status = document
          .querySelector(".playControl")
          ?.classList.contains("playing")
          ? MediaStatus.PLAYING
          : MediaStatus.PAUSED;
        break;
      case "youtube.com":
      case "www.youtube.com":
        status = document.querySelector("video")?.paused
          ? MediaStatus.PAUSED
          : MediaStatus.PLAYING;
        break;
    }
    return status;
  };
  const checkTitle = () => {
    let title = "Unavailable";
    switch (window.location.hostname) {
      case "soundcloud.com":
        title =
          document.querySelector<HTMLElement>(".playbackSoundBadge__titleLink")
            ?.title ?? "Unavailable";
        break;
      case "youtube.com":
      case "www.youtube.com":
        title =
          document.querySelector<HTMLElement>(".ytp-chapter-title-content")
            ?.innerText ||
          document.querySelector<HTMLElement>("h1 yt-formatted-string")
            ?.innerText ||
          "Unavailable";
        break;
    }
    return title;
  };

  const playMedia = () => {
    switch (window.location.hostname) {
      case "soundcloud.com":
        document.querySelector<HTMLElement>(".playControl")?.click();
        break;
      case "youtube.com":
      case "www.youtube.com":
        document.querySelector("video")?.play();
    }
  };

  const pauseMedia = () => {
    switch (window.location.hostname) {
      case "soundcloud.com":
        document.querySelector<HTMLElement>(".playControl.playing")?.click();
        break;
      case "youtube.com":
      case "www.youtube.com":
        document.querySelector("video")?.pause();
    }
  };

  const checkMedia = () => {
    const status = checkStatus();
    if (status !== MediaScript.status) {
      MediaScript.status = status;
      const messageId =
        status === MediaStatus.PLAYING
          ? "add-to-playing-queue"
          : "add-to-paused-queue";
      sendMessage(messageId, {});
    }
  };

  onMessage("pause-media", () => {
    pauseMedia();
    sendMessage("add-to-paused-queue", {});
  });
  onMessage("play-media", () => {
    playMedia();
    sendMessage("add-to-playing-queue", {});
  });
  onMessage("check-media", () => {
    checkMedia();
  });
  onMessage("check-title", () => {
    return { title: checkTitle() };
  });

  MediaScript.initialInterval = setInterval(() => {
    if (checkStatus() === MediaStatus.PLAYING) {
      // keep local state
      MediaScript.status = MediaStatus.PLAYING;
      sendMessage("add-to-playing-queue", {});
      clearInterval(MediaScript.initialInterval);
      MediaScript.initialInterval = null;
      MediaScript.interval = setInterval(() => {
        checkMedia();
      }, 5000);
    }
  }, 5000);

  window.addEventListener("unload", () => {
    if (MediaScript.interval) clearInterval(MediaScript.interval);
    if (MediaScript.initialInterval) clearInterval(MediaScript.initialInterval);
    sendMessage("remove-from-queue", {});
  });
};
