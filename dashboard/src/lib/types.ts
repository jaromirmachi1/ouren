export type ProjectStatus = 'available' | 'reserved' | 'sold' | 'inProgress'
export type ProjectChannel = 'residential' | 'sale' | 'rent'
export type CustomerStatus = 'lead' | 'qualified' | 'reservation' | 'contract' | 'closed' | 'lost'
export type FlatLayout = 'S' | '1kk' | '2kk' | '3kk' | '4kk' | 'Multiple'

export const FLAT_LAYOUTS: FlatLayout[] = ['S', '1kk', '2kk', '3kk', '4kk', 'Multiple']
export const PROJECT_CHANNELS: ProjectChannel[] = ['residential', 'sale', 'rent']
export type InquiryStatus = 'new' | 'inProgress' | 'done' | 'spam'
export type UnitStatus = 'available' | 'reserved' | 'sold' | 'rented'
export type UnitKind = 'apartment' | 'house' | 'land'
export const UNIT_KINDS: UnitKind[] = ['apartment', 'house', 'land']

export function normalizeProjectChannels(
  channels?: unknown,
  legacy?: unknown,
): ProjectChannel[] {
  const fromArray = Array.isArray(channels)
    ? channels.filter((value): value is ProjectChannel =>
        PROJECT_CHANNELS.includes(value as ProjectChannel),
      )
    : []
  if (fromArray.length) return [...new Set(fromArray)]

  if (typeof legacy === 'string' && PROJECT_CHANNELS.includes(legacy as ProjectChannel)) {
    return [legacy as ProjectChannel]
  }

  return ['residential']
}

export type Project = {
  _id: string
  name: string
  slug: string
  location: string
  channels?: ProjectChannel[]
  /** @deprecated Prefer channels — kept for older local docs */
  channel?: ProjectChannel
  type: string
  layout?: string
  status: ProjectStatus
  price: string
  units: number
  areaSqm?: number
  year: number
  featured?: boolean
  websiteUrl?: string
  imageUrl?: string
  descriptionCs?: string
  descriptionEn?: string
}

export type Unit = {
  _id: string
  label: string
  slug?: string
  kind?: UnitKind
  location?: string
  layout?: string
  listOnSale?: boolean
  listOnRent?: boolean
  projectId?: string
  projectName?: string
  status: UnitStatus
  floor?: number
  rooms?: number
  areaSqm?: number
  landAreaSqm?: number
  priceCzk?: number
  imageUrl?: string
  gallery?: { key: string; ref: string; url: string }[]
  descriptionCs?: string
  descriptionEn?: string
  customerName?: string
}

export type Customer = {
  _id: string
  name: string
  email?: string
  phone?: string
  status: CustomerStatus
  budget?: string
  preferredLanguage?: string
  source?: string
  notes?: string
  interestedProjects?: string[]
  lookingForLayouts?: FlatLayout[]
  portalAccess?: boolean
}

export type Inquiry = {
  _id: string
  type: string
  name: string
  email?: string
  phone?: string
  propertyType?: string
  estimatedValue?: string
  message?: string
  status: InquiryStatus
  createdAt?: string
  relatedProjectName?: string
}
