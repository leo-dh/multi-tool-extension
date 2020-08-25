/* eslint-disable @typescript-eslint/no-non-null-assertion */
import store from "@/store";
import { Message, MessageType, TabInfo, PopupMode } from "@/types";
import { MutationTypes } from "./store/mutations";

async function refreshListedTabs(): Promise<void> {
  store.commit(MutationTypes.CLEAR_LISTED_TABS);
  const tabs = await browser.tabs.query({});
  for (const tab of tabs) {
    if (tab.url?.includes("youtube") && tab.audible) {
      const { id, windowId } = tab;
      store.commit(MutationTypes.ADD_TAB, { id: id!, windowId: windowId! });
    }
  }
}

async function refreshSelectedTab(): Promise<void> {
  const selectedTab = store.getters.getSelectedTab;
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
  store.commit(MutationTypes.SET_SELECTED_TAB, tabInfo);
}

browser.runtime.onMessage.addListener(async (message: Message, _sender) => {
  switch (message.type) {
    case MessageType.POPUP: {
      const mode = store.getters.getPopupMode;
      if (mode === PopupMode.MULTIPLE_TABS) {
        await refreshListedTabs();
      } else if (mode === PopupMode.SELECTED_TAB) {
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
      store.commit(MutationTypes.SET_SELECTED_TAB, tabInfo);
      break;
    }

    case MessageType.JUMP_TAB: {
      let tabInfo;
      if (store.state.popupMode === PopupMode.MULTIPLE_TABS) {
        tabInfo = store.getters.getListedTabs;
        store.commit(MutationTypes.INCREMENT_COUNTER);
      } else if (store.state.popupMode === PopupMode.SELECTED_TAB) {
        tabInfo = store.getters.getSelectedTab;
      }
      if (!tabInfo) return;
      browser.windows.update(tabInfo.windowId, { focused: true });
      browser.tabs.update(tabInfo.id, { active: true });
      break;
    }

    case MessageType.GET_ALL_TABS: {
      return browser.tabs.query({}).then(result => {
        return result.map(tab => {
          const { id, windowId, favIconUrl, title } = tab;
          return { id, windowId, favIconUrl, title };
        });
      });
      break;
    }
  }
});
