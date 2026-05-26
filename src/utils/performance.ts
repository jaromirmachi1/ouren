/** WebKit Safari (not Chrome/Firefox on macOS). */
export function isSafari(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|CriOS|Chromium|Edg|OPR|Firefox|FxiOS/i.test(ua);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type PerformanceTier = 'high' | 'low';

export function getPerformanceTier(): PerformanceTier {
  if (prefersReducedMotion() || isSafari()) {
    return 'low';
  }

  return 'high';
}

export function shouldUseHeavyEffects(): boolean {
  return getPerformanceTier() === 'high';
}
