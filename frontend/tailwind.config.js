module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3d5',
          400: '#6b8cce',
          500: '#2c3e80',
          600: '#1e2d5a',
          700: '#152041',
          800: '#0f1829',
          900: '#0a0f14',
        },
        'matte-blue': {
          50: '#eceff5',
          100: '#d5dce8',
          200: '#b8c5da',
          300: '#8fa6c8',
          400: '#5d7fa3',
          500: '#3d5a80',
          600: '#2d4563',
          700: '#1f3247',
          800: '#152030',
          900: '#0d1419',
        },
        'accent-blue': '#4a90e2',
        'accent-cyan': '#1abc9c',
        'accent-purple': '#9b59b6',
      },
    },
  },
  plugins: [],
}
