<template>
  <div class="h-[150px] overflow-x-hidden">
    <transition name="fade" mode="out-in">
      <div
        v-if="!mediaQueueDetails.length"
        key="empty"
        class="flex w-full h-full items-center justify-center flex-col text-center text-sm text-gray-400"
      >
        <mdi-playlist-play class="h-6 w-6 text-teal-600" />
        <p>There is nothing playing currently.</p>
        <div class="flex gap-2 mt-2">
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noreferrer"
            class="links youtube"
          >
            <mdi-youtube
          /></a>
          <a
            href="https://www.soundcloud.com"
            target="_blank"
            rel="noreferrer"
            class="links soundcloud"
            ><mdi-soundcloud
          /></a>
        </div>
      </div>

      <transition-group
        v-else
        key="list"
        name="list"
        tag="div"
        class="space-y-2 rounded overflow-y-auto h-full relative overflow-x-hidden"
        appear
      >
        <template v-for="tab in mediaQueueDetails" :key="tab.tabId">
          <div
            class="flex items-center rounded overflow-hidden list-item-transition"
            @mouseenter="hover = tab.tabId"
            @mouseleave="hover = null"
          >
            <div class="relative w-full">
              <tab-card
                :fav-icon-url="tab.favIconUrl"
                :title="tab.pageTitle"
                :url="tab.url"
              />

              <transition name="fade">
                <div
                  v-if="hover === tab.tabId"
                  class="absolute w-full h-full cursor-pointer bg-gray-600/90 px-2 top-0"
                  @click="jumpToTab(tab)"
                >
                  <div
                    class="flex w-full h-full justify-between items-center gap-2"
                  >
                    <div>
                      <transition name="fade" mode="out-in">
                        <div
                          v-if="savedRef && titleRef === tab.title"
                          key="title"
                        >
                          <p class="font-semibold">Title saved.</p>
                        </div>
                        <div v-else key="now playing" class="min-w-0">
                          <h3 class="font-semibold text-xs">Now Playing</h3>
                          <p class="line-clamp-1 text-xs text-gray-300">
                            {{ tab.title }}
                          </p>
                        </div>
                      </transition>
                    </div>
                    <div class="flex text-white gap-2">
                      <button
                        v-if="tab.status === MediaStatus.PAUSED"
                        class="media-buttons"
                        title="Play media"
                        @click="play($event, tab.tabId)"
                      >
                        <mdi-play-circle-outline class="w-5 h-5" />
                      </button>
                      <button
                        v-else-if="tab.status === MediaStatus.PLAYING"
                        class="media-buttons"
                        title="Pause media"
                        @click="pause($event, tab.tabId)"
                      >
                        <mdi-pause-circle-outline class="w-5 h-5" />
                      </button>
                      <button
                        class="media-buttons disabled:cursor-auto !disabled:text-white"
                        title="Save now playing"
                        :disabled="savedRef && titleRef === tab.title"
                        @click="saveTitle($event, tab.title)"
                      >
                        <transition name="fade" mode="out-in">
                          <mdi-check
                            v-if="savedRef && titleRef === tab.title"
                            key="saved"
                            class="w-5 h-5"
                          />
                          <mdi-content-save-outline
                            v-else
                            key="save"
                            class="w-5 h-5"
                          />
                        </transition>
                      </button>
                      <button
                        class="media-buttons"
                        title="Close tab"
                        @click="close($event, tab.tabId)"
                      >
                        <mdi-close-circle-outline class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </template>
      </transition-group>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { runtime, tabs, windows } from "webextension-polyfill";
import { debouncedWatch } from "@vueuse/core";
import { mediaQueueDetails, savedTitles, notificationQueue } from "@/logic";
import { MediaQueueDetails, MediaStatus } from "@/logic/types";

const hover = ref<number | null>(null);
const titleRef = ref("");
const savedRef = ref(false);

const jumpToTab = async (tab: MediaQueueDetails) => {
  const [currentTab] = await browser.tabs.query({ active: true });
  if (currentTab.id !== tab.tabId) {
    windows.update(tab.windowId, { focused: true });
    tabs.update(tab.tabId, { active: true });
  }
};
const play = (ev: MouseEvent, id: number) => {
  ev.stopPropagation();
  runtime.sendMessage({ type: "play-media", tabId: id });
};
const pause = (ev: MouseEvent, id: number) => {
  ev.stopPropagation();
  runtime.sendMessage({ type: "pause-media", tabId: id });
};

const saveTitle = (ev: MouseEvent, title: string) => {
  ev.stopPropagation();
  savedTitles.value = [...savedTitles.value, title];
  titleRef.value = title;
  savedRef.value = true;
  const trimmedTitle =
    title.length > 30 ? `${title.substring(0, 30 - 3)}...` : title;
  notificationQueue.value = [
    ...notificationQueue.value,
    {
      title: "Playback",
      timeout: 3000,
      timestamp: Date.now(),
      content: `'${trimmedTitle}' saved.`,
    },
  ];
};
debouncedWatch(
  savedRef,
  (value) => {
    if (value) savedRef.value = false;
  },
  { debounce: 2000 }
);
const close = (ev: MouseEvent, id: number) => {
  ev.stopPropagation();
  tabs.remove(id);
};
</script>

<style scoped>
.media-buttons {
  @apply duration-300 hover:text-gray-400;
}
.links {
  @apply duration-200 text-white border-2 border-transparent hover:bg-transparent rounded-sm p-1 filter saturate-60;
}
.youtube {
  @apply bg-[#FF0000] hover:border-[#FE0000] hover:text-[#FE5000];
}
.soundcloud {
  @apply bg-[#FE5000] hover:border-[#FE5000] hover:text-[#FE5000];
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
