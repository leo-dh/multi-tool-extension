<template>
  <div class="container">
    <button @click="jumpTab">
      Change Tab
    </button>
    <button @click="selectTab">
      Select Current Tab
    </button>
    <button @click="resetSelectedTabs">
      Reset Tabs
    </button>
    <div class="selectedTab">
      <span>Selected Tab</span>
      <div>
        <img :src="selectedTab.favIconUrl || ''" alt="" />
        <div>
          {{ selectedTab.title || "..." }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MessageType, PopupMode } from "@/types";

export default Vue.extend({
  name: "App",
  computed: {
    selectedTab() {
      const selectedTab = this.$store.getters.getSelectedTab;
      return selectedTab ? selectedTab : {};
    },
    mode() {
      return this.$store.getters.getPopupMode;
    },
  },
  mounted() {
    browser.runtime.sendMessage({ type: MessageType.POPUP });
    this.mode = this.$store.getters.getPopupMode;
  },
  methods: {
    jumpTab(): void {
      switch (this.mode) {
        case PopupMode.MULTIPLE_TABS: {
          const { id, windowId } = this.$store.getters.getListedTab;
          browser.windows.update(windowId as number, { focused: true });
          browser.tabs.update(id as number, { active: true });
          this.$store.commit("incrementCounter");
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
      browser.runtime.sendMessage({ type: MessageType.POPUP_CUR_TAB });
      this.$store.commit("setPopupMode", PopupMode.SELECTED_TAB);
      this.mode = PopupMode.SELECTED_TAB;
      this.selectedTab = this.$store.getters.getSelectedTab;
    },
    resetSelectedTabs(): void {
      browser.runtime.sendMessage({ type: MessageType.POPUP });
      this.$store.commit("setPopupMode", PopupMode.MULTIPLE_TABS);
      this.mode = PopupMode.MULTIPLE_TABS;
    },
  },
});
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  padding: 1em;
}
.selectedTab {
}
</style>
