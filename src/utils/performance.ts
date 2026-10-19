/** Device capability checks for expensive marketing effects. */

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

export function prefersReducedData(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(connection?.saveData);
}

export function hasCoarsePointer(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

export type PerformanceTier = 'high' | 'low';

export function getPerformanceTier(): PerformanceTier {
  if (prefersReducedMotion() || prefersReducedData() || isSafari() || hasCoarsePointer()) {
    return 'low';
  }

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof memory === 'number' && memory <= 4) {
    return 'low';
  }

  const cores = navigator.hardwareConcurrency;
  if (typeof cores === 'number' && cores <= 4) {
    return 'low';
  }

  return 'high';
}

/** Lenis, custom cursor, WebGL, magnetic physics. */
export function shouldUseHeavyEffects(): boolean {
  return getPerformanceTier() === 'high';
}

/** Soft UI motion (short GSAP reveals). Still off when reduced-motion is set. */
export function shouldUseLightMotion(): boolean {
  return !prefersReducedMotion();
}
