<template>
  <input
    v-model="inputValue"
    placeholder="Click to edit"
    type="text"
    class="w-full p-2 text-blue-gray-900 focus:border-teal-600 focus:bg-transparent focus:text-white border-2 border-transparent duration-300 rounded"
  />
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();
const inputValue = useVModel(props, "modelValue", emit);
</script>
