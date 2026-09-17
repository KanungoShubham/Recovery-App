import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3355C9",
          dark: "#28439E",
          light: "#5C79D8",
        },
        ink: "#0B1730",
        body: "#F5F7FC",
        "gray-medium": "#DFE2EA",
        "gray-helper": "#A8AFBF",
        success: { DEFAULT: "#16A34A", light: "#DCFCE7" },
        warning: { DEFAULT: "#F97316", light: "#FFEDD5" },
        danger: { DEFAULT: "#DC2626", light: "#FEE2E2", border: "#FECACA" },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,23,48,0.04), 0 8px 20px -8px rgba(11,23,48,0.12)",
        floating: "0 12px 28px -8px rgba(51,85,201,0.35)",
      },
      keyframes: {
        "toast-in": {
          "0%": { transform: "translateY(-16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "toast-out": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-16px)", opacity: "0" },
        },
        "sheet-in": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "toast-in": "toast-in 0.25s ease-out",
        "toast-out": "toast-out 0.2s ease-in forwards",
        "sheet-in": "sheet-in 0.28s cubic-bezier(0.32,0.72,0,1)",
        "pop-in": "pop-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
