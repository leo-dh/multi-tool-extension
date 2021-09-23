<template>
  <!-- Why min-w-0 is required -->
  <!-- https://stackoverflow.com/questions/36247140/why-dont-flex-items-shrink-past-content-size -->
  <div class="py-1 px-2 flex items-center min-w-0">
    <img :src="favIconUrl" alt="" class="w-4 h-4 mr-4 flex-shrink-0" />
    <div class="min-w-0">
      <p class="line-clamp-1 font-semibold text-sm">
        {{ title }}
      </p>
      <p class="text-xs text-gray-400 line-clamp-1 break-all">
        {{ url }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    favIconUrl?: string;
    title?: string;
    url?: string;
  }>(),
  { favIconUrl: "", title: "", url: "" }
);
const { favIconUrl, title, url } = toRefs(props);
</script>
