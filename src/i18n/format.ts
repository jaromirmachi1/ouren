import type { Locale } from './types';

export function formatProjectPrice(price: string, locale: Locale, labels: { from: string; sold: string }) {
  if (price.toLowerCase() === 'sold') {
    return labels.sold;
  }

  if (price.startsWith('From ')) {
    return `${labels.from} ${price.slice(5)}`;
  }

  if (price.startsWith('Od ')) {
    return locale === 'en' ? `From ${price.slice(3)}` : price;
  }

  if (/^[\d\s]+$/.test(price.trim())) {
    return `${labels.from} ${price.trim()}`;
  }

  return price;
}

export function formatProjectMeta(
  price: string,
  units: number,
  year: number,
  locale: Locale,
  labels: { from: string; sold: string; units: string },
) {
  const formattedPrice = formatProjectPrice(price, locale, labels);

  if (price.toLowerCase() === 'sold' || price === 'Prodáno') {
    return formattedPrice;
  }

  const separator = locale === 'cs' ? ' · ' : ' · ';
  return `${formattedPrice}${separator}${units} ${labels.units}${separator}${year}`;
}

export function formatReadTime(minutes: number, locale: Locale) {
  if (locale === 'cs') {
    return `${minutes} min čtení`;
  }

  return `${minutes} min read`;
}

export function formatDate(date: string, locale: Locale) {
  return new Date(date).toLocaleDateString(locale === 'cs' ? 'cs-CZ' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
