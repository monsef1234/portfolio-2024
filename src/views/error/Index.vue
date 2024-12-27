<template>
  <div
    class="font-lucida h-screen place-content-center bg-[#1d45aa] p-5 sm:p-10 md:p-20"
  >
    <div class="flex flex-col gap-5 max-w-7xl mx-auto" id="error"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Typewriter from "typewriter-effect/dist/core";

export default defineComponent({
  name: "NotFound",

  data() {
    return {
      mobile: false as boolean,
    };
  },

  methods: {
    initializeTypewriter(id: string) {
      const typewriter = new Typewriter(
        document.querySelector(id) as HTMLElement,
        {
          loop: false,
          delay: 10,
          cursor: "",
        }
      );

      return typewriter;
    },

    detectMobileDevice() {
      this.mobile = window.matchMedia("(max-width: 768px)").matches;
    },

    typewriter() {
      const typewriter = this.initializeTypewriter("#error");

      typewriter
        .typeString(
          `<p class="md:text-2xl text-base mb-5">An error has occurred.</p>`
        )
        .pauseFor(500)
        .typeString(
          `<p class="md:text-2xl text-base">
    If this is the first time you've seen this error screen that means you
    entre a wrong path or this path has been moved
  </p>`
        )
        .pauseFor(500)
        .typeString(
          `<h2 class="text-center mt-16 md:text-3xl text-lg">${
            this.mobile ? "Touch any where" : "Press any key"
          } to continue <span class="cursor-animation">_</span></h2>`
        )
        .callFunction(() => {
          document.addEventListener(
            `${this.mobile ? "touchstart" : "keydown"}`,
            this.pushToHome
          );
        })
        .start();
    },

    pushToHome() {
      this.$router.push("/");
    },
  },

  mounted() {
    this.detectMobileDevice();
    this.typewriter();
  },

  beforeUnmount() {
    document.removeEventListener(
      `${this.mobile ? "touchstart" : "keydown"}`,
      this.pushToHome
    );
  },
});
</script>
