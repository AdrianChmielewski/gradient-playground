/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class', // sterowanie trybem ciemnym przez klasę (używane przez DaisyUI)
  theme: {
    extend: {
      // Przykładowe niestandardowe tła – przydatne przy generowaniu gradientów
      backgroundImage: {
        'custom-linear': 'linear-gradient(45deg, #FF00AA, #00FFA0)',
        'custom-radial': 'radial-gradient(circle, #FF00AA, #00FFA0)',
        'custom-conic': 'conic-gradient(from 45deg, #FF00AA, #00FFA0, #FF00AA)',
        'gradient-dots': 
          'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.15) 1px, transparent 0)',
      },
      // Ulepszone animacje
      keyframes: {
        'gradient-move': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        'bounce-small': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        'gradient-move': 'gradient-move 15s ease infinite',
        'wiggle': 'wiggle 0.3s ease-in-out',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'bounce-small': 'bounce-small 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-up': 'scale-up 0.4s ease-out',
      },
      // Dodatkowe układy siatki
      gridTemplateColumns: {
        'auto-fill-100': 'repeat(auto-fill, minmax(100px, 1fr))',
        'auto-fill-150': 'repeat(auto-fill, minmax(150px, 1fr))',
        'auto-fill-200': 'repeat(auto-fill, minmax(200px, 1fr))',
        'auto-fill-250': 'repeat(auto-fill, minmax(250px, 1fr))',
      },
      // Dodatkowe rozmiary
      scale: {
        '102': '1.02',
        '103': '1.03',
        '105': '1.05',
      },
      // Dodatkowe cienie
      boxShadow: {
        'inner-lg': 'inset 0 2px 10px 0 rgba(0, 0, 0, 0.15)',
        'inner-xl': 'inset 0 2px 20px 0 rgba(0, 0, 0, 0.2)',
        'elevation-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'elevation-2': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        'elevation-3': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
        'elevation-4': '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
        'elevation-5': '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    require('tailwindcss-animate'),
    require('tailwindcss-textshadow'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#FF00AA",
          "secondary": "#00FFA0",
          "accent": "#FF512F",
          "neutral": "#3D4451",
          "base-100": "#FFFFFF",
          "base-200": "#F8F9FC",
          "base-300": "#EBEDF2",
          "info": "#2094f3",
          "success": "#009485",
          "warning": "#ff9900",
          "error": "#ff5724",
        },
      },
      {
        pastel: {
          "primary": "#a3d2ca",
          "secondary": "#f6eac2",
          "accent": "#f7d794",
          "neutral": "#b8a9c9",
          "base-100": "#ffffff",
          "base-200": "#F9F9F9",
          "base-300": "#EFEFEF",
          "info": "#82b1ff",
          "success": "#a5d6a7",
          "warning": "#ffcc80",
          "error": "#ef9a9a",
        },
      },
      {
        retro: {
          "primary": "#f67280",
          "secondary": "#c06c84",
          "accent": "#6c5b7b",
          "neutral": "#355c7d",
          "base-100": "#ffffff",
          "base-200": "#F9F5F0",
          "base-300": "#EFE9E1",
          "info": "#99b898",
          "success": "#ff847c",
          "warning": "#e84a5f",
          "error": "#2a363b",
        },
      },
      {
        corporate: {
          "primary": "#0d47a1",
          "secondary": "#1976d2",
          "accent": "#42a5f5",
          "neutral": "#e0e0e0",
          "base-100": "#ffffff",
          "base-200": "#F5F8FB",
          "base-300": "#E5ECF6",
          "info": "#64b5f6",
          "success": "#81c784",
          "warning": "#ffb74d",
          "error": "#e57373",
        },
      },
      "dark",
      "cupcake",
    ],
  },
}
