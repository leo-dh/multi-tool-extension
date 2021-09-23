import { onMessage } from "webext-bridge";
import { tabs } from "webextension-polyfill";

export const registerShortcutsModule = () => {
  onMessage("cycle-pinned-tabs", async ({ sender }) => {
    const pinnedTabs = await tabs.query({ pinned: true });
    if (!pinnedTabs.length) return {};
    const senderIndex = pinnedTabs.findIndex((tab) => tab.id === sender.tabId);
    if (senderIndex === -1) {
      tabs.update(pinnedTabs[0].id || 0, { active: true });
    } else {
      tabs.update(pinnedTabs[(senderIndex + 1) % pinnedTabs.length].id || 0, {
        active: true,
      });
    }
    return {};
  });
};
