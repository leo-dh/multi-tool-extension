<template>
  <div class="tabs">
    <span class="tabs__title">Tabs</span>
    <div class="tabs__search">
      <div class="tabs__search__inputContainer">
        <input
          ref="searchInput"
          v-model="search"
          type="text"
          class="tabs__search__inputContainer__input"
          placeholder="Search Tabs"
          @keyup.enter="jumpToFirst"
        />
      </div>
      <div v-if="filteredTabs" class="tabs__search__results">
        <template v-for="(tab, i) in filteredTabs">
          <div :key="i" class="tabs__search__results__item" @click="jumpToTab(tab)">
            <img :src="tab.favIconUrl" alt="" class="tabs__search__results__item__icon" />
            <span class="tabs__search__results__item__text">{{ tab.title }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { TabInfo } from "@/types";

export default Vue.extend({
  props: {
    tabs: {
      type: Array as () => Array<TabInfo>,
      default: () => [] as TabInfo[],
    },
  },
  data() {
    return {
      search: "",
    };
  },
  computed: {
    filteredTabs(): TabInfo[] {
      return this.tabs.filter(
        value => value.title?.includes(this.search) || value.url?.includes(this.search)
      );
    },
  },
  mounted() {
    (this.$refs.searchInput as HTMLElement).focus();
  },
  methods: {
    jumpToTab({ id, windowId }: TabInfo) {
      browser.windows.update(windowId, { focused: true });
      browser.tabs.update(id, { active: true });
      window.close();
    },
    jumpToFirst() {
      const selectedTab = this.filteredTabs[0];
      if (!selectedTab) return;
      this.jumpToTab(selectedTab);
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
.tabs__title {
  padding: 0 16px;
  font-weight: bold;
}
.tabs__search {
  margin-top: 8px;
}
.tabs__search__inputContainer {
  padding: 0 16px;
}
.tabs__search__inputContainer__input {
  width: 100%;
  padding: 8px 4px;
}
.tabs__search__results {
  border-top: 1px solid gray;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 16px;
}
.tabs__search__results__item {
  display: flex;
  align-items: center;
  margin: 24px 16px;
  cursor: pointer;
}
.tabs__search__results__item:hover .tabs__search__results__item__text {
  background: grey;
}
.tabs__search__results__item__icon {
  width: 24px;
  height: 24px;
}
.tabs__search__results__item__text {
  margin-left: 16px;
  font-size: 0.9rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.3s ease-in-out;
}
</style>
