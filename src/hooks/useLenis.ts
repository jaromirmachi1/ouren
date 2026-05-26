import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { shouldUseHeavyEffects } from '../utils/performance';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  useEffect(() => {
    if (!shouldUseHeavyEffects()) {
      return;
    }

    let lenis: Lenis | null = null;
    let rafId = 0;

    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
      });

      lenis.on('scroll', ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length && value !== undefined && lenis) {
            lenis.scrollTo(value, { immediate: true });
          }
          return lenis?.scroll ?? 0;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
      });

      const onRefresh = () => {
        lenis?.resize();
      };

      ScrollTrigger.addEventListener('refresh', onRefresh);

      const loop = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      const onResize = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
        cancelAnimationFrame(rafId);
        ScrollTrigger.removeEventListener('refresh', onRefresh);
        ScrollTrigger.scrollerProxy(document.documentElement, {});
        lenis?.destroy();
        lenis = null;
      };
    } catch (error) {
      console.error('Lenis failed to initialize:', error);
      return () => {
        cancelAnimationFrame(rafId);
        lenis?.destroy();
      };
    }
  }, []);
}
