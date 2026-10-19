import { useEffect, useState } from 'react';
import { ListingCatalog } from '../components/listings/ListingCatalog';
import { loadRentListings, type Listing } from '../data/listings';
import { useLanguage } from '../i18n/LanguageContext';
import { PageMeta } from '../seo/PageMeta';

export default function RentPage() {
  const { locale, t } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadRentListings().then((next) => {
      if (!cancelled) setListings(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageMeta
        description={t.meta.rentDescription}
        lang={locale}
        path="/pronajem"
        title={t.meta.rentTitle}
      />
      <ListingCatalog
        basePath="/pronajem"
        countLabel={t.listings.countRent}
        lead={t.listings.rentLead}
        listings={listings}
        title={t.listings.rentTitle}
      />
    </>
  );
}
