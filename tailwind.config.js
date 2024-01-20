/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/pp-auth-lib/**/*.{html,ts,js,mjs}",
    "./projects/pp-auth-lib/src/lib/**/*.{html,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
