export const fadeUp = {
  autoAlpha: 0,
  y: 60,
  duration: 0.9,
  ease: 'power3.out',
} as const;

export const fadeUpReveal = {
  autoAlpha: 1,
  y: 0,
  duration: 0.9,
  ease: 'power3.out',
} as const;

export const heroLine = {
  autoAlpha: 0,
  y: 80,
  duration: 1,
  ease: 'power3.out',
} as const;

export const staggerDefaults = {
  amount: 0.45,
  ease: 'power3.out',
} as const;

export const scrollTriggerDefaults = {
  start: 'top 85%',
  toggleActions: 'play none none none',
  once: true,
} as const;
