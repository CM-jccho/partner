import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7634CB",
          50: "#F5F0FF",
          100: "#EDE5FF",
          500: "#7634CB",
          600: "#6929B5",
          700: "#5A2799",
        },
        sidebar: "#1E1040",
        "sidebar-hover": "#2D1A5E",
        "sidebar-active": "#7634CB",
      },
      fontFamily: { sans: ["Pretendard", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
