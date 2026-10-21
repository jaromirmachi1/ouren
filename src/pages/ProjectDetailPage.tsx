import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PropertyGallery } from '../components/listings/PropertyGallery';
import { UnitInventory } from '../components/projects/UnitInventory';
import { loadProjectBySlug } from '../data/projects-source';
import { useLanguage } from '../i18n/LanguageContext';
import { formatProjectPrice } from '../i18n/format';
import { PageMeta } from '../seo/PageMeta';
import type { Project } from '../types';

const Page = styled.main`
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.brightBg};
  color: ${({ theme }) => theme.colors.brightInk};
`;

const Frame = styled.article`
  display: grid;
  gap: clamp(28px, 4vw, 44px);
  padding: clamp(128px, 16vh, 156px) ${({ theme }) => theme.spacing.pageX} 0;
`;

const BackLink = styled(Link)`
  width: fit-content;
  color: ${({ theme }) => theme.colors.navy};
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: opacity 180ms cubic-bezier(0.23, 1, 0.32, 1);

  &:hover,
  &:focus-visible {
    opacity: 0.65;
    outline: none;
  }
`;

const Header = styled.header`
  display: grid;
  gap: 14px;
`;

const Title = styled.h1`
  max-width: 14em;
  font-size: clamp(40px, 5vw, 72px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  letter-spacing: -0.03em;
  line-height: 0.96;
  text-wrap: balance;
`;

const Location = styled.p`
  color: rgba(5, 6, 15, 0.78);
  font-size: 13px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const Facts = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px 32px;
  margin: 0;
  padding-top: 4px;
  border-top: 1px solid ${({ theme }) => theme.colors.brightLine};

  @media (min-width: 900px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const Fact = styled.div`
  display: grid;
  gap: 8px;
  padding-top: 18px;

  dt {
    color: rgba(5, 6, 15, 0.78);
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  dd {
    font-size: clamp(18px, 1.6vw, 22px);
    font-weight: ${({ theme }) => theme.typography.weights.light};
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
`;

const Story = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px 28px;
  align-items: end;
  justify-content: space-between;
`;

const Description = styled.p`
  max-width: 62ch;
  font-size: clamp(17px, 1.5vw, 19px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  line-height: 1.7;
  text-wrap: pretty;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const PrimaryLink = styled.a`
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 22px;
  background: ${({ theme }) => theme.colors.navy};
  color: ${({ theme }) => theme.colors.white};
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition:
    transform 140ms cubic-bezier(0.23, 1, 0.32, 1),
    background 180ms cubic-bezier(0.23, 1, 0.32, 1);

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.midBlue};
    outline: none;
  }

  &:active {
    transform: scale(0.97);
  }
`;

const SecondaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 22px;
  border: 1px solid ${({ theme }) => theme.colors.brightLine};
  color: ${({ theme }) => theme.colors.brightInk};
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition:
    transform 140ms cubic-bezier(0.23, 1, 0.32, 1),
    border-color 180ms cubic-bezier(0.23, 1, 0.32, 1);

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.navy};
    outline: none;
  }

  &:active {
    transform: scale(0.97);
  }
`;

const InventoryBlock = styled.section`
  display: grid;
  gap: 18px;
  padding: clamp(8px, 2vw, 16px) ${({ theme }) => theme.spacing.pageX} clamp(72px, 10vw, 120px);
`;

const InventoryTitle = styled.h2`
  font-size: clamp(24px, 3vw, 36px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: -0.02em;
`;

export default function ProjectDetailPage() {
  const { locale, t } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) {
      setProject(null);
      return;
    }

    let cancelled = false;
    loadProjectBySlug(slug).then((next) => {
      if (!cancelled) setProject(next ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (project === undefined) return null;
  if (!project) return <Navigate replace to="/projekty" />;

  const price = formatProjectPrice(project.price, locale, {
    from: t.common.from,
    sold: t.common.sold,
  });
  const priceIsSold = project.price.toLowerCase() === 'sold' || project.price === 'Prodáno';
  const available = project.inventory?.filter((unit) => unit.status === 'available').length ?? 0;
  const description =
    project.description?.[locale] ?? project.description?.en ?? project.description?.cs ?? '';
  const photos = [project.image, ...(project.gallery ?? [])];

  return (
    <Page>
      <PageMeta
        description={description || t.meta.projectsDescription}
        image={project.image}
        lang={locale}
        path={`/projekty/${project.slug}`}
        title={`${project.name} | Ouren`}
      />
      <Frame>
        <BackLink className="hoverable" to="/projekty">
          ← {t.common.backToProjects}
        </BackLink>
        <PropertyGallery
          alt={project.name}
          nextLabel={t.listings.galleryNext}
          photos={photos}
          prevLabel={t.listings.galleryPrev}
        />
        <Header>
          <Title>{project.name}</Title>
          <Location>{project.location}</Location>
        </Header>
        <Facts>
          <Fact>
            <dt>{t.listings.specs.status}</dt>
            <dd>{t.status[project.status]}</dd>
          </Fact>
          <Fact>
            <dt>{t.listings.specs.price}</dt>
            <dd>
              {price}
              {locale === 'cs' && !priceIsSold ? ' Kč' : ''}
            </dd>
          </Fact>
          <Fact>
            <dt>{t.projects.table.unit}</dt>
            <dd>
              {available > 0 ? `${available} ${t.projects.availableUnits}` : project.units}
            </dd>
          </Fact>
          {project.areaSqm ? (
            <Fact>
              <dt>{t.listings.specs.area}</dt>
              <dd>
                {project.areaSqm.toLocaleString(locale === 'cs' ? 'cs-CZ' : 'en-GB')} m²
              </dd>
            </Fact>
          ) : null}
          <Fact>
            <dt>{t.listings.specs.year}</dt>
            <dd>{project.year}</dd>
          </Fact>
        </Facts>
        <Story>
          {description ? <Description>{description}</Description> : null}
          <Actions>
            <SecondaryLink className="hoverable" to="/#contact">
              {t.common.inquire}
            </SecondaryLink>
            {project.websiteUrl ? (
              <PrimaryLink
                className="hoverable"
                href={project.websiteUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {t.projects.externalSite}
              </PrimaryLink>
            ) : null}
          </Actions>
        </Story>
      </Frame>
      <InventoryBlock>
        <InventoryTitle>{t.projects.inventoryTitle}</InventoryTitle>
        <UnitInventory units={project.inventory ?? []} />
      </InventoryBlock>
    </Page>
  );
}
