/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
 theme: {
  extend: {
    colors: {
      navy: {
        50: '#eef2f9',
        100: '#d6e0ef',
        400: '#3a5a94',
        600: '#1c3763',
        800: '#0f2447',
        900: '#0B1E3D',
        950: '#071630',
      },

      brand: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#2563EB',
        600: '#1d4ed8',
        700: '#1e40af',
      },

      sky: {
        400: '#38BDF8',
      },

      ice: '#F8FAFC',

      teal: {
        500: '#10B981',
      },
    },

    fontFamily: {
      display: ['"Space Grotesk"', 'sans-serif'],
      body: ['"Inter"', 'sans-serif'],
      mono: ['"IBM Plex Mono"', 'monospace'],
    },

    boxShadow: {
      soft: '0 10px 40px -10px rgba(11, 30, 61, 0.15)',
      glow: '0 0 0 1px rgba(37,99,235,0.08), 0 20px 60px -15px rgba(37,99,235,0.35)',
    },

    backgroundImage: {
      'grid-faint':
        'linear-gradient(to right, rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.06) 1px, transparent 1px)',
    },

    keyframes: {
      float: {
        '0%, 100%': {
          transform: 'translateY(0px)',
        },
        '50%': {
          transform: 'translateY(-16px)',
        },
      },

      'spin-slow': {
        from: {
          transform: 'rotate(0deg)',
        },
        to: {
          transform: 'rotate(360deg)',
        },
      },

      blob: {
        '0%, 100%': {
          transform: 'translate(0,0) scale(1)',
        },
        '33%': {
          transform: 'translate(30px,-40px) scale(1.1)',
        },
        '66%': {
          transform: 'translate(-20px,20px) scale(0.95)',
        },
      },
    },

    animation: {
      float: 'float 6s ease-in-out infinite',
      'spin-slow': 'spin-slow 14s linear infinite',
      blob: 'blob 12s ease-in-out infinite',
    },

    /*
     * Responsive-friendly max widths
     */
    maxWidth: {
      '8xl': '1440px',
      '9xl': '1600px',
    },

    /*
     * Useful for controlling large sections
     */
    minHeight: {
      'screen-safe': '100svh',
    },
  },
},
}