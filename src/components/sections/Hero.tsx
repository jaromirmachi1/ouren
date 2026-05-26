import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';
import { ColorBends } from '../ui/ColorBends';
import { GrainOverlay } from '../ui/GrainOverlay';
import { theme } from '../../styles/theme';

const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100vh;
  padding: clamp(120px, 14vh, 160px) ${({ theme: t }) => t.spacing.pageX}
    clamp(56px, 9vh, 112px);
  overflow: hidden;
  background: ${({ theme: t }) => t.colors.deepBlack};
`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background: ${({ theme: t }) => t.colors.deepBlack};
`;

const StaticFallback = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 42%, rgba(26, 47, 160, 0.55) 0%, transparent 42%),
    radial-gradient(circle at 50% 38%, ${({ theme: t }) => t.colors.navy} 0%, transparent 58%),
    ${({ theme: t }) => t.colors.deepBlack};

  @media (prefers-reduced-motion: no-preference) {
    display: none;
  }
`;

const Vignette = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse at 50% 50%, transparent 35%, ${({ theme: t }) => t.colors.deepBlack} 100%),
    linear-gradient(180deg, rgba(5, 6, 15, 0.35) 0%, transparent 30%, rgba(5, 6, 15, 0.65) 100%);
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
`;

const Headline = styled.h1`
  font-size: clamp(72px, 9vw, 130px);
  font-weight: ${({ theme: t }) => t.typography.weights.extraLight};
  letter-spacing: ${({ theme: t }) => t.typography.tracking.tight};
  line-height: 0.92;
`;

const Line = styled.span`
  display: block;
  overflow: hidden;
`;

const LineInner = styled.span`
  display: block;
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
`;

const Subline = styled.p`
  margin-top: clamp(28px, 4vw, 48px);
  color: ${({ theme: t }) => t.colors.gold};
  font-size: ${({ theme: t }) => t.typography.scale.label};
  font-weight: ${({ theme: t }) => t.typography.weights.regular};
  letter-spacing: ${({ theme: t }) => t.typography.tracking.label};
  text-transform: uppercase;
  opacity: 1;
  visibility: visible;
`;

const OUREN_BLUES = [theme.colors.navy, theme.colors.midBlue, theme.colors.lightBlue];

const HERO_LINES = ['We build.', 'We place.', 'We elevate.'];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const lines = section.querySelectorAll('[data-hero-line]');
      const subline = section.querySelector('[data-hero-subline]');

      gsap.set(lines, { y: 80, autoAlpha: 0 });
      gsap.set(subline, { y: 24, autoAlpha: 0 });

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .to(lines, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.15 })
        .to(subline, { y: 0, autoAlpha: 1, duration: 0.8 }, '-=0.35');
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <Section id="top" ref={sectionRef}>
      <Background aria-hidden="true">
        <StaticFallback />
        <ColorBends
          autoRotate={4}
          bandWidth={5.5}
          colors={OUREN_BLUES}
          frequency={1.05}
          intensity={1.4}
          iterations={3}
          mouseInfluence={0.45}
          noise={0.1}
          parallax={0.35}
          rotation={90}
          scale={1.1}
          speed={0.18}
          transparent
          warpStrength={1.1}
        />
        <Vignette />
      </Background>
      <GrainOverlay opacity={0.05} />
      <Content>
        <Headline>
          {HERO_LINES.map((line) => (
            <Line key={line}>
              <LineInner data-hero-line>{line}</LineInner>
            </Line>
          ))}
        </Headline>
        <Subline data-hero-subline>Czech Republic — International</Subline>
      </Content>
    </Section>
  );
}
