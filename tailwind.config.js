/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
    colors: {
      'todo-custom-color': '#fc657e'
    },
    },
  }
}
