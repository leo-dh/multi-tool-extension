import { Message, MessageType } from "@/types";

const keyListener = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === "\\") {
    if (e.shiftKey) browser.runtime.sendMessage({ type: MessageType.GO_TO_PINNED_TAB });
    else browser.runtime.sendMessage({ type: MessageType.GO_TO_PLAYING_TAB });
  }
};
document.addEventListener("keydown", keyListener);
const displayToast = (displayText: string) => {
  const toastElement = document.createElement("div");
  toastElement.innerHTML = displayText;
  toastElement.style.cssText += `
    position: fixed;
    z-index: 1;
    right: 30px;
    bottom: 30px;
    border-radius: 8px;
    background-color: #31313a;
    padding: 16px 32px;
    color: whitesmoke;
    opacity: 0;
    transition: all 0.5s;
    font-size: 16px;
  `;
  document.body.appendChild(toastElement);

  setTimeout(() => {
    toastElement.style.opacity = "1";
  }, 100);
  new Promise<void>((resolve, _) => {
    setTimeout(() => {
      toastElement.style.opacity = "0";
      resolve();
    }, 2000);
  }).then(() => {
    setTimeout(() => {
      document.body.removeChild(toastElement);
    }, 500);
  });
};
const toastCallback = (message: Message, sender: browser.runtime.MessageSender) => {
  if (message.type === MessageType.TOAST_SUCCESS) {
    displayToast(`Selection added to ${message.text}`);
  } else if (message.type === MessageType.TOAST_FAILURE) {
    displayToast("Failed to add selection");
  }
};
browser.runtime.onMessage.addListener(toastCallback);
window.addEventListener("unload", () => {
  document.removeEventListener("keydown", keyListener);
  browser.runtime.onMessage.removeListener(toastCallback);
});
