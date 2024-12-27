import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";

import { MotionPlugin } from "@vueuse/motion";
import { TinyEmitter } from "tiny-emitter";
import VueSimpleContextMenu from "vue-simple-context-menu";
import VueDraggableResizable from "vue-draggable-resizable";
import vClickOutside from "click-outside-vue3";

import "vue-simple-context-menu/dist/vue-simple-context-menu.css";
import "vue-draggable-resizable/style.css";
import "./assets/styles/style.css";

import App from "./App.vue";

export const emitter = new TinyEmitter();
const app = createApp(App);
const pinia = createPinia();

app.component("vue-simple-context-menu", VueSimpleContextMenu);
app.component("vue-draggable-resizable", VueDraggableResizable);

app.use(router).use(MotionPlugin).use(vClickOutside).use(pinia);

app.mount("#app");
