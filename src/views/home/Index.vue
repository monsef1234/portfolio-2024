<template>
  <div class="h-screen flex flex-col">
    <div class="flex-1 bg-[#1b2021]">
      <Desktop />
    </div>
    <Taskbar />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Taskbar from "./components/taskbar/Index.vue";
import Desktop from "./components/desktop/Index.vue";

export default defineComponent({
  name: "Home",

  components: {
    Taskbar,
    Desktop,
  },
});
</script>
