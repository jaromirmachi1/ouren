import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ListingDetail } from '../components/listings/ListingDetail';
import { getSaleListing, type Listing } from '../data/listings';
import { useLanguage } from '../i18n/LanguageContext';
import { PageMeta } from '../seo/PageMeta';

export default function SaleDetailPage() {
  const { locale, t } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const [listing, setListing] = useState<Listing | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) {
      setListing(null);
      return;
    }
    let cancelled = false;
    getSaleListing(slug).then((next) => {
      if (!cancelled) setListing(next ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (listing === undefined) return null;
  if (!listing) return <Navigate replace to="/prodej" />;

  const description = listing.description[locale] ?? listing.description.cs;

  return (
    <>
      <PageMeta
        description={description}
        image={listing.image}
        lang={locale}
        path={`/prodej/${listing.slug}`}
        title={`${listing.title} | Ouren`}
      />
      <ListingDetail
        backLabel={t.listings.backToSale}
        backTo="/prodej"
        listing={listing}
      />
    </>
  );
}
