import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BrightProjectCard } from '../components/projects/BrightProjectCard';
import { loadActiveProjects, loadSoldProjects } from '../data/projects-source';
import { useLanguage } from '../i18n/LanguageContext';
import { PageMeta } from '../seo/PageMeta';
import type { Project } from '../types';

const Page = styled.main`
  min-height: 100dvh;
  background:
    radial-gradient(circle at 12% 0%, rgba(203, 223, 238, 0.55), transparent 42%),
    ${({ theme }) => theme.colors.brightBg};
  color: ${({ theme }) => theme.colors.brightInk};
`;

const Hero = styled.header`
  padding: clamp(140px, 18vh, 180px) ${({ theme }) => theme.spacing.pageX} clamp(40px, 6vw, 64px);
`;

const Title = styled.h1`
  max-width: 12ch;
  font-size: clamp(48px, 8vw, 96px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  letter-spacing: -0.03em;
  line-height: 0.92;
  color: ${({ theme }) => theme.colors.brightInk};
`;

const Block = styled.section`
  padding: 0 ${({ theme }) => theme.spacing.pageX} clamp(56px, 8vw, 96px);
`;

const BlockTitle = styled.h2`
  margin-bottom: clamp(20px, 3vw, 28px);
  color: ${({ theme }) => theme.colors.brightInk};
  font-size: clamp(22px, 3vw, 32px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: -0.02em;
`;

const Grid = styled.div`
  display: grid;
  gap: clamp(18px, 2vw, 24px);

  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export default function ProjectsPage() {
  const { locale, t } = useLanguage();
  const [active, setActive] = useState<Project[]>([]);
  const [sold, setSold] = useState<Project[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadActiveProjects(), loadSoldProjects()]).then(([nextActive, nextSold]) => {
      if (cancelled) return;
      setActive(nextActive);
      setSold(nextSold);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Page>
      <PageMeta
        description={t.meta.projectsDescription}
        lang={locale}
        path="/projekty"
        title={t.meta.projectsTitle}
      />
      <Hero>
        <Title>{t.projects.pageTitle}</Title>
      </Hero>
      {active.length ? (
        <Block>
          <BlockTitle>{t.projects.allProjects}</BlockTitle>
          <Grid>
            {active.map((project) => (
              <BrightProjectCard key={project.id} project={project} />
            ))}
          </Grid>
        </Block>
      ) : null}
      {sold.length ? (
        <Block id="sold">
          <BlockTitle>{t.sold.title}</BlockTitle>
          <Grid>
            {sold.map((project) => (
              <BrightProjectCard key={project.id} project={project} />
            ))}
          </Grid>
        </Block>
      ) : null}
    </Page>
  );
}
