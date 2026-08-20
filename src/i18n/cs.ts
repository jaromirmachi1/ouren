import type { Translations } from './types';

export const cs: Translations = {
  meta: {
    homeTitle: 'Ouren Real Estate | Stavíme. Umísťujeme. Povyšujeme.',
    homeDescription:
      'Ouren je mezinárodní developerská a realitní společnost se sídlem v České republice pro prémiové rezidenční a komerční nemovitosti.',
    blogTitle: 'Journal | Ouren Real Estate',
    blogDescription:
      'Editorialní pohledy na luxusní reality, design, investice a tržní analýzy od Ouren.',
    siteName: 'Ouren Real Estate',
  },
  common: {
    loading: 'Načítání',
    readMore: 'Číst více',
    backToJournal: 'Zpět do journalu',
    minRead: 'min čtení',
    units: 'jednotek',
    from: 'Od',
    sold: 'Prodáno',
    openMenu: 'Otevřít menu',
    closeMenu: 'Zavřít menu',
    homeLabel: 'Ouren — domů',
  },
  lang: {
    switchToEnglish: 'English',
    switchToCzech: 'Čeština',
    current: 'CZ',
  },
  nav: {
    projects: 'projekty',
    sold: 'prodáno',
    about: 'o nás',
    sellWithUs: 'prodat s námi',
    journal: 'journal',
    contact: 'kontakt',
  },
  hero: {
    lines: ['Stavíme.', 'Umísťujeme.', 'Povyšujeme.'],
    subline: 'Česká republika — Mezinárodně',
  },
  propertyMenu: {
    eyebrow: 'Procházet podle typu',
    types: {
      flats: 'Byty',
      houses: 'Domy',
      commercial: 'Komerční',
      others: 'Ostatní',
    },
  },
  projects: {
    title: 'Aktuální projekty',
  },
  sold: {
    title: 'Dokončené',
    counterLabel: 'prodaných nemovitostí',
  },
  sell: {
    headline: 'Nabídněte nemovitost s námi',
    fields: {
      name: 'Jméno',
      email: 'E-mail',
      phone: 'Telefon',
      propertyType: 'Typ nemovitosti',
      estimatedValue: 'Odhadovaná hodnota',
      message: 'Zpráva',
    },
    propertyTypes: {
      apartment: 'Byt',
      house: 'Dům',
      land: 'Pozemek',
      commercial: 'Komerční',
    },
    submit: 'Odeslat poptávku',
    success: 'Děkujeme. Náš tým vás bude brzy kontaktovat.',
    validation: {
      name: 'Zadejte jméno',
      email: 'Zadejte platný e-mail',
      phone: 'Zadejte telefon',
      estimatedValue: 'Zadejte odhadovanou hodnotu',
      message: 'Napište krátkou zprávu',
    },
  },
  about: {
    eyebrow: 'O Ouren',
    headline: 'Postaveno na preciznosti. Řízeno vizí.',
    body1:
      'Ouren je mezinárodní realitní firma s kořeny v České republice, která formuje rezidenční i komerční prostředí s editorialní jasností a dlouhodobou hodnotou.',
    body2:
      'Od developerské strategie po umístění projektů provázíme každou fázi s diskrétností, precizností a designovým citem, který povyšuje každou nemovitost, kterou zastupujeme.',
    imageAlt: 'Tým Ouren v moderní architektonické kanceláři',
    stats: {
      activeProjects: 'aktivních projektů',
      propertiesSold: 'prodaných nemovitostí',
    },
  },
  contact: {
    eyebrow: 'Kontakt',
    headline: 'Začněme rozhovor.',
    copy:
      'Pro akvizice, privátní nabídky a developerská partnerství v České republice i na mezinárodních trzích.',
    locations: 'Praha · Brno · Mezinárodně',
  },
  footer: {
    navigation: 'Navigace',
    contact: 'Kontakt',
    portal: 'Ouren Portál',
    copyright: '© 2025 Ouren Real Estate',
  },
  portal: {
    metaTitle: 'Ouren Portál',
    metaDescription: 'Interní portál Ouren.',
    title: 'Portál zde není nasazen',
    copy:
      'Portál je samostatná aplikace (složka dashboard/). V Vercel vytvořte druhý projekt s Root Directory dashboard, nasaďte ho, pak na marketing projektu nastavte VITE_PORTAL_URL na URL portálu (např. https://ouren-portal.vercel.app/admin) a spusťte Redeploy.',
    redirecting: 'Přesměrování do portálu…',
    backHome: 'Zpět na úvod',
  },
  blog: {
    eyebrow: 'Journal',
    title: 'Pohledy na místo, design a hodnotu.',
    lead:
      'Perspektivy našich expertů na trhy, architekturu a umění umístit výjimečné nemovitosti.',
    categories: {
      market: 'Trh',
      design: 'Design',
      investment: 'Investice',
      lifestyle: 'Životní styl',
    },
  },
  status: {
    available: 'Volné',
    reserved: 'Rezervováno',
    sold: 'Prodáno',
    inProgress: 'V přípravě',
  },
};
