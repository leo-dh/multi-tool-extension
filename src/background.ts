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
    case MessageType.INFO: {
      // if (message.text?.includes("youtube")) {
      //   const { id, windowId } = sender.tab!;
      //   const tabInfo = { id: id as number, windowId: windowId as number };
      //   store.commit("addTab", tabInfo);
      //   console.log(store.state.listedTabs);
      // }
      break;
    }

    case MessageType.POPUP: {
      if (store.state.popupMode === PopupMode.MULTIPLE_TABS) {
        await refreshListedTabs();
      } else if (store.state.popupMode === PopupMode.SELECTED_TAB) {
        await refreshSelectedTab();
      }
      break;
    }

    case MessageType.POPUP_CUR_TAB: {
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
  }
});
