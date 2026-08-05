export type ProjectStatus = 'available' | 'reserved' | 'sold' | 'inProgress'
export type CustomerStatus = 'lead' | 'qualified' | 'reservation' | 'contract' | 'closed' | 'lost'
export type InquiryStatus = 'new' | 'inProgress' | 'done' | 'spam'
export type UnitStatus = 'available' | 'reserved' | 'sold'

export type Project = {
  _id: string
  name: string
  slug: string
  location: string
  type: string
  status: ProjectStatus
  price: string
  units: number
  year: number
  featured?: boolean
  websiteUrl?: string
  imageUrl?: string
}

export type Unit = {
  _id: string
  label: string
  projectName: string
  status: UnitStatus
  floor?: number
  rooms?: number
  areaSqm?: number
  priceCzk?: number
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
