import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import styled from 'styled-components';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { OurenLogo } from './OurenLogo';

const EASE_COVER: [number, number, number, number] = [0.76, 0, 0.24, 1];
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

const Stage = styled.div`
  position: relative;
  min-height: 100dvh;
`;

const PageFrame = styled(motion.div)`
  position: relative;
  z-index: 1;
  min-height: 100dvh;
  will-change: opacity, transform;
`;

const Curtain = styled(motion.div)<{ $blocking: boolean }>`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.overlay + 10};
  display: grid;
  place-items: center;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.navy};
  pointer-events: ${({ $blocking }) => ($blocking ? 'auto' : 'none')};
  will-change: transform;
`;

const Mark = styled(motion.div)`
  img {
    height: clamp(48px, 7vw, 64px);
    width: auto;
  }
`;

type Phase = 'idle' | 'cover' | 'reveal';

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const isFirstLoad = useRef(true);
  const [phase, setPhase] = useState<Phase>('idle');
  const [reveal, setReveal] = useState(true);
  const timers = useRef<number[]>([]);

  useScrollToTop();

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useLayoutEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    if (reduceMotion) {
      setReveal(true);
      setPhase('idle');
      return;
    }

    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];

    setReveal(false);
    setPhase('cover');

    timers.current.push(
      window.setTimeout(() => {
        setReveal(true);
        setPhase('reveal');
      }, 400),
    );

    timers.current.push(
      window.setTimeout(() => {
        setPhase('idle');
      }, 860),
    );
  }, [location.pathname, reduceMotion]);

  const showCurtain = phase !== 'idle' && !reduceMotion;

  return (
    <Stage>
      <PageFrame
        key={location.pathname}
        animate={reveal || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE_OUT }}
      >
        {children}
      </PageFrame>

      <AnimatePresence>
        {showCurtain ? (
          <Curtain
            $blocking={phase === 'cover'}
            animate={{ y: phase === 'reveal' ? '-101%' : '0%' }}
            aria-hidden
            initial={{ y: '100%' }}
            key="page-curtain"
            transition={{
              duration: phase === 'reveal' ? 0.44 : 0.36,
              ease: EASE_COVER,
            }}
          >
            <Mark
              animate={{
                opacity: phase === 'cover' ? 1 : 0,
                scale: phase === 'cover' ? 1 : 0.98,
              }}
              initial={{ opacity: 0, scale: 0.97 }}
              transition={{
                duration: 0.28,
                ease: EASE_OUT,
                delay: phase === 'cover' ? 0.1 : 0,
              }}
            >
              <OurenLogo height={56} />
            </Mark>
          </Curtain>
        ) : null}
      </AnimatePresence>
    </Stage>
  );
}
