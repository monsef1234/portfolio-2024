import { defineStore } from "pinia";

export const useSequencesStore = defineStore("sequences", {
  state: () => ({
    sequence: 1 as number,
  }),

  actions: {
    setSequence() {
      this.sequence = this.sequence + 1;
    },

    resetSequence() {
      this.sequence = 1;
    },
  },
});
