import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import type { Listing } from '../../data/listings';

const CardLink = styled(Link)<{ $closed?: boolean }>`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  color: inherit;
  background: ${({ theme, $closed }) =>
    $closed ? theme.colors.brightBg : theme.colors.brightSurface};
  border: 1px solid
    ${({ theme, $closed }) => ($closed ? 'rgba(0, 10, 103, 0.16)' : theme.colors.brightLine)};
  transition:
    transform 180ms cubic-bezier(0.23, 1, 0.32, 1),
    border-color 180ms cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    border-color: rgba(0, 10, 103, 0.28);
  }

  &:hover img {
    transform: ${({ $closed }) => ($closed ? 'scale(1.015)' : 'scale(1.03)')};
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

const Image = styled.img<{ $closed?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  filter: ${({ $closed }) =>
    $closed ? 'grayscale(0.35) contrast(1.04) brightness(0.88)' : 'none'};
  transition:
    transform 420ms cubic-bezier(0.23, 1, 0.32, 1),
    filter 280ms cubic-bezier(0.23, 1, 0.32, 1);
`;

const Veil = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(5, 6, 15, 0.08) 0%, transparent 38%),
    linear-gradient(0deg, rgba(5, 6, 15, 0.55) 0%, transparent 52%);
  pointer-events: none;
`;

const SoldMark = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: grid;
  place-items: center;
  pointer-events: none;
`;

const SoldCartouche = styled.p`
  display: grid;
  gap: 10px;
  justify-items: center;
  margin: 0;
  padding: 14px 22px;
  border: 1px solid rgba(245, 245, 240, 0.72);
  background: rgba(5, 6, 15, 0.28);
  backdrop-filter: blur(6px);
  color: ${({ theme }) => theme.colors.white};
  font-size: clamp(13px, 1.5vw, 15px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: 0.32em;
  line-height: 1;
  text-indent: 0.32em;
  text-transform: uppercase;

  &::before,
  &::after {
    content: '';
    width: 28px;
    height: 1px;
    background: rgba(245, 245, 240, 0.7);
  }
`;

const Body = styled.div`
  display: grid;
  gap: 8px;
  align-content: start;
  padding: 22px 22px 26px;
`;

const Meta = styled.p<{ $closed?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme, $closed }) => ($closed ? theme.colors.navy : theme.colors.navy)};
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  &::before {
    content: '';
    width: ${({ $closed }) => ($closed ? '18px' : '0')};
    height: 1px;
    background: ${({ theme }) => theme.colors.navy};
    transition: width 180ms cubic-bezier(0.23, 1, 0.32, 1);
  }
`;

const Name = styled.h2<{ $closed?: boolean }>`
  color: ${({ theme }) => theme.colors.brightInk};
  font-size: clamp(20px, 2.2vw, 26px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: -0.02em;
  line-height: 1.08;
  opacity: ${({ $closed }) => ($closed ? 0.78 : 1)};
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

const Price = styled.p<{ $closed?: boolean }>`
  color: ${({ theme, $closed }) => ($closed ? theme.colors.navy : theme.colors.brightInk)};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: ${({ $closed }) => ($closed ? '0.18em' : 'normal')};
  text-indent: ${({ $closed }) => ($closed ? '0.18em' : '0')};
  text-transform: ${({ $closed }) => ($closed ? 'uppercase' : 'none')};
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

function isClosedStatus(status: Listing['status']) {
  return status === 'sold' || status === 'rented';
}

type ListingCardProps = {
  listing: Listing;
  basePath: '/prodej' | '/pronajem';
};

export function ListingCard({ listing, basePath }: ListingCardProps) {
  const { locale, t } = useLanguage();
  const closed = isClosedStatus(listing.status);
  const statusLabel = t.status[listing.status];

  return (
    <CardLink $closed={closed} className="hoverable" to={`${basePath}/${listing.slug}`}>
      <Media>
        <Image
          $closed={closed}
          alt={listing.title}
          decoding="async"
          loading="lazy"
          src={listing.image}
        />
        {closed ? (
          <>
            <Veil aria-hidden="true" />
            <SoldMark>
              <SoldCartouche>{statusLabel}</SoldCartouche>
            </SoldMark>
          </>
        ) : null}
      </Media>
      <Body>
        <Meta $closed={closed}>{statusLabel}</Meta>
        <Name $closed={closed}>{listing.title}</Name>
        <Location>{listing.location}</Location>
        <Foot>
          <Price $closed={closed}>
            {closed
              ? statusLabel
              : formatPrice(listing.price, listing.offer, locale, t.listings.priceOnRequest)}
          </Price>
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
