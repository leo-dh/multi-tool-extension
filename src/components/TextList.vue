<template>
  <div class="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
    <template v-for="(text, i) in savedTitles" :key="text">
      <div class="relative bg-gray-500 px-2 py-1 pr-14 rounded group">
        {{ text }}

        <div class="absolute top-1 right-1 group space-x-0.5">
          <button
            class="opacity-0 duration-300 p-1 rounded-sm"
            :class="[
              copied && copiedText === text
                ? ''
                : 'group-hover:opacity-100 hover:bg-gray-600',
            ]"
            @click="copyToClipboard(text)"
          >
            <mdi-content-copy class="h-4 w-4" />
          </button>

          <button
            class="opacity-0 duration-300 p-1 rounded-sm group-hover:opacity-100 hover:bg-gray-700"
            @click="deleteSavedText(i)"
          >
            <mdi-delete class="h-5 w-5 -m-0.5" />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { useClipboard } from "@vueuse/core";
import { savedTitles } from "@/logic";

const { copy, copied, text: copiedText } = useClipboard({ copiedDuring: 1000 });

const copyToClipboard = async (text: string) => {
  await copy(text);
  // TODO send message to create a new notification
};

const deleteSavedText = (i: number) => {
  const savedTitlesCopy = [...savedTitles.value];
  savedTitlesCopy.splice(i, 1);
  savedTitles.value = [...savedTitlesCopy];
};
</script>

<style scoped>
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
