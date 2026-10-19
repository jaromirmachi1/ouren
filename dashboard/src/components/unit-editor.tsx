'use client'

import { FormEvent, useEffect, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/components/language-provider'
import { createUnit, deleteUnit, updateUnit } from '@/lib/actions/units'
import { compressImage, compressImages } from '@/lib/compress-image'
import type { Unit, UnitKind, UnitStatus } from '@/lib/types'
import { UNIT_KINDS } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUSES: UnitStatus[] = ['available', 'reserved', 'sold', 'rented']

const selectClassName = cn(
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none',
  'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
)

const textareaClassName = cn(
  'min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none',
  'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
)

type ProjectOption = { _id: string; name: string }

type FormState = {
  label: string
  slug: string
  kind: UnitKind
  location: string
  layout: string
  status: UnitStatus
  floor: string
  rooms: string
  areaSqm: string
  landAreaSqm: string
  priceCzk: string
  listOnSale: boolean
  listOnRent: boolean
  projectId: string
  descriptionCs: string
  descriptionEn: string
}

const emptyForm: FormState = {
  label: '',
  slug: '',
  kind: 'apartment',
  location: '',
  layout: '',
  status: 'available',
  floor: '',
  rooms: '',
  areaSqm: '',
  landAreaSqm: '',
  priceCzk: '',
  listOnSale: true,
  listOnRent: false,
  projectId: '',
  descriptionCs: '',
  descriptionEn: '',
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function formFromUnit(unit: Unit | null): FormState {
  if (!unit) return emptyForm
  return {
    label: unit.label,
    slug: unit.slug ?? '',
    kind: unit.kind === 'house' || unit.kind === 'land' ? unit.kind : 'apartment',
    location: unit.location ?? '',
    layout: unit.layout ?? '',
    status: unit.status,
    floor: unit.floor != null ? String(unit.floor) : '',
    rooms: unit.rooms != null ? String(unit.rooms) : '',
    areaSqm: unit.areaSqm != null ? String(unit.areaSqm) : '',
    landAreaSqm: unit.landAreaSqm != null ? String(unit.landAreaSqm) : '',
    priceCzk: unit.priceCzk != null ? String(unit.priceCzk) : '',
    listOnSale: unit.listOnSale !== false,
    listOnRent: Boolean(unit.listOnRent),
    projectId: unit.projectId ?? '',
    descriptionCs: unit.descriptionCs ?? '',
    descriptionEn: unit.descriptionEn ?? '',
  }
}

export function UnitEditor({
  unit,
  projects,
  open,
  onClose,
}: {
  unit: Unit | null
  projects: ProjectOption[]
  open: boolean
  onClose: () => void
}) {
  const { t } = useLanguage()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [keptGallery, setKeptGallery] = useState<{ key: string; ref: string; url: string }[]>([])
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [compressing, setCompressing] = useState(false)
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()
  const isEdit = Boolean(unit)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    setForm(formFromUnit(unit))
    setImage(null)
    setPreview(unit?.imageUrl ?? null)
    setKeptGallery((unit?.gallery ?? []).filter((item) => item.ref && item.url))
    setGalleryFiles([])
    setError('')
  }, [open, unit])

  useEffect(() => {
    if (!image) return
    const url = URL.createObjectURL(image)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [image])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    const data = new FormData()
    if (unit?._id) data.set('id', unit._id)
    data.set('label', form.label)
    data.set('slug', form.slug)
    data.set('kind', form.kind)
    data.set('location', form.location)
    data.set('layout', form.layout)
    data.set('status', form.status)
    data.set('floor', form.floor)
    data.set('rooms', form.rooms)
    data.set('areaSqm', form.areaSqm)
    data.set(
      'landAreaSqm',
      form.kind === 'house' || form.kind === 'land' ? form.landAreaSqm : '',
    )
    data.set('priceCzk', form.priceCzk)
    data.set('listOnSale', form.listOnSale ? 'true' : 'false')
    data.set('listOnRent', form.listOnRent ? 'true' : 'false')
    data.set('projectId', form.projectId)
    data.set('descriptionCs', form.descriptionCs)
    data.set('descriptionEn', form.descriptionEn)
    if (image) data.set('image', image)
    for (const item of keptGallery) data.append('galleryRef', item.ref)
    for (const file of galleryFiles) data.append('gallery', file)

    startTransition(async () => {
      const result = isEdit ? await updateUnit(data) : await createUnit(data)
      if (!result.ok) {
        const message = t.units.errors[result.error]
        setError(message)
        toast.error(message)
        return
      }
      toast.success(isEdit ? t.units.updated : t.units.created)
      onClose()
      router.refresh()
    })
  }

  if (!mounted || !open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 p-3 backdrop-blur-[1px]">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close" onClick={onClose} />
      <aside className="relative z-10 flex h-full w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-xl border bg-background p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{isEdit ? t.units.editTitle : t.units.addTitle}</h2>
            <p className="text-sm text-muted-foreground">
              {isEdit ? t.units.editDescription : t.units.addDescription}
            </p>
          </div>
          <button type="button" className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))} onClick={onClose}>
            <X className="size-4" />
          </button>
        </div>

        <form className="flex flex-1 flex-col gap-3" onSubmit={onSubmit}>
          <div className="grid gap-1.5">
            <Label>{t.units.kind}</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {UNIT_KINDS.map((kind) => (
                <button
                  key={kind}
                  type="button"
                  aria-pressed={form.kind === kind}
                  className={cn(
                    buttonVariants({ variant: form.kind === kind ? 'default' : 'outline', size: 'sm' }),
                    'h-8',
                  )}
                  onClick={() => update('kind', kind)}
                >
                  {t.units.kinds[kind]}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="unit-label">{t.units.label}</Label>
            <Input
              id="unit-label"
              required
              value={form.label}
              onChange={(event) => {
                const label = event.target.value
                update('label', label)
                if (!isEdit || !form.slug) update('slug', slugify(label))
              }}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="unit-location">{t.units.location}</Label>
            <Input id="unit-location" value={form.location} onChange={(event) => update('location', event.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {form.kind !== 'land' ? (
              <div className="grid gap-1.5">
                <Label htmlFor="unit-layout">{t.units.layout}</Label>
                <Input
                  id="unit-layout"
                  placeholder="3+kk"
                  value={form.layout}
                  onChange={(event) => update('layout', event.target.value)}
                />
              </div>
            ) : null}
            <div className="grid gap-1.5">
              <Label htmlFor="unit-status">{t.units.status}</Label>
              <select
                id="unit-status"
                className={selectClassName}
                value={form.status}
                onChange={(event) => update('status', event.target.value as UnitStatus)}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {t.units.statuses[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {form.kind !== 'land' ? (
              <div className="grid gap-1.5">
                <Label htmlFor="unit-area">{form.kind === 'house' ? t.units.areaHouse : t.units.area}</Label>
                <Input
                  id="unit-area"
                  type="number"
                  min={0}
                  value={form.areaSqm}
                  onChange={(event) => update('areaSqm', event.target.value)}
                />
              </div>
            ) : null}
            <div className="grid gap-1.5">
              <Label htmlFor="unit-price">{t.units.price}</Label>
              <Input id="unit-price" type="number" min={0} value={form.priceCzk} onChange={(event) => update('priceCzk', event.target.value)} />
            </div>
          </div>
          {form.kind === 'house' || form.kind === 'land' ? (
            <div className="grid gap-1.5">
              <Label htmlFor="unit-land">{t.units.landArea} (m²)</Label>
              <Input
                id="unit-land"
                type="number"
                min={0}
                value={form.landAreaSqm}
                onChange={(event) => update('landAreaSqm', event.target.value)}
              />
            </div>
          ) : null}
          {form.kind === 'apartment' || form.kind === 'house' ? (
            <div className="grid grid-cols-2 gap-3">
              {form.kind === 'apartment' ? (
                <div className="grid gap-1.5">
                  <Label htmlFor="unit-floor">{t.units.floor}</Label>
                  <Input id="unit-floor" type="number" value={form.floor} onChange={(event) => update('floor', event.target.value)} />
                </div>
              ) : null}
              <div className="grid gap-1.5">
                <Label htmlFor="unit-rooms">{t.units.rooms}</Label>
                <Input id="unit-rooms" type="number" min={0} value={form.rooms} onChange={(event) => update('rooms', event.target.value)} />
              </div>
            </div>
          ) : null}
          <div className="grid gap-1.5">
            <Label htmlFor="unit-project">{t.units.project}</Label>
            <select
              id="unit-project"
              className={selectClassName}
              value={form.projectId}
              onChange={(event) => update('projectId', event.target.value)}
            >
              <option value="">{t.units.noProject}</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.listOnSale}
                onChange={(event) => update('listOnSale', event.target.checked)}
              />
              {t.units.listOnSale}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.listOnRent}
                onChange={(event) => update('listOnRent', event.target.checked)}
              />
              {t.units.listOnRent}
            </label>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="unit-image">{t.units.image}</Label>
            <input
              id="unit-image"
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) {
                  setImage(null)
                  return
                }
                setCompressing(true)
                void compressImage(file)
                  .then(setImage)
                  .finally(() => setCompressing(false))
              }}
            />
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" className="mt-1 h-28 w-full rounded-lg border object-cover" src={preview} />
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="unit-gallery">{t.units.gallery}</Label>
            <input
              id="unit-gallery"
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => {
                const files = Array.from(event.target.files ?? [])
                if (!files.length) {
                  setGalleryFiles([])
                  return
                }
                setCompressing(true)
                void compressImages(files)
                  .then(setGalleryFiles)
                  .finally(() => setCompressing(false))
              }}
            />
            <p className="text-xs text-muted-foreground">{t.units.galleryHint}</p>
            {compressing && !galleryFiles.length ? (
              <p className="text-xs text-muted-foreground">{t.units.compressing}</p>
            ) : null}
            {galleryFiles.length ? (
              <p className="text-xs text-muted-foreground">
                {compressing ? t.units.compressing : `${galleryFiles.length} ${t.units.filesSelected}`}
              </p>
            ) : compressing ? (
              <p className="text-xs text-muted-foreground">{t.units.compressing}</p>
            ) : null}
            {keptGallery.length ? (
              <div className="mt-1 grid grid-cols-3 gap-2">
                {keptGallery.map((item) => (
                  <div key={item.ref} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="" className="h-20 w-full rounded-md border object-cover" src={item.url} />
                    <button
                      type="button"
                      className="absolute right-1 top-1 rounded-md bg-background/90 px-1.5 py-0.5 text-xs"
                      onClick={() => setKeptGallery((current) => current.filter((photo) => photo.ref !== item.ref))}
                    >
                      {t.units.remove}
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="unit-cs">{t.units.descriptionCs}</Label>
            <textarea id="unit-cs" className={textareaClassName} value={form.descriptionCs} onChange={(event) => update('descriptionCs', event.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="unit-en">{t.units.descriptionEn}</Label>
            <textarea id="unit-en" className={textareaClassName} value={form.descriptionEn} onChange={(event) => update('descriptionEn', event.target.value)} />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {isEdit && unit ? (
              <button
                type="button"
                className={cn(buttonVariants({ variant: 'destructive' }))}
                disabled={pending}
                onClick={() => {
                  if (!window.confirm(t.units.confirmDelete)) return
                  startTransition(async () => {
                    const result = await deleteUnit(unit._id)
                    if (!result.ok) {
                      toast.error(t.units.errors[result.error])
                      return
                    }
                    toast.success(t.units.deleted)
                    onClose()
                    router.refresh()
                  })
                }}
              >
                {t.units.delete}
              </button>
            ) : null}
            <button type="button" className={cn(buttonVariants({ variant: 'outline' }), 'ml-auto')} onClick={onClose} disabled={pending}>
              {t.units.cancel}
            </button>
            <button type="submit" className={cn(buttonVariants())} disabled={pending || compressing}>
              {pending ? t.units.saving : t.units.save}
            </button>
          </div>
        </form>
      </aside>
    </div>,
    document.body,
  )
}

export function AddUnitButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" className={cn(buttonVariants())} onClick={onClick}>
      <Plus className="size-4" />
      {label}
    </button>
  )
}
