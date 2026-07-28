// Core imports
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";

// Plugins
import { MotionPlugin } from "@vueuse/motion";
import { TinyEmitter } from "tiny-emitter";
import VueSimpleContextMenu from "vue-simple-context-menu";
import vClickOutside from "click-outside-vue3";

// Styles
import "vue-simple-context-menu/dist/vue-simple-context-menu.css";
import "./assets/styles/style.css";

// Event emitter instance
export const emitter = new TinyEmitter();

// App initialization
const pinia = createPinia();
const app = createApp(App);

// Global components
app.component("vue-simple-context-menu", VueSimpleContextMenu);

// Plugin registration
app.use(router).use(MotionPlugin).use(vClickOutside).use(pinia);

// Mount app
app.mount("#app");
