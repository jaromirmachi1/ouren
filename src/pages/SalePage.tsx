import { useEffect, useState } from 'react';
import { ListingCatalog } from '../components/listings/ListingCatalog';
import { loadSaleListings, type Listing } from '../data/listings';
import { useLanguage } from '../i18n/LanguageContext';
import { PageMeta } from '../seo/PageMeta';

export default function SalePage() {
  const { locale, t } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadSaleListings().then((next) => {
      if (!cancelled) setListings(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageMeta
        description={t.meta.saleDescription}
        lang={locale}
        path="/prodej"
        title={t.meta.saleTitle}
      />
      <ListingCatalog
        basePath="/prodej"
        listings={listings}
        title={t.listings.saleTitle}
      />
    </>
  );
}
