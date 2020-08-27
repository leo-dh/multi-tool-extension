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
          @keyup.enter="jumpToSelected"
          @keydown.alt.j="changeSelected(1)"
          @keydown.alt.k="changeSelected(-1)"
          @keydown.up="changeSelected(-1)"
          @keydown.down="changeSelected(1)"
        />
      </div>
      <div v-if="filteredTabs" ref="results" class="tabs__search__results">
        <template v-for="(tab, i) in filteredTabs">
          <div
            :key="i"
            class="tabs__search__results__item"
            :class="i == selected ? 'selected' : ''"
            @click="jumpToTab(tab)"
          >
            <img :src="tab.favIconUrl" alt="" class="tabs__search__results__item__icon" />
            <div class="tabs__search__results__item__text">
              <span class="tabs__search__results__item__text__title">{{ tab.title }}</span>
              <span class="tabs__search__results__item__text__url">{{ tab.url }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { TabInfo } from "@/types";
import Fuse from "fuse.js";

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
      selected: 0,
    };
  },
  computed: {
    filteredTabs(): TabInfo[] {
      if (!this.search) return this.tabs;
      const fuse = new Fuse(this.tabs, {
        keys: [{ name: "title", weight: 1.5 }, "url"],
        threshold: 0.5,
      });
      return fuse.search(this.search).map(result => result.item);
    },
  },
  watch: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    search(newValue, oldValue) {
      this.selected = 0;
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
    jumpToSelected() {
      const selectedTab = this.filteredTabs[this.selected];
      if (!selectedTab) return;
      this.jumpToTab(selectedTab);
    },
    changeSelected(amount: number) {
      const max = this.filteredTabs.length - 1;
      const min = 0;
      const newVal = this.selected + amount;
      if (!(newVal > max || newVal < min)) {
        this.selected = newVal;
      }
      this.$nextTick(() => {
        (this.$refs["results"] as HTMLElement)
          .querySelector(".selected")
          ?.scrollIntoView({ block: amount > 0 ? "end" : "start", behavior: "smooth" });
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
  /* border-top: 1px solid gray; */
  max-height: 300px;
  overflow-y: auto;
  margin-top: 16px;
}
.tabs__search__results__item {
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin: 6px 6px;
  padding: 12px 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}
.tabs__search__results__item:hover {
  background: #4d4d5c;
}
.tabs__search__results__item.selected {
  background: #4d4d5c;
}
.tabs__search__results__item__icon {
  width: 18px;
  min-width: 18px;
  height: 18px;
  min-height: 18px;
}
.tabs__search__results__item__text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 16px;
  overflow: hidden;
}
.tabs__search__results__item__text__title {
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tabs__search__results__item__text__url {
  margin-top: 4px;
  font-size: 0.6rem;
  color: #c4c4c4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
