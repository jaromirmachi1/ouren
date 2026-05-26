import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { OurenLogo } from './OurenLogo';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.overlay + 10};
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.navy};
  pointer-events: none;
`;

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const isFirstLoad = useRef(true);
  const [showOverlay, setShowOverlay] = useState(false);

  useScrollToTop();

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    setShowOverlay(true);
    const timer = window.setTimeout(() => setShowOverlay(false), 1200);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showOverlay && (
          <Overlay
            animate={{ y: '-100%' }}
            exit={{ y: '-100%' }}
            initial={{ y: '100%' }}
            key={`overlay-${location.pathname}`}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <OurenLogo height={56} />
          </Overlay>
        )}
      </AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 1 }}
        key={location.pathname}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
