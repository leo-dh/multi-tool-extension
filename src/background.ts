/* eslint-disable @typescript-eslint/no-non-null-assertion */
import store from "@/store";
import { Message, MessageType, TabInfo } from "@/types";
import { MutationTypes } from "./store/mutations";

function refreshSelectedTab(): void {
  const selectedTab: TabInfo = store.getters.getSelectedTab;
  if (!selectedTab) return;
  const { id } = selectedTab;
  browser.tabs.get(id).then(tab => {
    const { windowId, favIconUrl, title, url } = tab;
    const tabInfo = { id, windowId, favIconUrl, title, url } as TabInfo;
    store.commit(MutationTypes.SET_SELECTED_TAB, tabInfo);
  });
}

function refreshTabs(): void {
  browser.tabs.query({}).then((result: browser.tabs.Tab[]) => {
    const tabs = result.map(tab => {
      const { id, windowId, favIconUrl, title, url } = tab;
      return { id, windowId, favIconUrl, title, url } as TabInfo;
    });
    store.commit(MutationTypes.SET_TABS, tabs);
  });
}

function focusTab(id: number, windowId: number): void {
  browser.windows.update(windowId, { focused: true });
  browser.tabs.update(id, { active: true });
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
      const tabInfo = { id, windowId, favIconUrl, title, url } as TabInfo;
      store.commit(MutationTypes.SET_SELECTED_TAB, tabInfo);
      break;
    }

    case MessageType.JUMP_TAB: {
      const tabInfo: TabInfo = store.getters.getSelectedTab;
      if (!tabInfo) return;
      const [currentTab] = await browser.tabs.query({ active: true });
      if (currentTab.id !== tabInfo.id) {
        store.commit(MutationTypes.SET_PREVIOUS_TAB, currentTab);
        focusTab(tabInfo.id, tabInfo.windowId);
      } else {
        const prevTab: TabInfo = store.getters.getPreviousTab;
        focusTab(prevTab.id, prevTab.windowId);
      }
      break;
    }
  }
});
