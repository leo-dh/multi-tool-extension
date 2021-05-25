<template>
  <div class="container">
    <now-playing />
    <pinned-tab />
    <tabs />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { MessageType } from "@/types";
import PinnedTab from "@/components/PinnedTab.vue";
import NowPlaying from "@/components/NowPlaying.vue";
import Tabs from "@/components/Tabs.vue";

export default defineComponent({
  name: "App",
  components: {
    PinnedTab,
    Tabs,
    NowPlaying,
  },
  setup() {
    browser.runtime.sendMessage({ type: MessageType.POPUP });
    onMounted(() => {
      const body = document.querySelector("body");
      if (body) {
        body.style.background = "#31313a";
        body.style.display = "flex";
        body.style.justifyContent = "center";
      }
    });
  },
});
</script>

<style>
/* CSS Reset */
html {
  box-sizing: border-box;
  font-size: 16px;
  font-family: sans-serif;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
ol,
ul {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

ol,
ul {
  list-style: none;
}

.container {
  display: flex;
  flex-direction: column;
  max-width: 350px;
}
.container > * {
  margin-top: 8px;
}
.buttonRow {
  display: flex;
  padding: 0px 16px;
}
.buttonRow > * {
  flex: 1 1 0;
  margin-right: 8px;
}
</style>
