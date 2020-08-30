import { MessageType } from "@/types";

const keyListener = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === "\\") {
    if (e.shiftKey) browser.runtime.sendMessage({ type: MessageType.GO_TO_PIN_TAB });
    else browser.runtime.sendMessage({ type: MessageType.GO_TO_PLAYING_TAB });
  }
};
document.addEventListener("keydown", keyListener);

window.addEventListener("unload", () => {
  document.removeEventListener("keydown", keyListener);
});
