'use server'

import { revalidatePath } from 'next/cache'
import { PermissionError, requirePermission } from '@/lib/permissions'
import { sanityWriteClient } from '@/lib/sanity-write'
import type { UnitKind, UnitStatus } from '@/lib/types'

export type UnitActionResult =
  | { ok: true }
  | {
      ok: false
      error: 'nameRequired' | 'saveFailed' | 'forbidden' | 'uploadFailed' | 'sanityWriteRequired' | 'sanityUnauthorized'
    }

const STATUSES = new Set<UnitStatus>(['available', 'reserved', 'sold', 'rented'])
const KINDS = new Set<UnitKind>(['apartment', 'house', 'land'])

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function readNumber(formData: FormData, key: string) {
  const raw = readString(formData, key)
  if (!raw) return undefined
  const value = Number(raw)
  return Number.isFinite(value) ? value : undefined
}

function isUnauthorizedError(error: unknown) {
  if (!error || typeof error !== 'object') return false
  const candidate = error as { statusCode?: number; message?: string }
  const message = typeof candidate.message === 'string' ? candidate.message.toLowerCase() : ''
  return candidate.statusCode === 401 || message.includes('unauthorized') || message.includes('session not found')
}

function galleryFrom(refs: string[], uploads: { _id: string }[]) {
  const existing = refs.map((ref, index) => ({
    _type: 'image' as const,
    _key: `keep-${index}-${ref.slice(-6)}`,
    asset: { _type: 'reference' as const, _ref: ref },
  }))
  const added = uploads.map((asset, index) => ({
    _type: 'image' as const,
    _key: `new-${index}-${asset._id.slice(-6)}`,
    asset: { _type: 'reference' as const, _ref: asset._id },
  }))
  return [...existing, ...added]
}

function readFiles(formData: FormData, key: string) {
  return formData.getAll(key).filter((entry): entry is File => entry instanceof File && entry.size > 0)
}

function readRefs(formData: FormData) {
  return formData.getAll('galleryRef').filter((entry): entry is string => typeof entry === 'string' && entry.length > 0)
}

async function uploadImage(file: File) {
  if (!sanityWriteClient) throw new Error('sanityWriteRequired')
  const buffer = Buffer.from(await file.arrayBuffer())
  return sanityWriteClient.assets.upload('image', buffer, {
    filename: file.name || 'flat.jpg',
    contentType: file.type || 'image/jpeg',
  })
}

function parseUnit(formData: FormData) {
  const label = readString(formData, 'label')
  const statusRaw = readString(formData, 'status') as UnitStatus
  const kindRaw = readString(formData, 'kind') as UnitKind
  const kind = KINDS.has(kindRaw) ? kindRaw : 'apartment'
  const landAreaSqm =
    kind === 'house' || kind === 'land' ? readNumber(formData, 'landAreaSqm') : undefined
  return {
    id: readString(formData, 'id') || undefined,
    label,
    slug: (readString(formData, 'slug') || slugify(label) || 'nemovitost').slice(0, 96),
    kind,
    location: readString(formData, 'location') || undefined,
    layout: readString(formData, 'layout') || undefined,
    listOnSale: readString(formData, 'listOnSale') === 'true',
    listOnRent: readString(formData, 'listOnRent') === 'true',
    projectId: readString(formData, 'projectId') || undefined,
    status: STATUSES.has(statusRaw) ? statusRaw : 'available',
    floor: kind === 'apartment' ? readNumber(formData, 'floor') : undefined,
    rooms: kind === 'land' ? undefined : readNumber(formData, 'rooms'),
    areaSqm: kind === 'land' ? undefined : readNumber(formData, 'areaSqm'),
    landAreaSqm,
    priceCzk: readNumber(formData, 'priceCzk'),
    descriptionCs: readString(formData, 'descriptionCs') || undefined,
    descriptionEn: readString(formData, 'descriptionEn') || undefined,
  }
}

function documentFrom(fields: ReturnType<typeof parseUnit>, imageRef?: { _type: 'image'; asset: { _type: 'reference'; _ref: string } }) {
  return {
    label: fields.label,
    slug: { _type: 'slug' as const, current: fields.slug },
    kind: fields.kind,
    listOnSale: fields.listOnSale,
    listOnRent: fields.listOnRent,
    status: fields.status,
    ...(fields.location ? { location: fields.location } : {}),
    ...(fields.layout ? { layout: fields.layout } : {}),
    ...(fields.floor != null ? { floor: fields.floor } : {}),
    ...(fields.rooms != null ? { rooms: fields.rooms } : {}),
    ...(fields.areaSqm != null ? { areaSqm: fields.areaSqm } : {}),
    ...(fields.landAreaSqm != null ? { landAreaSqm: fields.landAreaSqm } : {}),
    ...(fields.priceCzk != null ? { priceCzk: fields.priceCzk } : {}),
    ...(fields.descriptionCs ? { descriptionCs: fields.descriptionCs } : {}),
    ...(fields.descriptionEn ? { descriptionEn: fields.descriptionEn } : {}),
    ...(fields.projectId
      ? { project: { _type: 'reference' as const, _ref: fields.projectId } }
      : {}),
    ...(imageRef ? { image: imageRef } : {}),
  }
}

export async function createUnit(formData: FormData): Promise<UnitActionResult> {
  try {
    await requirePermission('manageProjects')
  } catch (error) {
    if (error instanceof PermissionError) return { ok: false, error: 'forbidden' }
    throw error
  }

  if (!sanityWriteClient) return { ok: false, error: 'sanityWriteRequired' }

  const fields = parseUnit(formData)
  if (!fields.label) return { ok: false, error: 'nameRequired' }
  const file = formData.get('image')
  const galleryFiles = readFiles(formData, 'gallery')

  try {
    let imageRef: { _type: 'image'; asset: { _type: 'reference'; _ref: string } } | undefined
    if (file instanceof File && file.size > 0) {
      const asset = await uploadImage(file)
      imageRef = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
    }
    const uploaded = galleryFiles.length ? await Promise.all(galleryFiles.map((item) => uploadImage(item))) : []
    const gallery = galleryFrom(readRefs(formData), uploaded)
    await sanityWriteClient.create({
      _type: 'unit',
      ...documentFrom(fields, imageRef),
      ...(gallery.length ? { gallery } : {}),
    })
    revalidatePath('/units')
    return { ok: true }
  } catch (error) {
    if (isUnauthorizedError(error)) return { ok: false, error: 'sanityUnauthorized' }
    return { ok: false, error: file instanceof File || galleryFiles.length ? 'uploadFailed' : 'saveFailed' }
  }
}

export async function updateUnit(formData: FormData): Promise<UnitActionResult> {
  try {
    await requirePermission('manageProjects')
  } catch (error) {
    if (error instanceof PermissionError) return { ok: false, error: 'forbidden' }
    throw error
  }

  if (!sanityWriteClient) return { ok: false, error: 'sanityWriteRequired' }

  const fields = parseUnit(formData)
  if (!fields.label || !fields.id) return { ok: false, error: fields.label ? 'saveFailed' : 'nameRequired' }
  const file = formData.get('image')
  const galleryFiles = readFiles(formData, 'gallery')
  const keptRefs = readRefs(formData)

  try {
    const patch = documentFrom(fields)
    if (file instanceof File && file.size > 0) {
      const asset = await uploadImage(file)
      Object.assign(patch, {
        image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
      })
    }
    const uploaded = galleryFiles.length ? await Promise.all(galleryFiles.map((item) => uploadImage(item))) : []
    const gallery = galleryFrom(keptRefs, uploaded)
    if (gallery.length) Object.assign(patch, { gallery })
    await sanityWriteClient
      .patch(fields.id)
      .set(patch)
      .unset([
        ...(fields.projectId ? [] : ['project']),
        ...(fields.location ? [] : ['location']),
        ...(fields.layout ? [] : ['layout']),
        ...(fields.floor != null ? [] : ['floor']),
        ...(fields.rooms != null ? [] : ['rooms']),
        ...(fields.areaSqm != null ? [] : ['areaSqm']),
        ...(fields.landAreaSqm != null ? [] : ['landAreaSqm']),
        ...(fields.descriptionCs ? [] : ['descriptionCs']),
        ...(fields.descriptionEn ? [] : ['descriptionEn']),
        ...(gallery.length ? [] : ['gallery']),
      ])
      .commit()
    revalidatePath('/units')
    return { ok: true }
  } catch (error) {
    if (isUnauthorizedError(error)) return { ok: false, error: 'sanityUnauthorized' }
    return { ok: false, error: 'saveFailed' }
  }
}

export async function deleteUnit(id: string): Promise<UnitActionResult> {
  try {
    await requirePermission('manageProjects')
  } catch (error) {
    if (error instanceof PermissionError) return { ok: false, error: 'forbidden' }
    throw error
  }
  if (!sanityWriteClient || !id) return { ok: false, error: 'saveFailed' }
  try {
    await sanityWriteClient.delete(id)
    revalidatePath('/units')
    return { ok: true }
  } catch {
    return { ok: false, error: 'saveFailed' }
  }
}
