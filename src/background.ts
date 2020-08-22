import store from "@/store/index";
import { Message, MessageType } from "@/types";

browser.runtime.onMessage.addListener(async (message: Message, sender, sendResponse) => {
  switch (message.type) {
    case MessageType.INFO: {
      if (message.text?.includes("youtube")) {
        const { id, windowId } = sender.tab!;
        const tabInfo = { id: id!, windowId: windowId! };
        store.commit("addTab", tabInfo);
        console.log(store.state.listedTabs);
      }
      break;
    }

    case MessageType.POPUP: {
      const tabs = await browser.tabs.query({});
      for (const tab of tabs) {
        console.log(tab.url);
      }
      break;
    }

    case MessageType.POPUP_CUR_TAB: {
      const [tab] = await browser.tabs.query({ active: true });
      console.log(tab.url, tab.id, tab.windowId);
      break;
    }
  }
});
