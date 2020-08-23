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
      <span class="selectedTab__title">Selected Tab</span>
      <div class="selectedTab__details">
        <img :src="selectedTab.favIconUrl || ''" alt="" class="selectedTab__details__icon" />
        <span class="selectedTab__details__text">
          {{ selectedTab.title || "..." }}
        </span>
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
      this.selectedTab = this.$store.getters.getSelectedTab;
    },
    resetSelectedTabs(): void {
      browser.runtime.sendMessage({ type: MessageType.POPUP });
      this.$store.commit("setPopupMode", PopupMode.MULTIPLE_TABS);
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
.selectedTab__details {
  display: flex;
  align-items: center;
}
.selectedTab__details__icon {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}
</style>
