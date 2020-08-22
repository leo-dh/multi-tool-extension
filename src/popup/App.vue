<template>
  <div class="container">
    <button @click="jumpTab">
      Change Tab
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",
  methods: {
    jumpTab(): void {
      const { id, windowId } = this.$store.getters.getTabInfo;
      browser.windows.update(windowId, { focused: true });
      browser.tabs.update(id, { active: true });
      this.$store.state.counter++;
    },
  },
  destroyed() {
    this.$store.state.counter = 0;
  },
  mounted() {
    browser.runtime.sendMessage({ type: "popup" });
  },
});
</script>

<style>
.container {
  display: flex;
  padding: 1em;
}
</style>
