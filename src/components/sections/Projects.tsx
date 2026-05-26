import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { activeProjects } from '../../data/projects';
import { useLanguage } from '../../i18n/LanguageContext';
import { refreshScrollTriggers, revealOnScroll } from '../../utils/scrollReveal';
import { SplitText } from '../ui/SplitText';
import { ProjectCard } from './ProjectCard';

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing.sectionY} ${({ theme }) => theme.spacing.pageX};
`;

const Title = styled.h2`
  margin-bottom: clamp(40px, 6vw, 72px);
  font-size: ${({ theme }) => theme.typography.scale.h2};
  font-weight: ${({ theme }) => theme.typography.weights.light};
`;

const Grid = styled.div`
  display: grid;
  gap: clamp(20px, 3vw, 32px);
`;

const GridRest = styled.div`
  display: grid;
  gap: clamp(20px, 3vw, 32px);

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export function Projects() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [featured, ...rest] = activeProjects;

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const cards = section.querySelectorAll('.project-card');
    const context = revealOnScroll(section, cards);

    refreshScrollTriggers();

    return () => {
      context.revert();
    };
  }, []);

  return (
    <Section id="projects" ref={sectionRef}>
      <Title>
        <SplitText as="span" triggerOnScroll splitBy="words">
          {t.projects.title}
        </SplitText>
      </Title>
      <Grid>
        {featured && <ProjectCard featured index={0} project={featured} />}
        <GridRest>
          {rest.map((project, index) => (
            <ProjectCard index={index + 1} key={project.id} project={project} />
          ))}
        </GridRest>
      </Grid>
    </Section>
  );
}
