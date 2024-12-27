<template>
  <span class="blink" v-if="cursor">_</span>
  <div id="content" v-show="!cursor"></div>

  <form
    @submit.prevent="submit"
    class="flex flex-col gap-4 w-fit mb-4"
    v-if="form"
  >
    <input
      type="text"
      placeholder="enter your your name"
      class="outline-none py-2 px-4 rounded-md text-[var(--color-2)]"
      :class="{
        'opacity-50 pointer-events-none': loading,
      }"
      v-model="name"
      :disabled="loading"
    />
    <button
      class="border-2 border-[var(--color-1)] cursor-pointer w-fit py-2 px-4 rounded-md"
      :class="{
        'opacity-50 pointer-events-none': loading,
      }"
      :disabled="loading"
    >
      submit
    </button>
  </form>

  <small class="mb-4 block text-sm" v-if="form || list"
    ><strong class="font-bold text-[var(--color-4)]">Note: </strong>click
    <span
      class="underline cursor-pointer"
      @click="restartHandler"
      :class="{
        'opacity-50 pointer-events-none': loading,
      }"
      >here</span
    >
    to restart me, at the end im not going to shutdown 🤭</small
  >

  <div v-if="list">
    <h1 class="text-xl underline mb-4">List of Warriors</h1>
    <p class="text-lg" v-for="(warrior, i) in warriors" :key="i">
      - {{ warrior.name }}
    </p>

    <button
      class="border-2 border-[var(--color-1)] cursor-pointer w-fit py-2 px-4 rounded-md mt-4"
      :class="{
        'opacity-50 pointer-events-none': loadingList,
      }"
      :disabled="loadingList"
      @click="loadMore"
      v-if="!loadingHide"
    >
      load more
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Typewriter from "typewriter-effect/dist/core";
import confetti from "canvas-confetti";

import { emitter } from "@/main";
import { useSequencesStore } from "@/stores/sequences";
import { sanityClient } from "@/sanity";

export default defineComponent({
  name: "Sequence5",

  setup() {
    const sequencesStore = useSequencesStore();

    return {
      sequencesStore,
    };
  },

  data() {
    return {
      cursor: true as boolean,
      form: false as boolean,
      name: "" as string,
      loading: false as boolean,
      loadingList: false as boolean,
      list: false as boolean,
      warriors: [] as any[],
      loadingHide: false as boolean,

      pageSize: 10 as number,
      page: 0 as number,
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

    fire(particleRatio: number, opts: any) {
      confetti({
        origin: { y: 0.7 },
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      });
    },

    async submit() {
      this.loading = true;

      try {
        if (!this.name.trim()) return;

        await sanityClient.create({
          _type: "winner",
          name: this.name,
        });

        this.name = "";
        this.form = false;
        await this.getWinners();
        this.list = true;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async getWinners() {
      const start = this.page * this.pageSize;
      const end = start + this.pageSize;

      try {
        const winners = await sanityClient.fetch(
          `*[_type == "winner"] | order(_createdAt asc) [${start}...${end}]`,
          {
            start,
            end,
          }
        );

        if (winners.length < this.pageSize) {
          this.loadingHide = true;
        }

        this.warriors = [...this.warriors, ...winners];
      } catch (error) {
        console.log(error);
      }
    },

    async loadMore() {
      this.loadingList = true;
      this.page++;
      await this.getWinners();
      this.loadingList = false;
    },

    triggerFireworks() {
      this.fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      this.fire(0.2, {
        spread: 60,
      });
      this.fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      this.fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      this.fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    },

    restartHandler() {
      emitter.emit("restart");

      this.sequencesStore.resetSequence();
    },
  },

  mounted() {
    const typewriter = this.initializeTypewriter("#content");

    typewriter
      .pauseFor(500)
      .callFunction(() => {
        this.cursor = false;
        this.triggerFireworks();
      })
      .pauseFor(1000)
      .typeString(
        "<p class='text-lg mb-4'><strong class='text-green-500'>Congratulations</strong> you beat me</p>"
      )
      .pauseFor(500)
      .typeString(
        "<p class='text-lg'>as a reward we will put your name in the list of warriors</p>"
      )
      .pauseFor(500)
      .callFunction(() => {
        this.form = true;
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
