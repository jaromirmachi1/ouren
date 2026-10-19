import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import type { Listing } from '../../data/listings';

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
  gap: 8px;
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
  font-size: clamp(20px, 2.2vw, 26px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: -0.02em;
  line-height: 1.08;
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
  margin-top: 10px;
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.brightLine};
`;

const Price = styled.p`
  color: ${({ theme }) => theme.colors.brightInk};
  font-size: 15px;
  font-variant-numeric: tabular-nums;
`;

const Specs = styled.p`
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: 13px;
`;

function formatPrice(value: number, offer: Listing['offer'], locale: string, onRequest: string) {
  if (!value) return onRequest;
  const formatted = new Intl.NumberFormat(locale === 'cs' ? 'cs-CZ' : 'en-GB').format(value);
  if (offer === 'rent') {
    return locale === 'cs' ? `${formatted} Kč / měs.` : `${formatted} CZK / mo`;
  }
  return locale === 'cs' ? `${formatted} Kč` : `${formatted} CZK`;
}

type ListingCardProps = {
  listing: Listing;
  basePath: '/prodej' | '/pronajem';
};

export function ListingCard({ listing, basePath }: ListingCardProps) {
  const { locale, t } = useLanguage();

  return (
    <CardLink className="hoverable" to={`${basePath}/${listing.slug}`}>
      <Media>
        <Image alt={listing.title} decoding="async" loading="lazy" src={listing.image} />
      </Media>
      <Body>
        <Meta>{t.status[listing.status]}</Meta>
        <Name>{listing.title}</Name>
        <Location>{listing.location}</Location>
        <Foot>
          <Price>{formatPrice(listing.price, listing.offer, locale, t.listings.priceOnRequest)}</Price>
          <Specs>
            {listing.layout || t.listings.kinds[listing.type]}
            {listing.area
              ? ` · ${listing.area} m²${
                  listing.type === 'land' ? ` ${t.listings.specs.landArea.toLowerCase()}` : ''
                }`
              : ''}
            {listing.landArea
              ? ` · ${listing.landArea} m² ${t.listings.specs.landArea.toLowerCase()}`
              : ''}
          </Specs>
        </Foot>
      </Body>
    </CardLink>
  );
}
