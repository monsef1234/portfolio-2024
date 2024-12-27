import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lucida: ["Lucida", "sans-serif"],
        tahoma: ["Tahoma", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
