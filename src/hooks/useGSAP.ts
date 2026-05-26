import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useGSAP(
  callback: (context: gsap.Context) => void | (() => void),
  dependencies: unknown[] = [],
) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scopeRef.current) {
      return;
    }

    const context = gsap.context(() => {
      callback(context);
    }, scopeRef);

    return () => context.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return scopeRef;
}
