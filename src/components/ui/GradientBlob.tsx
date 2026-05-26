import styled, { keyframes } from 'styled-components';

type GradientBlobProps = {
  color?: string;
  size?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  opacity?: number;
  blur?: string;
  className?: string;
};

type StyledBlobProps = {
  $color: string;
  $size: string;
  $top: string;
  $right: string;
  $bottom: string;
  $left: string;
  $opacity: number;
  $blur: string;
};

const drift = keyframes`
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(4%, -3%, 0) scale(1.08);
  }

  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
`;

const Blob = styled.div<StyledBlobProps>`
  position: absolute;
  top: ${({ $top }) => $top};
  right: ${({ $right }) => $right};
  bottom: ${({ $bottom }) => $bottom};
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size};
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, ${({ $color }) => $color} 0%, transparent 68%);
  filter: blur(${({ $blur }) => $blur});
  opacity: ${({ $opacity }) => $opacity};
  pointer-events: none;
  transform: translateZ(0);
  animation: ${drift} 12s ease-in-out infinite;
`;

export function GradientBlob({
  color = 'rgba(26, 47, 160, 0.72)',
  size = 'clamp(320px, 48vw, 720px)',
  top = '10%',
  right = 'auto',
  bottom = 'auto',
  left = '50%',
  opacity = 0.7,
  blur = '72px',
  className,
}: GradientBlobProps) {
  return (
    <Blob
      aria-hidden="true"
      className={className}
      $blur={blur}
      $bottom={bottom}
      $color={color}
      $left={left}
      $opacity={opacity}
      $right={right}
      $size={size}
      $top={top}
    />
  );
}
