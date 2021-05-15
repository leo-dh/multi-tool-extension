<template>
  <div class="tabs">
    <span class="tabs__title">Tabs</span>
    <div class="tabs__search">
      <div class="tabs__search__inputContainer">
        <svg class="tabs__search__inputContainer__icon" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          />
        </svg>
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
        <template v-for="(tab, i) in filteredTabs" :key="i">
          <div
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
import { computed, defineComponent, nextTick, onMounted, ref, watch } from "vue";
import { MessageType, Tab } from "@/types";
import Fuse from "fuse.js";

export default defineComponent({
  setup() {
    const search = ref("");
    const selected = ref(0);
    const results = ref<HTMLDivElement | null>(null);
    const searchInput = ref<HTMLInputElement | null>(null);

    const tabs = ref<Tab[] | null>(null);
    browser.runtime.sendMessage({ type: MessageType.GET_TABS }).then(res => {
      tabs.value = res;
    });
    const filteredTabs = computed(() => {
      if (!search.value || !tabs.value) return tabs.value;
      const fuse = new Fuse(tabs.value, {
        keys: [{ name: "title", weight: 1.5 }, "url"],
        threshold: 0.5,
      });
      console.log(fuse.search(search.value).map(result => result.item));
      return fuse.search(search.value).map(result => result.item);
    });

    watch(
      () => search.value,
      () => {
        selected.value = 0;
      }
    );

    function jumpToTab({ id, windowId }: Tab) {
      browser.windows.update(windowId as number, { focused: true });
      browser.tabs.update(id as number, { active: true });
      window.close();
    }
    function jumpToSelected() {
      if (!filteredTabs.value) return;
      const selectedTab = filteredTabs.value[selected.value];
      if (!selectedTab) return;
      jumpToTab(selectedTab);
    }
    function changeSelected(amount: number) {
      if (!filteredTabs.value) return;
      const max = filteredTabs.value.length - 1;
      const min = 0;
      const newVal = selected.value + amount;
      if (!(newVal > max || newVal < min)) {
        selected.value = newVal;
      }
      nextTick(() => {
        (results.value as HTMLDivElement)
          .querySelector(".selected")
          ?.scrollIntoView({ block: amount > 0 ? "end" : "start", behavior: "smooth" });
      });
    }

    onMounted(() => {
      searchInput.value?.focus();
    });

    return {
      search,
      selected,
      results,
      searchInput,
      tabs,
      filteredTabs,
      jumpToTab,
      jumpToSelected,
      changeSelected,
    };
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
  position: relative;
}
.tabs__search__inputContainer__icon {
  width: 16px;
  height: 16px;
  color: gray;
  margin: 8px 8px;
  position: absolute;
}
.tabs__search__inputContainer__input {
  width: 100%;
  padding: 8px 4px 8px 24px;
}
.tabs__search__results {
  /* border-top: 1px solid gray; */
  max-height: 250px;
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
  transition: all 0.2s ease-in-out;
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
