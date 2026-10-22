import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { loadActiveProjects } from '../../data/projects-source';
import { useLanguage } from '../../i18n/LanguageContext';
import type { Project } from '../../types';
import { refreshScrollTriggers, revealOnScroll } from '../../utils/scrollReveal';
import { ProjectCard } from './ProjectCard';

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing.sectionY} ${({ theme }) => theme.spacing.pageX};
`;

const Title = styled.h2`
  margin-bottom: clamp(40px, 6vw, 72px);
  font-size: ${({ theme }) => theme.typography.scale.h2};
  font-weight: ${({ theme }) => theme.typography.weights.light};
`;

const Stack = styled.div`
  display: grid;
  gap: clamp(20px, 3vw, 32px);
`;

const Rest = styled.div`
  display: grid;
  gap: clamp(20px, 3vw, 32px);

  @media (min-width: 900px) {
    grid-template-columns: 1.2fr 0.8fr;

    > :nth-child(3),
    > :nth-child(6) {
      grid-column: 1 / -1;
      min-height: 48vh;
    }
  }
`;

export function Projects() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadActiveProjects().then((next) => {
      if (!cancelled) setProjects(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !projects.length) return;

    const cards = section.querySelectorAll('.project-card');
    const context = revealOnScroll(section, cards, { y: 32, duration: 0.7, stagger: 0.08 });
    refreshScrollTriggers();

    return () => {
      context.revert();
    };
  }, [projects]);

  if (!projects.length) return null;

  const [featured, ...rest] = projects;

  return (
    <Section id="projects" ref={sectionRef}>
      <Title>{t.projects.title}</Title>
      <Stack>
        {featured ? <ProjectCard featured index={0} project={featured} /> : null}
        {rest.length ? (
          <Rest>
            {rest.map((project, index) => (
              <ProjectCard index={index + 1} key={project.id} project={project} />
            ))}
          </Rest>
        ) : null}
      </Stack>
    </Section>
  );
}
