import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';
import type { Project } from '../../types';

type ProjectCardProps = {
  project: Project;
  index: number;
  featured?: boolean;
};

const Card = styled.article<{ $featured?: boolean }>`
  position: relative;
  display: grid;
  min-height: ${({ $featured }) => ($featured ? '60vh' : '40vh')};
  overflow: hidden;
  border: 0.5px solid rgba(255, 255, 255, 0.08);
  background: ${({ theme }) => theme.colors.card};
  transition: border-color 0.45s ease;

  &:hover {
    border-color: rgba(200, 169, 110, 0.3);
  }

  ${({ $featured }) =>
    $featured &&
    `
    grid-template-columns: 1fr;

    @media (min-width: 900px) {
      grid-template-columns: 60% 40%;
    }
  `}
`;

const Media = styled.div<{ $featured?: boolean }>`
  position: relative;
  overflow: hidden;
  min-height: ${({ $featured }) => ($featured ? '320px' : '100%')};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  min-height: inherit;
  object-fit: cover;
  transform: scale(1.02);
`;

const Overlay = styled.div`
  position: absolute;
  inset: auto 0 0;
  z-index: 2;
  display: grid;
  gap: 8px;
  padding: clamp(20px, 3vw, 32px);
  background: linear-gradient(180deg, transparent 0%, rgba(5, 6, 15, 0.88) 72%);
`;

const Panel = styled.div`
  display: grid;
  align-content: end;
  gap: 16px;
  padding: clamp(20px, 3vw, 32px);
`;

const Name = styled.h3`
  font-size: ${({ theme }) => theme.typography.scale.h3};
  font-weight: ${({ theme }) => theme.typography.weights.light};
`;

const Location = styled.p`
  color: ${({ theme }) => theme.colors.gold};
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
`;

const Meta = styled.p`
  color: ${({ theme }) => theme.colors.mutedWhite};
  font-size: 14px;
`;

const Badge = styled.span<{ $status: Project['status'] }>`
  width: fit-content;
  padding: 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 10px;
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;

  ${({ $status, theme }) => {
    if ($status === 'available') {
      return `color: #7dd87d; border-color: rgba(125, 216, 125, 0.35);`;
    }
    if ($status === 'reserved') {
      return `color: #e8b35a; border-color: rgba(232, 179, 90, 0.35);`;
    }
    return `color: ${theme.colors.mutedWhite};`;
  }}
`;

const statusLabel: Record<Project['status'], string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
};

export function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;

    if (!card || !image) {
      return;
    }

    const onEnter = () => {
      gsap.to(image, { scale: 1.05, duration: 0.6, ease: 'power3.out' });
    };

    const onLeave = () => {
      gsap.to(image, { scale: 1.02, duration: 0.6, ease: 'power3.out' });
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);

    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <Card
      $featured={featured}
      className="hoverable project-card"
      data-cursor-label={String(index + 1).padStart(2, '0')}
      ref={cardRef}
    >
      <Media $featured={featured}>
        <Image alt={project.name} loading="lazy" ref={imageRef} src={project.image} />
        {!featured && (
          <Overlay>
            <Name>{project.name}</Name>
            <Location>{project.location}</Location>
            <Badge $status={project.status}>{statusLabel[project.status]}</Badge>
          </Overlay>
        )}
      </Media>
      {featured && (
        <Panel>
          <Badge $status={project.status}>{statusLabel[project.status]}</Badge>
          <Name>{project.name}</Name>
          <Location>{project.location}</Location>
          <Meta>
            {project.price} · {project.units} units · {project.year}
          </Meta>
        </Panel>
      )}
    </Card>
  );
}
