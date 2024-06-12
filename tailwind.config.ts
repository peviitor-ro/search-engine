import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      PoppinsLight: ["PoppinsLight", "sans-serif"],
      JustMandrone: ["JustMandrone", "sans-serif"],
      PoppinsRegular: ["PoppinsRegular", "sans-serif"],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        border_light_grey: "#e3e5e6",
        border_grey: "#dbdcdc",
        border_grey_lighter: "#dfe3e6",
        text_orange: "#f3781d",
        text_ink_black: "#090a0a",
        text_grey: "#4b4646",
        text_grey_darker: "#6f777a",
        background_green: "#048a81",
        background_green_light: "#DBE8E9",

        background_grey: "#f0f3f6",
        background_dark_blue: "#032239",
        background_cards: "#fbfbfb",
        white: "#ffffff",
      },
      boxShadow: {
        card_shadow: "0px 1px 3px 1px #00000026",
        hover_card_shadow: "0px 1px 2px 0px #0000004d",
        button_shadow: "0px 5px 5px 0px #00000040 inset",
        checbox_shadow: "0px 4px 14px 0px #0000001a;",
      },
    },
  },
  plugins: [],
};
export default config;
