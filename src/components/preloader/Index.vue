<template>
  <div
    class="font-lucida my-10 flex flex-col gap-20 h-[calc(100vh-5rem)] absolute container mx-5"
  >
    <div class="flex text-center gap-32 text-lg leading-5">
      <p class="font-bold">Monsef,<br />Sofiane,<br />Bouras</p>
      <p>Released on: {{ format(new Date("2024-12-16"), "dd/MM/yyyy") }}</p>
    </div>

    <div class="flex-1 leading-5 text-lg">
      <div class="flex gap-[0.3rem] uppercase">
        <p>Loading resources</p>
        <div class="loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="ml-10 text-base mt-5">
        <p
          v-for="resource in loadedResources"
          :key="resource"
          v-html="resource"
        ></p>
      </div>
    </div>

    <div class="text-lg leading-5">
      <p>
        Press <kbd class="font-bold">DEL</kbd> to enter setup,
        <kbd class="font-bold">ESC</kbd> to skip memory test
      </p>
      <p>{{ format(new Date(), "dd/MM/yyyy") }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { format } from "date-fns";

export default defineComponent({
  name: "Preloader",

  setup() {
    return {
      format,
    };
  },

  data() {
    return {
      resources: [
        "Loading Graphics Interface... &nbsp;&nbsp;&nbsp;&nbsp;10%",
        "Loading UI Elements... &nbsp;&nbsp;&nbsp;&nbsp;20%",
        "Mounting File System...&nbsp;&nbsp;&nbsp;&nbsp;30%",
        "Initializing Core Kernel...&nbsp;&nbsp;&nbsp;&nbsp;40%",
        "Allocating Memory Resources...&nbsp;&nbsp;&nbsp;&nbsp;50%",
        "Scanning for Updates...&nbsp;&nbsp;&nbsp;&nbsp;60%",
        "Synchronizing System Clock...&nbsp;&nbsp;&nbsp;&nbsp;70%",
        "Loading Fonts and Themes...&nbsp;&nbsp;&nbsp;&nbsp;80%",
        "Cleaning Temporary Files...&nbsp;&nbsp;&nbsp;&nbsp;90%",
        "Compiling Cache Data...&nbsp;&nbsp;&nbsp;&nbsp;100%",
      ] as string[],

      progress: 0 as number,
      loadedResources: [] as string[],
    };
  },

  methods: {
    updateProgress() {
      const interval = setInterval(() => {
        if (this.progress < 100) {
          this.loadedResources.push(this.resources[this.progress / 10]);
          this.progress += 10;
        } else {
          clearInterval(interval);
        }
      }, 300);
    },

    autoScroll() {
      const target = document.querySelector(".container") as HTMLElement;

      if (!target) return;

      const observer = new MutationObserver(() => {
        target.scrollTo({
          top: target.scrollHeight,
          behavior: "smooth",
        });
      });

      observer.observe(target, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    },
  },

  mounted() {
    this.updateProgress();
    this.autoScroll();
  },
});
</script>

<style scoped>
.loader span {
  display: inline-block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: var(--color-3);
  margin: 0 3px;
  animation: dot-pulse 1s ease-in-out infinite;
}

.loader span:nth-child(1) {
  animation-delay: 0.1s;
}

.loader span:nth-child(2) {
  animation-delay: 0.2s;
}

.loader span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes dot-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
