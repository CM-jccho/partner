import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#004399",
          50: "#E8F0FF",
          100: "#C5D8FF",
          500: "#004399",
          600: "#003380",
          700: "#002266",
        },
        sidebar: "#001529",
        "sidebar-hover": "#002855",
        "sidebar-active": "#004399",
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
