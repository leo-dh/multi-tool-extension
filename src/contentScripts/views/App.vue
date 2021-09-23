<template>
  <div
    class="fixed right-0 bottom-0 m-[20px] z-100 flex flex-col select-none gap-[8px] w-[200px]"
  >
    <transition-group name="list">
      <button
        v-if="notificationQueue.length > 0"
        key="button"
        class="btn"
        @click="clearMessageQueue"
      >
        Clear all notifications
      </button>
      <template v-for="message in notificationQueue" :key="message.timestamp">
        <div
          class="list-item-transition bg-white text-blue-gray-800 px-[8px] py-[6px] rounded-[4px] shadow"
        >
          <p class="font-semibold text-teal-600 m-0 text-[16px] leading-[24px]">
            {{ message.title }}
          </p>
          <p class="mt-[4px] mx-0 mb-0 text-[14px] leading-[20px]">
            {{ message.content }}
          </p>
        </div>
      </template>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { onMessage } from "webext-bridge";
import { NotificationQueueDetails } from "@/logic/types";
import "virtual:windi.css";

const notificationQueue = ref<NotificationQueueDetails[]>([]);
onMessage("update-notifications", ({ data: { newNotifications } }) => {
  notificationQueue.value = [...notificationQueue.value, ...newNotifications];
  newNotifications.forEach((notification) => {
    setTimeout(() => {
      const index = notificationQueue.value.indexOf(notification);
      if (index > -1) {
        notificationQueue.value.splice(index, 1);
      }
    }, notification.timeout);
  });
});
function clearMessageQueue() {
  notificationQueue.value = [];
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  @apply font-sans;
}
.btn {
  @apply px-[8px] py-[8px] rounded inline-block
    bg-teal-600 text-white cursor-pointer
    hover:bg-teal-700
    disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50 duration-300 font-semibold border-0;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
}
.list-enter-from {
  transform: translateY(40px);
}
.list-item-transition {
  transition: all 0.5s ease;
}
</style>
