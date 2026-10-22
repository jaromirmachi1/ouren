import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import { ListingCard } from './ListingCard';
import { FaqSection } from '../seo/FaqSection';
import type { Listing } from '../../data/listings';
import type { FaqBlock } from '../../i18n/types';

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
  max-width: 14ch;
  font-size: clamp(48px, 8vw, 96px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  letter-spacing: -0.03em;
  line-height: 0.92;
`;

const Lead = styled.p`
  max-width: 44ch;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: clamp(16px, 1.8vw, 19px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  line-height: 1.55;
`;

const Count = styled.p`
  margin-top: 18px;
  color: ${({ theme }) => theme.colors.navy};
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const Grid = styled.section`
  display: grid;
  gap: clamp(18px, 2vw, 24px);
  padding: 0 ${({ theme }) => theme.spacing.pageX} clamp(72px, 10vw, 120px);

  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Empty = styled.p`
  max-width: 42ch;
  padding: 0 ${({ theme }) => theme.spacing.pageX} clamp(72px, 10vw, 120px);
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: clamp(16px, 1.7vw, 18px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  line-height: 1.55;
`;

type ListingCatalogProps = {
  title: string;
  lead?: string;
  countLabel?: string;
  listings: Listing[];
  basePath: '/prodej' | '/pronajem';
  faq?: FaqBlock;
};

const STATUS_ORDER: Record<Listing['status'], number> = {
  available: 0,
  reserved: 1,
  rented: 2,
  sold: 3,
};

function sortListings(listings: Listing[]) {
  return [...listings].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
}

export function ListingCatalog({
  title,
  lead,
  countLabel,
  listings,
  basePath,
  faq,
}: ListingCatalogProps) {
  const { t } = useLanguage();
  const ordered = sortListings(listings);

  return (
    <Page>
      <Hero>
        <Title>{title}</Title>
        {lead ? <Lead>{lead}</Lead> : null}
        {countLabel ? (
          <Count>
            {ordered.length} {countLabel}
          </Count>
        ) : null}
      </Hero>
      {ordered.length === 0 ? (
        <Empty>{t.listings.empty}</Empty>
      ) : (
        <Grid>
          {ordered.map((listing) => (
            <ListingCard basePath={basePath} key={listing.id} listing={listing} />
          ))}
        </Grid>
      )}
      {faq ? (
        <FaqSection id={basePath === '/prodej' ? 'sale-faq' : 'rent-faq'} items={faq.items} title={faq.title} />
      ) : null}
    </Page>
  );
}
