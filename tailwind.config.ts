import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#f9f5ef",
          100: "#f1e6d6",
          200: "#e8d5ba",
          300: "#d8b98b",
          400: "#c49a58",
          500: "#b4813a",
          600: "#996531",
          700: "#7a4d26",
          800: "#5e381c",
          900: "#452715"
        }
      },
      fontFamily: {
        display: ["'DM Sans'", "'Segoe UI'", "sans-serif"],
        body: ["'Inter'", "'Segoe UI'", "sans-serif"]
      }
    }
  }
};

export default config;

