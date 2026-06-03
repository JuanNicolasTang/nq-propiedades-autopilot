import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17211f",
        moss: "#496f5d",
        jade: "#0f766e",
        clay: "#ba5a31",
        pollen: "#f3c95f",
        paper: "#f7f4ec",
        cloud: "#eef3f0",
        night: "#101715",
      },
      boxShadow: {
        panel: "0 24px 80px rgba(23, 33, 31, 0.14)",
        button: "0 12px 30px rgba(15, 118, 110, 0.24)",
      },
      borderRadius: {
        soft: "0.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
