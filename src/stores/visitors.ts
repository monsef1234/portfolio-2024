import { defineStore } from "pinia";

export const useVisitorsStore = defineStore("visitors", {
  state: () => ({
    visitorsCount: 0 as number,
    loading: false,
  }),

  actions: {
    setLoading(value: boolean) {
      this.loading = value;
    },

    setVisitorsCount(value: number) {
      this.visitorsCount = value;
    },
  },
});
