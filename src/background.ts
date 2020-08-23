import store from "@/store/index";
import { Message, MessageType, TabInfo } from "@/types";

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
      store.commit("clearListedTabs");
      const tabs = await browser.tabs.query({});
      for (const tab of tabs) {
        if (tab.url?.includes("youtube") && tab.audible) {
          const { id, windowId } = tab;
          store.commit("addTab", { id: id as number, windowId: windowId as number });
        }
      }
      break;
    }

    case MessageType.POPUP_CUR_TAB: {
      const [tab] = await browser.tabs.query({ active: true });
      const { id, windowId, favIconUrl, title } = tab;
      const tabInfo: TabInfo = {
        id: id as number,
        windowId: windowId as number,
        favIconUrl: favIconUrl as string,
        title: title as string,
      };
      store.commit("setSelectedTab", tabInfo);
      break;
    }
  }
});
