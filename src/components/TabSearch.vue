<template>
  <div class="flex flex-col">
    <h2 class="font-semibold">Tabs</h2>
    <div class="mt-2">
      <div class="relative">
        <mdi-magnify
          class="absolute w-4 h-4 text-gray-400 mx-2 top-1/2 transform -translate-y-1/2"
        />
        <input
          ref="searchInputElement"
          v-model="searchString"
          type="text"
          class="w-full py-2 pr-1 pl-8 text-sm text-blue-gray-900 rounded border-2 focus:border-teal-600 focus:bg-transparent focus:text-white duration-300"
          placeholder="Search Tabs"
          @keyup.enter="jumpToSelected"
          @keydown.alt.j="changeSelected(1)"
          @keydown.alt.k="changeSelected(-1)"
          @keydown.up="changeSelected(-1)"
          @keydown.down="changeSelected(1)"
        />
      </div>
      <div
        ref="resultsElement"
        class="h-[250px] overflow-y-auto mt-4 overflow-x-hidden pr-2 relative space-y-2"
      >
        <transition-group name="list">
          <template v-for="(tab, i) in filteredTabs" :key="tab.id">
            <div
              class="flex items-center rounded cursor-pointer hover:bg-[#4d4d5c] overflow-hidden flex-shrink-0 list-item-transition w-full"
              :class="[i === selectedIndex ? 'selected' : '']"
              @click="jumpToTab(tab)"
              @mouseenter="hoveredTab = tab.id || null"
              @mouseleave="hoveredTab = null"
            >
              <div class="relative w-full">
                <tab-card
                  :fav-icon-url="tab.favIconUrl"
                  :title="tab.title"
                  :url="tab.url"
                />
                <transition name="fade">
                  <div
                    v-if="hoveredTab === tab.id"
                    class="absolute top-0 right-0 h-full flex justify-end px-2 linear-gradient-right pl-6"
                  >
                    <div class="flex text-white gap-2">
                      <button
                        class="media-buttons"
                        :title="`${tab.pinned ? 'Unpin' : 'Pin'} tab`"
                        @click="togglePin($event, tab)"
                      >
                        <transition name="fade" mode="out-in">
                          <mdi-pin-off
                            v-if="tab.pinned"
                            key="pinned"
                            class="w-5 h-5"
                          />
                          <mdi-pin v-else key="not pinned" class="w-5 h-5" />
                        </transition>
                      </button>
                      <button
                        class="media-buttons"
                        :title="`${
                          tab.mutedInfo?.muted ? 'Unmute' : 'Mute'
                        } tab`"
                        @click="toggleMute($event, tab)"
                      >
                        <transition name="fade" mode="out-in">
                          <mdi-volume-mute
                            v-if="tab.mutedInfo?.muted"
                            key="muted"
                            class="w-5 h-5"
                          />
                          <mdi-volume v-else key="playing" class="w-5 h-5" />
                        </transition>
                      </button>
                      <button
                        class="media-buttons"
                        title="Close tab"
                        @click="closeTab($event, tab.id)"
                      >
                        <mdi-close-circle-outline class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </template>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Tabs, tabs } from "webextension-polyfill";
import Fuse from "fuse.js";
import { mediaQueue } from "@/logic";

const searchString = ref("");
const selectedIndex = ref(0);
const resultsElement = ref<HTMLDivElement | null>(null);
const searchInputElement = ref<HTMLInputElement | null>(null);
const hoveredTab = ref<number | null>(null);

const allTabs = ref([] as Tabs.Tab[]);
function setAllTabs() {
  tabs.query({}).then((value) => {
    allTabs.value = value;
  });
}
setAllTabs();

watch(mediaQueue, () => {
  setAllTabs();
});

const filteredTabs = computed(() => {
  if (!searchString.value || !allTabs.value) return allTabs.value;
  const fuse = new Fuse(allTabs.value, {
    keys: [{ name: "title", weight: 1.5 }, "url"],
    threshold: 0.5,
  });
  return fuse.search(searchString.value).map((result) => result.item);
});

watch(searchString, () => {
  selectedIndex.value = 0;
});

function jumpToTab({ id, windowId }: Tabs.Tab) {
  browser.windows.update(windowId as number, { focused: true });
  browser.tabs.update(id as number, { active: true });
  window.close();
}
function jumpToSelected() {
  if (!filteredTabs.value) return;
  const selectedTab = filteredTabs.value[selectedIndex.value];
  if (!selectedTab) return;
  jumpToTab(selectedTab);
}
function changeSelected(amount: number) {
  if (!filteredTabs.value) return;
  const max = filteredTabs.value.length - 1;
  const min = 0;
  const newVal = selectedIndex.value + amount;
  if (!(newVal > max || newVal < min)) {
    selectedIndex.value = newVal;
  }
  nextTick(() => {
    (resultsElement.value as HTMLDivElement)
      .querySelector(".selected")
      ?.scrollIntoView({
        block: amount > 0 ? "end" : "start",
        behavior: "smooth",
      });
  });
}

async function closeTab(ev: MouseEvent, id?: number) {
  ev.stopPropagation();
  if (id) {
    await tabs.remove(id);
    setAllTabs();
  }
}
async function togglePin(ev: MouseEvent, tab: Tabs.Tab) {
  ev.stopPropagation();
  if (tab.id) {
    await tabs.update(tab.id, { pinned: !tab.pinned });
    setAllTabs();
  }
}
async function toggleMute(ev: MouseEvent, tab: Tabs.Tab) {
  ev.stopPropagation();
  if (tab.id) {
    await tabs.update(tab.id, { muted: !tab.mutedInfo?.muted });
    setAllTabs();
  }
}

onMounted(() => {
  searchInputElement.value?.focus();
});
</script>

<style scoped>
.selected {
  background: #4d4d5c;
}
.linear-gradient-right {
  background: linear-gradient(to right, rgba(0, 0, 0, 0), #4d4d5cff 20%);
}

.media-buttons {
  @apply duration-300 hover:text-gray-400;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-leave-active {
  position: absolute;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-item-transition {
  transition: all 0.5s ease;
}
.list-move {
  transition: all 0.5s ease;
}
</style>
