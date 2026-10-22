import { absoluteUrl, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from './site';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: SITE_NAME,
    alternateName: 'Ouren',
    url: SITE_URL,
    logo: absoluteUrl(DEFAULT_OG_IMAGE),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    email: 'info@ouren.cz',
    telephone: '+420722033055',
    legalName: 'SD GROUP PROSPERITY s.r.o.',
    identifier: '21369178',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Radnická 376/11',
      addressLocality: 'Brno',
      postalCode: '602 00',
      addressCountry: 'CZ',
    },
    description: DEFAULT_DESCRIPTION,
    areaServed: [
      { '@type': 'Country', name: 'Czech Republic' },
      { '@type': 'Place', name: 'International' },
    ],
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ['cs', 'en'],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

type BlogPostingInput = {
  title: string;
  description: string;
  path: string;
  image: string;
  publishedAt: string;
  author: string;
};

export function faqPageJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function blogPostingJsonLd({
  title,
  description,
  path,
  image,
  publishedAt,
  author,
}: BlogPostingInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: absoluteUrl(image),
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(DEFAULT_OG_IMAGE),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(path),
    },
    url: absoluteUrl(path),
  };
}
