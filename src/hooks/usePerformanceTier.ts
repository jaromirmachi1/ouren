import { useSyncExternalStore } from 'react';
import { getPerformanceTier, type PerformanceTier } from '../utils/performance';

function subscribe(onStoreChange: () => void) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion.addEventListener('change', onStoreChange);

  return () => {
    reducedMotion.removeEventListener('change', onStoreChange);
  };
}

function getSnapshot(): PerformanceTier {
  return getPerformanceTier();
}

function getServerSnapshot(): PerformanceTier {
  return 'high';
}

export function usePerformanceTier(): PerformanceTier {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
