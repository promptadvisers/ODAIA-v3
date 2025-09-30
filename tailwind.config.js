/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0f1419',    // Main dark background
          secondary: '#1a1d26',  // Secondary panels
          card: '#1e2139',        // Card backgrounds
          hover: '#252940',       // Hover states
          input: '#0f1419',       // Input fields
        },
        text: {
          primary: '#ffffff',   // Primary white text
          secondary: '#8b92a3', // Secondary gray text
          muted: '#6b7280',     // Muted text
        },
        border: {
          primary: '#2a2f3e',
          secondary: '#1a1f2e',
        },
        status: {
          green: '#22c55e',
          yellow: '#f59e0b',
          blue: '#3b82f6',
        },
        accent: {
          blue: '#3b82f6',
          'blue-hover': '#2563eb',
        },
        tag: {
          bg: '#2a2f3e',
          text: '#8b92a3',
        },
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}