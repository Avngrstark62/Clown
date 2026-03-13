/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ffffff',
          dark: '#1a1a1a',
        },
        secondary: {
          light: '#f3f4f6',
          dark: '#2d2d2d',
        },
        accent: {
          light: '#ef4444',
          dark: '#ef4444',
        },
        text: {
          light: '#000000',
          dark: '#ffffff',
        },
        border: {
          light: '#e5e7eb',
          dark: '#404040',
        },
      },
      backgroundColor: {
        'sidebar': 'var(--bg-sidebar)',
        'content': 'var(--bg-content)',
        'card': 'var(--bg-card)',
      },
      textColor: {
        'primary': 'var(--text-primary)',
        'secondary': 'var(--text-secondary)',
      },
    },
  },
  plugins: [],
};
