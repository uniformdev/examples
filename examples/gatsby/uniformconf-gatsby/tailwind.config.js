/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      minHeight: {
        500: "500px",
      },
      maxHeight: {
        500: "500px",
      },
    },
  },
  plugins: [],
}
