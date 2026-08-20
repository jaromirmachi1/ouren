import type { Translations } from './types';

export const en: Translations = {
  meta: {
    homeTitle: 'Ouren Real Estate | We build. We place. We elevate.',
    homeDescription:
      'Ouren is a Czech-based international real estate developer and brokerage for premium residential and commercial properties.',
    blogTitle: 'Journal | Ouren Real Estate',
    blogDescription:
      'Editorial insights on luxury real estate, design, investment, and market intelligence from Ouren.',
    siteName: 'Ouren Real Estate',
  },
  common: {
    loading: 'Loading',
    readMore: 'Read more',
    backToJournal: 'Back to journal',
    minRead: 'min read',
    units: 'units',
    from: 'From',
    sold: 'Sold',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    homeLabel: 'Ouren home',
  },
  lang: {
    switchToEnglish: 'English',
    switchToCzech: 'Čeština',
    current: 'EN',
  },
  nav: {
    projects: 'projects',
    sold: 'sold',
    about: 'about',
    sellWithUs: 'sell with us',
    journal: 'journal',
    contact: 'contact',
  },
  hero: {
    lines: ['We build.', 'We place.', 'We elevate.'],
    subline: 'Czech Republic — International',
  },
  propertyMenu: {
    eyebrow: 'Browse by type',
    types: {
      flats: 'Flats',
      houses: 'Houses',
      commercial: 'Commercial',
      others: 'Others',
    },
  },
  projects: {
    title: 'Current projects',
  },
  sold: {
    title: 'Completed',
    counterLabel: 'properties sold',
  },
  sell: {
    headline: 'List your property with us',
    fields: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      propertyType: 'Property type',
      estimatedValue: 'Estimated value',
      message: 'Message',
    },
    propertyTypes: {
      apartment: 'Apartment',
      house: 'House',
      land: 'Land',
      commercial: 'Commercial',
    },
    submit: 'Submit inquiry',
    success: 'Thank you. Our team will contact you shortly.',
    validation: {
      name: 'Name is required',
      email: 'Enter a valid email',
      phone: 'Phone is required',
      estimatedValue: 'Estimated value is required',
      message: 'Please add a short message',
    },
  },
  about: {
    eyebrow: 'About Ouren',
    headline: 'Built on precision. Driven by vision.',
    body1:
      'Ouren is an international real estate firm rooted in the Czech Republic, shaping residential and commercial environments with editorial clarity and long-term value.',
    body2:
      'From development strategy to placement, we guide every stage with discretion, precision, and a design-led sensibility that elevates each property we represent.',
    imageAlt: 'Ouren team in a modern architectural office',
    stats: {
      activeProjects: 'active projects',
      propertiesSold: 'properties sold',
    },
  },
  contact: {
    eyebrow: 'Contact',
    headline: 'Begin the conversation.',
    copy:
      'For acquisitions, private listings, and development partnerships across Czech Republic and international markets.',
    locations: 'Prague · Brno · International',
  },
  footer: {
    navigation: 'Navigation',
    contact: 'Contact',
    portal: 'Ouren Portal',
    copyright: '© 2025 Ouren Real Estate',
  },
  portal: {
    metaTitle: 'Ouren Portal',
    metaDescription: 'Ouren internal portal.',
    title: 'Portal is not on this site',
    copy:
      'ouren.vercel.app only hosts the marketing site. The internal portal is a separate Next.js app — deploy the dashboard/ folder on Vercel, then set VITE_PORTAL_URL.',
    redirecting: 'Redirecting to the portal…',
    backHome: 'Back to home',
  },
  blog: {
    eyebrow: 'Journal',
    title: 'Insights on place, design, and value.',
    lead:
      'Perspectives from our team on markets, architecture, and the craft of placing exceptional properties.',
    categories: {
      market: 'Market',
      design: 'Design',
      investment: 'Investment',
      lifestyle: 'Lifestyle',
    },
  },
  status: {
    available: 'Available',
    reserved: 'Reserved',
    sold: 'Sold',
    inProgress: 'In progress',
  },
};
