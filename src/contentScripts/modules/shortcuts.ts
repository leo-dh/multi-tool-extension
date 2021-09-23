import { sendMessage } from "webext-bridge";

export const initShortcutsModule = () => {
  const keyListener = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "\\") sendMessage("cycle-pinned-tabs", {});
  };
  window.addEventListener("keydown", keyListener);
  window.addEventListener("unload", () => {
    window.removeEventListener("keydown", keyListener);
  });
};
