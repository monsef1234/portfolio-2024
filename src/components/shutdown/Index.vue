<template>
  <div
    class="font-lucida bg-[var(--color-2)] h-[100dvh] p-6 sm:p-10 md:p-20 break-words overflow-auto"
    id="scroll-container"
  >
    <Sequence1 v-if="sequencesStore.sequence === 1" />
    <Sequence2 v-if="sequencesStore.sequence === 2" />
    <Sequence3 v-if="sequencesStore.sequence === 3" />
    <Sequence4 v-if="sequencesStore.sequence === 4" />
    <Sequence5 v-if="sequencesStore.sequence === 5" />
    <Sequence6 v-if="sequencesStore.sequence === 6" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Sequence1 from "./sequences/Sequence1.vue";
import Sequence2 from "./sequences/Sequence2.vue";
import Sequence3 from "./sequences/Sequence3.vue";
import Sequence4 from "./sequences/Sequence4.vue";
import Sequence5 from "./sequences/Sequence5.vue";
import Sequence6 from "./sequences/Sequence6.vue";
import { useSequencesStore } from "@/stores/sequences";

export default defineComponent({
  name: "Shutdown",

  components: {
    Sequence1,
    Sequence2,
    Sequence3,
    Sequence4,
    Sequence5,
    Sequence6,
  },

  setup() {
    const sequencesStore = useSequencesStore();

    return {
      sequencesStore,
    };
  },

  methods: {
    autoScroll() {
      const container = document.querySelector(
        "#scroll-container"
      ) as HTMLElement;

      if (!container) return;

      const observer = new MutationObserver(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    },
  },

  mounted() {
    this.autoScroll();
  },
});
</script>

<style scoped>
#scroll-container {
  scrollbar-width: none;
}
</style>
