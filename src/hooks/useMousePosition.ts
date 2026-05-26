import { useEffect, useState } from 'react';

type MousePosition = {
  x: number;
  y: number;
};

export function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('pointermove', updatePosition, { passive: true });

    return () => {
      window.removeEventListener('pointermove', updatePosition);
    };
  }, []);

  return position;
}
