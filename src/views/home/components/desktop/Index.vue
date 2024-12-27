<template>
  <div
    class="mx-4 my-6 md:mx-8 md:my-8 relative h-[calc(100vh-6.5rem)] flex flex-col gap-10 parent z-10"
  >
    <button
      class="w-28"
      :class="{ 'pointer-events-none opacity-50': app.isOpen }"
      v-for="app in appsStore.apps"
      :key="app.name"
      @dblclick="appHandler(app)"
      @touchstart="timestampHandler($event)"
      @touchend="appHandlerTouch($event, app)"
      :title="app.name"
    >
      <img :src="app.icon" alt="terminal icon" class="w-10 h-10 mx-auto" />
      <span class="inline-block text-ellipsis overflow-hidden w-full">{{
        app.name
      }}</span>
    </button>

    <div v-for="app in openedApps" :key="app.name">
      <vue-draggable-resizable
        v-motion
        :initial="{
          opacity: 0,
        }"
        :enter="{
          opacity: 1,
        }"
        v-if="app.name == 'Terminal'"
        :key="app.name"
        class="bg-[var(--color-1)] rounded-md w-[100%] md:w-[80%] h-[80%] absolute vue-draggable"
        :style="{ zIndex: `${app.zIndex} !important` }"
        v-show="!app.isMinimized"
        :w="null"
        :h="null"
        :resizable="false"
        @click="zIndexHandler(app)"
      >
        <Terminal
          :app="app"
          @close-app="closeApp"
          @minimize-app="minimizeApp"
        />
      </vue-draggable-resizable>

      <vue-draggable-resizable
        v-motion
        :initial="{
          opacity: 0,
        }"
        :enter="{
          opacity: 1,
        }"
        v-if="app.name == 'Snake'"
        :key="app.name"
        class="bg-[var(--color-1)] rounded-md max-w-lg w-full h-[65%] absolute vue-draggable"
        :style="{ zIndex: `${app.zIndex} !important` }"
        v-show="!app.isMinimized"
        :w="null"
        :h="null"
        :resizable="false"
        :draggable="checkDevices ? false : true"
        @click="zIndexHandler(app)"
      >
        <Snake :app="app" @close-app="closeApp" @minimize-app="minimizeApp" />
      </vue-draggable-resizable>

      <vue-draggable-resizable
        v-motion
        :initial="{
          opacity: 0,
        }"
        :enter="{
          opacity: 1,
        }"
        v-if="app.name == 'Tic Tac Toe'"
        :key="app.name"
        class="bg-[var(--color-1)] rounded-md max-w-lg w-full h-[65%] absolute vue-draggable"
        :style="{ zIndex: `${app.zIndex} !important` }"
        v-show="!app.isMinimized"
        :w="null"
        :h="null"
        :resizable="false"
        @click="zIndexHandler(app)"
      >
        <TicTacToe
          :app="app"
          @close-app="closeApp"
          @minimize-app="minimizeApp"
        />
      </vue-draggable-resizable>
    </div>

    <div
      class="max-w-lg w-full flex -z-[1] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-lucida tracking-tighter items-center gap-10 flex-wrap justify-center"
    >
      <div class="text-6xl">
        Hell<span class="eye"
          ><span
            class="pupil"
            :style="{
              display: checkDevices ? 'none' : 'block',
            }"
          ></span
        ></span>
      </div>
      <div class="text-6xl">
        W<span class="eye ml-2"
          ><span
            class="pupil"
            :style="{
              display: checkDevices ? 'none' : 'block',
            }"
          ></span></span
        >rld!
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiWindowClose, mdiWindowMinimize } from "@mdi/js";

import { useAppsStore } from "@/stores/apps";
import { App } from "@/types/app";
import { emitter } from "@/main";
import Terminal from "../terminal/Index.vue";
import Snake from "../snake/Index.vue";
import { openedApp } from "@/types/opened-app";
import TicTacToe from "../tictactoe/Index.vue";

export default defineComponent({
  name: "Desktop",

  setup() {
    const appsStore = useAppsStore();

    return {
      appsStore,
      mdiWindowClose,
      mdiWindowMinimize,
    };
  },

  components: {
    SvgIcon,
    Snake,
    Terminal,
    TicTacToe,
  },

  data() {
    return {
      startTimestamp: null as number | null,

      openedApps: [] as openedApp[],
    };
  },

  methods: {
    appHandler(app: App) {
      if (app.name == "Shutdown") {
        emitter.emit("shutdown");
        return;
      }

      const index = this.appsStore.apps.indexOf(app);

      this.appsStore.openApp(index);

      this.openedApps.forEach((a) => {
        a.zIndex = 0;
      });

      this.openedApps.push({ ...app, zIndex: 0, isMinimized: false });

      emitter.emit("open-app", app);
    },

    zIndexHandler(app: openedApp) {
      this.openedApps = this.openedApps.map((a) =>
        a.name == app.name ? { ...a, zIndex: 1 } : { ...a, zIndex: 0 }
      );
    },

    timestampHandler(event: TouchEvent) {
      this.startTimestamp = event.timeStamp;
    },

    appHandlerTouch(event: TouchEvent, app: App) {
      if (this.startTimestamp && event.timeStamp - this.startTimestamp < 500) {
        app.name == "Shutdown"
          ? emitter.emit("shutdown")
          : this.appHandler(app);
      }
    },

    closeApp(app: App) {
      this.appsStore.closeApp(app);
      this.openedApps = this.openedApps.filter((a) => app.name != a.name);

      emitter.emit("close-app", app);
    },

    minimizeApp(app: openedApp) {
      app.isMinimized = !app.isMinimized;
    },

    handleMouseMove(event: MouseEvent) {
      const pupils = document.querySelectorAll<HTMLElement>(".pupil");

      pupils.forEach((pupil) => {
        const rect = pupil.getBoundingClientRect();

        const pupilCenterX = rect.left + rect.width / 2;
        const pupilCenterY = rect.top + rect.height / 2;

        const angle = Math.atan2(
          event.clientY - pupilCenterY,
          event.clientX - pupilCenterX
        );

        const distance = 5;

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        pupil.style.transform = `translate(${x}px, ${y}px)`;
      });
    },
  },

  computed: {
    checkDevices() {
      return window.matchMedia("(max-width: 768px)").matches;
    },
  },

  mounted() {
    emitter.on("toggle-app", (app: App) => {
      this.openedApps = this.openedApps.map((a) =>
        a.name == app.name ? { ...a, isMinimized: !a.isMinimized } : a
      );
    });
    emitter.on("close-app-right-click", (name: string) => {
      this.openedApps = this.openedApps.filter((a) => a.name != name);
    });

    window.addEventListener("mousemove", this.handleMouseMove);
  },

  beforeUnmount() {
    emitter.off("toggle-app");

    window.removeEventListener("mousemove", this.handleMouseMove);
  },
});
</script>

<style scoped>
.vue-draggable {
  position-area: center;
}

.eye {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 5px solid var(--color-3);
  border-radius: 50%;
}

.eye .pupil {
  position: absolute;
  top: 25%;
  left: 25%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: var(--color-5);
  border-radius: 50%;
}
</style>
