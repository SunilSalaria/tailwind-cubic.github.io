/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './**/*.html',
    './assets/**/*.js'
  ],
  theme: {
    colors: {
        // primary
        primary: '#FE8464',
        primary_light: '#FFEFEB',
        primary_transparent: '#2936516b',
        // secondary
        secondary: '#293651',
        secondary_dark: '#132342',
        secondary_light: '#646F87',
        secondary_shade: '#efefef',
        // info
        info: '#fe6e9a',
        // light
        light: '#fafafc',
        // white
        white: '#fff',
    },
    extend: {},
},
plugins: [],
}
