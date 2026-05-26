import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';
import { useMousePosition } from '../../hooks/useMousePosition';

type MagneticButtonProps = {
  children: ReactNode;
  type?: 'button' | 'submit';
  className?: string;
  onClick?: () => void;
};

const Button = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-width: 220px;
  padding: 18px 32px;
  border: 1px solid rgba(200, 169, 110, 0.45);
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
`;

const Fill = styled.span`
  position: absolute;
  inset: 0;
  z-index: 0;
  background: ${({ theme }) => theme.colors.gold};
  transform: scaleX(0);
  transform-origin: left;
`;

const Label = styled.span`
  position: relative;
  z-index: 1;
`;

export function MagneticButton({
  children,
  type = 'button',
  className,
  onClick,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const { x, y } = useMousePosition();

  const handleMove = () => {
    const button = buttonRef.current;

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();
    const offsetX = x - (rect.left + rect.width / 2);
    const offsetY = y - (rect.top + rect.height / 2);

    gsap.to(button, {
      x: offsetX * 0.18,
      y: offsetY * 0.18,
      duration: 0.35,
      ease: 'power3.out',
    });
  };

  const handleLeave = () => {
    const button = buttonRef.current;
    const fill = fillRef.current;

    if (!button || !fill) {
      return;
    }

    gsap.to(button, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
    gsap.to(fill, { scaleX: 0, duration: 0.45, ease: 'power3.out' });
  };

  const handleEnter = () => {
    const fill = fillRef.current;

    if (!fill) {
      return;
    }

    gsap.to(fill, { scaleX: 1, duration: 0.55, ease: 'power3.out' });
  };

  return (
    <Button
      className={`hoverable ${className ?? ''}`}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      ref={buttonRef}
      type={type}
    >
      <Fill ref={fillRef} />
      <Label>{children}</Label>
    </Button>
  );
}
