import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home/Index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/views/error/Index.vue"),
    meta: {
      title: "Page Not Found",
    },
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
