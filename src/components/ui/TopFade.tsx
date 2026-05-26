import styled from 'styled-components';

const Fade = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.nav - 1};
  width: 100%;
  height: clamp(140px, 22vh, 220px);
  pointer-events: none;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.deepBlack} 0%,
    ${({ theme }) => theme.colors.deepBlack} 18%,
    rgba(5, 6, 15, 0.88) 45%,
    rgba(5, 6, 15, 0.45) 72%,
    transparent 100%
  );
`;

export function TopFade() {
  return <Fade aria-hidden="true" />;
}
