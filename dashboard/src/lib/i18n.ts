export type Locale = 'cs' | 'en'

export type Translations = {
  brand: string
  workspace: string
  headerSubtitle: string
  marketingSite: string
  sanityLive: string
  mockData: string
  langCs: string
  langEn: string
  nav: {
    overview: string
    customers: string
    projects: string
    units: string
    inquiries: string
    settings: string
  }
  overview: {
    title: string
    subtitle: string
    projects: string
    availableUnits: string
    customers: string
    newInquiries: string
    recentCustomers: string
    activePipeline: string
    latestInquiries: string
    fromForms: string
    featuredInventory: string
    currentlyInMarket: string
    interest: string
    unitsYear: string
  }
  customers: {
    title: string
    subtitle: string
    search: string
    all: string
    records: string
    customer: string
    status: string
    budget: string
    projects: string
    portal: string
    source: string
    layouts: string
    layoutsHint: string
    allLayouts: string
    enabled: string
    off: string
    allStatuses: string
    allSources: string
    noResults: string
    clearFilters: string
    add: string
    addTitle: string
    addDescription: string
    edit: string
    editTitle: string
    editDescription: string
    name: string
    email: string
    phone: string
    notes: string
    save: string
    saving: string
    cancel: string
    delete: string
    deleting: string
    deleted: string
    confirmDelete: string
    created: string
    updated: string
    noProject: string
    sourcePlaceholder: string
    portalAccess: string
    errors: {
      nameRequired: string
      sanityWriteNotConfigured: string
      saveFailed: string
      emailTaken: string
      forbidden: string
    }
  }
  projects: {
    title: string
    subtitle: string
    all: string
    developments: string
    project: string
    type: string
    status: string
    price: string
    units: string
    year: string
    link: string
  }
  units: {
    title: string
    subtitle: string
    inventory: string
    count: string
    unit: string
    project: string
    status: string
    floor: string
    rooms: string
    area: string
    price: string
    customer: string
  }
  inquiries: {
    title: string
    subtitle: string
    inbox: string
    count: string
    contact: string
    type: string
    details: string
    status: string
    received: string
  }
  login: {
    subtitle: string
    email: string
    password: string
    submit: string
    signingIn: string
    invalid: string
  }
  settings: {
    title: string
    subtitle: string
    account: string
    accountHint: string
    signedInAs: string
    yourRole: string
    signOut: string
    teamAccess: string
    teamHint: string
    rolesHint: string
    roleColumn: string
    noUsers: string
    howToAdd: string
    step1: string
    step2: string
    step3: string
    roleUpdated: string
    roleReLogin: string
    roles: {
      viewer: string
      re_agent: string
      ceo: string
    }
    roleDescriptions: {
      viewer: string
      re_agent: string
      ceo: string
    }
    roleErrors: {
      forbidden: string
      invalidRole: string
      unknownUser: string
      saveFailed: string
    }
  }
  status: {
    project: {
      available: string
      reserved: string
      sold: string
      inProgress: string
    }
    customer: {
      lead: string
      qualified: string
      reservation: string
      contract: string
      closed: string
      lost: string
    }
    inquiry: {
      new: string
      inProgress: string
      done: string
      spam: string
    }
    unit: {
      available: string
      reserved: string
      sold: string
    }
  }
}

export const cs: Translations = {
  brand: 'Ouren Portál',
  workspace: 'Pracovní prostor',
  headerSubtitle: 'Interní prostor pro klienty a inventář',
  marketingSite: 'Marketingový web',
  sanityLive: 'Sanity aktivní',
  mockData: 'Lokální data',
  langCs: 'Čeština',
  langEn: 'English',
  nav: {
    overview: 'Přehled',
    customers: 'Klienti',
    projects: 'Projekty',
    units: 'Jednotky',
    inquiries: 'Poptávky',
    settings: 'Nastavení',
  },
  overview: {
    title: 'Přehled',
    subtitle: 'Pipeline, inventář a aktivita klientů Ouren.',
    projects: 'Projekty',
    availableUnits: 'Volné jednotky',
    customers: 'Klienti',
    newInquiries: 'Nové poptávky',
    recentCustomers: 'Nedávní klienti',
    activePipeline: 'Aktivní pipeline',
    latestInquiries: 'Nejnovější poptávky',
    fromForms: 'Z formulářů na webu',
    featuredInventory: 'Aktuální nabídka',
    currentlyInMarket: 'Projekty aktuálně v nabídce',
    interest: 'Zájem',
    unitsYear: 'jednotek',
  },
  customers: {
    title: 'Klienti',
    subtitle: 'Leady, rezervace a přístup do portálu.',
    search: 'Hledat klienty...',
    all: 'Všichni klienti',
    records: 'záznamů',
    customer: 'Klient',
    status: 'Stav',
    budget: 'Rozpočet',
    projects: 'Projekty',
    portal: 'Portál',
    source: 'Zdroj',
    layouts: 'Dispozice',
    layoutsHint: 'Můžete vybrat víc možností.',
    allLayouts: 'Všechny dispozice',
    enabled: 'Zapnuto',
    off: 'Vypnuto',
    allStatuses: 'Všechny stavy',
    allSources: 'Všechny zdroje',
    noResults: 'Žádní klienti neodpovídají filtrům.',
    clearFilters: 'Zrušit filtry',
    add: 'Přidat klienta',
    addTitle: 'Nový klient',
    addDescription: 'Vyplňte údaje a uložte. Klient se hned objeví v seznamu.',
    edit: 'Upravit',
    editTitle: 'Upravit klienta',
    editDescription: 'Změny se uloží a hned se projeví v seznamu.',
    name: 'Jméno',
    email: 'E-mail',
    phone: 'Telefon',
    notes: 'Poznámky',
    save: 'Uložit',
    saving: 'Ukládám…',
    cancel: 'Zrušit',
    delete: 'Smazat',
    deleting: 'Mažu…',
    deleted: 'Klient byl smazán.',
    confirmDelete: 'Opravdu smazat tohoto klienta?',
    created: 'Klient byl přidán.',
    updated: 'Klient byl uložen.',
    noProject: 'Bez projektu',
    sourcePlaceholder: 'např. doporučení, web',
    portalAccess: 'Přístup do portálu',
    errors: {
      nameRequired: 'Vyplňte jméno klienta.',
      sanityWriteNotConfigured: 'Chybí SANITY_API_TOKEN v dashboard/.env.local.',
      saveFailed: 'Uložení se nepovedlo. Zkuste to znovu.',
      emailTaken: 'Tento e-mail už má klient {name}.',
      forbidden: 'Nemáte oprávnění tuto akci provést.',
    },
  },
  projects: {
    title: 'Projekty',
    subtitle: 'Developmenty spravované v Sanity a zobrazené na webu.',
    all: 'Všechny projekty',
    developments: 'developmentů',
    project: 'Projekt',
    type: 'Typ',
    status: 'Stav',
    price: 'Cena',
    units: 'Jednotky',
    year: 'Rok',
    link: 'Odkaz',
  },
  units: {
    title: 'Jednotky',
    subtitle: 'Inventář jednotek a přiřazení ke klientům.',
    inventory: 'Inventář',
    count: 'jednotek',
    unit: 'Jednotka',
    project: 'Projekt',
    status: 'Stav',
    floor: 'Patro',
    rooms: 'Pokoje',
    area: 'Plocha',
    price: 'Cena',
    customer: 'Klient',
  },
  inquiries: {
    title: 'Poptávky',
    subtitle: 'Odeslané formuláře (prodej / kontakt).',
    inbox: 'Schránka',
    count: 'poptávek',
    contact: 'Kontakt',
    type: 'Typ',
    details: 'Projekt / detaily',
    status: 'Stav',
    received: 'Přijato',
  },
  login: {
    subtitle: 'Přihlášení do interního portálu',
    email: 'E-mail',
    password: 'Heslo',
    submit: 'Přihlásit se',
    signingIn: 'Přihlašuji…',
    invalid: 'Neplatný e-mail nebo heslo.',
  },
  settings: {
    title: 'Nastavení',
    subtitle: 'Účet, role a přístup kolegů do portálu.',
    account: 'Účet',
    accountHint: 'Aktuálně přihlášený uživatel.',
    signedInAs: 'Přihlášen jako',
    yourRole: 'Vaše role',
    signOut: 'Odhlásit se',
    teamAccess: 'Přístup týmu',
    teamHint: 'Účty s přístupem do /admin. Hesla se v UI neukazují.',
    rolesHint: 'Role určují, co může uživatel v portálu měnit. Změna role se projeví po opětovném přihlášení.',
    roleColumn: 'Role',
    noUsers: 'Žádní uživatelé v AUTH_USERS.',
    howToAdd: 'Jak přidat kolegu',
    step1: 'Otevřete dashboard/.env.local',
    step2: 'AUTH_USERS=vas@email.cz:heslo:ceo,kolega@email.cz:heslo:re_agent',
    step3: 'Restartujte dashboard (npm run dev) a pošlete kolegovi jeho e-mail + heslo.',
    roleUpdated: 'Role byla uložena.',
    roleReLogin: 'Uživatel se musí znovu přihlásit, aby se role projevila.',
    roles: {
      viewer: 'Viewer',
      re_agent: 'RE agent',
      ceo: 'CEO',
    },
    roleDescriptions: {
      viewer: 'Pouze prohlížení — žádné úpravy.',
      re_agent: 'Správa klientů, projektů a zpráv.',
      ceo: 'Plný přístup včetně nastavení rolí.',
    },
    roleErrors: {
      forbidden: 'Nemáte oprávnění měnit role.',
      invalidRole: 'Neplatná role.',
      unknownUser: 'Uživatel není v AUTH_USERS.',
      saveFailed: 'Role se nepodařilo uložit.',
    },
  },
  status: {
    project: {
      available: 'Volné',
      reserved: 'Rezervováno',
      sold: 'Prodáno',
      inProgress: 'V přípravě',
    },
    customer: {
      lead: 'Lead',
      qualified: 'Kvalifikovaný',
      reservation: 'Rezervace',
      contract: 'Smlouva',
      closed: 'Uzavřeno',
      lost: 'Ztraceno',
    },
    inquiry: {
      new: 'Nová',
      inProgress: 'V řešení',
      done: 'Hotovo',
      spam: 'Spam',
    },
    unit: {
      available: 'Volné',
      reserved: 'Rezervováno',
      sold: 'Prodáno',
    },
  },
}

export const en: Translations = {
  brand: 'Ouren Portal',
  workspace: 'Workspace',
  headerSubtitle: 'Internal customer workspace',
  marketingSite: 'Marketing site',
  sanityLive: 'Sanity live',
  mockData: 'Local data',
  langCs: 'Čeština',
  langEn: 'English',
  nav: {
    overview: 'Overview',
    customers: 'Customers',
    projects: 'Projects',
    units: 'Units',
    inquiries: 'Inquiries',
    settings: 'Settings',
  },
  overview: {
    title: 'Overview',
    subtitle: 'Pipeline, inventory, and client activity for Ouren.',
    projects: 'Projects',
    availableUnits: 'Available units',
    customers: 'Customers',
    newInquiries: 'New inquiries',
    recentCustomers: 'Recent customers',
    activePipeline: 'Active pipeline',
    latestInquiries: 'Latest inquiries',
    fromForms: 'From website forms',
    featuredInventory: 'Featured inventory',
    currentlyInMarket: 'Projects currently in market',
    interest: 'Interest',
    unitsYear: 'units',
  },
  customers: {
    title: 'Customers',
    subtitle: 'Leads, reservations, and portal access for Ouren clients.',
    search: 'Search customers...',
    all: 'All customers',
    records: 'records',
    customer: 'Customer',
    status: 'Status',
    budget: 'Budget',
    projects: 'Projects',
    portal: 'Portal',
    source: 'Source',
    layouts: 'Layout',
    layoutsHint: 'You can select more than one.',
    allLayouts: 'All layouts',
    enabled: 'Enabled',
    off: 'Off',
    allStatuses: 'All statuses',
    allSources: 'All sources',
    noResults: 'No customers match these filters.',
    clearFilters: 'Clear filters',
    add: 'Add customer',
    addTitle: 'New customer',
    addDescription: 'Fill in the details and save. The customer appears in the list immediately.',
    edit: 'Edit',
    editTitle: 'Edit customer',
    editDescription: 'Changes are saved and shown in the list immediately.',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    notes: 'Notes',
    save: 'Save',
    saving: 'Saving…',
    cancel: 'Cancel',
    delete: 'Delete',
    deleting: 'Deleting…',
    deleted: 'Customer deleted.',
    confirmDelete: 'Delete this customer?',
    created: 'Customer added.',
    updated: 'Customer updated.',
    noProject: 'No project',
    sourcePlaceholder: 'e.g. referral, website',
    portalAccess: 'Portal access',
    errors: {
      nameRequired: 'Please enter the customer name.',
      sanityWriteNotConfigured: 'SANITY_API_TOKEN is missing in dashboard/.env.local.',
      saveFailed: 'Could not save. Please try again.',
      emailTaken: 'This email already belongs to {name}.',
      forbidden: 'You do not have permission to perform this action.',
    },
  },
  projects: {
    title: 'Projects',
    subtitle: 'Developments managed in Sanity and shown on the marketing site.',
    all: 'All projects',
    developments: 'developments',
    project: 'Project',
    type: 'Type',
    status: 'Status',
    price: 'Price',
    units: 'Units',
    year: 'Year',
    link: 'Link',
  },
  units: {
    title: 'Units',
    subtitle: 'Unit-level inventory with assignment to customers.',
    inventory: 'Inventory',
    count: 'units',
    unit: 'Unit',
    project: 'Project',
    status: 'Status',
    floor: 'Floor',
    rooms: 'Rooms',
    area: 'Area',
    price: 'Price',
    customer: 'Customer',
  },
  inquiries: {
    title: 'Inquiries',
    subtitle: 'Form submissions from sell-with-us and contact flows.',
    inbox: 'Inbox',
    count: 'inquiries',
    contact: 'Contact',
    type: 'Type',
    details: 'Project / details',
    status: 'Status',
    received: 'Received',
  },
  login: {
    subtitle: 'Sign in to the internal portal',
    email: 'Email',
    password: 'Password',
    submit: 'Sign in',
    signingIn: 'Signing in…',
    invalid: 'Invalid email or password.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Account, roles, and colleague access to the portal.',
    account: 'Account',
    accountHint: 'Currently signed-in user.',
    signedInAs: 'Signed in as',
    yourRole: 'Your role',
    signOut: 'Sign out',
    teamAccess: 'Team access',
    teamHint: 'Accounts that can open /admin. Passwords are never shown here.',
    rolesHint: 'Roles control what each user can change in the portal. Role changes apply after the user signs in again.',
    roleColumn: 'Role',
    noUsers: 'No users configured in AUTH_USERS.',
    howToAdd: 'How to add a colleague',
    step1: 'Open dashboard/.env.local',
    step2: 'AUTH_USERS=you@email.com:password:ceo,colleague@email.com:password:re_agent',
    step3: 'Restart the dashboard (npm run dev) and share their email + password.',
    roleUpdated: 'Role saved.',
    roleReLogin: 'The user must sign in again for the role to take effect.',
    roles: {
      viewer: 'Viewer',
      re_agent: 'RE agent',
      ceo: 'CEO',
    },
    roleDescriptions: {
      viewer: 'Read-only — no changes allowed.',
      re_agent: 'Manage clients, projects, and messages.',
      ceo: 'Full access including role management.',
    },
    roleErrors: {
      forbidden: 'You do not have permission to change roles.',
      invalidRole: 'Invalid role.',
      unknownUser: 'User is not in AUTH_USERS.',
      saveFailed: 'Could not save the role.',
    },
  },
  status: {
    project: {
      available: 'Available',
      reserved: 'Reserved',
      sold: 'Sold',
      inProgress: 'In progress',
    },
    customer: {
      lead: 'Lead',
      qualified: 'Qualified',
      reservation: 'Reservation',
      contract: 'Contract',
      closed: 'Closed',
      lost: 'Lost',
    },
    inquiry: {
      new: 'New',
      inProgress: 'In progress',
      done: 'Done',
      spam: 'Spam',
    },
    unit: {
      available: 'Available',
      reserved: 'Reserved',
      sold: 'Sold',
    },
  },
}

export const dictionaries: Record<Locale, Translations> = { cs, en }
export const defaultLocale: Locale = 'cs'

export function isLocale(value: string): value is Locale {
  return value === 'cs' || value === 'en'
}
