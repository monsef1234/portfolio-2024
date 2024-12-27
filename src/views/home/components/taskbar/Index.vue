<template>
  <div class="h-10 bg-[var(--color-2)] flex items-center p-1 z-10 gap-5">
    <div class="swiper flex-1 mx-2 flex gap-5 relative">
      <transition-group
        class="swiper-wrapper"
        name="taskbar-transition"
        tag="div"
      >
        <div
          v-for="app in openedApps"
          :key="app.name"
          class="!h-full border border-[var(--color-3)] p-1 !flex !gap-3 !items-center text-base !w-fit swiper-slide cursor-pointer"
          @click="appHandler(app)"
          @contextmenu.prevent.stop="handleClick($event, app)"
        >
          <img :src="app.icon" :alt="app.name" class="w-5 h-5 md:w-6 md:h-6" />
          <span class="text-xs md:text-sm">{{ app.name }}</span>
        </div>
      </transition-group>
    </div>

    <div
      class="h-full border border-[var(--color-3)] p-1 md:p-2 flex gap-2 items-center"
    >
      <button @click="toggleMute = !toggleMute">
        <SvgIcon
          v-if="toggleMute"
          type="mdi"
          :path="mdiVolumeMute"
          class="w-5 h-5 md:w-6 md:h-6"
        />
        <SvgIcon
          v-else
          type="mdi"
          :path="mdiVolumeHigh"
          class="w-5 h-5 md:w-6 md:h-6"
        />
      </button>
      <div class="w-[0.1rem] h-5 bg-[var(--color-3)] mx-1"></div>
      <span class="font-bold md:text-sm text-xs flex gap-2">
        Visitors:
        <template v-if="!visitorsStore.loading">
          {{ visitorsStore.visitorsCount }}
        </template>
        <template v-else>
          <div class="loader"></div>
        </template>
      </span>

      <div class="w-[0.1rem] h-5 bg-[var(--color-3)] mx-1"></div>
      <span class="font-bold md:text-sm text-xs">{{
        format(realTime, "hh:mm aa")
      }}</span>
    </div>
  </div>

  <vue-simple-context-menu
    element-id="context-menu"
    :options="[{ name: 'Close' }]"
    ref="vueSimpleContextMenu"
    @option-clicked="optionClicked"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import clickEffect from "@/assets/sounds/click-effect.wav";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiVolumeHigh, mdiVolumeMute } from "@mdi/js";
import { format } from "date-fns";

import { useAppsStore } from "@/stores/apps";
import { useVisitorsStore } from "@/stores/visitors";
import { App } from "@/types/app";
import { emitter } from "@/main";
import Swiper from "swiper";

import "swiper/css";

export default defineComponent({
  name: "Taskbar",

  components: {
    SvgIcon,
  },

  setup() {
    const appsStore = useAppsStore();
    const visitorsStore = useVisitorsStore();

    const vueSimpleContextMenu = ref("vueSimpleContextMenu") as any;

    return {
      format,
      appsStore,
      visitorsStore,
      mdiVolumeHigh,
      mdiVolumeMute,
      vueSimpleContextMenu,
    };
  },

  data() {
    return {
      toggleMute: false as boolean,
      realTime: new Date() as Date,
      numberOfVisitors: 0 as number,
      loading: false as boolean,
      swiper: null as Swiper | null,

      openedApps: [] as App[],
    };
  },

  methods: {
    clickEffectHandler() {
      const audio = new Audio(clickEffect);
      audio.play();
    },

    appHandler(app: App) {
      emitter.emit("toggle-app", app);
    },

    handleClick(event: MouseEvent, item: any) {
      this.vueSimpleContextMenu.showMenu(event, item);
    },

    optionClicked(event: any) {
      const {
        item: { name },
      } = event;

      this.appsStore.closeAppUsingRightClick(name);
      this.openedApps = this.openedApps.filter((app) => app.name != name);
      emitter.emit("close-app-right-click", name);
    },

    getRealTime() {
      setInterval(() => {
        this.realTime = new Date();
      }, 1000);
    },

    initializeSwiper() {
      this.swiper = new Swiper(".swiper", {
        slidesPerView: "auto",
        spaceBetween: 10,
        freeMode: true,
      });
    },
  },

  watch: {
    toggleMute(value: boolean) {
      if (value) {
        document.removeEventListener("click", this.clickEffectHandler);
      } else {
        document.addEventListener("click", this.clickEffectHandler);
      }
    },
  },

  mounted() {
    document.addEventListener("click", this.clickEffectHandler);

    this.getRealTime();
    this.initializeSwiper();

    emitter.on("open-app", (app: App) => {
      this.openedApps.push(app);
    });
    emitter.on("close-app", (app: App) => {
      this.openedApps = this.openedApps.filter((a) => app.name != a.name);
    });
  },

  beforeUnmount() {
    document.removeEventListener("click", this.clickEffectHandler);

    emitter.off("open-app");
    emitter.off("close-app");
  },
});
</script>

<style scoped>
.taskbar-transition-move,
.taskbar-transition-enter-active,
.taskbar-transition-leave-active {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}
.taskbar-transition-enter-from,
.taskbar-transition-leave-to {
  opacity: 0;
}

.taskbar-transition-leave-active {
  position: absolute;
}

.loader {
  width: 20px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(farthest-side, var(--color-3) 94%, #0000) top/8px
      8px no-repeat,
    conic-gradient(#0000 30%, var(--color-3));
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 8px), #000 0);
  animation: l13 1s infinite linear;
}
@keyframes l13 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
