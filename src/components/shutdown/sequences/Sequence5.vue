<template>
  <span class="blink" v-if="cursor">_</span>
  <div id="content" v-show="!cursor"></div>
  <button class="text-lg underline mb-4" v-if="restart" @click="handleRestart">
    click here to shutdown
  </button>
  <video
    ref="video"
    v-if="video"
    autoplay
    :src="rickTrollMeme"
    class="w-full max-w-xl object-cover"
  ></video>
  <div id="restart"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Typewriter from "typewriter-effect/dist/core";

import { emitter } from "@/main";
import { useSequencesStore } from "@/stores/sequences";
import rickTrollMeme from "@/assets/videos/ricktroll-meme.mp4";

export default defineComponent({
  name: "Sequence5",

  setup() {
    const sequencesStore = useSequencesStore();

    return {
      sequencesStore,
      rickTrollMeme,
    };
  },

  data() {
    return {
      cursor: true as boolean,
      restart: false as boolean,
      video: false as boolean,
    };
  },

  methods: {
    initializeTypewriter(id: string) {
      const typewriter = new Typewriter(id, {
        loop: false,
        delay: 50,
        cursor: "",
      });

      return typewriter;
    },

    handleRestart() {
      const typewriter = this.initializeTypewriter("#restart");
      this.video = true;

      typewriter
        .pauseFor(1000)
        .typeString(
          "<span class='text-lg font-bold mt-4 inline-block'>Restarting</span>"
        )
        .pauseFor(500)
        .typeString("<span>.</span>")
        .pauseFor(500)
        .typeString("<span>.</span>")
        .pauseFor(500)
        .typeString("<span>.</span>")
        .start();

      this.$nextTick(() => {
        const video = this.$refs.video as HTMLVideoElement;

        video.addEventListener("ended", () => {
          emitter.emit("restart");
          this.sequencesStore.setSequence();
        });
      });
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
      .typeString("<p class='text-lg mb-4'>ughh i admit it you win</p>")
      .pauseFor(500)
      .typeString(
        "<p class='text-lg mb-4'>this computer will shutdown after 5 seconds</p>"
      )
      .pauseFor(500)
      .typeString("<p>1</p>")
      .pauseFor(1500)
      .typeString("<p>2</p>")
      .pauseFor(1500)
      .typeString("<p>3</p>")
      .pauseFor(1500)
      .typeString("<p>4</p>")
      .pauseFor(1500)
      .typeString("<p>5</p>")
      .pauseFor(1000)
      .callFunction(() => {
        this.restart = true;
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
