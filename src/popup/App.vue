<template>
  <div class="container">
    <button @click="jumpTab">
      Change Tab
    </button>
    <button @click="selectTab">
      Select Current Tab
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MessageType } from "@/types";

export default Vue.extend({
  name: "App",
  methods: {
    jumpTab(): void {
      const { id, windowId } = this.$store.getters.getTabInfo;
      browser.windows.update(windowId, { focused: true });
      browser.tabs.update(id, { active: true });
      this.$store.state.counter++;
    },
    selectTab(): void {
      browser.runtime.sendMessage({ type: MessageType.POPUP_CUR_TAB });
    },
  },
  destroyed() {
    this.$store.state.counter = 0;
  },
  mounted() {
    browser.runtime.sendMessage({ type: MessageType.POPUP });
  },
});
</script>

<style>
.container {
  display: flex;
  padding: 1em;
}
</style>
