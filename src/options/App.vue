<template>
  <div class="main">
    <div class="tokenfield">
      <label for="notionv2">Notion V2 Token</label>
      <input id="notionv2" v-model="notionV2Token" type="text" />
    </div>
    <div class="buttoncontainer">
      <button @click="saveToken">SAVE</button>
    </div>
    <div class="notionpagefield">
      <div class="formfield titlefield">
        <label for="pagetitle">Notion Page Title</label>
        <input id="pagetitle" v-model="notionPageTitle" type="text" placeholder="optional" />
      </div>
      <div class="formfield urlfield">
        <label for="pageurl">Notion Page Url</label>
        <input id="pageurl" v-model="notionPageUrl" type="text" placeholder="url" />
      </div>
    </div>
    <div class="buttoncontainer">
      <button @click="savePage">ADD</button>
    </div>
    <table>
      <tr class="tableheader">
        <th width="20%">Title</th>
        <th width="70%">Url</th>
        <th width="10%" style="text-align:center">Delete</th>
      </tr>
      <template v-for="(page, i) in notionPages" :key="i">
        <tr>
          <td>{{ page.title }}</td>
          <td>{{ page.url }}</td>
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
import { defineComponent } from "vue";
import { Page } from "@/types";

export default defineComponent({
  name: "App",
  data() {
    return {
      notionV2Token: "",
      notionPageUrl: "",
      notionPageTitle: "",
      notionPages: [] as Page[],
    };
  },
  async mounted() {
    this.notionV2Token = (await this.getLocalStorage("notionv2token")) ?? "";
    const result = await this.getLocalStorage<string | null>("notionpages");
    this.notionPages = result ? JSON.parse(result) : ([] as Page[]);
  },
  methods: {
    setLocalStorage(key: string, value: any) {
      browser.storage.local.set({
        [key]: value,
      });
    },
    async getLocalStorage<T>(key: string): Promise<T | null> {
      try {
        const result = (await browser.storage.local.get(key))[key];
        return result;
      } catch (error) {
        console.info(`Key ${key} cannot be found`);
        return null;
      }
    },
    saveToken() {
      this.setLocalStorage("notionv2token", this.notionV2Token);
    },
    savePage() {
      if (this.notionPageUrl.length > 0) {
        this.notionPages.push({
          title: this.notionPageTitle,
          url: this.notionPageUrl,
        });
        this.setLocalStorage("notionpages", JSON.stringify(this.notionPages));
        this.notionPageUrl = "";
        this.notionPageTitle = "";
      }
    },
    removePage(index: number) {
      this.notionPages.splice(index, 1);
      this.setLocalStorage("notionpages", JSON.stringify(this.notionPages));
    },
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

.tokenfield {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.tokenfield input {
  margin-top: 8px;
  width: 100%;
}
.notionpagefield {
  display: flex;
  margin-top: 8px;
}
.notionpagefield .formfield {
  display: flex;
  flex-direction: column;
}
.notionpagefield .titlefield {
  flex: 3;
}
.notionpagefield .urlfield {
  flex: 5;
  margin-left: 8px;
}
.notionpagefield .formfield input {
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
