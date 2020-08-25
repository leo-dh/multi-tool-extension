<template>
  <div class="pinnedTab">
    <span class="pinnedTab__title">Pinned Tab</span>
    <div class="pinnedTab__details">
      <template v-if="pinnedTab">
        <img :src="pinnedTab.favIconUrl" alt="" class="pinnedTab__details__icon" />
        <span class="pinnedTab__details__text">
          {{ pinnedTab.title }}
        </span>
      </template>
      <template v-else>
        <span class="pinnedTab__details__text">
          No Pinned Tab
        </span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  computed: {
    pinnedTab() {
      return this.$store.getters.getSelectedTab;
    },
  },
});
</script>

<style scoped>
.pinnedTab {
  color: whitesmoke;
  border-radius: 4px;
  padding: 8px 16px;
}
.pinnedTab__title {
  font-weight: bold;
  font-size: 0.8rem;
}
.pinnedTab__details {
  display: flex;
  align-items: center;
  margin-top: 8px;
}
.pinnedTab__details__icon {
  width: 18px;
  height: 18px;
  margin-right: 12px;
}
.pinnedTab__details__text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 0.8rem;
}
</style>
