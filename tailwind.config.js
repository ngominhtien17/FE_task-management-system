// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        fontFamily: {
          sans: [
            'Inter',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Oxygen',
            'Ubuntu',
            'Cantarell',
            'Open Sans',
            'Helvetica Neue',
            'sans-serif',
          ],
        },
        colors: {
          // Primary colors
          primary: {
            DEFAULT: '#1976D2', // primary blue
            dark: '#1565C0',    // primary dark blue
            light: '#E3F2FD',   // ultra light blue
          },
          // Background colors
          background: {
            DEFAULT: '#FFFFFF', // white
            secondary: '#F8FAFD', // light gray-blue
          },
          // Text colors
          text: {
            DEFAULT: '#2A3747',    // dark slate
            secondary: '#6E7A8A',  // medium slate
            muted: '#9EA8B4',      // light slate
          },
          // State colors
          error: {
            DEFAULT: '#D32F2F',
            light: 'rgba(211, 47, 47, 0.08)',
          },
          success: {
            DEFAULT: '#2E7D32',
          },
          // Border colors
          border: {
            DEFAULT: '#E2E8F0',
          },
        },
        boxShadow: {
          'form': '0 8px 32px rgba(0, 0, 0, 0.08)',
          'button': '0 4px 12px rgba(25, 118, 210, 0.25)',
          'button-hover': '0 6px 16px rgba(25, 118, 210, 0.35)',
        },
        spacing: {
          'form-padding': '48px',
        },
      },
    },
    plugins: [],
  }