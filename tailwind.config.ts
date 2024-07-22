import { url } from "inspector";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "accent-1" : "#FD5E2B",
        "accent-2" : "#FE303D",
        "bg-primary" : "#FEFEF2",
        "bg-secondary" : "#D9D5C5",
        "text-primary" : "#4B4A48",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        rubik: ["var(--font-rubik)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
