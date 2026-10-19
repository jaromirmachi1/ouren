import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Footer } from '../layout/Footer';
import type { Listing } from '../../data/listings';
import { useLanguage } from '../../i18n/LanguageContext';

const navClear = 'clamp(128px, 15vh, 156px)';

const Page = styled.main`
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.brightBg};
  color: ${({ theme }) => theme.colors.brightInk};
`;

const Stage = styled.article`
  display: grid;
  align-items: start;
  padding-top: ${navClear};

  @media (min-width: 980px) {
    grid-template-columns: minmax(320px, 440px) minmax(0, 1fr);
    column-gap: clamp(28px, 4vw, 72px);
    padding-left: ${({ theme }) => theme.spacing.pageX};
  }
`;

const Copy = styled.div`
  display: grid;
  align-content: start;
  gap: clamp(22px, 3vh, 32px);
  padding: 4px ${({ theme }) => theme.spacing.pageX} 36px;

  @media (min-width: 980px) {
    position: sticky;
    top: ${navClear};
    display: flex;
    flex-direction: column;
    gap: 22px;
    height: calc(100dvh - ${navClear});
    max-height: calc(100dvh - ${navClear});
    padding: 4px 0 28px;
  }
`;

const CopyScroll = styled.div`
  display: grid;
  gap: clamp(22px, 3vh, 32px);

  @media (min-width: 980px) {
    flex: 1 1 auto;
    min-height: 0;
    gap: 20px;
    overflow: auto;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: rgba(5, 6, 15, 0.28) transparent;
  }
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
  gap: 12px;
`;

const Title = styled.h1`
  font-size: clamp(34px, 3.2vw, 52px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  letter-spacing: -0.03em;
  line-height: 0.98;
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
  gap: 20px 24px;
  margin: 0;
  padding-top: 4px;
  border-top: 1px solid ${({ theme }) => theme.colors.brightLine};
`;

const Fact = styled.div`
  display: grid;
  gap: 8px;
  padding-top: 16px;

  dt {
    color: rgba(5, 6, 15, 0.78);
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  dd {
    font-size: clamp(18px, 1.5vw, 22px);
    font-weight: ${({ theme }) => theme.typography.weights.light};
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
`;

const Story = styled.div`
  display: grid;
  gap: 24px;
  justify-items: start;
`;

const Description = styled.p`
  font-size: 17px;
  font-weight: ${({ theme }) => theme.typography.weights.light};
  line-height: 1.7;
  text-wrap: pretty;
`;

const Inquire = styled(Link)`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: 48px;
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

const Reel = styled.div`
  display: grid;
  gap: 10px;

  @media (max-width: 979px) {
    margin-top: 8px;
  }
`;

const Shot = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  background: ${({ theme }) => theme.colors.brightSurface};
`;

const BrightFooter = styled.div`
  footer {
    background: ${({ theme }) => theme.colors.brightBg};
    color: ${({ theme }) => theme.colors.brightInk};
  }

  footer a,
  footer button {
    color: ${({ theme }) => theme.colors.brightInk};
  }

  footer p {
    color: ${({ theme }) => theme.colors.brightMuted};
  }
`;

function formatPrice(value: number, offer: Listing['offer'], locale: string, onRequest: string) {
  if (!value) return onRequest;
  const formatted = new Intl.NumberFormat(locale === 'cs' ? 'cs-CZ' : 'en-GB').format(value);
  if (offer === 'rent') {
    return locale === 'cs' ? `${formatted} Kč / měsíc` : `${formatted} CZK / month`;
  }
  return locale === 'cs' ? `${formatted} Kč` : `${formatted} CZK`;
}

function uniquePhotos(image: string, gallery?: string[]) {
  const frames = [image, ...(gallery ?? [])].filter(
    (url, index, all) => Boolean(url) && all.indexOf(url) === index,
  );
  const real = frames.filter((url) => !url.includes('images.unsplash.com'));
  return real.length ? real : frames;
}

type ListingDetailProps = {
  listing: Listing;
  backTo: '/prodej' | '/pronajem';
  backLabel: string;
};

export function ListingDetail({ listing, backTo, backLabel }: ListingDetailProps) {
  const { locale, t } = useLanguage();
  const description = listing.description[locale] ?? listing.description.cs;
  const price = formatPrice(listing.price, listing.offer, locale, t.listings.priceOnRequest);
  const photos = uniquePhotos(listing.image, listing.gallery);
  const localeTag = locale === 'cs' ? 'cs-CZ' : 'en-GB';
  const area = listing.area ? `${listing.area.toLocaleString(localeTag)} m²` : '—';
  const land =
    listing.landArea && listing.landArea > 0
      ? `${listing.landArea.toLocaleString(localeTag)} m²`
      : null;

  return (
    <Page>
      <Stage>
        <Copy>
          <CopyScroll>
            <BackLink className="hoverable" to={backTo}>
              ← {backLabel}
            </BackLink>
            <Header>
              <Title>{listing.title}</Title>
              <Location>{listing.location}</Location>
            </Header>
            <Facts>
              <Fact>
                <dt>{t.listings.specs.status}</dt>
                <dd>{t.status[listing.status]}</dd>
              </Fact>
              <Fact>
                <dt>{t.listings.specs.layout}</dt>
                <dd>{listing.layout || t.listings.kinds[listing.type]}</dd>
              </Fact>
              <Fact>
                <dt>
                  {listing.type === 'land' ? t.listings.specs.landArea : t.listings.specs.area}
                </dt>
                <dd>{area}</dd>
              </Fact>
              {land ? (
                <Fact>
                  <dt>{t.listings.specs.landArea}</dt>
                  <dd>{land}</dd>
                </Fact>
              ) : null}
              <Fact>
                <dt>{t.listings.specs.price}</dt>
                <dd>{price}</dd>
              </Fact>
            </Facts>
            {description ? (
              <Story>
                <Description>{description}</Description>
              </Story>
            ) : null}
          </CopyScroll>
          <Inquire className="hoverable" to="/#contact">
            {t.common.inquire}
          </Inquire>
        </Copy>
        <Reel>
          {photos.map((url, index) => (
            <Shot
              alt={index === 0 ? listing.title : ''}
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'low'}
              key={url}
              loading={index === 0 ? 'eager' : 'lazy'}
              src={url}
            />
          ))}
        </Reel>
      </Stage>
      <BrightFooter>
        <Footer />
      </BrightFooter>
    </Page>
  );
}
