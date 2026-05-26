import styled from 'styled-components';
import { shouldUseHeavyEffects } from '../../utils/performance';

type GrainOverlayProps = {
  opacity?: number;
  className?: string;
};

const LightGrain = styled.div<{ $opacity: number }>`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.grain};
  opacity: ${({ $opacity }) => $opacity};
  pointer-events: none;
  background-image: radial-gradient(rgba(255, 255, 255, 0.14) 0.6px, transparent 0.6px);
  background-size: 3px 3px;
`;

const Overlay = styled.svg<{ $opacity: number }>`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.grain};
  width: 100vw;
  height: 100vh;
  opacity: ${({ $opacity }) => $opacity};
  pointer-events: none;
`;

export function GrainOverlay({ opacity = 0.035, className }: GrainOverlayProps) {
  if (!shouldUseHeavyEffects()) {
    return <LightGrain aria-hidden="true" className={className} $opacity={opacity} />;
  }

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
