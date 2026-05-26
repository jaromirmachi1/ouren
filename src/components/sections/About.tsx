import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styled from 'styled-components';
import { scrollTriggerDefaults } from '../../styles/animations';
import { SplitText } from '../ui/SplitText';

gsap.registerPlugin(ScrollTrigger);

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing.sectionY} ${({ theme }) => theme.spacing.pageX};
`;

const Grid = styled.div`
  display: grid;
  gap: clamp(32px, 5vw, 64px);

  @media (min-width: 900px) {
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
  }
`;

const ImageWrap = styled.div`
  position: relative;
  overflow: hidden;
  min-height: clamp(360px, 52vh, 620px);
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  min-height: inherit;
  object-fit: cover;
  clip-path: inset(0 100% 0 0);
`;

const Content = styled.div`
  display: grid;
  gap: 24px;
`;

const Eyebrow = styled.p`
  color: ${({ theme }) => theme.colors.gold};
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
`;

const Headline = styled.h2`
  font-size: ${({ theme }) => theme.typography.scale.h2};
  font-weight: ${({ theme }) => theme.typography.weights.light};
`;

const Body = styled.p`
  color: rgba(245, 245, 240, 0.7);
  font-size: ${({ theme }) => theme.typography.scale.body};
  font-weight: ${({ theme }) => theme.typography.weights.light};
  line-height: ${({ theme }) => theme.typography.leading.body};
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-top: 12px;
`;

const Stat = styled.div`
  display: grid;
  gap: 8px;
`;

const StatValue = styled.p`
  color: ${({ theme }) => theme.colors.gold};
  font-size: clamp(36px, 5vw, 64px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  line-height: 0.95;
`;

const StatLabel = styled.p`
  color: rgba(245, 245, 240, 0.72);
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
`;

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;

    if (!section || !image) {
      return;
    }

    gsap.to(image, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: image,
        ...scrollTriggerDefaults,
      },
    });

    gsap.to(image, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  return (
    <Section id="about" ref={sectionRef}>
      <Grid>
        <ImageWrap>
          <Image
            alt="Ouren team in a modern architectural office"
            loading="lazy"
            ref={imageRef}
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80"
          />
        </ImageWrap>
        <Content>
          <Eyebrow>About Ouren</Eyebrow>
          <Headline>
            <SplitText as="span" splitBy="words" triggerOnScroll>
              Built on precision. Driven by vision.
            </SplitText>
          </Headline>
          <Body>
            Ouren is an international real estate firm rooted in the Czech Republic, shaping residential and
            commercial environments with editorial clarity and long-term value.
          </Body>
          <Body>
            From development strategy to placement, we guide every stage with discretion, precision, and a
            design-led sensibility that elevates each property we represent.
          </Body>
          <Stats>
            <Stat>
              <StatValue>12+</StatValue>
              <StatLabel>active projects</StatLabel>
            </Stat>
            <Stat>
              <StatValue>200+</StatValue>
              <StatLabel>properties sold</StatLabel>
            </Stat>
          </Stats>
        </Content>
      </Grid>
    </Section>
  );
}
