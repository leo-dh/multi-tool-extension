import store from "@/store/index";

interface Request {
  type: string;
  message: string;
}

browser.runtime.onMessage.addListener((request: Request, sender, sendResponse) => {
  if (request.type === "info") {
    if (request.message.includes("github")) {
      const { id, windowId } = sender.tab!;
      const tabInfo = { id: id!, windowId: windowId! };
      store.commit("addTab", tabInfo);
      console.log(store.state.listedTabs);
    }
  }
});
browser.tabs.query({}).then(tabs => {
  for (const tab of tabs) {
    console.log(tab.url);
  }
});
console.log("From Background");
browser.runtime.onMessage.addListener((request: Request, sender, sendResponse) => {
  if (request.type === "popup") {
    console.log("FROM POPUP");
    browser.tabs.query({}).then(tabs => {
      for (const tab of tabs) {
        console.log(tab.url);
      }
    });
  }
});
