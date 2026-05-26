export const theme = {
  colors: {
    navy: '#000A67',
    deepBlack: '#05060F',
    white: '#F5F5F0',
    gold: '#C8A96E',
    midBlue: '#1A2FA0',
    lightBlue: '#3B5BDB',
    card: '#0D1020',
    mutedWhite: 'rgba(245, 245, 240, 0.7)',
    border: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    sans: '"Vastine", system-ui, sans-serif',
    display: '"Vastine", system-ui, sans-serif',
    weights: {
      extraLight: 400,
      light: 400,
      regular: 400,
    },
    scale: {
      hero: 'clamp(64px, 10vw, 140px)',
      h1: 'clamp(40px, 6vw, 96px)',
      h2: 'clamp(28px, 4vw, 56px)',
      h3: 'clamp(22px, 2.4vw, 34px)',
      label: '11px',
      body: '16px',
    },
    tracking: {
      tight: '-0.02em',
      label: '0.2em',
      nav: '0.15em',
    },
    leading: {
      body: 1.8,
      heading: 0.95,
    },
  },
  spacing: {
    base: '8px',
    sectionY: 'clamp(80px, 12vw, 160px)',
    pageX: 'clamp(20px, 5vw, 72px)',
  },
  radii: {
    none: '0',
    soft: '18px',
    pill: '999px',
  },
  motion: {
    ease: 'power3.out',
    duration: {
      fast: 0.3,
      base: 0.6,
      slow: 1,
    },
  },
  zIndex: {
    cursor: 200,
    nav: 100,
    overlay: 90,
    grain: 80,
  },
} as const;

export type Theme = typeof theme;
