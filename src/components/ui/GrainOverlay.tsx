import styled from 'styled-components';

type GrainOverlayProps = {
  opacity?: number;
  className?: string;
};

const Overlay = styled.svg<{ $opacity: number }>`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.grain};
  width: 100vw;
  height: 100vh;
  opacity: ${({ $opacity }) => $opacity};
  mix-blend-mode: overlay;
  pointer-events: none;
`;

export function GrainOverlay({ opacity = 0.035, className }: GrainOverlayProps) {
  return (
    <Overlay
      aria-hidden="true"
      className={className}
      $opacity={opacity}
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <filter id="ouren-grain-filter">
        <feTurbulence baseFrequency="0.8" numOctaves="4" seed="16" stitchTiles="stitch" type="fractalNoise" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA slope="0.55" type="linear" />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter="url(#ouren-grain-filter)" />
    </Overlay>
  );
}
