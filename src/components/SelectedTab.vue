<template>
  <div class="selectedTab">
    <span class="selectedTab__title">Selected Tab</span>
    <div class="selectedTab__details">
      <img :src="selectedTab.favIconUrl || ''" alt="" class="selectedTab__details__icon" />
      <span class="selectedTab__details__text">
        {{ selectedTab.title || "..." }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  computed: {
    selectedTab() {
      return this.$store.getters.getSelectedTab || {};
    },
  },
});
</script>

<style scoped>
.selectedTab {
  color: whitesmoke;
}
.selectedTab__title {
  font-weight: bold;
  font-size: 1.2rem;
}
.selectedTab__details {
  display: flex;
  align-items: center;
  margin-top: 8px;
}
.selectedTab__details__icon {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}
.selectedTab__details__text {
  max-width: 20ch;
  font-size: 0.8rem;
}
</style>
