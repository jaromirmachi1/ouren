import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styled from 'styled-components';
import { soldProjects } from '../../data/projects';
import { useLanguage } from '../../i18n/LanguageContext';
import { scrollTriggerDefaults } from '../../styles/animations';

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing.sectionY} 0;
  overflow: hidden;
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
  color: rgba(245, 245, 240, 0.55);
  font-size: clamp(22px, 3vw, 36px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: ${({ theme }) => theme.typography.tracking.tight};
`;

const Counter = styled.p`
  color: ${({ theme }) => theme.colors.gold};
  font-size: clamp(40px, 6vw, 88px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  line-height: 0.9;
  text-align: right;
`;

const CounterLabel = styled.span`
  display: block;
  margin-top: 8px;
  color: rgba(245, 245, 240, 0.6);
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
`;

const PinWrap = styled.div`
  position: relative;
  width: 100%;
`;

const Track = styled.div`
  display: flex;
  gap: clamp(16px, 2vw, 24px);
  width: max-content;
  padding: 0 ${({ theme }) => theme.spacing.pageX};
`;

const Card = styled.article`
  position: relative;
  flex: 0 0 clamp(280px, 42vw, 420px);
  min-height: 34vh;
  overflow: hidden;
  border: 0.5px solid rgba(255, 255, 255, 0.08);
  background: ${({ theme }) => theme.colors.card};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  min-height: 34vh;
  object-fit: cover;
  filter: saturate(0.7);
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
  color: ${({ theme }) => theme.colors.gold};
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
`;

export function SoldProjects() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const counter = counterRef.current;

    if (!section || !track) {
      return;
    }

    const scrollDistance = track.scrollWidth - window.innerWidth;

    const horizontalTween = gsap.to(track, {
      x: -scrollDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${scrollDistance}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    if (counter) {
      const counterState = { value: 0 };

      gsap.to(counterState, {
        value: 47,
        duration: 1.6,
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
    }

    return () => {
      horizontalTween.scrollTrigger?.kill();
      horizontalTween.kill();
    };
  }, []);

  return (
    <Section id="sold" ref={sectionRef}>
      <Header>
        <Title>{t.sold.title}</Title>
        <Counter>
          <span ref={counterRef}>0</span>
          <CounterLabel>{t.sold.counterLabel}</CounterLabel>
        </Counter>
      </Header>
      <PinWrap>
        <Track ref={trackRef}>
          {soldProjects.map((project, index) => (
            <Card
              className="hoverable project-card"
              data-cursor-label={String(index + 1).padStart(2, '0')}
              key={project.id}
            >
              <Image alt={project.name} loading="lazy" src={project.image} />
              <Overlay>
                <Name>{project.name}</Name>
                <Location>{project.location}</Location>
              </Overlay>
            </Card>
          ))}
        </Track>
      </PinWrap>
    </Section>
  );
}
