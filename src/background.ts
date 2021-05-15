import { Message, MessageType, Page, Tab } from "@/types";
import createStore from "./simplestore";
import { state, State } from "./store/state";
import { MutationTypes, mutations } from "./store/mutations";

const store = createStore<State>({
  state,
  getters: {
    getSelectedTab: s => s.selectedTab,
    getPreviousTab: s => s.previousTab,
    getTabs: s => s.tabs,
    getPlayingTab: s => s.playingTab,
    getVideoPlaying: s => s.videoPlaying,
  },
  mutations,
});

function refreshSelectedTab(): void {
  const selectedTab: Tab = store.getters.getSelectedTab();
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
  const nowPlaying: Tab = store.getters.getPlayingTab();
  if (!nowPlaying) return;
  browser.tabs.get(nowPlaying.id as number).then(
    tab => {
      browser.tabs
        .sendMessage(tab.id as number, { type: MessageType.CHECK_VIDEO_STATUS } as Message)
        .then(result => {
          // Tab is still on youtube
          if (result) store.commit(MutationTypes.SET_PLAYING_TAB, tab);
          else store.commit(MutationTypes.SET_PLAYING_TAB, null);
        });
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
browser.runtime.onMessage.addListener(async (message: Message, sender) => {
  switch (message.type) {
    case MessageType.POPUP: {
      refreshSelectedTab();
      refreshTabs();
      refreshNowPlaying();
      break;
    }

    case MessageType.GET_PINNED_TAB: {
      return store.getters.getSelectedTab();
    }

    case MessageType.PIN_CUR_TAB: {
      console.log("PIN TAB message");
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      if (!tab) return null;
      if (!tab.id || !tab.windowId) {
        return null;
      }
      store.commit(MutationTypes.SET_SELECTED_TAB, tab);
      return tab;
    }

    case MessageType.GO_TO_PINNED_TAB: {
      const selectedTab: Tab = store.getters.getSelectedTab();
      await goToTab(selectedTab);
      break;
    }

    case MessageType.GET_NOW_PLAYING: {
      return {
        tab: store.getters.getPlayingTab(),
        videoPlaying: store.getters.getVideoPlaying(),
      };
    }

    case MessageType.GET_TABS: {
      return store.getters.getTabs();
    }

    case MessageType.GO_TO_PLAYING_TAB: {
      const playingTab: Tab = store.getters.getPlayingTab();
      await goToTab(playingTab);
      break;
    }

    case MessageType.SET_VIDEO_STATUS: {
      if (!sender.tab?.id) return {};
      const status = message.text === "play";
      browser.tabs.get(sender.tab.id).then(tab => {
        store.commit(MutationTypes.SET_PLAYING_TAB, tab);
        store.commit(MutationTypes.SET_VIDEO_PLAYING, status);
      });
      break;
    }

    default: {
      break;
    }
  }
});

enum ContextMenu {
  ADD_TO_NOTION = "ADD_TO_NOTION",
}

const getNotionDetails = async () => {
  const token: string = (await browser.storage.local.get("notionv2token")).notionv2token;
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
      id: page.url,
      title: page.title.length > 0 ? page.title : page.url,
      parentId: ContextMenu.ADD_TO_NOTION,
      contexts: ["selection"],
      onclick: (info, tab) => {
        fetch("http://localhost:9998/notion", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: page.url, content: info.selectionText }),
        }).then(response => {
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
        });
      },
    });
  });
};
setContextMenu();
browser.storage.onChanged.addListener(setContextMenu);
