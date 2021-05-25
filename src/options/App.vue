<template>
  <div class="main">
    <div class="tokenfield">
      <label for="notionapitoken">Notion API Token</label>
      <input id="notionapitoken" v-model="notionApiToken" type="text" />
    </div>
    <div class="buttoncontainer">
      <button @click="saveToken">SAVE</button>
    </div>
    <div class="urlfield">
      <label for="notionurl">Notion Pages</label>
      <input id="notionurl" v-model="notionUrl" type="text" />
    </div>
    <div class="buttoncontainer">
      <button @click="savePage">ADD</button>
    </div>
    <table>
      <tr class="tableheader">
        <th width="20%">Title</th>
        <th width="70%">UUID</th>
        <th width="10%" style="text-align:center">Delete</th>
      </tr>
      <template v-for="(page, i) in notionPages" :key="i">
        <tr>
          <td>{{ page.title }}</td>
          <td>{{ page.uuid }}</td>
          <td>
            <div>
              <button @click="removePage(i)">
                <svg class="" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </template>
    </table>

    <div style="height: 100px"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Page, LocalStorageKeys } from "@/types";

export default defineComponent({
  name: "App",
  setup() {
    const notionApiToken = ref("");
    const notionUrl = ref("");
    const notionPages = ref<Page[]>([]);

    async function setLocalStorage(key: string, value: string) {
      browser.storage.local.set({
        [key]: value,
      });
    }
    async function getLocalStorage<T>(key: LocalStorageKeys): Promise<T | null> {
      try {
        const result = (await browser.storage.local.get(key))[key];
        return result;
      } catch (error) {
        console.info(`Key ${key} cannot be found`);
        return null;
      }
    }
    async function saveToken(e: Event) {
      await setLocalStorage(LocalStorageKeys.NOTION_TOKEN, notionApiToken.value);
      (e.target as HTMLElement).innerHTML = "SAVED";
      console.log("WHT");
      setTimeout(() => {
        (e.target as HTMLElement).innerHTML = "SAVE";
      }, 1000);
    }
    function savePage() {
      if (notionUrl.value) {
        const parser = document.createElement("a");
        parser.href = notionUrl.value;
        const { pathname } = parser;
        const [title, uuid] = pathname.replaceAll("/", "").split("-");
        const uuidFormatted = uuid.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
        notionPages.value.push({
          title,
          uuid: uuidFormatted,
        });
        setLocalStorage(LocalStorageKeys.NOTION_PAGES, JSON.stringify(notionPages.value));
        notionUrl.value = "";
      }
    }
    function removePage(index: number) {
      notionPages.value.splice(index, 1);
      setLocalStorage("notionpages", JSON.stringify(notionPages.value));
    }

    (async () => {
      notionApiToken.value = (await getLocalStorage(LocalStorageKeys.NOTION_TOKEN)) ?? "";
      const result = await getLocalStorage<string | null>(LocalStorageKeys.NOTION_PAGES);
      notionPages.value = result ? JSON.parse(result) : [];
    })();

    return {
      notionApiToken,
      notionUrl,
      notionPages,
      savePage,
      saveToken,
      removePage,
    };
  },
});
</script>

<style>
html {
  box-sizing: border-box;
  font-size: 16px;
  font-family: sans-serif;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
ol,
ul {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

ol,
ul {
  list-style: none;
}
@media (prefers-color-scheme: dark) {
  body {
    background: #202023;
    color: #fff;
  }

  p,
  label {
    color: rgb(177, 177, 179);
  }
}
.main {
  display: grid;
  height: 100%;
  padding: 16px 0;
  gap: 8px;
  grid-template-columns: 1fr 100px;
  grid-template-rows: min-content;
  width: 100%;
}
label {
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.9em;
}

.tokenfield,
.urlfield {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.urlfield {
  margin-top: 8px;
}
.tokenfield input,
.urlfield input {
  margin-top: 8px;
  width: 100%;
}
.buttoncontainer {
  display: flex;
  align-items: flex-end;
}
.buttoncontainer button {
  width: 100%;
  text-align: center;
  font-weight: bold;
}
table {
  width: 100%;
  grid-column: span 2;
}
th {
  text-align: left;
  border-bottom: #31313a 2px solid;
  padding: 8px 0;
}
td {
  user-select: text;
  padding: 6px 0;
  word-break: break-all;
}
td div {
  display: flex;
  align-items: center;
  justify-content: center;
}
td button {
  background: transparent;
  border-radius: 50%;
  border: none;
  width: 36px;
  height: 36px;
  padding: 0px;
  cursor: pointer;
  transition: background 0.3s ease;
}
td button:hover {
  background: #31313a;
}
td button svg {
  height: 24px;
  width: 24px;
  color: whitesmoke;
  display: block;
  margin: auto;
}
</style>
