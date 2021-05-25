<template>
  <div class="pinnedTab">
    <span class="pinnedTab__title">Pinned Tab</span>
    <div class="pinnedTab__content">
      <div
        v-if="pinnedTab"
        class="pinnedTab__content__details"
        title="Go to pinned tab"
        @click="jumpToTab"
      >
        <img :src="pinnedTab.favIconUrl" alt="" class="pinnedTab__content__details__icon" />
        <span class="pinnedTab__content__details__text">
          {{ pinnedTab.title }}
        </span>
      </div>
      <span v-else class="pinnedTab__content__text">
        No Pinned Tab
      </span>
      <div class="pinnedTab__content__button" title="Pin Current Tab" @click="pinCurrentTab">
        <svg viewBox="0 0 512 512" fill="currentColor">
          <path
            d="M330.274 0l-10.607 10.607c-24.914 24.914-28.585 63.132-11.047 91.987l-107.305 72.504-1.856-1.856c-40.939-40.939-107.553-40.94-148.492 0L40.36 183.848l133.289 133.289L0 490.787 21.213 512l173.649-173.65 133.29 133.29 10.607-10.607c40.94-40.94 40.939-107.553 0-148.492l-1.856-1.856 72.504-107.305c28.855 17.539 67.073 13.868 91.987-11.047L512 181.727zm-3.187 428.148L83.852 184.913c29.104-19.248 68.783-16.069 94.394 9.541l139.3 139.3c25.61 25.611 28.789 65.29 9.541 94.394zm-11.791-139.07l-92.374-92.374 105.496-71.281 58.159 58.159zM416.541 171.12l-75.66-75.66c-13.828-13.828-16.758-34.491-8.789-51.216l135.665 135.665c-16.725 7.969-37.388 5.039-51.216-8.789z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { MessageType, Tab } from "@/types";

export default defineComponent({
  setup() {
    const pinnedTab = ref<Tab | null>(null);
    browser.runtime.sendMessage({ type: MessageType.GET_PINNED_TAB }).then(res => {
      pinnedTab.value = res;
    });

    function pinCurrentTab(): void {
      browser.runtime.sendMessage({ type: MessageType.SET_PINNED_TAB }).then(res => {
        pinnedTab.value = res;
      });
    }

    function jumpToTab(): void {
      if (!pinnedTab.value) return;
      const { id, windowId } = pinnedTab.value;
      browser.windows.update(windowId as number, { focused: true });
      browser.tabs.update(id as number, { active: true });
      window.close();
    }

    return {
      pinnedTab,
      pinCurrentTab,
      jumpToTab,
    };
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
}
.pinnedTab__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
.pinnedTab__content__details {
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px 8px;
  transition: all 0.2s ease-in-out;
  width: 100%;
}
.pinnedTab__content__details:hover {
  background: #4d4d5c;
}
.pinnedTab__content__details__icon {
  width: 18px;
  height: 18px;
  margin-right: 12px;
}
.pinnedTab__content__details__text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 0.8rem;
  font-weight: 600;
}
.pinnedTab__content__button {
  color: whitesmoke;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-left: 8px;
  border-radius: 50%;
  border: solid 2px #4d4d5c;
  display: flex;
}
.pinnedTab__content__button:hover {
  background: #4d4d5c;
}
.pinnedTab__content__button svg {
  width: 16px;
  height: 16px;
}
</style>
