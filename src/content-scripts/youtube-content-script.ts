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
  }, 300);
};
const playCallback = () => {
  debounceWrapper(() => {
    browser.runtime.sendMessage({ type: MessageType.SET_VIDEO_STATUS, text: "play" });
  }, 300);
};
const setupVideoElement = (video: HTMLVideoElement) => {
  video.addEventListener("pause", pauseCallback);
  video.addEventListener("play", playCallback);
  const status = video.paused ? "play" : "pause";
  browser.runtime.sendMessage({ type: MessageType.SET_VIDEO_STATUS, text: status });
};
if (!video) {
  timer = setInterval(() => {
    video = document.querySelector("video");
    if (video) {
      setupVideoElement(video);
      clearInterval(timer);
    }
  }, 5000);
} else {
  setupVideoElement(video);
}
const messageCallback = (message: Message, _sender: browser.runtime.MessageSender) => {
  if (message.type === MessageType.PLAY_PAUSE) {
    if (video?.paused) {
      video.play();
    } else {
      video?.pause();
    }
  } else if (message.type === MessageType.CHECK_VIDEO_STATUS) {
    if (video?.paused) {
      browser.runtime.sendMessage({ type: MessageType.SET_VIDEO_STATUS, text: "pause" });
      return new Promise((resolve, _) => resolve(true));
    } else {
      browser.runtime.sendMessage({ type: MessageType.SET_VIDEO_STATUS, text: "play" });
      return new Promise((resolve, _) => resolve(true));
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
