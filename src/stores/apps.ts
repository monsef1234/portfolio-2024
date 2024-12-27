import { defineStore } from "pinia";

import { App } from "@/types/app";

import terminalIcon from "@/assets/images/terminal.png";
import shutdownIcon from "@/assets/images/shutdown.png";
import snakeIcon from "@/assets/images/snake.png";
import ticTacToeIcon from "@/assets/images/tic-tac-toe.png";

export const useAppsStore = defineStore("apps", {
  state: () => ({
    apps: [
      {
        name: "Terminal",
        icon: terminalIcon,
        isOpen: false,
      },
      {
        name: "Snake",
        icon: snakeIcon,
        isOpen: false,
      },
      {
        name: "Tic Tac Toe",
        icon: ticTacToeIcon,
        isOpen: false,
      },
      {
        name: "Shutdown",
        icon: shutdownIcon,
        isOpen: false,
      },
    ] as App[],
  }),

  actions: {
    openApp(index: number) {
      this.apps = this.apps.map((a) =>
        a.name == this.apps[index].name ? { ...a, isOpen: true } : a
      );
    },

    closeAppUsingRightClick(name: string) {
      this.apps = this.apps.map((app) =>
        app.name == name ? { ...app, isOpen: false } : app
      );
    },

    closeApp(app: App) {
      this.apps = this.apps.map((a) =>
        a.name == app.name ? { ...a, isOpen: false } : a
      );
    },
  },
});
