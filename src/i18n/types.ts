export type Locale = 'cs' | 'en';

export type NavKey =
  | 'sale'
  | 'rent'
  | 'weBuy'
  | 'projects'
  | 'sold'
  | 'about'
  | 'journal'
  | 'contact';

export type PropertyTypeKey = 'flats' | 'houses' | 'commercial' | 'others';

export type BlogCategoryKey = 'market' | 'design' | 'investment' | 'lifestyle';

export type ProjectStatusKey = 'available' | 'reserved' | 'sold' | 'inProgress' | 'rented';

export type Translations = {
  meta: {
    homeTitle: string;
    homeDescription: string;
    blogTitle: string;
    blogDescription: string;
    projectsTitle: string;
    projectsDescription: string;
    saleTitle: string;
    saleDescription: string;
    rentTitle: string;
    rentDescription: string;
    weBuyTitle: string;
    weBuyDescription: string;
    siteName: string;
  };
  common: {
    loading: string;
    readMore: string;
    backToJournal: string;
    backToProjects: string;
    minRead: string;
    units: string;
    from: string;
    sold: string;
    openMenu: string;
    closeMenu: string;
    homeLabel: string;
    viewProject: string;
    inquire: string;
  };
  lang: {
    switchToEnglish: string;
    switchToCzech: string;
    current: string;
  };
  nav: Record<NavKey, string>;
  hero: {
    brand: string;
    headline: string;
    support: string;
    cta: string;
  };
  propertyMenu: {
    title: string;
    types: Record<PropertyTypeKey, string>;
  };
  projects: {
    title: string;
    pageTitle: string;
    pageLead: string;
    allProjects: string;
    availableUnits: string;
    inventoryTitle: string;
    filterAll: string;
    filterAvailable: string;
    filterReserved: string;
    filterSold: string;
    filterRented: string;
    table: {
      unit: string;
      floor: string;
      layout: string;
      area: string;
      terrace: string;
      price: string;
      status: string;
    };
    noUnits: string;
    externalSite: string;
  };
  listings: {
    saleTitle: string;
    saleLead: string;
    rentTitle: string;
    rentLead: string;
    weBuyTitle: string;
    weBuyLead: string;
    countSale: string;
    countRent: string;
    backToSale: string;
    backToRent: string;
    empty: string;
    priceOnRequest: string;
    galleryPrev: string;
    galleryNext: string;
    specs: {
      status: string;
      layout: string;
      area: string;
      landArea: string;
      price: string;
      year: string;
    };
    kinds: {
      apartment: string;
      house: string;
      land: string;
      commercial: string;
    };
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
  weBuyPage: {
    title: string;
    lead: string;
    ctaBuy: string;
    ctaList: string;
    pathsTitle: string;
    pathsLead: string;
    buyPath: {
      title: string;
      summary: string;
      points: [string, string, string, string];
    };
    listPath: {
      title: string;
      summary: string;
      points: [string, string, string, string];
    };
    fitsTitle: string;
    fitsBuy: { title: string; items: [string, string, string] };
    fitsList: { title: string; items: [string, string, string] };
    stepsTitle: string;
    steps: [{ title: string; body: string }, { title: string; body: string }, { title: string; body: string }, { title: string; body: string }];
    proofTitle: string;
    proofLead: string;
    proofItems: [{ value: string; label: string }, { value: string; label: string }, { value: string; label: string }];
    formTitle: string;
    formLead: string;
    formNote: string;
    intents: {
      buy: string;
      list: string;
      unsure: string;
    };
    fields: {
      intent: string;
      location: string;
      phone: string;
      name: string;
      propertyType: string;
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
      location: string;
      phone: string;
      name: string;
    };
    faqTitle: string;
    faq: [{ q: string; a: string }, { q: string; a: string }, { q: string; a: string }, { q: string; a: string }];
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
    portal: string;
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
