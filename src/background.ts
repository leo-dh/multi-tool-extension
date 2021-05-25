import { Message, MessageType, Page, Tab, LocalStorageKeys } from "@/types";
import { store } from "./store";
import { MutationTypes } from "./store/mutations";
import { addContentToPage } from "./notionapi";

async function refreshSelectedTab(): Promise<void> {
  const selectedTab: Tab = store.getters.getSelectedTab();
  if (!selectedTab) return;
  const { id } = selectedTab;
  if (!id) return;
  try {
    const tab = await browser.tabs.get(id);
    store.commit(MutationTypes.SET_SELECTED_TAB, tab);
  } catch (_) {
    store.commit(MutationTypes.SET_SELECTED_TAB, null);
  }
}

async function refreshTabs(): Promise<void> {
  const tabs = await browser.tabs.query({});
  store.commit(MutationTypes.SET_TABS, tabs);
}

async function refreshNowPlaying(): Promise<void> {
  const nowPlaying: Tab = store.getters.getPlayingTab();
  if (!nowPlaying) return;
  try {
    const tab = await browser.tabs.get(nowPlaying.id as number);
    const response = await browser.tabs.sendMessage(tab.id as number, {
      type: MessageType.CHECK_VIDEO_STATUS,
    });
    store.commit(MutationTypes.SET_PLAYING_TAB, response ? tab : null);
  } catch (_) {
    store.commit(MutationTypes.SET_PLAYING_TAB, null);
  }
}

function focusTab(id: number, windowId: number): void {
  browser.windows.update(windowId, { focused: true });
  browser.tabs.update(id, { active: true });
}

async function goToTab(targetTab: Tab) {
  if (!targetTab) return;
  const [currentTab] = await browser.tabs.query({ active: true });
  if (currentTab.id !== targetTab.id) {
    if (!targetTab.id || !targetTab.windowId) return;
    store.commit(MutationTypes.SET_PREVIOUS_TAB, currentTab);
    focusTab(targetTab.id, targetTab.windowId);
  } else {
    const prevTab: Tab = store.getters.getPreviousTab();
    if (!prevTab.id || !prevTab.windowId) return;
    focusTab(prevTab.id, prevTab.windowId);
  }
}

// eslint-disable-next-line consistent-return
browser.runtime.onMessage.addListener((message: Message, sender) => {
  switch (message.type) {
    case MessageType.GET_PINNED_TAB: {
      return refreshSelectedTab().then(() => {
        return store.getters.getSelectedTab();
      });
    }

    case MessageType.SET_PINNED_TAB: {
      return browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
        if (!tab) return false;
        if (!tab.id || !tab.windowId) return false;
        store.commit(MutationTypes.SET_SELECTED_TAB, tab);
        return tab;
      });
    }

    case MessageType.GO_TO_PINNED_TAB: {
      const selectedTab: Tab = store.getters.getSelectedTab();
      goToTab(selectedTab);
      return false;
    }

    case MessageType.GET_NOW_PLAYING: {
      return refreshNowPlaying().then(() => {
        return {
          tab: store.getters.getPlayingTab(),
          videoPlaying: store.getters.getVideoPlaying(),
        };
      });
    }

    case MessageType.GET_TABS: {
      return refreshTabs().then(() => {
        return store.getters.getTabs();
      });
    }

    case MessageType.GO_TO_PLAYING_TAB: {
      const playingTab: Tab = store.getters.getPlayingTab();
      goToTab(playingTab);
      return false;
    }

    case MessageType.SET_VIDEO_STATUS: {
      if (!sender.tab?.id) return false;
      const status = message.text === "play";
      browser.tabs.get(sender.tab.id).then(tab => {
        store.commit(MutationTypes.SET_PLAYING_TAB, tab);
        store.commit(MutationTypes.SET_VIDEO_PLAYING, status);
      });
      return false;
    }

    default: {
      return false;
    }
  }
});

enum ContextMenu {
  ADD_TO_NOTION = "ADD_TO_NOTION",
}

const getNotionToken = async () => {
  const token: string = (await browser.storage.local.get(LocalStorageKeys.NOTION_TOKEN))[
    LocalStorageKeys.NOTION_TOKEN
  ];
  return token;
};

const setContextMenu = async () => {
  await browser.contextMenus.removeAll();
  browser.contextMenus.create({
    id: ContextMenu.ADD_TO_NOTION,
    title: "Add to Notion",
    contexts: ["selection"],
  });
  const { notionpages } = await browser.storage.local.get("notionpages");
  const pages: Page[] = JSON.parse(notionpages);
  pages.forEach(page => {
    browser.contextMenus.create({
      id: page.uuid,
      title: page.title.length > 0 ? page.title : page.uuid,
      parentId: ContextMenu.ADD_TO_NOTION,
      contexts: ["selection"],
      onclick: async (info, tab) => {
        if (!info.selectionText) return;
        const token = await getNotionToken();
        const response = await addContentToPage(info.selectionText, page.uuid, token);
        if (response.status === 200) {
          if (!tab.id) return;
          browser.tabs.sendMessage(tab.id, {
            type: MessageType.TOAST_SUCCESS,
            text: page.title,
          } as Message);
        } else {
          if (!tab.id) return;
          browser.tabs.sendMessage(tab.id, {
            type: MessageType.TOAST_FAILURE,
          } as Message);
        }
      },
    });
  });
};
setContextMenu();
browser.storage.onChanged.addListener(setContextMenu);
