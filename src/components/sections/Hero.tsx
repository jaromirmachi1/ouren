import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import { shouldUseHeavyEffects, shouldUseLightMotion } from '../../utils/performance';
import { theme } from '../../styles/theme';

const ColorBends = lazy(() =>
  import('../ui/ColorBends').then((module) => ({ default: module.ColorBends })),
);

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100dvh;
  padding: clamp(120px, 14vh, 160px) ${({ theme: t }) => t.spacing.pageX}
    clamp(56px, 9vh, 104px);
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
`;

const Vignette = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse at 50% 45%, transparent 42%, rgba(5, 6, 15, 0.55) 100%),
    linear-gradient(180deg, rgba(5, 6, 15, 0.28) 0%, transparent 28%, transparent 58%, rgba(5, 6, 15, 0.78) 100%);
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  gap: 14px;
  width: 100%;
  max-width: 34rem;
`;

const Headline = styled.h1`
  margin: 0;
  max-width: 14ch;
  color: ${({ theme: t }) => t.colors.white};
  font-size: clamp(34px, 5.2vw, 58px);
  font-weight: ${({ theme: t }) => t.typography.weights.extraLight};
  letter-spacing: -0.03em;
  line-height: 1.02;
  text-wrap: balance;
`;

const Support = styled.p`
  margin: 0;
  max-width: 34ch;
  color: rgba(245, 245, 240, 0.58);
  font-size: clamp(14px, 1.35vw, 16px);
  font-weight: ${({ theme: t }) => t.typography.weights.light};
  line-height: 1.55;
`;

const Cta = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  margin-top: 10px;
  padding: 4px 0;
  color: ${({ theme: t }) => t.colors.ice};
  font-size: 11px;
  font-weight: ${({ theme: t }) => t.typography.weights.regular};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  transition: color 200ms ${EASE}, transform 140ms ${EASE};

  span[data-line] {
    display: block;
    width: 28px;
    height: 1px;
    background: currentColor;
    transform-origin: left center;
    transition: transform 220ms ${EASE};
  }

  svg {
    width: 11px;
    height: 11px;
    transition: transform 220ms ${EASE};
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: ${({ theme: t }) => t.colors.white};
    }

    &:hover span[data-line] {
      transform: scaleX(1.35);
    }

    &:hover svg {
      transform: translateX(3px);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: none;
    color: ${({ theme: t }) => t.colors.white};
  }
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const OUREN_BLUES = [theme.colors.navy, theme.colors.midBlue, theme.colors.lightBlue];

export function Hero() {
  const { t, locale } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [showWebGL, setShowWebGL] = useState(false);

  useEffect(() => {
    if (!shouldUseHeavyEffects()) return;

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      if (!cancelled) setShowWebGL(true);
    }, 80);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !shouldUseLightMotion()) return;

    const ctx = gsap.context(() => {
      const items = section.querySelectorAll('[data-hero-reveal]');
      gsap.set(items, { y: 20, autoAlpha: 0 });
      gsap.to(items, {
        y: 0,
        autoAlpha: 1,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.12,
      });
    }, section);

    return () => ctx.revert();
  }, [locale]);

  return (
    <Section id="top" ref={sectionRef}>
      <Background aria-hidden="true">
        <StaticFallback />
        {showWebGL ? (
          <Suspense fallback={null}>
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
          </Suspense>
        ) : null}
        <Vignette />
      </Background>
      <Content>
        <VisuallyHidden>{t.hero.brand}</VisuallyHidden>
        <Headline data-hero-reveal>{t.hero.headline}</Headline>
        <Support data-hero-reveal>{t.hero.support}</Support>
        <Cta className="hoverable" data-hero-reveal href="/projekty">
          <span data-line aria-hidden />
          {t.hero.cta}
          <svg aria-hidden fill="none" viewBox="0 0 12 12">
            <path
              d="M2 6h8M7 3l3 3-3 3"
              stroke="currentColor"
              strokeLinecap="square"
              strokeWidth="1"
            />
          </svg>
        </Cta>
      </Content>
    </Section>
  );
}
