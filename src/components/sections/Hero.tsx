import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  prefersReducedData,
  prefersReducedMotion,
  shouldUseLightMotion,
} from '../../utils/performance';

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
const HERO_VIDEO = '/video/hero.mp4';
const HERO_POSTER = '/video/hero-poster.jpg';

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

const Poster = styled.div`
  position: absolute;
  inset: 0;
  background:
    ${({ theme: t }) => t.colors.deepBlack}
      url(${HERO_POSTER}) center / cover no-repeat;
`;

const Video = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  filter: brightness(0.62) contrast(1.08) saturate(0.78);
`;

const Filter = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, rgba(0, 10, 103, 0.34) 0%, rgba(5, 6, 15, 0.18) 34%, rgba(5, 6, 15, 0.72) 100%),
    radial-gradient(ellipse at 50% 42%, transparent 36%, rgba(5, 6, 15, 0.62) 100%);
  mix-blend-mode: multiply;
  pointer-events: none;
`;

const Vignette = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    linear-gradient(180deg, rgba(5, 6, 15, 0.42) 0%, transparent 26%, transparent 54%, rgba(5, 6, 15, 0.86) 100%),
    linear-gradient(90deg, rgba(5, 6, 15, 0.28) 0%, transparent 38%, transparent 72%, rgba(5, 6, 15, 0.22) 100%);
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 3;
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

export function Hero() {
  const { t, locale } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canPlayVideo = !prefersReducedMotion() && !prefersReducedData();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !canPlayVideo) return;

    const play = () => {
      void video.play().catch(() => {
        // Autoplay can still be blocked; poster remains visible underneath.
      });
    };

    play();

    const onVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else {
        play();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [canPlayVideo]);

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
        <Poster />
        {canPlayVideo ? (
          <Video
            autoPlay
            disablePictureInPicture
            loop
            muted
            playsInline
            poster={HERO_POSTER}
            preload="metadata"
            ref={videoRef}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </Video>
        ) : null}
        <Filter />
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
