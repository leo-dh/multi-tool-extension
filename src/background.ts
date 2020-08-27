/* eslint-disable @typescript-eslint/no-non-null-assertion */
import store from "@/store";
import { Message, MessageType, TabInfo } from "@/types";
import { MutationTypes } from "./store/mutations";

async function refreshSelectedTab(): Promise<void> {
  const selectedTab = store.getters.getSelectedTab;
  if (!selectedTab) return;
  const { id } = selectedTab;
  const tab = await browser.tabs.get(id);
  const { windowId, favIconUrl, title, url } = tab;
  const tabInfo: TabInfo = {
    id: id!,
    windowId: windowId!,
    favIconUrl: favIconUrl!,
    title: title!,
    url: url!,
  };
  store.commit(MutationTypes.SET_SELECTED_TAB, tabInfo);
}

async function refreshTabs(): Promise<void> {
  const tabs = (await browser.tabs.query({})).map(tab => {
    const { id, windowId, favIconUrl, title, url } = tab;
    return { id, windowId, favIconUrl, title, url };
  });
  store.commit(MutationTypes.SET_TABS, tabs);
}

browser.runtime.onMessage.addListener(async (message: Message, _sender) => {
  switch (message.type) {
    case MessageType.POPUP: {
      refreshSelectedTab();
      refreshTabs();
      break;
    }

    case MessageType.GET_CUR_TAB: {
      const [tab] = await browser.tabs.query({ active: true });
      const { id, windowId, favIconUrl, title, url } = tab;
      const tabInfo: TabInfo = {
        id: id!,
        windowId: windowId!,
        favIconUrl: favIconUrl!,
        title: title!,
        url: url!,
      };
      store.commit(MutationTypes.SET_SELECTED_TAB, tabInfo);
      break;
    }

    case MessageType.JUMP_TAB: {
      const tabInfo = store.getters.getSelectedTab;
      if (!tabInfo) return;
      browser.windows.update(tabInfo.windowId, { focused: true });
      browser.tabs.update(tabInfo.id, { active: true });
      break;
    }
  }
});
