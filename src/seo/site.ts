/** Canonical marketing site origin for SEO absolute URLs. */
export const SITE_URL = 'https://ouren.cz';

export const SITE_NAME = 'Ouren Real Estate';

export const DEFAULT_OG_IMAGE = '/og-image.jpg';

export const DEFAULT_DESCRIPTION =
  'Ouren is a Brno-based real estate developer and brokerage for premium residential and commercial properties across the Czech Republic.';

export function absoluteUrl(path = '/') {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
