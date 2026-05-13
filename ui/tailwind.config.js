/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // editorial code lab palette — warm ink + parchment + gold
        ink: {
          bg: '#0E0D14',
          surface: '#16151F',
          raised: '#1C1B27',
          rule: '#2A2837',
          ruleStrong: '#3D3A50',
          muted: '#8B8696',
          soft: '#B7B2C2',
          text: '#EDE9DC',
          pure: '#FAF7EE',
        },
        gold: {
          DEFAULT: '#F5C518',
          400: '#FFD64A',
          500: '#F5C518',
          600: '#C99C00',
          700: '#8A6900',
          50: '#FFF8DC',
        },
        indigo: {
          glow: '#7C8CFF',
        },
        mint: {
          glow: '#6FE8B0',
        },
        coral: {
          glow: '#FF7A7A',
        },
        // legacy aliases kept so any leftover utility classes still resolve
        primary: {
          50: '#FFF8DC',
          100: '#FFEFAA',
          200: '#FFE56C',
          300: '#FFD64A',
          400: '#FFD64A',
          500: '#F5C518',
          600: '#C99C00',
          700: '#8A6900',
          800: '#5A4500',
          900: '#332700',
          950: '#1A1300',
        },
        secondary: {
          50: '#FAF7EE',
          100: '#EDE9DC',
          200: '#D6D1C2',
          300: '#B7B2C2',
          400: '#8B8696',
          500: '#6E687C',
          600: '#4E4A5E',
          700: '#2A2837',
          800: '#16151F',
          900: '#0E0D14',
          950: '#07060A',
        },
        accent: {
          50: '#E9FFF4',
          100: '#C2FBDF',
          200: '#9BF2C8',
          300: '#6FE8B0',
          400: '#6FE8B0',
          500: '#3DCF8E',
          600: '#1FA46C',
          700: '#177450',
          800: '#0E4A33',
          900: '#062719',
          950: '#04140D',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'caret-blink': 'caretBlink 1.05s steps(1) infinite',
        'scanline': 'scanline 9s linear infinite',
        'hairline-pulse': 'hairlinePulse 3.2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        caretBlink: { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        hairlinePulse: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
      },
      fontFamily: {
        // display: editorial serif w/ wonky variable axes
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        // body / labels / code — mono everywhere keeps the lab feel
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Menlo', 'Consolas', 'monospace'],
        // korean glyphs fall back gracefully through Pretendard
        kr: ['Pretendard', '"Apple SD Gothic Neo"', '"Noto Sans KR"', 'sans-serif'],
        // generic body — used rarely, falls back to mono
        sans: ['"JetBrains Mono"', 'Pretendard', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.03em',
        crisp: '-0.015em',
      },
      backgroundImage: {
        'paper-grain':
          "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.96  0 0 0 0 0.92  0 0 0 0 0.85  0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
    },
  },
  plugins: [],
}
