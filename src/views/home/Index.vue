<template>
  <transition
    :css="false"
    @leave="(el, done) => motions().preloader.leave(done)"
  >
    <Preloader
      v-if="preloader && !shutdown"
      v-motion="'preloader'"
      :initial="{
        opacity: 0,
        translateX: '-50%',
        left: '50%',
      }"
      :visibleOnce="{
        opacity: 1,
        translateX: '-50%',
        left: '50%',
      }"
      :leave="{
        opacity: 0,
        translateX: '-50%',
        left: '50%',
      }"
    />
  </transition>

  <transition :css="false" @leave="(el, done) => motions().home.leave(done)">
    <div
      v-motion="'home'"
      :initial="{
        opacity: 0,
      }"
      :visibleOnce="{
        opacity: 1,
      }"
      :leave="{
        opacity: 0,
      }"
      class="h-[100dvh] flex flex-col"
      v-if="!shutdown && !preloader"
    >
      <div class="flex-1 bg-[#1b2021]">
        <Desktop />
      </div>
      <Taskbar />
    </div>
  </transition>

  <Shutdown v-if="shutdown && !preloader" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useMotions } from "@vueuse/motion";

import Preloader from "@/components/preloader/Index.vue";
import Shutdown from "@/components/shutdown/Index.vue";
import Taskbar from "./components/taskbar/Index.vue";
import Desktop from "./components/desktop/Index.vue";
import { useVisitorsStore } from "@/stores/visitors";
import { emitter } from "@/main";
import { sanityClient } from "@/sanity";

export default defineComponent({
  name: "Home",

  components: {
    Taskbar,
    Desktop,
    Preloader,
    Shutdown,
  },

  setup() {
    const visitorsStore = useVisitorsStore();

    return {
      visitorsStore,
    };
  },

  data() {
    return {
      preloader: true as boolean,
      shutdown: false as boolean,
    };
  },

  methods: {
    motions() {
      return useMotions();
    },
    async visitorHandler() {
      this.visitorsStore.setLoading(true);
      try {
        const isVisited = localStorage.getItem("isVisited");
        const query = `count(*[_type == "visitor"])`;
        if (isVisited) {
          const visitorsCount = await sanityClient.fetch(query);
          this.visitorsStore.setVisitorsCount(visitorsCount);
          return;
        }
        const data: { country_name: string; city: string } =
          await this.getVisitorLocation();
        await sanityClient.create({
          _type: "visitor",
          country_name: data.country_name,
          city: data.city,
        });
        const visitorsCount = await sanityClient.fetch(query);
        this.visitorsStore.setVisitorsCount(visitorsCount);
        localStorage.setItem("isVisited", "true");
      } catch (error) {
        console.log(error);
      }
    },
    async getVisitorLocation() {
      const response = await fetch(
        `https://api.ipapi.com/check?access_key=${import.meta.env.VITE_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }

      return response.json();
    },
  },

  mounted() {
    const minDisplayTime = new Promise((resolve) => setTimeout(resolve, 3500));
    const loadComplete = new Promise((resolve: any) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", resolve);
      }
    });

    Promise.all([minDisplayTime, loadComplete, this.visitorHandler()]).then(
      () => {
        this.preloader = false;
        this.visitorsStore.setLoading(false);
      }
    );

    emitter.on("shutdown", () => {
      this.shutdown = true;
    });
    emitter.on("restart", () => {
      this.shutdown = false;
      this.preloader = true;

      setTimeout(() => {
        this.preloader = false;
      }, 3000);
    });
  },

  beforeUnmount() {
    emitter.off("shutdown");
    emitter.off("restart");
  },
});
</script>
