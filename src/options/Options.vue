<template>
  <main class="px-4 py-10 max-w-screen-md mx-auto">
    <div class="flex">
      <pixelarticons-sliders class="icon-btn mr-4 w-8 h-8" />
      <h1 class="font-bold text-2xl">Options</h1>
    </div>
    <div class="mt-8 mx-auto space-y-12">
      <div class="flex flex-col items-start">
        <label for="notionTokenInput" class="font-semibold text-xl"
          >Notion Token</label
        >
        <EditableInput
          id="notionTokenInput"
          v-model="notionToken"
          class="w-full mt-4"
        />
      </div>
      <div class="flex flex-col items-start">
        <label for="notionPagesInput" class="font-semibold text-xl"
          >Notion Pages</label
        >
        <table id="notionPagesInput" class="w-full mt-4">
          <tr class="border-b-2 border-gray-400">
            <th width="20%" class="p-2 text-left">Title</th>
            <th width="70%" class="p-2 text-left">UUID</th>
            <th width="10%" class="p-2">Delete</th>
          </tr>
          <template v-for="(page, i) in notionPages" :key="i">
            <tr>
              <td class="py-1 pr-2">
                <EditableInput v-model="page.title" />
              </td>
              <td class="py-1">
                <EditableInput v-model="page.uuid" />
              </td>
              <td>
                <div class="flex w-full h-full items-center justify-center">
                  <button
                    class="p-2 flex items-center justify-center rounded-full hover:text-white hover:bg-red-400 duration-300"
                    @click="removePage(i)"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </template>

          <tr>
            <td colspan="3">
              <button class="w-full btn py-2 rounded mt-4" @click="addNewPage">
                Add New Page
              </button>
            </td>
          </tr>
        </table>
      </div>
      <div class="flex gap-8">
        <div class="flex flex-col flex-1">
          <h2 class="font-semibold text-xl">Saved Titles</h2>
          <text-list />
        </div>
        <div class="flex flex-col flex-1">
          <h2 class="font-semibold text-xl">Debug</h2>
          <div class="mt-4">
            <button class="btn" @click="resetLocalStorage">
              Reset Local Storage
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import {
  notionToken,
  notionPages,
  mediaQueue,
  mediaQueueDetails,
  numPlayingTabs,
  autoPause,
  savedTitles,
  notificationQueue,
} from "@/logic/storage";

const addNewPage = () => {
  notionPages.value.push({
    uuid: "",
    title: "",
  });
};
const removePage = (i: number) => {
  notionPages.value.splice(i, 1);
};

const resetLocalStorage = () => {
  notionToken.value = "";
  notionPages.value = [];
  mediaQueue.value = [];
  mediaQueueDetails.value = [];
  numPlayingTabs.value = 0;
  autoPause.value = false;
  savedTitles.value = [];
  notificationQueue.value = [];
};
</script>
