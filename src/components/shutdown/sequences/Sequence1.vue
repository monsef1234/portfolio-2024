<template>
  <span class="blink" v-if="cursor">_</span>
  <div id="shutdown"></div>
  <div id="error"></div>
  <div class="error-messages"></div>
  <div id="restart"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Typewriter from "typewriter-effect/dist/core";

import { emitter } from "@/main";
import { useSequencesStore } from "@/stores/sequences";

export default defineComponent({
  name: "Sequence1",

  setup() {
    const sequencesStore = useSequencesStore();

    return {
      sequencesStore,
    };
  },

  data() {
    return {
      cursor: true as boolean,

      errorMessage: [
        "> Running diagnostics...",
        "> Multiple errors found in my system",
        "> Memory corruption at address 0xF8A92",
        "> File system integrity compromised",
        "> Core system files inaccessible",
        "> Initializing backup systems",
        "> Loading safe mode protocols",
        "> Checking disk structure",
        "> Verifying boot sector",
      ] as string[],
    };
  },

  methods: {
    initializeTypewriter(id: string) {
      const typewriter = new Typewriter(id, {
        loop: false,
        delay: 10,
        cursor: "",
      });

      return typewriter;
    },

    firstGroupErrorMessages() {
      const messages = this.errorMessage.slice(0, 2);
      return messages;
    },

    secondGroupErrorMessages() {
      const messages = this.errorMessage.slice(2, 4);
      return messages;
    },

    thirdGroupErrorMessages() {
      const messages = this.errorMessage.slice(4, 6);
      return messages;
    },

    fourthGroupErrorMessages() {
      const messages = this.errorMessage.slice(6, this.errorMessage.length);
      return messages;
    },

    appendMessages(messages: string[]) {
      const parent = document.querySelector(".error-messages") as HTMLElement;

      messages.forEach((message) => {
        const p = document.createElement("p");
        p.classList.add("text-lg", "mb-2");
        p.innerText = message;
        parent.appendChild(p);
      });
    },

    shutdownTypewriter() {
      const typewriter = this.initializeTypewriter("#shutdown");

      typewriter
        .pauseFor(2000)
        .callFunction(() => {
          this.cursor = false;
        })
        .typeString("<p class='text-lg'>Initiating shutdown sequence...</p>")
        .pauseFor(500)
        .typeString(
          "<p class='text-lg'>Wrapping up all processes and securing data streams.</p>"
        )
        .pauseFor(500)
        .typeString(
          "<p class='text-lg'> Memory banks powering down, cache cleared,</p>"
        )
        .pauseFor(500)
        .typeString(
          "<p class='text-lg'>It's been a productive session! Systems powering off - catch you on the next boot!</p>"
        )
        .pauseFor(3000)
        .callFunction(() => {
          this.errorTypewriter();
        })
        .start();
    },

    errorTypewriter() {
      const typewriter = this.initializeTypewriter("#error");

      typewriter
        .typeString(
          "<p class='text-red-500 font-bold mt-2 mb-2 text-lg md:text-xl'>CRITICAL_SYSTEM_FAILURE_DETECTED</p>"
        )
        .pauseFor(2000)
        .callFunction(async () => {
          this.appendMessages(this.firstGroupErrorMessages());
          await new Promise((resolve) => setTimeout(resolve, 2000));
          this.appendMessages(this.secondGroupErrorMessages());
          await new Promise((resolve) => setTimeout(resolve, 2000));
          this.appendMessages(this.thirdGroupErrorMessages());
          await new Promise((resolve) => setTimeout(resolve, 2000));
          this.appendMessages(this.fourthGroupErrorMessages());
        })
        .pauseFor(6500)
        .callFunction(() => {
          this.restartTypewriter();
        })
        .start();
    },

    restartTypewriter() {
      const typewriter = this.initializeTypewriter("#restart");

      typewriter
        .pauseFor(1000)
        .typeString(
          "<p class='text-red-500 font-bold mt-5 mb-5 text-xl'>[ERROR CODE: 0xDEADBEEF]</p>"
        )
        .pauseFor(500)
        .typeString(
          "<p class='text-lg mb-4'>RESTART REQUIRED TO PREVENT DATA LOSS! 🚨</p>"
        )
        .pauseFor(1000)
        .typeString("<span class='text-lg font-bold'>Restarting</span>")
        .pauseFor(500)
        .typeString("<span>.</span>")
        .pauseFor(500)
        .typeString("<span>.</span>")
        .pauseFor(500)
        .typeString("<span>.</span>")
        .pauseFor(500)
        .callFunction(() => {
          emitter.emit("restart");
          this.sequencesStore.setSequence();
        })
        .start();
    },
  },

  mounted() {
    this.shutdownTypewriter();
  },
});
</script>

<style scoped>
.blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
