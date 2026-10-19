'use server'

import { revalidatePath } from 'next/cache'
import { removeLocalProject, upsertLocalProject } from '@/lib/local-projects'
import { PermissionError, requirePermission } from '@/lib/permissions'
import { sanityWriteClient } from '@/lib/sanity-write'
import type { Project, ProjectChannel, ProjectStatus } from '@/lib/types'

export type ProjectActionResult =
  | { ok: true }
  | {
      ok: false
      error:
        | 'nameRequired'
        | 'saveFailed'
        | 'forbidden'
        | 'uploadFailed'
        | 'sanityWriteRequired'
        | 'sanityUnauthorized'
    }

function isUnauthorizedError(error: unknown) {
  if (!error || typeof error !== 'object') return false
  const candidate = error as { statusCode?: number; message?: string; response?: { statusCode?: number } }
  const status = candidate.statusCode ?? candidate.response?.statusCode
  const message = typeof candidate.message === 'string' ? candidate.message.toLowerCase() : ''
  return status === 401 || message.includes('unauthorized') || message.includes('session not found')
}

const PROJECT_TYPES = new Set(['apartment', 'house', 'commercial'])
const PROJECT_STATUSES = new Set<ProjectStatus>(['available', 'reserved', 'sold', 'inProgress'])
const PROJECT_CHANNELS = new Set<ProjectChannel>(['residential', 'sale', 'rent'])

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function refresh() {
  revalidatePath('/admin/projects')
  revalidatePath('/admin')
  revalidatePath('/admin/customers')
  revalidatePath('/admin/units')
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function readNumber(formData: FormData, key: string, fallback = 0) {
  const raw = readString(formData, key)
  const value = Number(raw)
  return Number.isFinite(value) ? value : fallback
}

function readFiles(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)
}

async function uploadSanityImage(file: File) {
  if (!sanityWriteClient) throw new Error('sanityWriteRequired')
  const buffer = Buffer.from(await file.arrayBuffer())
  return sanityWriteClient.assets.upload('image', buffer, {
    filename: file.name || 'project-image.jpg',
    contentType: file.type || 'image/jpeg',
  })
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const mime = file.type || 'image/jpeg'
  return `data:${mime};base64,${buffer.toString('base64')}`
}

function parseProjectFields(formData: FormData) {
  const name = readString(formData, 'name')
  const typeRaw = readString(formData, 'type')
  const statusRaw = readString(formData, 'status') as ProjectStatus
  const channels = formData
    .getAll('channels')
    .map((value) => String(value))
    .filter((value): value is ProjectChannel => PROJECT_CHANNELS.has(value as ProjectChannel))
  const type = PROJECT_TYPES.has(typeRaw) ? (typeRaw as Project['type']) : 'apartment'
  const status = PROJECT_STATUSES.has(statusRaw) ? statusRaw : 'available'
  const slug = readString(formData, 'slug') || slugify(name) || 'project'

  return {
    id: readString(formData, 'id') || undefined,
    name,
    slug: slug.slice(0, 96),
    location: readString(formData, 'location'),
    channels: channels.length ? [...new Set(channels)] : (['residential'] as ProjectChannel[]),
    type,
    layout: readString(formData, 'layout') || undefined,
    status,
    price: readString(formData, 'price'),
    units: Math.max(0, Math.round(readNumber(formData, 'units', 0))),
    areaSqm: Math.max(0, Math.round(readNumber(formData, 'areaSqm', 0))) || undefined,
    year: Math.round(readNumber(formData, 'year', new Date().getFullYear())),
    featured: readString(formData, 'featured') === 'true',
    websiteUrl: readString(formData, 'websiteUrl') || undefined,
    descriptionCs: readString(formData, 'descriptionCs') || undefined,
    descriptionEn: readString(formData, 'descriptionEn') || undefined,
  }
}

function toLocalProject(
  fields: ReturnType<typeof parseProjectFields>,
  id: string,
  imageUrl?: string,
): Project {
  return {
    _id: id,
    name: fields.name,
    slug: fields.slug,
    location: fields.location,
    channels: fields.channels,
    type: fields.type,
    layout: fields.layout,
    status: fields.status,
    price: fields.price,
    units: fields.units,
    areaSqm: fields.areaSqm,
    year: fields.year,
    featured: fields.featured,
    websiteUrl: fields.websiteUrl,
    imageUrl,
    descriptionCs: fields.descriptionCs,
    descriptionEn: fields.descriptionEn,
  }
}

export async function createProject(formData: FormData): Promise<ProjectActionResult> {
  try {
    await requirePermission('manageProjects')
  } catch (error) {
    if (error instanceof PermissionError) return { ok: false, error: 'forbidden' }
    throw error
  }

  const fields = parseProjectFields(formData)
  if (!fields.name) return { ok: false, error: 'nameRequired' }

  const heroFile = readFiles(formData, 'image')[0]
  const galleryFiles = readFiles(formData, 'gallery')

  if ((heroFile || galleryFiles.length) && !sanityWriteClient) {
    return { ok: false, error: 'sanityWriteRequired' }
  }

  const localId = `local-project-${Date.now()}-${slugify(fields.name) || 'project'}`

  try {
    let imageUrl: string | undefined
    let imageRef: { _type: 'image'; asset: { _type: 'reference'; _ref: string } } | undefined
    let gallery:
      | Array<{ _type: 'image'; _key: string; asset: { _type: 'reference'; _ref: string } }>
      | undefined

    if (sanityWriteClient) {
      if (heroFile) {
        const asset = await uploadSanityImage(heroFile)
        imageRef = {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
        }
        imageUrl = asset.url
      }

      if (galleryFiles.length) {
        const assets = await Promise.all(galleryFiles.map((file) => uploadSanityImage(file)))
        gallery = assets.map((asset, index) => ({
          _type: 'image' as const,
          _key: `g-${index}-${asset._id}`,
          asset: { _type: 'reference' as const, _ref: asset._id },
        }))
      }

      const created = await sanityWriteClient.create({
        _type: 'project',
        name: fields.name,
        slug: { _type: 'slug', current: fields.slug },
        location: fields.location || undefined,
        channels: fields.channels,
        type: fields.type,
        layout: fields.layout,
        status: fields.status,
        price: fields.price || undefined,
        units: fields.units,
        areaSqm: fields.areaSqm,
        year: fields.year,
        featured: fields.featured,
        websiteUrl: fields.websiteUrl,
        descriptionCs: fields.descriptionCs,
        descriptionEn: fields.descriptionEn,
        ...(imageRef ? { image: imageRef } : {}),
        ...(gallery ? { gallery } : {}),
      })

      await upsertLocalProject(toLocalProject(fields, created._id, imageUrl))
    } else {
      if (heroFile) imageUrl = await fileToDataUrl(heroFile)
      await upsertLocalProject(toLocalProject(fields, localId, imageUrl))
    }

    refresh()
    return { ok: true }
  } catch (error) {
    if (error instanceof Error && error.message === 'sanityWriteRequired') {
      return { ok: false, error: 'sanityWriteRequired' }
    }
    if (isUnauthorizedError(error)) return { ok: false, error: 'sanityUnauthorized' }
    return { ok: false, error: heroFile || galleryFiles.length ? 'uploadFailed' : 'saveFailed' }
  }
}

export async function updateProject(formData: FormData): Promise<ProjectActionResult> {
  try {
    await requirePermission('manageProjects')
  } catch (error) {
    if (error instanceof PermissionError) return { ok: false, error: 'forbidden' }
    throw error
  }

  const fields = parseProjectFields(formData)
  if (!fields.name) return { ok: false, error: 'nameRequired' }
  if (!fields.id) return { ok: false, error: 'saveFailed' }

  const heroFile = readFiles(formData, 'image')[0]
  const galleryFiles = readFiles(formData, 'gallery')
  const keepImageUrl = readString(formData, 'existingImageUrl') || undefined

  if ((heroFile || galleryFiles.length) && !sanityWriteClient) {
    return { ok: false, error: 'sanityWriteRequired' }
  }

  try {
    let imageUrl = keepImageUrl

    if (sanityWriteClient && !fields.id.startsWith('local-')) {
      const patch: Record<string, unknown> = {
        name: fields.name,
        slug: { _type: 'slug', current: fields.slug },
        location: fields.location || undefined,
        channels: fields.channels,
        type: fields.type,
        layout: fields.layout,
        status: fields.status,
        price: fields.price || undefined,
        units: fields.units,
        areaSqm: fields.areaSqm,
        year: fields.year,
        featured: fields.featured,
        websiteUrl: fields.websiteUrl,
        descriptionCs: fields.descriptionCs,
        descriptionEn: fields.descriptionEn,
      }

      if (heroFile) {
        const asset = await uploadSanityImage(heroFile)
        patch.image = {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
        }
        imageUrl = asset.url
      }

      if (galleryFiles.length) {
        const assets = await Promise.all(galleryFiles.map((file) => uploadSanityImage(file)))
        patch.gallery = assets.map((asset, index) => ({
          _type: 'image' as const,
          _key: `g-${index}-${asset._id}`,
          asset: { _type: 'reference' as const, _ref: asset._id },
        }))
      }

      await sanityWriteClient
        .patch(fields.id)
        .set(patch)
        .unset([
          ...(fields.websiteUrl ? [] : ['websiteUrl']),
          ...(fields.descriptionCs ? [] : ['descriptionCs']),
          ...(fields.descriptionEn ? [] : ['descriptionEn']),
          ...(fields.location ? [] : ['location']),
          ...(fields.price ? [] : ['price']),
          ...(fields.areaSqm ? [] : ['areaSqm']),
          ...(fields.layout ? [] : ['layout']),
          'channel',
          'coverImageUrl',
        ])
        .commit()
    } else if (heroFile) {
      imageUrl = await fileToDataUrl(heroFile)
    }

    await upsertLocalProject(toLocalProject(fields, fields.id, imageUrl))
    refresh()
    return { ok: true }
  } catch (error) {
    if (isUnauthorizedError(error)) return { ok: false, error: 'sanityUnauthorized' }
    return { ok: false, error: heroFile || galleryFiles.length ? 'uploadFailed' : 'saveFailed' }
  }
}

export async function deleteProject(id: string): Promise<ProjectActionResult> {
  try {
    await requirePermission('manageProjects')
  } catch (error) {
    if (error instanceof PermissionError) return { ok: false, error: 'forbidden' }
    throw error
  }

  if (!id) return { ok: false, error: 'saveFailed' }

  try {
    if (sanityWriteClient && !id.startsWith('local-')) {
      await sanityWriteClient.delete(id)
    }
    await removeLocalProject(id)
    refresh()
    return { ok: true }
  } catch {
    try {
      await removeLocalProject(id)
      refresh()
      return { ok: true }
    } catch {
      return { ok: false, error: 'saveFailed' }
    }
  }
}
