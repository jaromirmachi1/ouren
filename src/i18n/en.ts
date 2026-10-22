import type { Translations } from './types';

export const en: Translations = {
  meta: {
    homeTitle: 'Ouren Real Estate | We select. We present. We sell.',
    homeDescription:
      'Ouren is a Brno-based real estate developer and brokerage for premium residential and commercial properties across the Czech Republic.',
    blogTitle: 'Journal | Ouren Real Estate',
    blogDescription:
      'Editorial insights on luxury real estate, design, investment, and market intelligence from Ouren.',
    projectsTitle: 'Residential projects | Ouren',
    projectsDescription:
      'Browse Ouren residential developments and available units across the Czech Republic.',
    saleTitle: 'For sale | Ouren',
    saleDescription: 'Apartments, houses, and commercial properties for sale with Ouren.',
    rentTitle: 'For rent | Ouren',
    rentDescription: 'Apartments, houses, and commercial spaces for rent with Ouren.',
    weBuyTitle: 'Sell with us | Ouren',
    weBuyDescription:
      'Cash buyout or a full listing with Ouren — we assess which path fits, with no obligation.',
    aboutTitle: 'About | Ouren',
    aboutDescription:
      'Ouren selects, presents, and sells premium residential and commercial property. Based in Brno, working across the Czech Republic.',
    siteName: 'Ouren Real Estate',
  },
  common: {
    loading: 'Loading',
    readMore: 'Read more',
    backToJournal: 'Back to journal',
    backToProjects: 'All projects',
    minRead: 'min read',
    units: 'units',
    from: 'From',
    sold: 'Sold',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    homeLabel: 'Ouren home',
    viewProject: 'View project',
    inquire: 'Inquire',
  },
  lang: {
    switchToEnglish: 'English',
    switchToCzech: 'Čeština',
    current: 'EN',
  },
  nav: {
    sale: 'Sale',
    rent: 'Rent',
    weBuy: 'Sell with us',
    projects: 'Residential projects',
    sold: 'Completed',
    about: 'About',
    journal: 'Journal',
    contact: 'Contact',
  },
  hero: {
    brand: 'Ouren',
    headline: 'We select. We present. We sell.',
    support: 'Premium residential and commercial real estate across the Czech Republic. Based in Brno.',
    cta: 'View residential projects',
  },
  propertyMenu: {
    title: 'What you are looking for',
    types: {
      flats: 'Flats',
      houses: 'Houses',
      commercial: 'Commercial',
      others: 'Others',
    },
  },
  projects: {
    title: 'Residential projects',
    pageTitle: 'Residential projects',
    pageLead: 'Developments and available units across Czech Republic — clear inventory, strong locations, design-led homes.',
    allProjects: 'All projects',
    availableUnits: 'available',
    inventoryTitle: 'Unit inventory',
    filterAll: 'All',
    filterAvailable: 'Available',
    filterReserved: 'Reserved',
    filterSold: 'Sold',
    filterRented: 'Rented',
    table: {
      unit: 'Unit',
      floor: 'Floor',
      layout: 'Layout',
      area: 'Area',
      terrace: 'Terrace',
      price: 'Price',
      status: 'Status',
    },
    noUnits: 'Inventory for this project will be published soon.',
    externalSite: 'Project website',
  },
  listings: {
    saleTitle: 'Sale',
    saleLead: 'Selected apartments, houses, and commercial properties ready for purchase.',
    rentTitle: 'Rent',
    rentLead: 'Residences and commercial spaces for rent — clear terms, strong locations.',
    weBuyTitle: 'Sell with us',
    weBuyLead: 'A direct buyout, or a full market sale with Ouren — we say plainly which path fits.',
    countSale: 'properties for sale',
    countRent: 'properties for rent',
    backToSale: 'All for sale',
    backToRent: 'All for rent',
    empty: 'No listings available right now. New offers will appear here soon.',
    priceOnRequest: 'Price on request',
    galleryPrev: 'Previous photo',
    galleryNext: 'Next photo',
    specs: {
      status: 'Status',
      layout: 'Layout',
      area: 'Area',
      landArea: 'Land',
      price: 'Price',
      year: 'Year',
    },
    kinds: {
      apartment: 'Flat',
      house: 'House',
      land: 'Land',
      commercial: 'Commercial',
    },
  },
  sold: {
    title: 'Completed',
    counterLabel: 'properties sold',
  },
  sell: {
    headline: 'We buy your property',
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
  weBuyPage: {
    title: 'Sell with us',
    lead: 'You sell — we either buy the property outright, or take it to market for you. No obligation; we assess which path makes sense.',
    heroAlt: 'Bright apartment with a kitchen, dining table, and sofa',
    ctaBuy: 'I want a buyout',
    ctaList: 'I want to list with Ouren',
    pathsTitle: 'Two paths. One decision — after the numbers.',
    pathsLead: 'Before we promise anything, we compare speed, certainty, and real net outcome — and tell you straight.',
    buyPath: {
      title: 'Buyout',
      summary: 'Direct purchase by Ouren. Less uncertainty, shorter timeline, fewer moving parts.',
      points: [
        'Close typically in days to weeks',
        'No viewings or public listing',
        'Condition and prep handled by us',
        'Price below market in exchange for speed and certainty',
      ],
    },
    listPath: {
      title: 'List with Ouren',
      summary: 'Full market representation with editorial presentation and discreet negotiation.',
      points: [
        'Aim: strongest achievable market value',
        'Prep, photography, listing, viewings',
        'We lead buyer conversations',
        'Longer horizon, higher upside potential',
      ],
    },
    fitsTitle: 'When each path fits',
    fitsBuy: {
      title: 'A buyout fits when',
      items: [
        'You need a fast, certain close',
        'You are resolving inheritance, divorce, or complex ownership',
        'You do not want repairs and open houses',
      ],
    },
    fitsList: {
      title: 'Listing with Ouren fits when',
      items: [
        'You want to maximise location and presentation',
        'You can allow a proper market timeline',
        'You want a partner, not just an advert',
      ],
    },
    stepsTitle: 'How it works',
    steps: [
      {
        title: 'Tell us briefly',
        body: 'A short form — location, phone, and preference. No commitment.',
      },
      {
        title: 'We reply within 24 hours',
        body: 'We clarify the situation and agree the next step in a way that suits you.',
      },
      {
        title: 'We assess the property',
        body: 'Location, condition, documents, and realistic options for buyout or listing.',
      },
      {
        title: 'We recommend a path',
        body: 'A clear recommendation: buyout, list with Ouren, or a mix. The decision stays yours.',
      },
    ],
    proofTitle: 'Trust sits in closed work',
    proofLead: 'The same team behind our developments also handles private sales and buyouts.',
    proofItems: [
      { value: '24 h', label: 'first reply' },
      { value: 'CZ', label: 'nationwide' },
      { value: '1 partner', label: 'from first note to signing' },
    ],
    formTitle: 'No-obligation inquiry',
    formLead: 'Location and phone are enough. We fill in the rest together.',
    formNote: 'Submitting does not commit you to sell or accept an offer.',
    intents: {
      buy: 'Buyout',
      list: 'List with Ouren',
      unsure: 'Not sure — advise me',
    },
    fields: {
      intent: 'What you need',
      location: 'City / area',
      phone: 'Phone',
      name: 'Name',
      propertyType: 'Property type',
      message: 'Brief context (optional)',
    },
    propertyTypes: {
      apartment: 'Apartment',
      house: 'House',
      land: 'Land',
      commercial: 'Commercial',
    },
    submit: 'Send inquiry',
    success: 'Thank you. We will reply within 24 hours.',
    validation: {
      location: 'Enter a location',
      phone: 'Enter a phone number',
      name: 'Enter your name',
    },
    faqTitle: 'Questions sellers ask first',
    faq: [
      {
        q: 'Is the form binding?',
        a: 'No. It is only a no-obligation assessment. No contract or exclusivity starts on submit.',
      },
      {
        q: 'Why is a buyout often below market?',
        a: 'You are paying for speed and certainty: no viewings, repairs, or open-ended timeline. If the open market is better for you, we say so.',
      },
      {
        q: 'Can you handle complex cases?',
        a: 'Yes — inheritance, co-ownership, liens, or properties needing renovation are reviewed case by case.',
      },
      {
        q: 'How fast do you reply?',
        a: 'Usually within 24 hours on business days. Note urgency in the message and we adjust.',
      },
    ],
  },
  about: {
    eyebrow: 'About Ouren',
    headline: 'Built on precision. Driven by vision.',
    body1:
      'Ouren is a real estate firm based in Brno. We shape residential and commercial environments with editorial clarity and long-term value — across the Czech Republic.',
    body2:
      'From development strategy to placement, we guide every stage with discretion, precision, and a design-led sensibility that elevates each property we represent.',
    imageAlt: 'Panorama Žabiny in Brno, a project represented by Ouren',
    more: 'Full profile',
    storyTitle: 'A small team. A narrow list.',
    storyBody:
      'We do not take every property that calls. We represent what we can defend — the address, the condition, the story, and the price. From the first reading to the keys, the line stays the same: discreet, exact, and free of theatre.',
    storyNote:
      'We are not a branch network. A small team knows the property in person. The same standard holds for a flat in Brno, a house outside Prague, and a commercial building worth holding.',
    practicesTitle: 'What you can bring us',
    practicesLead:
      'Four practices, one house. Each has its own pace, and none promises more than the market can carry.',
    practices: [
      {
        title: 'Sale',
        summary: 'Apartments, houses, land, and commercial property worth a public listing.',
      },
      {
        title: 'Rent',
        summary: 'Residential and commercial lettings for owners who want a tenant, not a service desk.',
      },
      {
        title: 'Buyout, or a listing',
        summary: 'We either buy the property or take it to market. We say which path fits.',
      },
      {
        title: 'Residential projects',
        summary: 'Development from strategy and naming through to placing individual units.',
      },
    ],
    principlesTitle: 'How we work',
    principlesLead: 'Four rules we keep when the market gets loud.',
    principles: [
      {
        title: 'We select',
        body: 'The portfolio is narrow on purpose. If we cannot stand behind a property, we say so at the start.',
      },
      {
        title: 'We present',
        body: 'Photographs, copy, and price sit at the same level. A listing should look like the house, not an advert.',
      },
      {
        title: 'We speak plainly',
        body: 'Buyout, listing, or a mix. The recommendation is specific. The first conversation binds no one.',
      },
      {
        title: 'We keep the horizon',
        body: 'We care how a property holds in five years, not only how fast it leaves a portal.',
      },
    ],
    clientsTitle: 'Who it is for',
    clientsLead: 'People who want a clear process, not a catalogue of promises.',
    clients: [
      {
        title: 'Owners',
        body: 'You are selling, letting, or weighing a buyout. The first reading is non-binding, and we reply within one business day.',
      },
      {
        title: 'Buyers',
        body: 'You want an address, not another viewing. We show only what fits how you want to live or invest.',
      },
      {
        title: 'Developers',
        body: 'We help name a project, price it, and bring it to market. From the first line to the last unit.',
      },
      {
        title: 'Investors',
        body: 'Residential and commercial in the Czech Republic. We take mandates only where we can hold the same standard as our own projects.',
      },
    ],
    reachTitle: 'Where we work',
    reachLead: 'Based in Brno. We work across the Czech Republic — we are not an international firm.',
    places: [
      {
        name: 'Brno',
        body: 'Our registered office and home market. Apartments, residences, and local addresses we know from our own projects, not from a map.',
      },
      {
        name: 'Czech Republic',
        body: 'Sale, rent, buyout, and development nationwide. Prague, the regions, and smaller towns — by mandate, not by branch.',
      },
    ],
    closeTitle: 'Start with the specific thing.',
    closeBody: 'Write what you are dealing with. We usually reply within 24 hours on business days.',
    write: 'Write',
    sell: 'Sell with us',
    operatorTitle: 'Site operator',
    operatorBody:
      'This website is operated by SD GROUP PROSPERITY s.r.o., ID No. 21369178, with its registered office at Radnická 376/11, 602 00 Brno, Czech Republic. The company is entered in the Commercial Register kept by the Regional Court in Brno under file No. C 138592.',
    operatorLink: 'Commercial register extract',
    stats: {
      activeProjects: 'active projects',
      propertiesSold: 'properties sold',
      reply: 'reply on business days',
    },
  },
  seoFaq: {
    home: {
      title: 'Questions',
      items: [
        {
          q: 'What does Ouren do?',
          a: 'Ouren selects, presents, and sells premium residential and commercial property. It also represents developers, and for selected properties it can buy outright or list on the open market.',
        },
        {
          q: 'Where do you work?',
          a: 'We are based in Brno and work across the Czech Republic. We are not an international firm and have no offices abroad.',
        },
        {
          q: 'Do you buy properties yourselves?',
          a: 'For selected ones, yes. Elsewhere a market listing fits better. The Sell with us page says which path applies. The first reading binds no one.',
        },
        {
          q: 'How do I reach you?',
          a: 'Write to info@ouren.cz or call +420 722 033 055. We usually reply within 24 hours on business days.',
        },
      ],
    },
    sale: {
      title: 'Before you choose',
      items: [
        {
          q: 'What is on the sale page?',
          a: 'Apartments, houses, land, and commercial property represented by Ouren. Sold items stay in the list, marked so they are not mistaken for something available.',
        },
        {
          q: 'Is the price final?',
          a: 'It is the asking price, unless the property is marked sold. Final terms are agreed in the contract, not in the catalogue.',
        },
        {
          q: 'How do I arrange a viewing?',
          a: 'Send the property name to info@ouren.cz or call +420 722 033 055. Viewings are arranged for listings that are available or reserved.',
        },
        {
          q: 'Do you take properties that are not in the catalogue?',
          a: 'Yes. Use the Sell with us page. We assess a buyout and a market listing, and the first conversation is non-binding.',
        },
      ],
    },
    rent: {
      title: 'Before you rent',
      items: [
        {
          q: 'What is in the rental list?',
          a: 'Apartments, houses, and commercial space for rent. Let properties stay visible, marked so it is clear they are no longer free.',
        },
        {
          q: 'How long is a lease?',
          a: 'The term depends on the property and what the parties agree. The catalogue does not use one lease length for every listing.',
        },
        {
          q: 'Can I view a space before signing?',
          a: 'Yes, for available and reserved listings. Send the name to info@ouren.cz or call +420 722 033 055.',
        },
        {
          q: 'Do you let offices and shops?',
          a: 'Yes. Commercial lettings sit in the same catalogue. Terms follow the type of space, not an apartment template.',
        },
      ],
    },
    projects: {
      title: 'About the projects',
      items: [
        {
          q: 'How is a project different from a sale listing?',
          a: 'A project is a whole building or a set of units, with its own inventory. Individual apartments and houses without a shared project are on the sale page.',
        },
        {
          q: 'How do I see a free unit?',
          a: 'The project page has a unit table and a status for each: available, reserved, sold, or rented.',
        },
        {
          q: 'Can I buy into a finished project?',
          a: 'Finished projects are shown separately. A remaining free unit, if there is one, is in the inventory. Otherwise the project is a reference.',
        },
        {
          q: 'Can Ouren prepare a project with me?',
          a: 'Yes. We help name it, price it, and bring it to market. The first conversation binds no one.',
        },
      ],
    },
    about: {
      title: 'About the firm',
      items: [
        {
          q: 'Who operates this website?',
          a: 'SD GROUP PROSPERITY s.r.o., ID No. 21369178, registered office Radnická 376/11, 602 00 Brno. The company is entered at the Regional Court in Brno under file No. C 138592.',
        },
        {
          q: 'Are you a brokerage or a developer?',
          a: 'In a narrow selection, both. We represent property for sale and rent, and we take residential projects from strategy through to placing units.',
        },
        {
          q: 'Do you have branches across the country?',
          a: 'No. We are based in Brno. We take work nationwide, but we are not a branch network.',
        },
        {
          q: 'Which languages do you work in?',
          a: 'Czech and English. The site language switches in the footer.',
        },
      ],
    },
  },
  entityFaq: {
    title: 'About this property',
    projectTitle: 'About this project',
    whereQ: 'Where is {name}?',
    whereA: '{name} is in {location}.',
    statusQ: 'Is {name} still available?',
    statusA: {
      available: '{name} is available. The next step is info@ouren.cz or +420 722 033 055.',
      reserved: '{name} is reserved. We confirm the status before arranging a viewing.',
      sold: '{name} is sold and is no longer available to buy.',
      rented: '{name} is let and is no longer available.',
      inProgress: '{name} is in preparation. Free units, if any are released, are in the table on this page.',
    },
    sizeQ: 'What is the size of {name}?',
    sizeA: 'The area of {name} is {area}.',
    sizeLandA: 'The area of {name} is {area}, and the land is {land}.',
    sizeUnknown: 'We will confirm the area of {name} on request. Write to info@ouren.cz.',
    nextQ: 'How do I find out more about {name}?',
    nextA: 'Write to info@ouren.cz or call +420 722 033 055 and name {name}. We usually reply within 24 hours on business days.',
    unitsQ: 'How many units in {name} are free?',
    unitsA: '{name} currently has {available} free units. The project lists {total} units in total.',
    unitsNone: '{name} has no unit marked free right now. The project lists {total} units, and their status is in the table above.',
    projectStatusQ: 'What stage is {name} in?',
    projectStatusA: 'The status of {name} is {status}.',
  },
  contact: {
    eyebrow: 'Contact',
    headline: 'Begin the conversation.',
    copy:
      'For acquisitions, private listings, and development partnerships across the Czech Republic. Based in Brno.',
    locations: 'Brno · Czech Republic',
  },
  footer: {
    navigation: 'Navigation',
    contact: 'Contact',
    portal: 'Ouren Portal',
    copyright: '© 2025 Ouren Real Estate',
    operator:
      'Operator: SD GROUP PROSPERITY s.r.o., ID 21369178, Radnická 376/11, 602 00 Brno. File No. C 138592, Regional Court in Brno.',
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
    rented: 'Rented',
    inProgress: 'In progress',
  },
};
