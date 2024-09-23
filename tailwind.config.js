/** @type {import('tailwindcss').Config} */


const color_1 = "#18181b";
const color_2 = "#fafafa";
const color_3 = "#1d4ed8";
const color_4 = "#ef4444";
const color_5 = "#242424";
const color_6 = "#4c1d95";
const color_hover_1 = "#404040";


export default {
  content: ["./src/**/*.{html,jsx}"],
  theme: {
    extend: {
      colors: {
        "1": color_1,
        "2": color_2,
        "3": color_3,
        "4": color_4,
        "5": color_5,
        "6": color_6,
        "hover_1": color_hover_1
      },
      backgroundImage: {
        "gradient-1": "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(255,46,0,1) 100%);",
      },
      animation: {
        appear: "appear .3s ease",
        appearWithOpacity: "appearWithOpacity .3s ease-out"
      },
      keyframes: {
        appear: {
          "0%": {
            transform: "scale(0.2)"
          },
          "100%": {
            transform: "scale(1)"
          }
        },
        opacityWithOpacity: {
          "0%": {
            opacity: ".0"
          },
          "100%": {
            opacity: "1"
          }
        }
      },

    },
  },
  plugins: [],
}

