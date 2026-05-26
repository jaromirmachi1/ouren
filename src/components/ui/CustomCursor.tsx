import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';
import { getPerformanceTier } from '../../utils/performance';

const CursorLayer = styled.div`
  pointer-events: none;

  @media (pointer: coarse) {
    display: none;
  }
`;

const Dot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.cursor};
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white};
  pointer-events: none;
  will-change: opacity, transform;
`;

const Ring = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.cursor};
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.gold};
  font-size: 7px;
  font-weight: ${({ theme }) => theme.typography.weights.regular};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  line-height: 1;
  text-transform: uppercase;
  pointer-events: none;
  will-change: border-color, opacity, transform;
`;

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const isLowTier = getPerformanceTier() === 'low';
    const setDotX = gsap.quickSetter(dot, 'x', 'px');
    const setDotY = gsap.quickSetter(dot, 'y', 'px');
    const setRingX = gsap.quickTo(ring, 'x', { duration: isLowTier ? 0.22 : 0.15, ease: 'power3.out' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: isLowTier ? 0.22 : 0.15, ease: 'power3.out' });
    let moveFrame = 0;
    let lastX = 0;
    let lastY = 0;

    gsap.set([dot, ring], { autoAlpha: 0 });

    const getCursorTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) {
        return null;
      }

      return target.closest<HTMLElement>('a, button, .hoverable, [data-cursor], [data-cursor-label]');
    };

    const applyCursorPosition = (x: number, y: number) => {
      setDotX(x - 4);
      setDotY(y - 4);
      setRingX(x - 18);
      setRingY(y - 18);
    };

    const moveCursor = (event: PointerEvent) => {
      lastX = event.clientX;
      lastY = event.clientY;

      if (!isLowTier) {
        applyCursorPosition(lastX, lastY);
        return;
      }

      if (moveFrame) {
        return;
      }

      moveFrame = requestAnimationFrame(() => {
        applyCursorPosition(lastX, lastY);
        moveFrame = 0;
      });
    };

    const showCursor = () => {
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2, ease: 'power2.out' });
    };

    const hideCursor = () => {
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2, ease: 'power2.out' });
    };

    const activateCursor = (event: PointerEvent) => {
      const target = getCursorTarget(event.target);

      if (!target) {
        return;
      }

      setLabel(target.dataset.cursorLabel ?? '');
      gsap.to(dot, { autoAlpha: 0, scale: 0, duration: 0.25, ease: 'power3.out' });
      gsap.to(ring, {
        borderColor: '#C8A96E',
        scale: 2.5,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    const deactivateCursor = (event: PointerEvent) => {
      const target = getCursorTarget(event.target);
      const nextTarget = getCursorTarget(event.relatedTarget);

      if (!target || target === nextTarget) {
        return;
      }

      setLabel('');
      gsap.to(dot, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'power3.out' });
      gsap.to(ring, {
        borderColor: 'rgba(255, 255, 255, 0.5)',
        scale: 1,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    window.addEventListener('pointermove', moveCursor, { passive: true });
    window.addEventListener('pointerenter', showCursor);
    window.addEventListener('pointerleave', hideCursor);
    document.addEventListener('pointerover', activateCursor);
    document.addEventListener('pointerout', deactivateCursor);

    return () => {
      if (moveFrame) {
        cancelAnimationFrame(moveFrame);
      }
      window.removeEventListener('pointermove', moveCursor);
      window.removeEventListener('pointerenter', showCursor);
      window.removeEventListener('pointerleave', hideCursor);
      document.removeEventListener('pointerover', activateCursor);
      document.removeEventListener('pointerout', deactivateCursor);
    };
  }, []);

  return (
    <CursorLayer aria-hidden="true">
      <Dot ref={dotRef} />
      <Ring ref={ringRef}>{label}</Ring>
    </CursorLayer>
  );
}
