import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import { formatProjectPrice } from '../../i18n/format';
import type { Project } from '../../types';
import { shouldUseLightMotion } from '../../utils/performance';

type ProjectCardProps = {
  project: Project;
  index: number;
  featured?: boolean;
};

const Card = styled(Link)<{ $featured?: boolean }>`
  position: relative;
  display: grid;
  min-height: ${({ $featured }) => ($featured ? '72vh' : '42vh')};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.card};
  color: inherit;
  transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);

  ${({ $featured }) =>
    $featured
      ? `
    min-height: min(78vh, 860px);
  `
      : ''}

  &:active {
    transform: scale(0.995);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ice};
    outline-offset: 3px;
  }
`;

const Media = styled.div`
  position: relative;
  overflow: hidden;
  min-height: inherit;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  min-height: inherit;
  object-fit: cover;
  transform: scale(1.02);
`;

const WebsiteButton = styled.button`
  position: absolute;
  top: clamp(16px, 2vw, 24px);
  right: clamp(16px, 2vw, 24px);
  z-index: 3;
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(5, 6, 15, 0.55);
  color: ${({ theme }) => theme.colors.white};
  transition:
    transform 160ms cubic-bezier(0.23, 1, 0.32, 1),
    background-color 200ms ease,
    color 200ms ease,
    border-color 200ms ease;

  svg {
    width: 18px;
    height: 18px;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: ${({ theme }) => theme.colors.ice};
      background: ${({ theme }) => theme.colors.ice};
      color: ${({ theme }) => theme.colors.deepBlack};
    }
  }

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ice};
    outline-offset: 3px;
  }
`;

const Overlay = styled.div<{ $featured?: boolean }>`
  position: absolute;
  inset: auto 0 0;
  z-index: 2;
  display: grid;
  gap: 8px;
  padding: ${({ $featured }) =>
    $featured ? 'clamp(28px, 4vw, 48px)' : 'clamp(20px, 3vw, 32px)'};
  background: linear-gradient(180deg, transparent 0%, rgba(5, 6, 15, 0.9) 78%);
`;

const Name = styled.h3<{ $featured?: boolean }>`
  font-size: ${({ $featured, theme }) =>
    $featured ? 'clamp(32px, 4.5vw, 56px)' : theme.typography.scale.h3};
  font-weight: ${({ theme }) => theme.typography.weights.light};
`;

const Location = styled.p`
  color: ${({ theme }) => theme.colors.ice};
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
`;

const Meta = styled.p`
  color: ${({ theme }) => theme.colors.mutedWhite};
  font-size: 14px;
`;

const Price = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: clamp(18px, 2vw, 22px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: ${({ theme }) => theme.typography.tracking.tight};
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
    if ($status === 'inProgress') {
      return `color: ${theme.colors.ice}; border-color: rgba(203, 223, 238, 0.45);`;
    }
    return `color: ${theme.colors.mutedWhite};`;
  }}
`;

function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const { locale, t } = useLanguage();
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const priceLabels = { from: t.common.from, sold: t.common.sold };
  const formattedPrice = formatProjectPrice(project.price, locale, priceLabels);

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    if (!card || !image || !shouldUseLightMotion()) return;

    const onEnter = () => {
      gsap.to(image, { scale: 1.05, duration: 0.55, ease: 'power3.out' });
    };
    const onLeave = () => {
      gsap.to(image, { scale: 1.02, duration: 0.55, ease: 'power3.out' });
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
      to={`/projekty/${project.slug}`}
    >
      <Media>
        <Image
          alt={project.name}
          decoding="async"
          loading={featured ? 'eager' : 'lazy'}
          ref={imageRef}
          src={project.image}
        />
        {project.websiteUrl ? (
          <WebsiteButton
            aria-label={`${project.name} website`}
            className="hoverable"
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              window.open(project.websiteUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            <ArrowUpRightIcon />
          </WebsiteButton>
        ) : null}
        <Overlay $featured={featured}>
          <Badge $status={project.status}>{t.status[project.status]}</Badge>
          <Name $featured={featured}>{project.name}</Name>
          <Location>{project.location}</Location>
          {featured ? (
            <>
              <Price>
                {formattedPrice}
                {locale === 'cs' ? ' Kč' : ''}
              </Price>
              <Meta>
                {project.units} {t.common.units}
                {project.areaSqm ? ` · ${project.areaSqm} m²` : ''} · {project.year}
              </Meta>
            </>
          ) : null}
        </Overlay>
      </Media>
    </Card>
  );
}
