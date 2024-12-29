<template>
  <div
    class="title-bar flex items-center justify-between p-2 bg-[var(--color-2)] h-10"
  >
    <span class="title font-bold tracking-widest">{{ app.name }}</span>
    <div class="controls flex items-center gap-2">
      <button>
        <SvgIcon
          :path="mdiWindowMinimize"
          type="mdi"
          :size="24"
          @click="$emit('minimize-app', app)"
        />
      </button>
      <button>
        <SvgIcon
          :path="mdiWindowClose"
          type="mdi"
          :size="24"
          @click="$emit('close-app', app)"
        />
      </button>
    </div>
  </div>

  <div class="h-[calc(100%-2.5rem)] grid grid-cols-3 gap-2 p-2">
    <div
      v-if="!start && !winner && !draw"
      class="col-span-3 place-content-center text-center"
    >
      <p class="mt-2 text-xl">Choose a mode to start the game.</p>

      <div class="flex flex-col gap-3 mt-3 text-lg">
        <button
          @click="
            () => {
              start = true;
              mode = 'easy';
            }
          "
          class="block mx-auto underline"
        >
          Easy
        </button>

        <button
          @click="
            () => {
              start = true;
              mode = 'medium';
            }
          "
          class="block mx-auto underline"
        >
          Medium
        </button>

        <button
          @click="
            () => {
              start = true;
              mode = 'hard';
            }
          "
          class="block mx-auto underline"
        >
          Hard
        </button>
      </div>
    </div>

    <div
      v-if="start && !winner && !draw"
      v-for="(cell, i) in cells"
      :key="i"
      @click.stop="handleCellClick(i)"
      class="border-2 border-[var(--color-2)] rounded-sm cursor-pointer relative"
      :class="{
        'text-[var(--color-3)]': cell === 'X',
        'text-[var(--color-4)]': cell === 'O',
        'pointer-events-none': computerTurn || !!winner || draw,
      }"
    >
      <span
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold"
      >
        {{ cell }}</span
      >
    </div>

    <div
      v-if="start && winner === 'X' && !draw"
      class="col-span-3 place-content-center text-center"
    >
      <p class="mb-2 text-3xl">You win.</p>

      <button @click="restartWithSameMode" class="mb-2 block mx-auto underline">
        Restart
      </button>

      <button @click="restart" class="block mx-auto underline">
        Change Level
      </button>
    </div>

    <div
      v-if="start && winner === 'O' && !draw"
      class="col-span-3 place-content-center text-center"
    >
      <p class="mb-2 text-3xl">You lose.</p>

      <button @click="restartWithSameMode" class="mb-2 block mx-auto underline">
        Restart
      </button>

      <button @click="restart" class="block mx-auto underline">
        Change Level
      </button>
    </div>

    <div
      v-if="start && draw"
      class="col-span-3 place-content-center text-center"
    >
      <p class="mb-2 text-3xl">Draw</p>

      <button @click="restartWithSameMode" class="mb-2 block mx-auto underline">
        Restart
      </button>

      <button @click="restart" class="block mx-auto underline">
        Change Level
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiWindowClose, mdiWindowMinimize } from "@mdi/js";

import { App } from "@/types/app";
import drawEffect from "@/assets/sounds/draw-effect.wav";
import winEffect from "@/assets/sounds/win-effect.wav";
import gameOverEffect from "@/assets/sounds/game-over.wav";

type mode = "easy" | "medium" | "hard";
type cell = "X" | "O" | "";

export default defineComponent({
  name: "TicTacToe",

  props: {
    app: {
      type: Object as PropType<App>,
      required: true,
    },
  },

  components: { SvgIcon },

  emits: ["close-app", "minimize-app"],

  setup() {
    return {
      mdiWindowClose,
      mdiWindowMinimize,
    };
  },

  data() {
    return {
      start: false as boolean,
      computerTurn: false as boolean,
      winner: "" as cell,
      draw: false as boolean,
      mode: "medium" as mode,

      cells: Array(9).fill("") as cell[],
      winningCombinations: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ] as number[][],
    };
  },

  methods: {
    handleCellClick(index: number) {
      if (this.cells[index] !== "" || this.winner || this.computerTurn) return;

      this.cells[index] = "X";
      new Audio(drawEffect).play();

      this.checkWinner();

      this.computerTurn = true;

      setTimeout(() => {
        this.handleComputerTurn();
      }, 1000);
    },

    checkWinner() {
      for (const combination of this.winningCombinations) {
        const [a, b, c] = combination;

        if (
          this.cells[a] === this.cells[b] &&
          this.cells[b] === this.cells[c] &&
          this.cells[a] !== ""
        ) {
          this.winner = this.cells[a];
          this.winner === "X" && new Audio(winEffect).play();
          this.winner === "O" && new Audio(gameOverEffect).play();
          return;
        }
      }

      if (this.cells.every((cell) => cell !== "")) {
        this.draw = true;
        return;
      }
    },

    handleComputerTurn() {
      if (this.winner || this.draw || !this.computerTurn) return;

      if (this.mode === "medium" && this.tryToBlock()) return;
      if (this.mode === "hard" && (this.tryToWin() || this.tryToBlock()))
        return;

      this.randomPlay();
    },

    tryToWin() {
      for (let i = 0; i < this.winningCombinations.length; i++) {
        const [a, b, c] = this.winningCombinations[i];

        if (
          this.cells[a] === "O" &&
          this.cells[b] === "O" &&
          this.cells[c] === ""
        ) {
          this.cells[c] = "O";
          new Audio(drawEffect).play();
          this.checkWinner();
          this.computerTurn = false;
          return true;
        } else if (
          this.cells[a] === "O" &&
          this.cells[c] === "O" &&
          this.cells[b] === ""
        ) {
          this.cells[b] = "O";
          new Audio(drawEffect).play();
          this.checkWinner();
          this.computerTurn = false;
          return true;
        } else if (
          this.cells[b] === "O" &&
          this.cells[c] === "O" &&
          this.cells[a] === ""
        ) {
          this.cells[a] = "O";
          new Audio(drawEffect).play();
          this.checkWinner();
          this.computerTurn = false;
          return true;
        }
      }

      return false;
    },

    tryToBlock() {
      for (let i = 0; i < this.winningCombinations.length; i++) {
        const [a, b, c] = this.winningCombinations[i];

        if (
          this.cells[a] === "X" &&
          this.cells[b] === "X" &&
          this.cells[c] === ""
        ) {
          this.cells[c] = "O";
          new Audio(drawEffect).play();
          this.checkWinner();
          this.computerTurn = false;
          return true;
        } else if (
          this.cells[a] === "X" &&
          this.cells[c] === "X" &&
          this.cells[b] === ""
        ) {
          this.cells[b] = "O";
          new Audio(drawEffect).play();
          this.checkWinner();
          this.computerTurn = false;
          return true;
        } else if (
          this.cells[b] === "X" &&
          this.cells[c] === "X" &&
          this.cells[a] === ""
        ) {
          this.cells[a] = "O";
          new Audio(drawEffect).play();
          this.checkWinner();
          this.computerTurn = false;
          return true;
        }
      }

      return false;
    },

    randomPlay() {
      const availableCellsIndex = [];

      for (let i = 0; i < this.cells.length; i++) {
        if (this.cells[i] === "") {
          availableCellsIndex.push(i);
        }
      }

      const randomIndex = Math.floor(
        Math.random() * availableCellsIndex.length
      );

      this.cells[availableCellsIndex[randomIndex]] = "O";

      new Audio(drawEffect).play();

      this.checkWinner();

      this.computerTurn = false;
    },

    restartWithSameMode() {
      this.cells = Array(9).fill("");
      this.winner = "";
      this.draw = false;
      this.computerTurn = false;
      this.start = true;
    },

    restart() {
      this.cells = Array(9).fill("");
      this.winner = "";
      this.draw = false;
      this.computerTurn = false;
      this.start = false;
      this.mode = "medium";
    },
  },
});
</script>
