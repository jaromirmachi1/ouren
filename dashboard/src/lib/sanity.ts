import { createClient } from 'next-sanity'
import { seedCustomers, seedInquiries, seedProjects, seedUnits } from './mock-data'
import { readDeletedCustomerIds, readLocalCustomers } from './local-customers'
import { readDeletedProjectIds, readLocalProjects } from './local-projects'
import { normalizeProjectChannels, type Customer, type Inquiry, type Project, type Unit } from './types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'

export const isSanityConfigured = Boolean(projectId && projectId !== 'your-project-id')

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion,
      useCdn: false,
    })
  : null

const fresh = { cache: 'no-store' as const }

const projectsQuery = `*[_type == "project"] | order(featured desc, name asc) {
  _id,
  name,
  "slug": slug.current,
  location,
  channels,
  channel,
  type,
  layout,
  status,
  price,
  units,
  areaSqm,
  year,
  featured,
  websiteUrl,
  descriptionCs,
  descriptionEn,
  "imageUrl": coalesce(image.asset->url, coverImageUrl),
  "galleryUrls": gallery[].asset->url
}`

const unitsQuery = `*[_type == "unit"] | order(_createdAt desc) {
  _id,
  label,
  "slug": slug.current,
  "kind": coalesce(kind, "apartment"),
  location,
  layout,
  listOnSale,
  listOnRent,
  "projectId": project._ref,
  "projectName": project->name,
  status,
  floor,
  rooms,
  areaSqm,
  landAreaSqm,
  priceCzk,
  descriptionCs,
  descriptionEn,
  "imageUrl": coalesce(image.asset->url, layoutImage.asset->url),
  "gallery": gallery[]{
    "key": _key,
    "ref": asset._ref,
    "url": asset->url
  },
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
  lookingForLayouts,
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
    const data = await sanityClient.fetch<T[]>(query, {}, fresh)
    // Sanity is connected but still empty — keep serving the real local seed
    // until content is imported into the dataset.
    if (!data || data.length === 0) return seed
    return data
  } catch {
    return seed
  }
}

export async function getProjects(): Promise<Project[]> {
  const [remote, local, deletedIds] = await Promise.all([
    fetchOrSeed(projectsQuery, seedProjects),
    readLocalProjects(),
    readDeletedProjectIds(),
  ])
  const deleted = new Set(deletedIds)
  const byId = new Map(
    remote.filter((project) => !deleted.has(project._id)).map((project) => [project._id, project]),
  )
  const extras: Project[] = []
  for (const project of local) {
    if (deleted.has(project._id)) continue
    if (byId.has(project._id)) byId.set(project._id, project)
    else extras.push(project)
  }
  return [...extras, ...byId.values()].map((project) => ({
    ...project,
    channels: normalizeProjectChannels(project.channels, project.channel),
  }))
}

export async function getUnits(): Promise<Unit[]> {
  if (!sanityClient) return seedUnits
  try {
    return (await sanityClient.fetch(unitsQuery, {}, fresh)) ?? []
  } catch {
    return seedUnits
  }
}

export async function getCustomers(): Promise<Customer[]> {
  const [remote, local, deletedIds] = await Promise.all([
    fetchOrSeed(customersQuery, seedCustomers),
    readLocalCustomers(),
    readDeletedCustomerIds(),
  ])
  const deleted = new Set(deletedIds)
  const byId = new Map(
    remote.filter((customer) => !deleted.has(customer._id)).map((customer) => [customer._id, customer]),
  )
  const extras: Customer[] = []
  for (const customer of local) {
    if (deleted.has(customer._id)) continue
    if (byId.has(customer._id)) byId.set(customer._id, customer)
    else extras.push(customer)
  }
  return [...extras, ...byId.values()]
}

export async function getInquiries(): Promise<Inquiry[]> {
  if (!sanityClient) return seedInquiries
  try {
    return (await sanityClient.fetch(inquiriesQuery, {}, fresh)) ?? []
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
