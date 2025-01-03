<template>
  <span class="blink" v-if="cursor">_</span>
  <div id="content" v-show="!cursor"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Typewriter from "typewriter-effect/dist/core";

import { emitter } from "@/main";
import { useSequencesStore } from "@/stores/sequences";

export default defineComponent({
  name: "Sequence4",

  setup() {
    const sequencesStore = useSequencesStore();

    return {
      sequencesStore,
    };
  },

  data() {
    return {
      cursor: true as boolean,
    };
  },

  methods: {
    initializeTypewriter(id: string) {
      const typewriter = new Typewriter(id, {
        loop: false,
        delay: 15,
        cursor: "",
      });

      return typewriter;
    },
  },

  mounted() {
    const typewriter = this.initializeTypewriter("#content");

    typewriter
      .pauseFor(1500)
      .callFunction(() => {
        this.cursor = false;
      })
      .pauseFor(1000)
      .typeString(
        `<pre class='text-lg mb-4'>

█████████████████████
██████████████░░░░░░█
████████████░░░░▄▀░░█
█░░░░░░███░░░░▄▀░░░░█
█░░▄▀░░█░░░░▄▀░░░░███
█░░░░░░█░░▄▀░░░░█████
████████░░▄▀░░███████
█░░░░░░█░░▄▀░░░░█████
█░░▄▀░░█░░░░▄▀░░░░███
█░░░░░░███░░░░▄▀░░░░█
████████████░░░░▄▀░░█
██████████████░░░░░░█
█████████████████████
    </pre>`
      )
      .pauseFor(500)
      .typeString("<span class='text-lg font-bold'>Restarting</span>")
      .pauseFor(500)
      .typeString("<span>.</span>")
      .pauseFor(500)
      .typeString("<span>.</span>")
      .pauseFor(500)
      .typeString("<span>.</span>")
      .pauseFor(1000)
      .callFunction(() => {
        emitter.emit("restart");
        this.sequencesStore.setSequence();
      })
      .start();
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
