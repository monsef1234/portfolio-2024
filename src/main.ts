// Core imports
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// Plugins
import { MotionPlugin } from "@vueuse/motion";
import { TinyEmitter } from "tiny-emitter";
import VueSimpleContextMenu from "vue-simple-context-menu";
import VueDraggableResizable from "vue-draggable-resizable";
import vClickOutside from "click-outside-vue3";

// Styles
import "vue-simple-context-menu/dist/vue-simple-context-menu.css";
import "vue-draggable-resizable/style.css";
import "./assets/styles/style.css";

// Event emitter instance
export const emitter = new TinyEmitter();

// App initialization
const app = createApp(App);
const pinia = createPinia();

// Global components
app.component("vue-simple-context-menu", VueSimpleContextMenu);
app.component("vue-draggable-resizable", VueDraggableResizable);

// Plugin registration
app.use(router).use(MotionPlugin).use(vClickOutside).use(pinia);

// Mount app
app.mount("#app");
