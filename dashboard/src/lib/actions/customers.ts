'use server'

import { revalidatePath } from 'next/cache'
import { sanityWriteClient } from '@/lib/sanity-write'
import { removeLocalCustomer, upsertLocalCustomer } from '@/lib/local-customers'
import { getCustomers, getProjects } from '@/lib/sanity'
import { PermissionError, requirePermission } from '@/lib/permissions'
import type { Customer, CustomerStatus, FlatLayout } from '@/lib/types'

export type CustomerInput = {
  id?: string
  name: string
  email?: string
  phone?: string
  status: CustomerStatus
  source?: string
  budget?: string
  notes?: string
  projectId?: string
  lookingForLayouts?: FlatLayout[]
  portalAccess?: boolean
}

export type CustomerActionResult =
  | { ok: true }
  | { ok: false; error: 'nameRequired' | 'emailTaken' | 'saveFailed' | 'forbidden'; existingName?: string }

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function refresh() {
  revalidatePath('/customers')
  revalidatePath('/')
}

function normalizeEmail(email?: string) {
  return email?.trim().toLowerCase() || ''
}

async function findEmailOwner(email: string, ignoreId?: string) {
  if (!email) return null
  const customers = await getCustomers()
  return (
    customers.find(
      (customer) => customer._id !== ignoreId && normalizeEmail(customer.email) === email,
    ) ?? null
  )
}

async function toCustomer(input: CustomerInput, id: string): Promise<Customer> {
  const projects = await getProjects()
  const project = projects.find((item) => item._id === input.projectId)
  return {
    _id: id,
    name: input.name.trim(),
    email: input.email?.trim() || undefined,
    phone: input.phone?.trim() || undefined,
    status: input.status || 'lead',
    source: input.source?.trim() || undefined,
    budget: input.budget?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
    preferredLanguage: 'cs',
    interestedProjects: project ? [project.name] : undefined,
    lookingForLayouts: input.lookingForLayouts?.length ? input.lookingForLayouts : undefined,
    portalAccess: Boolean(input.portalAccess),
  }
}

function sanityPayload(customer: Customer, projectId?: string) {
  return {
    name: customer.name,
    status: customer.status,
    preferredLanguage: customer.preferredLanguage || 'cs',
    portalAccess: Boolean(customer.portalAccess),
    email: customer.email || undefined,
    phone: customer.phone || undefined,
    source: customer.source || undefined,
    budget: customer.budget || undefined,
    notes: customer.notes || undefined,
    lookingForLayouts: customer.lookingForLayouts ?? [],
    interestedProjects: projectId
      ? [{ _type: 'reference' as const, _ref: projectId, _key: 'project-ref' }]
      : [],
  }
}

export async function createCustomer(input: CustomerInput): Promise<CustomerActionResult> {
  try {
    await requirePermission('manageCustomers')
  } catch (error) {
    if (error instanceof PermissionError) return { ok: false, error: 'forbidden' }
    throw error
  }

  const name = input.name.trim()
  if (!name) return { ok: false, error: 'nameRequired' }

  const email = normalizeEmail(input.email)
  const owner = await findEmailOwner(email)
  if (owner) return { ok: false, error: 'emailTaken', existingName: owner.name }

  const id = `local-${Date.now()}-${slugify(name) || 'customer'}`
  const customer = await toCustomer({ ...input, email: email || undefined }, id)

  try {
    if (sanityWriteClient) {
      const created = await sanityWriteClient.create({
        _type: 'customer',
        ...sanityPayload(customer, input.projectId),
      })
      await upsertLocalCustomer({ ...customer, _id: created._id })
    } else {
      await upsertLocalCustomer(customer)
    }
    refresh()
    return { ok: true }
  } catch {
    try {
      await upsertLocalCustomer(customer)
      refresh()
      return { ok: true }
    } catch {
      return { ok: false, error: 'saveFailed' }
    }
  }
}

export async function updateCustomer(input: CustomerInput): Promise<CustomerActionResult> {
  try {
    await requirePermission('manageCustomers')
  } catch (error) {
    if (error instanceof PermissionError) return { ok: false, error: 'forbidden' }
    throw error
  }

  const name = input.name.trim()
  if (!name) return { ok: false, error: 'nameRequired' }
  if (!input.id) return { ok: false, error: 'saveFailed' }

  const email = normalizeEmail(input.email)
  const owner = await findEmailOwner(email, input.id)
  if (owner) return { ok: false, error: 'emailTaken', existingName: owner.name }

  const customer = await toCustomer({ ...input, email: email || undefined }, input.id)

  try {
    if (sanityWriteClient && !input.id.startsWith('local-') && !input.id.startsWith('cust-')) {
      await sanityWriteClient
        .patch(input.id)
        .set(sanityPayload(customer, input.projectId))
        .unset([
          ...(customer.email ? [] : ['email']),
          ...(customer.phone ? [] : ['phone']),
          ...(customer.source ? [] : ['source']),
          ...(customer.budget ? [] : ['budget']),
          ...(customer.notes ? [] : ['notes']),
          ...(customer.lookingForLayouts?.length ? [] : ['lookingForLayouts']),
        ])
        .commit()
    }
    await upsertLocalCustomer(customer)
    refresh()
    return { ok: true }
  } catch {
    try {
      await upsertLocalCustomer(customer)
      refresh()
      return { ok: true }
    } catch {
      return { ok: false, error: 'saveFailed' }
    }
  }
}

export async function deleteCustomer(id: string): Promise<CustomerActionResult> {
  try {
    await requirePermission('manageCustomers')
  } catch (error) {
    if (error instanceof PermissionError) return { ok: false, error: 'forbidden' }
    throw error
  }

  if (!id) return { ok: false, error: 'saveFailed' }

  try {
    if (sanityWriteClient && !id.startsWith('local-') && !id.startsWith('cust-')) {
      await sanityWriteClient.delete(id)
    }
    await removeLocalCustomer(id)
    refresh()
    return { ok: true }
  } catch {
    try {
      await removeLocalCustomer(id)
      refresh()
      return { ok: true }
    } catch {
      return { ok: false, error: 'saveFailed' }
    }
  }
}
