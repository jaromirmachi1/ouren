import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styled from 'styled-components';
import { WeBuyIntake } from '../components/sell/WeBuyIntake';
import { useLanguage } from '../i18n/LanguageContext';
import { PageMeta } from '../seo/PageMeta';
import type { WeBuyIntent } from '../types';
import { prefersReducedMotion } from '../utils/performance';
import { refreshScrollTriggers } from '../utils/scrollReveal';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

const Page = styled.main`
  position: relative;
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.brightBg};
  color: ${({ theme }) => theme.colors.brightInk};

  > section:nth-of-type(even) {
    background: ${({ theme }) => theme.colors.brightSurface};
  }
`;

const Progress = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 60;
  width: 100%;
  height: 2px;
  transform: scaleX(0);
  transform-origin: 0 50%;
  background: ${({ theme }) => theme.colors.navy};
  pointer-events: none;
`;

const Hero = styled.header`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100dvh;
  padding: clamp(140px, 18vh, 180px) ${({ theme }) => theme.spacing.pageX} clamp(72px, 10vh, 112px);
  overflow: hidden;
  background:
    radial-gradient(circle at 12% 0%, rgba(203, 223, 238, 0.55), transparent 42%),
    ${({ theme }) => theme.colors.brightBg};
`;

const HeroGlow = styled.div`
  position: absolute;
  top: 18%;
  right: -8%;
  z-index: 0;
  width: min(48vw, 520px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(203, 223, 238, 0.55) 0%, transparent 68%);
  filter: blur(8px);
  pointer-events: none;
  will-change: transform;
`;

const Title = styled.h1`
  position: relative;
  z-index: 1;
  max-width: 12ch;
  font-size: clamp(56px, 7.4vw, 92px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  letter-spacing: -0.035em;
  line-height: 0.92;
  text-wrap: balance;
`;

const Lead = styled.p`
  position: relative;
  z-index: 1;
  max-width: 36rem;
  margin-top: 24px;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: clamp(17px, 1.9vw, 21px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  line-height: 1.55;
`;

const CtaRow = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 36px;
`;

const Cta = styled.a<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 52px;
  padding: 0 24px;
  border: 1px solid
    ${({ $primary, theme }) => ($primary ? theme.colors.navy : 'rgba(0, 10, 103, 0.28)')};
  background: ${({ $primary, theme }) => ($primary ? theme.colors.navy : 'transparent')};
  color: ${({ $primary, theme }) => ($primary ? theme.colors.white : theme.colors.navy)};
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition:
    opacity 180ms ${EASE},
    transform 180ms ${EASE},
    background 180ms ${EASE},
    border-color 180ms ${EASE};

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.navy};
    outline-offset: 3px;
  }
`;

const Section = styled.section`
  position: relative;
  padding: clamp(88px, 11vw, 132px) ${({ theme }) => theme.spacing.pageX}
    clamp(96px, 12vw, 148px);
  border-top: 1px solid rgba(5, 6, 15, 0.12);
`;

const SectionHead = styled.div`
  display: grid;
  gap: 16px;
  max-width: 38rem;
  margin-bottom: clamp(48px, 6vw, 72px);
`;

const SectionTitle = styled.h2`
  font-size: clamp(32px, 3.4vw, 48px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: -0.03em;
  line-height: 1.08;
  text-wrap: balance;
`;

const SectionLead = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 17px;
  font-weight: ${({ theme }) => theme.typography.weights.light};
  line-height: 1.6;
`;

const Paths = styled.div`
  display: grid;
  gap: clamp(28px, 4vw, 48px);

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: clamp(40px, 6vw, 72px);
  }
`;

const Path = styled.article`
  display: grid;
  gap: 18px;
  align-content: start;
  padding-top: 4px;
`;

const PathTitle = styled.h3`
  color: ${({ theme }) => theme.colors.navy};
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

const PathSummary = styled.p`
  max-width: 28ch;
  font-size: clamp(22px, 2.2vw, 28px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: -0.02em;
  line-height: 1.25;
  text-wrap: balance;
`;

const PathList = styled.ul`
  display: grid;
  gap: 12px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
`;

const PathItem = styled.li`
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 12px;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 15px;
  line-height: 1.45;

  &::before {
    content: '';
    width: 18px;
    height: 1px;
    margin-top: 0.7em;
    background: ${({ theme }) => theme.colors.navy};
  }
`;

const Fits = styled.div`
  display: grid;
  gap: clamp(28px, 4vw, 48px);

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FitBlock = styled.div`
  display: grid;
  gap: 16px;
`;

const FitTitle = styled.h3`
  font-size: clamp(20px, 2.2vw, 24px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: -0.02em;
`;

const FitList = styled.ul`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 15px;
  line-height: 1.5;
`;

const FitItem = styled.li`
  padding-left: 0;
`;

const Steps = styled.ol`
  display: grid;
  gap: clamp(36px, 4vw, 48px);
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: step;

  @media (min-width: 960px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    column-gap: clamp(28px, 3vw, 48px);
  }
`;

const Step = styled.li`
  display: grid;
  gap: 14px;
  align-content: start;
  counter-increment: step;

  &::before {
    content: counter(step, decimal-leading-zero);
    color: ${({ theme }) => theme.colors.navy};
    font-size: 12px;
    letter-spacing: 0.18em;
  }
`;

const StepTitle = styled.h3`
  min-height: 2.4em;
  font-size: 22px;
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: -0.02em;
  line-height: 1.2;
  text-wrap: balance;
`;

const StepBody = styled.p`
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 15px;
  line-height: 1.55;
`;

const Proof = styled.div`
  display: grid;
  gap: clamp(40px, 5vw, 72px);

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    align-items: end;
  }

  ${SectionHead} {
    margin-bottom: 0;
  }
`;

const ProofStats = styled.dl`
  display: grid;
  gap: 20px;
  margin: 0;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const ProofStat = styled.div`
  display: grid;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.brightLine};

  dt {
    color: ${({ theme }) => theme.colors.navy};
    font-size: clamp(28px, 3.2vw, 40px);
    font-weight: ${({ theme }) => theme.typography.weights.light};
    letter-spacing: -0.03em;
  }

  dd {
    margin: 0;
    color: ${({ theme }) => theme.colors.brightMuted};
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

const IntakeGrid = styled.div`
  display: grid;
  gap: clamp(40px, 5vw, 80px);

  @media (min-width: 980px) {
    grid-template-columns: minmax(0, 0.8fr) minmax(280px, 520px);
    align-items: start;
    justify-content: space-between;
  }

  ${SectionHead} {
    margin-bottom: 0;
  }
`;

const FaqList = styled.div`
  display: grid;
  gap: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.brightLine};
`;

const FaqItem = styled.details`
  border-bottom: 1px solid ${({ theme }) => theme.colors.brightLine};

  summary {
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
    padding: 24px 0;
    font-size: clamp(17px, 1.9vw, 22px);
    font-weight: ${({ theme }) => theme.typography.weights.light};
    letter-spacing: -0.015em;
    transition: opacity 180ms ${EASE};

    &::-webkit-details-marker {
      display: none;
    }

    &::after {
      content: '+';
      flex-shrink: 0;
      color: ${({ theme }) => theme.colors.navy};
      font-size: 22px;
      line-height: 1;
      transition: transform 220ms ${EASE};
    }

    &:hover {
      opacity: 0.72;
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.navy};
      outline-offset: 4px;
    }
  }

  &[open] summary::after {
    transform: rotate(45deg);
  }
`;

const FaqAnswer = styled.div`
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 280ms ${EASE};

  ${FaqItem}[open] & {
    grid-template-rows: 1fr;
  }
`;

const FaqAnswerInner = styled.p`
  overflow: hidden;
  max-width: 54ch;
  margin: 0;
  padding-bottom: 0;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 15px;
  line-height: 1.6;
  transition: padding-bottom 280ms ${EASE};

  ${FaqItem}[open] & {
    padding-bottom: 22px;
  }
`;

export default function WeBuyPage() {
  const { locale, t } = useLanguage();
  const copy = t.weBuyPage;
  const [intent, setIntent] = useState<WeBuyIntent>('unsure');
  const pageRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'vykup' || hash === 'buy') setIntent('buy');
    if (hash === 'prodej' || hash === 'list') setIntent('list');
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    if (prefersReducedMotion()) {
      page.querySelectorAll<HTMLElement>('[data-hero], [data-reveal]').forEach((node) => {
        node.style.opacity = '1';
        node.style.visibility = 'visible';
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set('[data-hero], [data-reveal]', { autoAlpha: 0, y: 36 });

      gsap.to('[data-hero]', {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.05,
      });

      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: page,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.4,
          },
        });
      }

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          y: 80,
          ease: 'none',
          scrollTrigger: {
            trigger: page,
            start: 'top top',
            end: '+=120%',
            scrub: 0.6,
          },
        });
      }

      page.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.to(el, {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
      });

    }, page);

    refreshScrollTriggers();

    return () => {
      ctx.revert();
    };
  }, [locale, copy.title]);

  const scrollToForm = (next: WeBuyIntent) => {
    setIntent(next);
    document.getElementById('we-buy-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Page ref={pageRef}>
      <Progress aria-hidden="true" ref={progressRef} />
      <PageMeta
        description={t.meta.weBuyDescription}
        lang={locale}
        path="/kupujeme"
        title={t.meta.weBuyTitle}
      />

      <Hero>
        <HeroGlow aria-hidden="true" ref={glowRef} />
        <Title data-hero>{copy.title}</Title>
        <Lead data-hero>{copy.lead}</Lead>
        <CtaRow data-hero>
          <Cta
            $primary
            className="hoverable"
            href="#we-buy-form"
            onClick={(event) => {
              event.preventDefault();
              scrollToForm('buy');
            }}
          >
            {copy.ctaBuy}
          </Cta>
          <Cta
            className="hoverable"
            href="#we-buy-form"
            onClick={(event) => {
              event.preventDefault();
              scrollToForm('list');
            }}
          >
            {copy.ctaList}
          </Cta>
        </CtaRow>
      </Hero>

      <Section aria-labelledby="paths-title">
        <SectionHead data-reveal>
          <SectionTitle id="paths-title">{copy.pathsTitle}</SectionTitle>
          <SectionLead>{copy.pathsLead}</SectionLead>
        </SectionHead>
        <Paths>
          <Path data-reveal>
            <PathTitle>{copy.buyPath.title}</PathTitle>
            <PathSummary>{copy.buyPath.summary}</PathSummary>
            <PathList>
              {copy.buyPath.points.map((point) => (
                <PathItem key={point}>{point}</PathItem>
              ))}
            </PathList>
          </Path>
          <Path data-reveal>
            <PathTitle>{copy.listPath.title}</PathTitle>
            <PathSummary>{copy.listPath.summary}</PathSummary>
            <PathList>
              {copy.listPath.points.map((point) => (
                <PathItem key={point}>{point}</PathItem>
              ))}
            </PathList>
          </Path>
        </Paths>
      </Section>

      <Section aria-labelledby="fits-title">
        <SectionHead data-reveal>
          <SectionTitle id="fits-title">{copy.fitsTitle}</SectionTitle>
        </SectionHead>
        <Fits>
          <FitBlock data-reveal>
            <FitTitle>{copy.fitsBuy.title}</FitTitle>
            <FitList>
              {copy.fitsBuy.items.map((item) => (
                <FitItem key={item}>{item}</FitItem>
              ))}
            </FitList>
          </FitBlock>
          <FitBlock data-reveal>
            <FitTitle>{copy.fitsList.title}</FitTitle>
            <FitList>
              {copy.fitsList.items.map((item) => (
                <FitItem key={item}>{item}</FitItem>
              ))}
            </FitList>
          </FitBlock>
        </Fits>
      </Section>

      <Section aria-labelledby="steps-title">
        <SectionHead data-reveal>
          <SectionTitle id="steps-title">{copy.stepsTitle}</SectionTitle>
        </SectionHead>
        <Steps data-reveal>
          {copy.steps.map((step) => (
            <Step key={step.title}>
              <StepTitle>{step.title}</StepTitle>
              <StepBody>{step.body}</StepBody>
            </Step>
          ))}
        </Steps>
      </Section>

      <Section aria-labelledby="proof-title">
        <Proof>
          <SectionHead data-reveal>
            <SectionTitle id="proof-title">{copy.proofTitle}</SectionTitle>
            <SectionLead>{copy.proofLead}</SectionLead>
          </SectionHead>
          <ProofStats>
            {copy.proofItems.map((item) => (
              <ProofStat data-reveal key={item.label}>
                <dt>{item.value}</dt>
                <dd>{item.label}</dd>
              </ProofStat>
            ))}
          </ProofStats>
        </Proof>
      </Section>

      <Section aria-labelledby="form-title">
        <IntakeGrid>
          <SectionHead data-reveal>
            <SectionTitle id="form-title">{copy.formTitle}</SectionTitle>
            <SectionLead>{copy.formLead}</SectionLead>
          </SectionHead>
          <div data-reveal>
            <WeBuyIntake key={intent} initialIntent={intent} />
          </div>
        </IntakeGrid>
      </Section>

      <Section aria-labelledby="faq-title">
        <SectionHead data-reveal>
          <SectionTitle id="faq-title">{copy.faqTitle}</SectionTitle>
        </SectionHead>
        <FaqList data-reveal>
          {copy.faq.map((item) => (
            <FaqItem key={item.q}>
              <summary>{item.q}</summary>
              <FaqAnswer>
                <FaqAnswerInner>{item.a}</FaqAnswerInner>
              </FaqAnswer>
            </FaqItem>
          ))}
        </FaqList>
      </Section>
    </Page>
  );
}
