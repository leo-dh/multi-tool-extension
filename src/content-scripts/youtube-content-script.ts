import { Message, MessageType } from "@/types";

browser.runtime.onMessage.addListener((message: Message, sender) => {
  if (message.type === MessageType.PLAY_PAUSE) {
    const video = document.querySelector("video");
    if (!video) return;
  }
});
