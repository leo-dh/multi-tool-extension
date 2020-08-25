<template>
  <div class="container">
    <div class="buttonRow">
      <button @click="changeTab">
        Change Tab
      </button>
      <button @click="selectTab">Pin Current</button>
      <button @click="resetSelectedTabs">
        Reset Tabs
      </button>
    </div>
    <selected-tab style="margin-top: 8px" />
    <tabs />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MessageType, PopupMode } from "@/types";
import SelectedTab from "@/components/SelectedTab.vue";
import { MutationTypes } from "@/store/mutations";
import Tabs from "@/components/Tabs.vue";

export default Vue.extend({
  name: "App",
  components: {
    SelectedTab,
    Tabs,
  },
  computed: {
    mode() {
      return this.$store.getters.getPopupMode;
    },
  },
  mounted() {
    browser.runtime.sendMessage({ type: MessageType.POPUP });
    const body = document.querySelector("body");
    if (body) body.style.background = "#31313a";
  },
  methods: {
    changeTab(): void {
      switch (this.mode) {
        case PopupMode.MULTIPLE_TABS: {
          const { id, windowId } = this.$store.getters.getListedTab;
          browser.windows.update(windowId as number, { focused: true });
          browser.tabs.update(id as number, { active: true });
          this.$store.commit(MutationTypes.INCREMENT_COUNTER);
          break;
        }

        case PopupMode.SELECTED_TAB: {
          const { id, windowId } = this.$store.getters.getSelectedTab;
          browser.windows.update(windowId as number, { focused: true });
          browser.tabs.update(id as number, { active: true });
          break;
        }
      }
    },
    selectTab(): void {
      this.$store.commit(MutationTypes.SET_POPUP_MODE, PopupMode.SELECTED_TAB);
      browser.runtime.sendMessage({ type: MessageType.GET_CUR_TAB });
    },
    resetSelectedTabs(): void {
      this.$store.commit(MutationTypes.SET_POPUP_MODE, PopupMode.MULTIPLE_TABS);
      browser.runtime.sendMessage({ type: MessageType.POPUP });
    },
  },
});
</script>

<style>
/* CSS Reset */
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

.container {
  display: flex;
  flex-direction: column;
  padding: 1em;
  max-width: 350px;
}
.buttonRow {
  display: flex;
}
.buttonRow > * {
  flex: 1 1 0;
}
</style>
