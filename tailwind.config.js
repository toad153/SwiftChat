/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/*.jsx",
    "./src/components/*.jsx"
  ],
  theme: {
    extend: {
      colors: {
        'cust-grey' : '#31363F',
        'cust-dark' : '#222831',
        'cust-blue' : '#76ABAE',
        'cust-white' : '#EEEEEE', 
      },
    },
  },
  plugins: [],
}

