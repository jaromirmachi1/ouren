import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Vastine';
    src: url('/fonts/Vastine.ttf') format('truetype');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html {
    background: ${({ theme }) => theme.colors.deepBlack};
    color: ${({ theme }) => theme.colors.white};
    font-family: ${({ theme }) => theme.typography.sans};
    font-size: 100%;
    scroll-behavior: auto;
    scrollbar-width: none;
    text-rendering: geometricPrecision;
  }

  html::-webkit-scrollbar,
  body::-webkit-scrollbar {
    display: none;
  }

  body {
    min-width: 320px;
    min-height: 100vh;
    background:
      radial-gradient(circle at 50% 18%, rgba(26, 47, 160, 0.28), transparent 36vw),
      ${({ theme }) => theme.colors.deepBlack};
    color: ${({ theme }) => theme.colors.white};
    font-family: ${({ theme }) => theme.typography.sans};
    font-weight: ${({ theme }) => theme.typography.weights.light};
    line-height: ${({ theme }) => theme.typography.leading.body};
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @media (pointer: fine) {
    body,
    a,
    button,
    .hoverable {
      cursor: none;
    }
  }

  #root {
    min-height: 100vh;
    isolation: isolate;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.gold};
    color: ${({ theme }) => theme.colors.deepBlack};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  button {
    border: 0;
    cursor: pointer;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  img {
    height: auto;
    object-fit: cover;
  }

  ul,
  ol {
    list-style: none;
    padding: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${({ theme }) => theme.typography.sans};
    font-weight: ${({ theme }) => theme.typography.weights.regular};
    line-height: ${({ theme }) => theme.typography.leading.heading};
    letter-spacing: ${({ theme }) => theme.typography.tracking.tight};
  }

  p {
    max-width: 70ch;
  }

  .hoverable {
    cursor: crosshair;
  }

  .project-card,
  .blog-card,
  .split-inner {
    opacity: 1;
    visibility: visible;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
