## TODO

## Adding different content scripts

1. Add the following to `package.json`

```json
{
  "scripts": {
    ...,

    "dev:youtube": "yarn run build:youtube -- --mode development",
    "build:youtube": "vite build --config vite.config.youtube.ts",
    "build": "cross-env NODE_ENV=production run-s clear build:web build:prepare build:js build:youtube",
  }
}
```

2. Modify `src/manifest.ts`

```typescript
export async function getManifest() {
  const pkg = (await fs.readJSON(r("package.json"))) as typeof PkgType;

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    ...
    content_scripts: [
      {
        matches: ["http://*/*", "https://*/*"],
        js: ["./dist/contentScripts/index.global.js"],
      },
      {
        matches: ["http://*/*", "https://*/*"],
        js: ["./dist/contentScripts/youtube.global.js"],
      },
    ],
```

3. Copy `vite.config.content.ts` to `vite.config.youtube.ts` and modify the
   relevant content.

```typescript
export default defineConfig({
  ...sharedConfig,
  build: {
    ...,
    lib: {
      entry: r("src/contentScripts/youtube.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "youtube.global.js",
      },
    },
  },
```

4. Modify `src/background/contentScriptHMR.ts` to inject the content script.

```typescript
browser.tabs
  .executeScript(tabId, {
    file: `${isFirefox ? "" : "."}/dist/contentScripts/youtube.global.js`,
    runAt: "document_end",
  })
  .catch((error) => console.error(error));
```

## Media Player Pseudocode

- User navigate to player website

  1. Content script to check if media is playing
  2. If playing
     a. Send message to background script -> update status, title
     b. Background script to add tabid to playing queue
     c. Background script to pause other playing tabs if they exist
     d. clear interval
  3. Else
     a. loop 5s interval

- User leave player website

  1. window unload send message to background script
  2. Background script to remove tabid from playing queue

- Update player details on popup click
  1. Popup oncreated send message to background script
  2. Background script check last playing tab details
  3. If last playing tab exist
     a. send message to content script to update details
  4. Else
     a. Check all audible tabs ?
