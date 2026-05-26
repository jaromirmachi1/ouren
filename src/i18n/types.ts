export type Locale = 'cs' | 'en';

export type NavKey =
  | 'projects'
  | 'sold'
  | 'about'
  | 'sellWithUs'
  | 'journal'
  | 'contact';

export type PropertyTypeKey = 'flats' | 'houses' | 'commercial' | 'others';

export type BlogCategoryKey = 'market' | 'design' | 'investment' | 'lifestyle';

export type ProjectStatusKey = 'available' | 'reserved' | 'sold' | 'inProgress';

export type Translations = {
  meta: {
    homeTitle: string;
    homeDescription: string;
    blogTitle: string;
    blogDescription: string;
    siteName: string;
  };
  common: {
    loading: string;
    readMore: string;
    backToJournal: string;
    minRead: string;
    units: string;
    from: string;
    sold: string;
    openMenu: string;
    closeMenu: string;
    homeLabel: string;
  };
  lang: {
    switchToEnglish: string;
    switchToCzech: string;
    current: string;
  };
  nav: Record<NavKey, string>;
  hero: {
    lines: [string, string, string];
    subline: string;
  };
  propertyMenu: {
    eyebrow: string;
    types: Record<PropertyTypeKey, string>;
  };
  projects: {
    title: string;
  };
  sold: {
    title: string;
    counterLabel: string;
  };
  sell: {
    headline: string;
    fields: {
      name: string;
      email: string;
      phone: string;
      propertyType: string;
      estimatedValue: string;
      message: string;
    };
    propertyTypes: {
      apartment: string;
      house: string;
      land: string;
      commercial: string;
    };
    submit: string;
    success: string;
    validation: {
      name: string;
      email: string;
      phone: string;
      estimatedValue: string;
      message: string;
    };
  };
  about: {
    eyebrow: string;
    headline: string;
    body1: string;
    body2: string;
    imageAlt: string;
    stats: {
      activeProjects: string;
      propertiesSold: string;
    };
  };
  contact: {
    eyebrow: string;
    headline: string;
    copy: string;
    locations: string;
  };
  footer: {
    navigation: string;
    contact: string;
    copyright: string;
  };
  blog: {
    eyebrow: string;
    title: string;
    lead: string;
    categories: Record<BlogCategoryKey, string>;
  };
  status: Record<ProjectStatusKey, string>;
};
