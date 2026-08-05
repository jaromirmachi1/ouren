import { createClient } from 'next-sanity'
import { seedCustomers, seedInquiries, seedProjects, seedUnits } from './mock-data'
import type { Customer, Inquiry, Project, Unit } from './types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'

export const isSanityConfigured = Boolean(projectId && projectId !== 'your-project-id')

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null

const projectsQuery = `*[_type == "project"] | order(featured desc, name asc) {
  _id,
  name,
  "slug": slug.current,
  location,
  type,
  status,
  price,
  units,
  year,
  featured,
  websiteUrl,
  "imageUrl": image.asset->url
}`

const unitsQuery = `*[_type == "unit"] | order(label asc) {
  _id,
  label,
  "projectName": project->name,
  status,
  floor,
  rooms,
  areaSqm,
  priceCzk,
  "customerName": customer->name
}`

const customersQuery = `*[_type == "customer"] | order(name asc) {
  _id,
  name,
  email,
  phone,
  status,
  budget,
  preferredLanguage,
  source,
  notes,
  portalAccess,
  "interestedProjects": interestedProjects[]->name
}`

const inquiriesQuery = `*[_type == "inquiry"] | order(createdAt desc) {
  _id,
  type,
  name,
  email,
  phone,
  propertyType,
  estimatedValue,
  message,
  status,
  createdAt,
  "relatedProjectName": relatedProject->name
}`

async function fetchOrSeed<T>(query: string, seed: T[]): Promise<T[]> {
  if (!sanityClient) return seed
  try {
    const data = await sanityClient.fetch<T[]>(query)
    // Sanity is connected but still empty — keep serving the real local seed
    // until content is imported into the dataset.
    if (!data || data.length === 0) return seed
    return data
  } catch {
    return seed
  }
}

export async function getProjects(): Promise<Project[]> {
  return fetchOrSeed(projectsQuery, seedProjects)
}

export async function getUnits(): Promise<Unit[]> {
  if (!sanityClient) return seedUnits
  try {
    return (await sanityClient.fetch(unitsQuery)) ?? []
  } catch {
    return seedUnits
  }
}

export async function getCustomers(): Promise<Customer[]> {
  return fetchOrSeed(customersQuery, seedCustomers)
}

export async function getInquiries(): Promise<Inquiry[]> {
  if (!sanityClient) return seedInquiries
  try {
    return (await sanityClient.fetch(inquiriesQuery)) ?? []
  } catch {
    return seedInquiries
  }
}

export async function getDashboardStats() {
  const [projects, units, customers, inquiries] = await Promise.all([
    getProjects(),
    getUnits(),
    getCustomers(),
    getInquiries(),
  ])

  return {
    projects,
    units,
    customers,
    inquiries,
    stats: {
      projects: projects.length,
      availableUnits: units.filter((u) => u.status === 'available').length,
      customers: customers.length,
      newInquiries: inquiries.filter((i) => i.status === 'new').length,
    },
  }
}
