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
      class="h-[100dvh] w-full flex flex-col overflow-hidden"
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
import { supabase } from "@/supabase";

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

        const fetchCount = async () => {
          const { count, error } = await supabase
            .from("visitor")
            .select("*", { count: "exact", head: true });
          if (error) throw error;
          this.visitorsStore.setVisitorsCount(count || 0);
        };

        if (isVisited) {
          await fetchCount();
          return;
        }

        const data: { country_name: string; city: string } =
          await this.getVisitorLocation();

        const { error: insertError } = await supabase
          .from("visitor")
          .insert([{ country_name: data.country_name, city: data.city }]);

        if (insertError) throw insertError;

        await fetchCount();
        localStorage.setItem("isVisited", "true");
      } catch (error) {
        console.log(error);
      }
    },
    async getVisitorLocation() {
      const response = await fetch("https://ipwho.is/");
      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data = await response.json();
      return {
        country_name: data.country,
        city: data.city,
      };
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
      },
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
