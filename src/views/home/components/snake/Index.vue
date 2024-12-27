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

  <div class="bg-[var(--color-1)] w-full h-full p-5">
    <div
      id="game-board"
      class="p-2 grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] grid w-full h-full border-2 border-[var(--color-2)] relative"
    >
      <div
        v-if="!gameOver"
        v-for="(segment, i) in snake"
        :key="i"
        class="snake"
        :class="{
          head: i === 0,
        }"
        :style="{
          gridColumnStart: segment.x,
          gridRowStart: segment.y,
        }"
      ></div>

      <transition
        :css="false"
        @leave="(el, done) => motions().gameOver.leave(done)"
      >
        <div
          v-motion="'gameOver'"
          :initial="{ opacity: 0, x: '-50%', y: '-50%' }"
          :visibleOnce="{ opacity: 1, x: '-50%', y: '-50%' }"
          :leave="{ opacity: 0, x: '-50%', y: '-50%' }"
          v-if="gameOver"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 grid place-content-center -translate-y-1/2 w-full h-full backdrop-blur-sm bg-[var(--color-2)]"
        >
          <h1 class="text-[var(--color-3)] text-2xl font-bold">Game over</h1>
          <button
            class="underline text-[var(--color-3)] text-xl"
            @click="
              () => {
                restartGame();
                handleRemoveFood();
                gameOver = false;
              }
            "
          >
            Restart
          </button>
        </div>
      </transition>
    </div>
  </div>

  <div
    class="arrows flex flex-col items-center gap-2 justify-center mt-5"
    v-if="checkDevices"
  >
    <kbd
      @click="
        () => {
          command = 'up';
          moveSnake();
        }
      "
      class="min-h-[30px] inline-flex justify-center items-center py-1 px-1.5 bg-gray-200 border border-transparent font-mono text-sm text-gray-800 rounded-md dark:bg-neutral-700 dark:text-neutral-200"
    >
      <SvgIcon :path="mdiChevronUp" type="mdi" :size="24" />
    </kbd>
    <div class="flex gap-2 items-center">
      <kbd
        @click="
          () => {
            command = 'left';
            moveSnake();
          }
        "
        class="min-h-[30px] inline-flex justify-center items-center py-1 px-1.5 bg-gray-200 border border-transparent font-mono text-sm text-gray-800 rounded-md dark:bg-neutral-700 dark:text-neutral-200"
      >
        <SvgIcon :path="mdiChevronLeft" type="mdi" :size="24" />
      </kbd>
      <kbd
        @click="
          () => {
            command = 'down';
          }
        "
        class="min-h-[30px] inline-flex justify-center items-center py-1 px-1.5 bg-gray-200 border border-transparent font-mono text-sm text-gray-800 rounded-md dark:bg-neutral-700 dark:text-neutral-200"
      >
        <SvgIcon :path="mdiChevronDown" type="mdi" :size="24" />
      </kbd>
      <kbd
        @click="
          () => {
            command = 'right';
            moveSnake();
          }
        "
        class="min-h-[30px] inline-flex justify-center items-center py-1 px-1.5 bg-gray-200 border border-transparent font-mono text-sm text-gray-800 rounded-md dark:bg-neutral-700 dark:text-neutral-200"
      >
        <SvgIcon :path="mdiChevronRight" type="mdi" :size="24" />
      </kbd>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiWindowClose,
  mdiWindowMinimize,
  mdiChevronUp,
  mdiChevronDown,
  mdiChevronLeft,
  mdiChevronRight,
} from "@mdi/js";
import { useMotions } from "@vueuse/motion";

import { App } from "@/types/app";
import eatEffect from "@/assets/sounds/eat-effect.wav";
import gameOverEffect from "@/assets/sounds/game-over.wav";

type command = "left" | "right" | "up" | "down";

interface coordinate {
  x: number;
  y: number;
}

export default defineComponent({
  name: "Snake",

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
      mdiChevronUp,
      mdiChevronDown,
      mdiChevronLeft,
      mdiChevronRight,
    };
  },

  data() {
    return {
      snake: [] as coordinate[],

      command: "left" as command,

      food: {
        x: Math.round(Math.random() * 19) + 1,
        y: Math.round(Math.random() * 19) + 1,
      } as coordinate,

      head: {
        x: 10,
        y: 10,
      } as coordinate,

      gameOver: false as boolean,

      availablePositions: [] as coordinate[],
    };
  },

  methods: {
    motions() {
      return useMotions();
    },

    drawFood() {
      const gameBoard = document.getElementById("game-board") as HTMLDivElement;
      const food = document.createElement("div") as HTMLDivElement;

      this.availablePositions = [];

      for (let x = 1; x <= 20; x++) {
        for (let y = 1; y <= 20; y++) {
          if (!this.snake.some((snake) => snake.x === x && snake.y === y)) {
            this.availablePositions.push({
              x,
              y,
            });
          }
        }
      }

      if (this.availablePositions.length === 0) {
        alert("You won!");
        return;
      }

      this.food =
        this.availablePositions[
          Math.floor(Math.random() * this.availablePositions.length)
        ];

      food.style.gridColumn = `${this.food.x}`;
      food.style.gridRow = `${this.food.y}`;
      food.style.background = "red";
      food.classList.add("food");

      gameBoard.appendChild(food);
    },

    moveSnake() {
      switch (this.command) {
        case "up":
          this.head = {
            x: this.head.x,
            y: this.head.y - 1,
          };
          break;
        case "down":
          this.head = {
            x: this.head.x,
            y: this.head.y + 1,
          };
          break;
        case "left":
          this.head = {
            x: this.head.x - 1,
            y: this.head.y,
          };
          break;
        case "right":
          this.head = {
            x: this.head.x + 1,
            y: this.head.y,
          };
          break;
      }

      this.snake.forEach((segment) => {
        if (segment.x === this.head.x && segment.y === this.head.y) {
          this.gameOver = true;
        }
      });

      this.checkGameBoardLimits();
      this.handleFoodCollision();

      this.snake.unshift(this.head);
      this.snake.pop();
    },

    checkGameBoardLimits() {
      if (
        this.head.x <= 0 ||
        this.head.y <= 0 ||
        this.head.x > 20 ||
        this.head.y > 20
      ) {
        this.gameOver = true;
      }
    },

    restartGame() {
      this.snake = [];
      this.$nextTick(() => {
        this.handleCreateSnake();

        this.handleCreateSnake();

        this.head = {
          x: this.snake[0].x,
          y: this.snake[0].y,
        };

        this.command = "left";

        this.drawFood();
      });
    },

    handleFoodCollision() {
      if (this.head.x === this.food.x && this.head.y === this.food.y) {
        new Audio(eatEffect).play();

        this.handleRemoveFood();

        this.snake.push({
          x: this.snake[this.snake.length - 1].x,
          y: this.snake[this.snake.length - 1].y,
        });

        this.drawFood();
      }
    },

    handleRemoveFood() {
      const food = document.querySelector(".food") as HTMLDivElement;

      if (food) {
        food.remove();
      }
    },

    handleCreateSnake() {
      this.snake = [
        {
          x: 10,
          y: 10,
        },
        {
          x: 11,
          y: 10,
        },
        {
          x: 12,
          y: 10,
        },
        {
          x: 13,
          y: 10,
        },
      ];
    },

    autoMove() {
      setInterval(() => {
        this.moveSnake();
      }, 200);
    },

    handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowUp":
          if (this.command === "down") return;
          this.command = "up";
          break;
        case "ArrowDown":
          if (this.command === "up") return;
          this.command = "down";
          break;
        case "ArrowLeft":
          if (this.command === "right") return;
          this.command = "left";
          break;
        case "ArrowRight":
          if (this.command === "left") return;
          this.command = "right";
          break;
        default:
          return;
      }

      this.moveSnake();
    },
  },

  watch: {
    gameOver(value) {
      if (value) new Audio(gameOverEffect).play();
    },
  },

  computed: {
    checkDevices() {
      return window.matchMedia("(max-width: 768px)").matches;
    },
  },

  mounted() {
    this.handleCreateSnake();

    this.drawFood();
    this.autoMove();

    document.addEventListener("keydown", this.handleKeyDown);
  },

  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  },
});
</script>

<style scoped>
.snake {
  background-color: var(--color-5);
  width: 100%;
  height: 100%;
}

.head {
  background-color: var(--color-6);
}

.food {
  background-color: var(--color-4);
}
</style>
