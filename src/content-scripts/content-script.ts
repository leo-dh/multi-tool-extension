import { MessageType } from "@/types";

const keyListener = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === "\\") {
    browser.runtime.sendMessage({ type: MessageType.JUMP_TAB });
  }
};
document.addEventListener("keydown", keyListener);

window.addEventListener("unload", () => {
  document.removeEventListener("keydown", keyListener);
});
