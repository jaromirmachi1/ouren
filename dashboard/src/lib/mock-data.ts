import type { Inquiry, Project, Unit } from './types'

/** Real inventory only — no placeholder projects. */
export const seedProjects: Project[] = [
  {
    _id: 'proj-panorama-zabiny',
    name: 'Panorama Žabiny',
    slug: 'panorama-zabiny',
    location: 'Brno — Žabiny',
    type: 'apartment',
    status: 'available',
    price: '5 420 000',
    units: 24,
    year: 2026,
    featured: true,
    websiteUrl: 'https://panoramazabiny.cz',
  },
]

/** Units stay empty until entered in Sanity / CMS. */
export const seedUnits: Unit[] = []

/** Real client database from Ouren. */
export { panoramaCustomers as seedCustomers } from './clients-seed'

/** Inquiries stay empty until form submissions exist. */
export const seedInquiries: Inquiry[] = []

/** @deprecated use seed* names */
export const mockProjects = seedProjects
export const mockUnits = seedUnits
export const mockInquiries = seedInquiries
export { panoramaCustomers as mockCustomers } from './clients-seed'
