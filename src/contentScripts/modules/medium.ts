// https://github.com/issammani/unlimited-medium/blob/master/app/src/js/content.js
import { sendMessage } from "webext-bridge";

export const initMediumModule = () => {
  // Wait for page to load
  const SCRIPT_SRC_REGEX = /https?:\/\/cdn-(?:static|client)(?:-\d)?\.medium\.com\//;
  const scripts = Array.from(document.querySelectorAll("script"));

  // Filter out only the ones we need
  const containsMediumScripts = scripts.some((script) =>
    SCRIPT_SRC_REGEX.test(script.src)
  );

  const isMedium = SCRIPT_SRC_REGEX.test(window.location.hostname);

  // Send message to backend if such a script is found
  if (containsMediumScripts || isMedium) {
    console.log("Is a medium blog !");
    sendMessage("medium-blog", {
      domain: window.location.host,
      url: window.location.origin,
    });
  }
};
