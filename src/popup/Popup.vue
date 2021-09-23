<template>
  <main class="w-[300px] px-3 py-2 text-left flex flex-col">
    <button class="btn mt-2 text-sm" @click="openOptionsPage">Options</button>
    <div class="flex justify-between items-center w-full mt-4">
      <h2 class="font-semibold">Playback</h2>
      <div class="text-xs">
        <label for="toggle" class="flex items-center cursor-pointer">
          <div class="mr-2 text-gray-300">Auto Pause</div>
          <div class="relative">
            <input
              id="toggle"
              v-model="autoPause"
              type="checkbox"
              class="sr-only"
            />
            <div class="block bg-gray-600 w-8 h-5 rounded-full"></div>
            <div
              class="dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition"
            ></div>
          </div>
        </label>
      </div>
    </div>
    <media-queue-details class="mt-2" />
    <tab-search />
  </main>
</template>

<script setup lang="ts">
import { autoPause } from "@/logic";
function openOptionsPage() {
  browser.runtime.openOptionsPage();
}
browser.runtime.sendMessage({ type: "check-media" });
</script>

<style>
body {
  @apply overflow-hidden;
}
#toggle:checked ~ .dot {
  transform: translateX(100%);
  @apply bg-teal-500;
}
</style>
