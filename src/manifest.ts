import fs from "fs-extra";
import type { Manifest } from "webextension-polyfill";
import type PkgType from "../package.json";
import { isDev, port, r } from "../scripts/utils";

export async function getManifest() {
  const pkg = (await fs.readJSON(r("package.json"))) as typeof PkgType;

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    browser_action: {
      default_icon: "./assets/multipledark.svg",
      default_popup: "./dist/popup/index.html",
      theme_icons: [
        {
          light: "./assets/multiplelight.svg",
          dark: "./assets/multipledark.svg",
          size: 16,
        },
        {
          light: "./assets/multiplelight.svg",
          dark: "./assets/multipledark.svg",
          size: 32,
        },
      ],
    },
    commands: {
      // Incorrect typing provided by @types/webextension-polyfill
      // @ts-ignore
      _execute_browser_action: {
        suggested_key: {
          default: "Ctrl+Space",
        },
      },
    },
    options_ui: {
      page: "./dist/options/index.html",
      open_in_tab: true,
      chrome_style: false,
    },
    background: {
      page: "./dist/background/index.html",
      persistent: false,
    },
    icons: {
      16: "./assets/multipledark.svg",
      48: "./assets/multipledark.svg",
      128: "./assets/multipledark.svg",
    },
    permissions: [
      "tabs",
      "storage",
      "activeTab",
      "http://*/*",
      "https://*/*",
      "contextMenus",
      "cookies",
    ],
    content_scripts: [
      {
        matches: ["http://*/*", "https://*/*"],
        js: ["./dist/contentScripts/index.global.js"],
      },
    ],
    web_accessible_resources: ["dist/contentScripts/style.css"],
  };

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts;
    manifest.permissions?.push("webNavigation");

    // this is required on dev for Vite script to load
    manifest.content_security_policy = `script-src \'self\' http://localhost:${port}; object-src \'self\'`;
  }

  return manifest;
}
