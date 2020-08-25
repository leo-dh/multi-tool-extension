<template>
  <div class="tabs">
    <span class="tabs__title">Tabs</span>
    <div class="tabs__search">
      <input ref="searchInput" v-model="search" type="text" class="tabs__search__input" />
      <div v-if="filteredTabs" class="tabs__search__results">
        <template v-for="(tab, i) in filteredTabs">
          <div :key="i" class="tabs__search__results__item">
            {{ tab.title }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MessageType, TabInfo } from "@/types";

export default Vue.extend({
  data() {
    return {
      search: "",
      tabs: [] as TabInfo[],
    };
  },
  computed: {
    filteredTabs(): TabInfo[] {
      return this.tabs.filter(value => value.title?.includes(this.search));
    },
  },
  mounted() {
    (this.$refs.searchInput as HTMLElement).focus();
  },
  created() {
    this.getTabs();
  },
  methods: {
    getTabs() {
      browser.runtime.sendMessage({ type: MessageType.GET_ALL_TABS }).then(response => {
        this.tabs = response;
      });
    },
  },
});
</script>

<style scoped>
.tabs {
  color: whitesmoke;
  display: flex;
  flex-direction: column;
}
.tabs__search__input {
  width: 100%;
}
.tabs__search__results {
  max-height: 200px;
  overflow-y: auto;
}
.tabs__search__results__item {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin: 4px 0;
}
</style>
