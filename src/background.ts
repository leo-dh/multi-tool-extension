import store from "@/store";
import { Message, MessageType, Tab } from "@/types";
import { MutationTypes } from "./store/mutations";

function refreshSelectedTab(): void {
  const selectedTab: Tab = store.getters.getSelectedTab;
  if (!selectedTab) return;
  const { id } = selectedTab;
  if (!id) return;
  browser.tabs.get(id).then(
    tab => {
      store.commit(MutationTypes.SET_SELECTED_TAB, tab);
    },
    () => {
      store.commit(MutationTypes.SET_SELECTED_TAB, null);
    }
  );
}

function refreshTabs(): void {
  browser.tabs.query({}).then((tabs: Tab[]) => {
    store.commit(MutationTypes.SET_TABS, tabs);
  });
}

function refreshNowPlaying(): void {
  const nowPlaying: Tab = store.getters.getPlayingTab;
  if (!nowPlaying) return;
  browser.tabs.get(nowPlaying.id as number).then(
    tab => {
      store.commit(MutationTypes.SET_PLAYING_TAB, tab);
    },
    () => {
      store.commit(MutationTypes.SET_PLAYING_TAB, null);
    }
  );
}

function focusTab(id: number, windowId: number): void {
  browser.windows.update(windowId, { focused: true });
  browser.tabs.update(id, { active: true });
}

browser.runtime.onMessage.addListener(async (message: Message, sender) => {
  switch (message.type) {
    case MessageType.POPUP: {
      refreshSelectedTab();
      refreshTabs();
      refreshNowPlaying();
      break;
    }

    case MessageType.GET_CUR_TAB: {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      if (!tab) return;
      if (!tab.id || !tab.windowId) {
        return new Promise((resolve, _) => {
          resolve("Unable to pin tab due to it's nature");
        });
      }
      store.commit(MutationTypes.SET_SELECTED_TAB, tab);
      break;
    }

    case MessageType.JUMP_TAB: {
      const selectedTab: Tab = store.getters.getSelectedTab;
      if (!selectedTab) return;
      const [currentTab] = await browser.tabs.query({ active: true });
      if (currentTab.id !== selectedTab.id) {
        if (!selectedTab.id || !selectedTab.windowId) return;
        store.commit(MutationTypes.SET_PREVIOUS_TAB, currentTab);
        focusTab(selectedTab.id, selectedTab.windowId);
      } else {
        const prevTab: Tab = store.getters.getPreviousTab;
        if (!prevTab.id || !prevTab.windowId) return;
        focusTab(prevTab.id, prevTab.windowId);
      }
      break;
    }

    case MessageType.SET_VIDEO_STATUS: {
      if (!sender.tab?.id) return;
      const status = message.text === "play" ? true : false;
      browser.tabs.get(sender.tab.id).then(tab => {
        store.commit(MutationTypes.SET_PLAYING_TAB, tab);
        store.commit(MutationTypes.SET_VIDEO_PLAYING, status);
      });
      break;
    }
  }
});
