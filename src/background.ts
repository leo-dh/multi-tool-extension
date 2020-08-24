/* eslint-disable @typescript-eslint/no-non-null-assertion */
import store from "@/store/index";
import { Message, MessageType, TabInfo, PopupMode } from "@/types";

async function refreshListedTabs(): Promise<void> {
  store.commit("clearListedTabs");
  const tabs = await browser.tabs.query({});
  for (const tab of tabs) {
    if (tab.url?.includes("youtube") && tab.audible) {
      const { id, windowId } = tab;
      store.commit("addTab", { id: id!, windowId: windowId! });
    }
  }
}

async function refreshSelectedTab(): Promise<void> {
  const selectedTab = store.state.selectedTab;
  if (!selectedTab) return;
  const { id } = selectedTab;
  const tab = await browser.tabs.get(id);
  const { windowId, favIconUrl, title } = tab;
  const tabInfo: TabInfo = {
    id: id!,
    windowId: windowId!,
    favIconUrl: favIconUrl!,
    title: title!,
  };
  store.commit("setSelectedTab", tabInfo);
}

browser.runtime.onMessage.addListener(async (message: Message, sender, sendResponse) => {
  switch (message.type) {
    case MessageType.POPUP: {
      if (store.state.popupMode === PopupMode.MULTIPLE_TABS) {
        await refreshListedTabs();
      } else if (store.state.popupMode === PopupMode.SELECTED_TAB) {
        await refreshSelectedTab();
      }
      break;
    }

    case MessageType.GET_CUR_TAB: {
      const [tab] = await browser.tabs.query({ active: true });
      const { id, windowId, favIconUrl, title } = tab;
      const tabInfo: TabInfo = {
        id: id!,
        windowId: windowId!,
        favIconUrl: favIconUrl!,
        title: title!,
      };
      store.commit("setSelectedTab", tabInfo);
      break;
    }

    case MessageType.JUMP_TAB: {
      let tabInfo;
      if (store.state.popupMode === PopupMode.MULTIPLE_TABS) {
        tabInfo = store.state.listedTabs[store.state.counter];
        store.commit("incrementCounter");
      } else if (store.state.popupMode === PopupMode.SELECTED_TAB) {
        tabInfo = store.state.selectedTab;
      }
      if (!tabInfo) return;
      browser.windows.update(tabInfo.windowId, { focused: true });
      browser.tabs.update(tabInfo.id, { active: true });
      break;
    }
  }
});
