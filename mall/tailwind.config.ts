import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#FF4757", 50: "#FFF0F1", 100: "#FFD6DA", 500: "#FF4757", 600: "#E6405E", 700: "#CC3355" },
        accent: { DEFAULT: "#FF6B35", 500: "#FF6B35" },
      },
      fontFamily: { sans: ["Pretendard", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
