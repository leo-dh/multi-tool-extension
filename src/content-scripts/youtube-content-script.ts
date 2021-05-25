import { MessageType, Message } from "@/types";

let timer: number | undefined;
let debounce: number | undefined;
let video = document.querySelector("video");
const debounceWrapper = (fn: () => void, delay: number) => {
  if (!debounce) clearTimeout(debounce);
  debounce = setTimeout(fn, delay);
};
const pauseCallback = () => {
  debounceWrapper(() => {
    browser.runtime.sendMessage({ type: MessageType.SET_VIDEO_STATUS, text: "pause" });
  }, 200);
};
const playCallback = () => {
  debounceWrapper(() => {
    browser.runtime.sendMessage({ type: MessageType.SET_VIDEO_STATUS, text: "play" });
  }, 200);
};
const setupVideoElement = (videoElement: HTMLVideoElement) => {
  videoElement.addEventListener("pause", pauseCallback);
  videoElement.addEventListener("play", playCallback);
  const status = videoElement.paused ? "play" : "pause";
  browser.runtime.sendMessage({ type: MessageType.SET_VIDEO_STATUS, text: status });
};
if (!video) {
  timer = setInterval(() => {
    video = document.querySelector("video");
    if (video) {
      setupVideoElement(video);
      clearInterval(timer);
    }
  }, 3000);
} else {
  setupVideoElement(video);
}
const messageCallback = (message: Message, _sender: browser.runtime.MessageSender) => {
  switch (message.type) {
    case MessageType.PLAY_PAUSE: {
      if (!video) return false;
      if (video.paused) {
        video.play();
        return Promise.resolve("play");
      }
      video.pause();
      return Promise.resolve("pause");
    }
    case MessageType.CHECK_VIDEO_STATUS: {
      if (video?.paused) {
        browser.runtime.sendMessage({ type: MessageType.SET_VIDEO_STATUS, text: "pause" });
      } else {
        browser.runtime.sendMessage({ type: MessageType.SET_VIDEO_STATUS, text: "play" });
      }
      return Promise.resolve(true);
    }
    default: {
      return false;
    }
  }
};

browser.runtime.onMessage.addListener(messageCallback);

window.onunload = () => {
  video?.removeEventListener("pause", pauseCallback);
  video?.removeEventListener("play", playCallback);
  browser.runtime.onMessage.removeListener(messageCallback);
  clearInterval(timer);
};
