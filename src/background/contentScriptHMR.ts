import { isFirefox, isForbiddenUrl } from "@/env";

// Firefox fetch files from cache instead of reloading changes from disk,
// hmr will not work as Chromium based browser
browser.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
  // Filter out non main window events.
  if (frameId !== 0) return;

  if (isForbiddenUrl(url)) return;

  // content script default 'run_at' value is 'document_idle' which misses the
  // load event. Need to take note the differences between dev and build. Otherwise,
  // mark the scripts to run at "document_end"
  // inject the latest scripts
  browser.tabs
    .executeScript(tabId, {
      file: `${isFirefox ? "" : "."}/dist/contentScripts/index.global.js`,
      runAt: "document_end",
    })
    .catch((error) => console.error(error));
});
