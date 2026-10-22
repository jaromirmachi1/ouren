import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styled from 'styled-components';
import panoramaZabinyImage from '../assets/images/IMG_3434.jpg';
import { useLanguage } from '../i18n/LanguageContext';
import { PageMeta } from '../seo/PageMeta';
import { JsonLd } from '../seo/JsonLd';
import { absoluteUrl, SITE_NAME, SITE_URL } from '../seo/site';
import { prefersReducedMotion } from '../utils/performance';
import { refreshScrollTriggers } from '../utils/scrollReveal';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

const PRACTICE_TO = ['/prodej', '/pronajem', '/kupujeme', '/projekty'] as const;

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
    radial-gradient(circle at 18% 0%, rgba(203, 223, 238, 0.5), transparent 46%),
    ${({ theme }) => theme.colors.brightBg};
`;

const Title = styled.h1`
  position: relative;
  z-index: 1;
  max-width: 11ch;
  font-size: clamp(56px, 7.2vw, 92px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  letter-spacing: -0.035em;
  line-height: 0.92;
  text-wrap: balance;
`;

const Lead = styled.p`
  position: relative;
  z-index: 1;
  max-width: 38rem;
  margin-top: 28px;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: clamp(17px, 1.8vw, 20px);
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

const CtaLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 52px;
  padding: 0 24px;
  border: 1px solid rgba(0, 10, 103, 0.28);
  color: ${({ theme }) => theme.colors.navy};
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: transform 180ms ${EASE};

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

const Story = styled.div`
  display: grid;
  gap: clamp(32px, 5vw, 72px);

  @media (min-width: 900px) {
    grid-template-columns: 0.92fr 1.08fr;
    align-items: end;
  }
`;

const Figure = styled.figure`
  margin: 0;
`;

const Image = styled.img`
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;

  @media (min-width: 900px) {
    aspect-ratio: 3 / 4;
  }
`;

const Caption = styled.figcaption`
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const StoryCopy = styled.div`
  display: grid;
  gap: 20px;
  align-content: end;
`;

const StoryTitle = styled.h2`
  max-width: 14ch;
  font-size: clamp(36px, 4vw, 56px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  letter-spacing: -0.035em;
  line-height: 0.96;
  text-wrap: balance;
`;

const Body = styled.p`
  max-width: 38rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 17px;
  font-weight: ${({ theme }) => theme.typography.weights.light};
  line-height: 1.65;
`;

const Stats = styled.dl`
  display: grid;
  gap: 28px;
  margin: 8px 0 0;

  @media (min-width: 720px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Stat = styled.div`
  display: grid;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid rgba(5, 6, 15, 0.12);
`;

const StatValue = styled.dt`
  color: ${({ theme }) => theme.colors.navy};
  font-size: clamp(40px, 5vw, 64px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  letter-spacing: -0.04em;
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
`;

const StatLabel = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const PracticeGrid = styled.div`
  display: grid;
  gap: 0;
  border-top: 1px solid rgba(5, 6, 15, 0.12);

  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Practice = styled(Link)`
  display: grid;
  gap: 14px;
  align-content: start;
  min-height: 180px;
  padding: 28px 0;
  border-bottom: 1px solid rgba(5, 6, 15, 0.12);
  color: inherit;
  transition: transform 180ms ${EASE};

  @media (min-width: 800px) {
    padding: 32px 28px 32px 0;

    &:nth-child(2n) {
      padding-right: 0;
      padding-left: 28px;
      border-left: 1px solid rgba(5, 6, 15, 0.12);
    }
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.99);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.navy};
    outline-offset: 4px;
  }
`;

const PracticeTitle = styled.h3`
  font-size: clamp(24px, 2.4vw, 32px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: -0.03em;
`;

const PracticeSummary = styled.p`
  max-width: 34ch;
  margin: 0;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 16px;
  line-height: 1.5;
`;

const Principles = styled.ol`
  display: grid;
  gap: clamp(32px, 4vw, 48px);
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: principle;

  @media (min-width: 960px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const Principle = styled.li`
  display: grid;
  gap: 14px;
  align-content: start;
  counter-increment: principle;

  &::before {
    content: counter(principle, decimal-leading-zero);
    color: ${({ theme }) => theme.colors.navy};
    font-size: 12px;
    letter-spacing: 0.18em;
  }
`;

const PrincipleTitle = styled.h3`
  min-height: 2.4em;
  font-size: 22px;
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: -0.02em;
  line-height: 1.2;
  text-wrap: balance;
`;

const PrincipleBody = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 15px;
  line-height: 1.55;
`;

const ClientGrid = styled.div`
  display: grid;
  gap: clamp(28px, 4vw, 40px);

  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Client = styled.article`
  display: grid;
  gap: 10px;
  padding-top: 18px;
  border-top: 1px solid rgba(5, 6, 15, 0.12);
`;

const ClientTitle = styled.h3`
  font-size: 22px;
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: -0.02em;
`;

const ClientBody = styled.p`
  max-width: 42ch;
  margin: 0;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 16px;
  line-height: 1.55;
`;

const Places = styled.div`
  display: grid;
  gap: clamp(28px, 4vw, 48px);

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Place = styled.article`
  display: grid;
  gap: 12px;
  align-content: start;
`;

const PlaceName = styled.h3`
  font-size: clamp(28px, 3vw, 40px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  letter-spacing: -0.03em;
`;

const RegistryLink = styled.a`
  width: fit-content;
  color: ${({ theme }) => theme.colors.navy};
  font-size: 14px;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 180ms ${EASE};

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.navy};
    outline-offset: 4px;
  }
`;

const CloseCopy = styled.div`
  display: grid;
  gap: 16px;
  max-width: 28rem;
`;

const CloseRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 28px 48px;
  align-items: end;
  justify-content: space-between;
`;

const ContactLines = styled.div`
  display: grid;
  gap: 8px;
`;

const ContactLink = styled.a`
  width: fit-content;
  color: ${({ theme }) => theme.colors.navy};
  font-size: clamp(20px, 2vw, 28px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: -0.02em;
  transition: opacity 180ms ${EASE};

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.navy};
    outline-offset: 4px;
  }
`;

const PlacesLine = styled.p`
  margin: 12px 0 0;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 13px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export default function AboutPage() {
  const { locale, t } = useLanguage();
  const copy = t.about;
  const pageRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

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
      gsap.set('[data-hero], [data-reveal]', { autoAlpha: 0, y: 28 });

      gsap.to('[data-hero]', {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
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

      page.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.to(el, {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
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
  }, [locale]);

  return (
    <Page ref={pageRef}>
      <PageMeta
        description={t.meta.aboutDescription}
        lang={locale}
        path="/o-nas"
        title={t.meta.aboutTitle}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: t.meta.aboutTitle,
          description: t.meta.aboutDescription,
          url: absoluteUrl('/o-nas'),
          inLanguage: locale,
          mainEntity: {
            '@type': 'RealEstateAgent',
            name: SITE_NAME,
            legalName: 'SD GROUP PROSPERITY s.r.o.',
            url: SITE_URL,
            email: 'info@ouren.cz',
            telephone: '+420722033055',
            identifier: '21369178',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Radnická 376/11',
              addressLocality: 'Brno',
              postalCode: '602 00',
              addressCountry: 'CZ',
            },
            areaServed: ['Prague', 'Brno', 'International'],
          },
        }}
        id="about-page"
      />
      <Progress ref={progressRef} />
      <Hero>
        <Title data-hero>{copy.headline}</Title>
        <Lead data-hero>{copy.body1}</Lead>
        <CtaRow data-hero>
          <Cta $primary className="hoverable" href="mailto:info@ouren.cz">
            {copy.write}
          </Cta>
          <CtaLink className="hoverable" to="/kupujeme">
            {copy.sell}
          </CtaLink>
        </CtaRow>
      </Hero>

      <Section>
        <Story>
          <Figure data-reveal>
            <Image alt={copy.imageAlt} decoding="async" src={panoramaZabinyImage} />
            <Caption>{copy.imageAlt}</Caption>
          </Figure>
          <StoryCopy data-reveal>
            <StoryTitle>{copy.storyTitle}</StoryTitle>
            <Body>{copy.body2}</Body>
            <Body>{copy.storyBody}</Body>
            <Body>{copy.storyNote}</Body>
          </StoryCopy>
        </Story>
      </Section>

      <Section>
        <Stats>
          <Stat data-reveal>
            <StatValue>12+</StatValue>
            <StatLabel>{copy.stats.activeProjects}</StatLabel>
          </Stat>
          <Stat data-reveal>
            <StatValue>200+</StatValue>
            <StatLabel>{copy.stats.propertiesSold}</StatLabel>
          </Stat>
          <Stat data-reveal>
            <StatValue>24 h</StatValue>
            <StatLabel>{copy.stats.reply}</StatLabel>
          </Stat>
        </Stats>
      </Section>

      <Section>
        <SectionHead data-reveal>
          <SectionTitle>{copy.practicesTitle}</SectionTitle>
          <SectionLead>{copy.practicesLead}</SectionLead>
        </SectionHead>
        <PracticeGrid>
          {copy.practices.map((item, index) => (
            <Practice className="hoverable" data-reveal key={item.title} to={PRACTICE_TO[index]}>
              <PracticeTitle>{item.title}</PracticeTitle>
              <PracticeSummary>{item.summary}</PracticeSummary>
            </Practice>
          ))}
        </PracticeGrid>
      </Section>

      <Section>
        <SectionHead data-reveal>
          <SectionTitle>{copy.principlesTitle}</SectionTitle>
          <SectionLead>{copy.principlesLead}</SectionLead>
        </SectionHead>
        <Principles>
          {copy.principles.map((item) => (
            <Principle data-reveal key={item.title}>
              <PrincipleTitle>{item.title}</PrincipleTitle>
              <PrincipleBody>{item.body}</PrincipleBody>
            </Principle>
          ))}
        </Principles>
      </Section>

      <Section>
        <SectionHead data-reveal>
          <SectionTitle>{copy.clientsTitle}</SectionTitle>
          <SectionLead>{copy.clientsLead}</SectionLead>
        </SectionHead>
        <ClientGrid>
          {copy.clients.map((item) => (
            <Client data-reveal key={item.title}>
              <ClientTitle>{item.title}</ClientTitle>
              <ClientBody>{item.body}</ClientBody>
            </Client>
          ))}
        </ClientGrid>
      </Section>

      <Section>
        <SectionHead data-reveal>
          <SectionTitle>{copy.reachTitle}</SectionTitle>
          <SectionLead>{copy.reachLead}</SectionLead>
        </SectionHead>
        <Places>
          {copy.places.map((place) => (
            <Place data-reveal key={place.name}>
              <PlaceName>{place.name}</PlaceName>
              <Body>{place.body}</Body>
            </Place>
          ))}
        </Places>
      </Section>

      <Section>
        <CloseRow>
          <CloseCopy data-reveal>
            <SectionTitle>{copy.closeTitle}</SectionTitle>
            <SectionLead>{copy.closeBody}</SectionLead>
          </CloseCopy>
          <ContactLines data-reveal>
            <ContactLink className="hoverable" href="mailto:info@ouren.cz">
              info@ouren.cz
            </ContactLink>
            <ContactLink className="hoverable" href="tel:+420722033055">
              +420 722 033 055
            </ContactLink>
            <PlacesLine>{t.contact.locations}</PlacesLine>
          </ContactLines>
        </CloseRow>
      </Section>

      <Section>
        <SectionHead data-reveal>
          <SectionTitle>{copy.operatorTitle}</SectionTitle>
          <SectionLead>{copy.operatorBody}</SectionLead>
          <RegistryLink
            href="https://rejstrik-firem.kurzy.cz/21369178/sd-group-prosperity-sro/"
            rel="noreferrer"
            target="_blank"
          >
            {copy.operatorLink}
          </RegistryLink>
        </SectionHead>
      </Section>
    </Page>
  );
}
