import { MessageType } from "@/types";

document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key === "\\") {
    browser.runtime.sendMessage({ type: MessageType.JUMP_TAB });
  }
});
