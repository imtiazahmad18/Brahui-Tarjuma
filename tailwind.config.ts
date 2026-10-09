import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#0D4D54",
          "teal-dark": "#083338",
          "teal-light": "#15656E",
          gold: "#C59B27",
          "gold-light": "#E0B747",
          maroon: "#7B1E22",
        },
        paper: {
          light: "#FBF9F5",
          "light-card": "#FFFFFF",
          "light-border": "#E8E2D9",
          dark: "#0F1722",
          "dark-card": "#17212F",
          "dark-border": "#243245",
        },
      },
      fontFamily: {
        nastaliq: [
          "'Jameel Noori Nastaliq'",
          "'Noto Nastaliq Urdu'",
          "'Urdu Typesetting'",
          "serif",
        ],
        serif: ["Georgia", "Cambria", "'Times New Roman'", "Times", "serif"],
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      lineHeight: {
        nastaliq: "2.35",
        "nastaliq-loose": "2.6",
      },
    },
  },
  plugins: [],
};

export default config;
