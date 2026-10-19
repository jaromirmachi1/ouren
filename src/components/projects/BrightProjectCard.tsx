import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import { formatProjectPrice } from '../../i18n/format';
import type { Project } from '../../types';

const CardLink = styled(Link)`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  color: inherit;
  background: ${({ theme }) => theme.colors.brightSurface};
  border: 1px solid ${({ theme }) => theme.colors.brightLine};
  transition:
    transform 180ms cubic-bezier(0.23, 1, 0.32, 1),
    border-color 180ms cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    border-color: rgba(0, 10, 103, 0.28);
  }

  &:hover img {
    transform: scale(1.03);
  }

  &:active {
    transform: scale(0.995);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.navy};
    outline-offset: 3px;
  }
`;

const Media = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: ${({ theme }) => theme.colors.brightBg};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: transform 320ms cubic-bezier(0.23, 1, 0.32, 1);
`;

const Body = styled.div`
  display: grid;
  gap: 10px;
  align-content: start;
  padding: 22px 22px 26px;
`;

const Meta = styled.p`
  color: ${({ theme }) => theme.colors.navy};
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const Name = styled.h2`
  color: ${({ theme }) => theme.colors.brightInk};
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: -0.02em;
  line-height: 1.05;
`;

const Location = styled.p`
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 14px;
`;

const Foot = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.brightLine};
`;

const Price = styled.p`
  color: ${({ theme }) => theme.colors.brightInk};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.typography.weights.regular};
  font-variant-numeric: tabular-nums;
`;

const Units = styled.p`
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 13px;
`;

type BrightProjectCardProps = {
  project: Project;
};

export function BrightProjectCard({ project }: BrightProjectCardProps) {
  const { locale, t } = useLanguage();
  const available =
    project.inventory?.filter((unit) => unit.status === 'available').length ?? 0;
  const isSold = project.status === 'sold' || project.price.toLowerCase().includes('sold');
  const price = isSold
    ? t.common.sold
    : formatProjectPrice(project.price, locale, {
        from: t.common.from,
        sold: t.common.sold,
      });

  return (
    <CardLink className="hoverable" to={`/projekty/${project.slug}`}>
      <Media>
        <Image alt={project.name} decoding="async" loading="lazy" src={project.image} />
      </Media>
      <Body>
        <Meta>{t.status[project.status]}</Meta>
        <Name>{project.name}</Name>
        <Location>{project.location}</Location>
        <Foot>
          <Price>
            {price}
            {locale === 'cs' && !isSold ? ' Kč' : ''}
          </Price>
          <Units>
            {available > 0
              ? `${available} ${t.projects.availableUnits}`
              : `${project.units} ${t.common.units}`}
          </Units>
        </Foot>
      </Body>
    </CardLink>
  );
}
