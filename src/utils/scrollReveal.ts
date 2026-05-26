import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollTriggerDefaults } from '../styles/animations';
import { prefersReducedMotion } from './performance';

gsap.registerPlugin(ScrollTrigger);

type RevealOptions = {
  trigger?: Element;
  y?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
};

export function revealOnScroll(
  scope: Element,
  targets: gsap.TweenTarget,
  options: RevealOptions = {},
) {
  if (prefersReducedMotion()) {
    return { revert: () => undefined };
  }

  const {
    trigger = scope,
    y = 60,
    duration = 0.9,
    stagger = 0.12,
    ease = 'power3.out',
  } = options;

  const context = gsap.context(() => {
    gsap.fromTo(
      targets,
      { y, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration,
        ease,
        stagger,
        immediateRender: false,
        scrollTrigger: {
          trigger,
          ...scrollTriggerDefaults,
        },
      },
    );
  }, scope);

  return context;
}

export function refreshScrollTriggers() {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}
