import { MessageType } from "@/types";

let debounce: Promise<any> | number | undefined;

const video = document.querySelector("video");
const debounceWrapper = (fn: () => void, delay: number) => {
  if (!debounce) clearTimeout(debounce);
  debounce = setTimeout(fn, delay);
};
const pauseFn = () => {
  debounceWrapper(() => {
    browser.runtime.sendMessage({ type: MessageType.SET_VIDEO_STATUS, text: "pause" });
  }, 500);
};
const playFn = () => {
  debounceWrapper(() => {
    browser.runtime.sendMessage({ type: MessageType.SET_VIDEO_STATUS, text: "play" });
  }, 500);
};
video?.addEventListener("pause", pauseFn);
video?.addEventListener("play", playFn);
