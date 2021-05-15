<template>
  <div v-if="tab" class="nowPlaying">
    <span class="nowPlaying__title">Now Playing</span>
    <div class="nowPlaying__content">
      <div class="nowPlaying__content__details" @click="jumpToTab">
        <img :src="tab.favIconUrl" alt="" class="nowPlaying__content__details__img" />
        <span class="nowPlaying__content__details__text">{{ tab.title }}</span>
      </div>
      <div class="nowPlaying__content__buttons">
        <div v-if="!videoPlaying" class="nowPlaying__content__buttons__icon" @click="playPause">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3" style="transform: translateX(2px)" />
          </svg>
        </div>
        <div v-else class="nowPlaying__content__buttons__icon" @click="playPause">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Tab, Message, MessageType } from "@/types";

export default defineComponent({
  setup() {
    const tab = ref<Tab | null>(null);
    const videoPlaying = ref(false);

    browser.runtime.sendMessage({ type: MessageType.GET_NOW_PLAYING }).then(res => {
      tab.value = res.tab;
      videoPlaying.value = res.videoPlaying;
    });

    function jumpToTab() {
      if (!tab.value) return;
      const { id, windowId } = tab.value;
      browser.windows.update(windowId as number, { focused: true });
      browser.tabs.update(id as number, { active: true });
      window.close();
    }

    function playPause() {
      if (!tab.value) return;
      browser.tabs.sendMessage(tab.value.id as number, { type: MessageType.PLAY_PAUSE } as Message);
    }
    return {
      tab,
      videoPlaying,
      jumpToTab,
      playPause,
    };
  },
});
</script>

<style scoped>
.nowPlaying {
  color: whitesmoke;
  border-radius: 4px;
  padding: 8px 16px;
}
.nowPlaying__title {
  font-weight: bold;
}
.nowPlaying__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 8px;
}
.nowPlaying__content__buttons {
  display: flex;
  justify-content: center;
}
.nowPlaying__content__buttons__icon {
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-left: 8px;
  border-radius: 50%;
  border: solid 2px #4d4d5c;
  display: flex;
  align-items: center;
}
.nowPlaying__content__buttons__icon:hover {
  background: #4d4d5c;
}
.nowPlaying__content__buttons__icon svg {
  width: 16px;
  height: 16px;
}
.nowPlaying__content__details {
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px 8px;
  transition: all 0.2s ease-in-out;
  width: 100%;
}
.nowPlaying__content__details:hover {
  background: #4d4d5c;
}
.nowPlaying__content__details__img {
  width: 18px;
  height: 18px;
  margin-right: 12px;
}
.nowPlaying__content__details__text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 0.8rem;
  font-weight: 600;
}
</style>
