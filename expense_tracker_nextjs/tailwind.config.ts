import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef3f2",
          100: "#fee5e2",
          200: "#fed0ca",
          300: "#fcaca5",
          400: "#f87d71",
          500: "#ef5844",
          600: "#dc3b27",
          700: "#b9301e",
          800: "#982c1c",
          900: "#7e2b1e",
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
} satisfies Config;
