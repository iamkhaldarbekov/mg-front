/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        logo: {
          "0%": {color: "white"},
          "25%": {color: "lightgoldenrodyellow"},
          "50%": {color: "gold"},
          "75%": {color: "orange"},
          "100%": {color: "lightgreen"},
        },
        message: {
          "0%": {opacity: "0", transform: "translateY(50px)"},
          "100%": {opacity: "1", transform: "translateY(0)"}
        }
      },
      animation: {
        logo: "logo 10s linear infinite alternate",
        message: "message 100ms ease"
      },
      fontFamily: {
        inter: "Inter",
        tiny5: "Tiny5"
      },
      colors: {
        darkgray: "#171717",
        dark: "#080808",
        gold: "#eba715",
        darkgold: "#b87e04",
        gray: "#363636",
        red: "#c7001b"
      },
      borderRadius: {
        dft: "5px",
        mid: "12px",
        big: "24px"
      },
      margin: {
        dft: "15px",
        big: "30px",
        btn: "25px 10px 0 0"
      },
      minHeight: {
        full: "calc(100vh - 90px)"
      }
    },
  },
  plugins: [],
}