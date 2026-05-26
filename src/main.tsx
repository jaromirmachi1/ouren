import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import App from './App';
import { useLenis } from './hooks/useLenis';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { refreshScrollTriggers } from './utils/scrollReveal';

function Root() {
  useLenis();

  useEffect(() => {
    const onLoad = () => refreshScrollTriggers();
    window.addEventListener('load', onLoad);
    refreshScrollTriggers();

    return () => {
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
