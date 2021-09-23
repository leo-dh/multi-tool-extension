import { createApp } from "vue";
import App from "./views/App.vue";
import { initMediumModule } from "./modules/medium";
import { initShortcutsModule } from "./modules/shortcuts";
import { initMediaModule } from "./modules/media";

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  initMediumModule();
  initShortcutsModule();
  initMediaModule();
  // mount component to context window
  const container = document.createElement("div");
  const root = document.createElement("div");
  const styleEl = document.createElement("link");
  const shadowDOM =
    container.attachShadow?.({ mode: __DEV__ ? "open" : "closed" }) ||
    container;
  styleEl.setAttribute("rel", "stylesheet");
  styleEl.setAttribute(
    "href",
    browser.runtime.getURL("dist/contentScripts/style.css")
  );
  shadowDOM.appendChild(styleEl);
  shadowDOM.appendChild(root);
  document.body.appendChild(container);
  createApp(App).mount(root);
})();
