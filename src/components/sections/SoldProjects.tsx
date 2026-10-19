import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styled from 'styled-components';
import { loadSoldProjects } from '../../data/projects-source';
import { useLanguage } from '../../i18n/LanguageContext';
import { scrollTriggerDefaults } from '../../styles/animations';
import type { Project } from '../../types';
import { shouldUseLightMotion } from '../../utils/performance';

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  position: relative;
  padding: ${({ theme }) => theme.spacing.sectionY} 0;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.deepBlack};
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: clamp(32px, 5vw, 56px);
  padding: 0 ${({ theme }) => theme.spacing.pageX};
`;

const Title = styled.h2`
  color: rgba(245, 245, 240, 0.72);
  font-size: clamp(22px, 3vw, 36px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: ${({ theme }) => theme.typography.tracking.tight};
`;

const Counter = styled.p`
  color: ${({ theme }) => theme.colors.ice};
  font-size: clamp(40px, 6vw, 88px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  line-height: 0.9;
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

const CounterLabel = styled.span`
  display: block;
  margin-top: 8px;
  color: rgba(245, 245, 240, 0.6);
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
`;

const Scroller = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Track = styled.div`
  display: flex;
  gap: clamp(12px, 1.6vw, 20px);
  width: max-content;
  padding: 0 ${({ theme }) => theme.spacing.pageX};
`;

const Card = styled(Link)`
  position: relative;
  flex: 0 0 min(78vw, 360px);
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.card};
  scroll-snap-align: start;
  color: inherit;

  @media (min-width: 900px) {
    flex-basis: min(32vw, 380px);
  }

  &:hover img,
  &:focus-visible img {
    transform: scale(1.04);
    filter: saturate(0.92);
  }

  &:active {
    transform: scale(0.99);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ice};
    outline-offset: 3px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.78);
  transform: scale(1);
  transition:
    transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 280ms cubic-bezier(0.22, 1, 0.36, 1);
`;

const Overlay = styled.div`
  position: absolute;
  inset: auto 0 0;
  padding: 20px;
  background: linear-gradient(180deg, transparent, rgba(5, 6, 15, 0.9));
`;

const Name = styled.h3`
  font-size: clamp(20px, 2vw, 28px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
`;

const Location = styled.p`
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.ice};
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
`;

export function SoldProjects() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadSoldProjects().then((next) => {
      if (!cancelled) setProjects(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const counter = counterRef.current;
    if (!section || !counter || !projects.length) return;

    const total = projects.reduce((sum, project) => sum + (project.units || 0), 0);

    if (!shouldUseLightMotion()) {
      counter.textContent = String(total);
      return;
    }

    const counterState = { value: 0 };
    const countTween = gsap.to(counterState, {
      value: total,
      duration: 1.4,
      ease: 'power2.out',
      snap: { value: 1 },
      scrollTrigger: {
        trigger: section,
        ...scrollTriggerDefaults,
      },
      onUpdate: () => {
        counter.textContent = `${Math.round(counterState.value)}`;
      },
    });

    return () => {
      countTween.scrollTrigger?.kill();
      countTween.kill();
    };
  }, [projects]);

  if (!projects.length) return null;

  return (
    <Section id="sold" ref={sectionRef}>
      <Header>
        <Title>{t.sold.title}</Title>
        <Counter>
          <span ref={counterRef}>0</span>
          <CounterLabel>{t.sold.counterLabel}</CounterLabel>
        </Counter>
      </Header>
      <Scroller>
        <Track>
          {projects.map((project) => (
            <Card className="hoverable project-card" key={project.id} to={`/projekty/${project.slug}`}>
              <Image
                alt={project.name}
                decoding="async"
                loading="lazy"
                src={project.image}
              />
              <Overlay>
                <Name>{project.name}</Name>
                <Location>{project.location}</Location>
              </Overlay>
            </Card>
          ))}
        </Track>
      </Scroller>
    </Section>
  );
}
