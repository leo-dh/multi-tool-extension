import { registerMediumModule } from "./modules/medium";
import { registerNotionModule } from "./modules/notion";
import { registerPopupModule } from "./modules/popup";
import { registerNotificationsModule } from "./modules/notifications";
import { registerShortcutsModule } from "./modules/shortcuts";
import { registerMediaModule } from "./modules/media";
// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import("/@vite/client");
  // load latest content script
  import("./contentScriptHMR");
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log("Extension installed");
});

registerMediumModule();
registerNotionModule();
registerPopupModule();
registerNotificationsModule();
registerShortcutsModule();
registerMediaModule();
