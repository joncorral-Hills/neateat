import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neat: {
          50: "#f4f9ec",
          100: "#e6f2d4",
          200: "#cfe5ad",
          300: "#b0d37d",
          400: "#92c054",
          500: "#7CB23A",
          600: "#5a8a28",
          700: "#456a22",
          800: "#395520",
          900: "#31491f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
