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
import { createProject, deleteProject, updateProject } from '@/lib/actions/projects'
import { compressImage, compressImages } from '@/lib/compress-image'
import type { Project, ProjectChannel, ProjectStatus } from '@/lib/types'
import { normalizeProjectChannels, PROJECT_CHANNELS } from '@/lib/types'
import { cn } from '@/lib/utils'

const PROJECT_TYPES = ['apartment', 'house', 'commercial'] as const
const PROJECT_STATUSES: ProjectStatus[] = ['available', 'reserved', 'sold', 'inProgress']

const selectClassName = cn(
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none',
  'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
)

const textareaClassName = cn(
  'min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none',
  'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
)

const fileClassName = cn(
  'block w-full text-sm text-muted-foreground',
  'file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground',
)

type FormState = {
  name: string
  slug: string
  location: string
  channels: ProjectChannel[]
  type: (typeof PROJECT_TYPES)[number]
  layout: string
  status: ProjectStatus
  price: string
  units: string
  areaSqm: string
  year: string
  featured: boolean
  websiteUrl: string
  descriptionCs: string
  descriptionEn: string
}

const emptyForm: FormState = {
  name: '',
  slug: '',
  location: '',
  channels: ['residential'],
  type: 'apartment',
  layout: '',
  status: 'available',
  price: '',
  units: '1',
  areaSqm: '',
  year: String(new Date().getFullYear()),
  featured: false,
  websiteUrl: '',
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

function formFromProject(project: Project | null): FormState {
  if (!project) return emptyForm
  return {
    name: project.name,
    slug: project.slug,
    location: project.location ?? '',
    channels: normalizeProjectChannels(project.channels, project.channel),
    type: (PROJECT_TYPES.includes(project.type as (typeof PROJECT_TYPES)[number])
      ? project.type
      : 'apartment') as FormState['type'],
    layout: project.layout ?? '',
    status: project.status,
    price: project.price ?? '',
    units: String(project.units ?? 0),
    areaSqm: project.areaSqm ? String(project.areaSqm) : '',
    year: String(project.year ?? new Date().getFullYear()),
    featured: Boolean(project.featured),
    websiteUrl: project.websiteUrl ?? '',
    descriptionCs: project.descriptionCs ?? '',
    descriptionEn: project.descriptionEn ?? '',
  }
}

export function ProjectEditor({
  project,
  open,
  onClose,
}: {
  project: Project | null
  open: boolean
  onClose: () => void
}) {
  const { t } = useLanguage()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [compressing, setCompressing] = useState(false)
  const [heroPreview, setHeroPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()
  const isEdit = Boolean(project)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    setForm(formFromProject(project))
    setHeroFile(null)
    setGalleryFiles([])
    setHeroPreview(project?.imageUrl ?? null)
    setError('')
  }, [open, project])

  useEffect(() => {
    if (!heroFile) return
    const url = URL.createObjectURL(heroFile)
    setHeroPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [heroFile])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')

    const formData = new FormData()
    if (project?._id) formData.set('id', project._id)
    formData.set('name', form.name)
    formData.set('slug', form.slug)
    formData.set('location', form.location)
    for (const channel of form.channels) formData.append('channels', channel)
    formData.set('type', form.type)
    formData.set('layout', form.layout)
    formData.set('status', form.status)
    formData.set('price', form.price)
    formData.set('units', form.units)
    formData.set('areaSqm', form.areaSqm)
    formData.set('year', form.year)
    formData.set('featured', form.featured ? 'true' : 'false')
    formData.set('websiteUrl', form.websiteUrl)
    formData.set('descriptionCs', form.descriptionCs)
    formData.set('descriptionEn', form.descriptionEn)
    if (project?.imageUrl) formData.set('existingImageUrl', project.imageUrl)
    if (heroFile) formData.set('image', heroFile)
    for (const file of galleryFiles) formData.append('gallery', file)

    startTransition(async () => {
      const result = isEdit ? await updateProject(formData) : await createProject(formData)
      if (!result.ok) {
        const message = t.projects.errors[result.error]
        setError(message)
        toast.error(message)
        return
      }
      toast.success(isEdit ? t.projects.updated : t.projects.created)
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
            <h2 className="text-lg font-semibold">
              {isEdit ? t.projects.editTitle : t.projects.addTitle}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEdit ? t.projects.editDescription : t.projects.addDescription}
            </p>
          </div>
          <button
            type="button"
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}
            onClick={onClose}
          >
            <X className="size-4" />
          </button>
        </div>

        <form className="flex flex-1 flex-col gap-3" onSubmit={onSubmit}>
          <div className="grid gap-1.5">
            <Label htmlFor="project-name">{t.projects.name}</Label>
            <Input
              id="project-name"
              value={form.name}
              onChange={(event) => {
                const name = event.target.value
                updateField('name', name)
                if (!isEdit || !form.slug) updateField('slug', slugify(name))
              }}
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="project-slug">{t.projects.slug}</Label>
            <Input
              id="project-slug"
              value={form.slug}
              onChange={(event) => updateField('slug', slugify(event.target.value))}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="project-location">{t.projects.location}</Label>
            <Input
              id="project-location"
              value={form.location}
              onChange={(event) => updateField('location', event.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label>{t.projects.channel}</Label>
            <p className="text-xs text-muted-foreground">{t.projects.channelHint}</p>
            <div className="grid grid-cols-3 gap-1.5">
              {PROJECT_CHANNELS.map((channel) => {
                const active = form.channels.includes(channel)
                return (
                  <button
                    key={channel}
                    type="button"
                    aria-pressed={active}
                    className={cn(
                      buttonVariants({ variant: active ? 'default' : 'outline', size: 'sm' }),
                      'h-auto min-h-8 whitespace-normal px-2 py-1.5 text-center text-xs leading-snug',
                    )}
                    onClick={() => {
                      if (active && form.channels.length === 1) return
                      updateField(
                        'channels',
                        active
                          ? form.channels.filter((value) => value !== channel)
                          : [...form.channels, channel],
                      )
                    }}
                  >
                    {t.projects.channels[channel]}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="project-type">{t.projects.type}</Label>
              <select
                id="project-type"
                className={selectClassName}
                value={form.type}
                onChange={(event) => updateField('type', event.target.value as FormState['type'])}
              >
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t.projects.types[type]}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="project-status">{t.projects.status}</Label>
              <select
                id="project-status"
                className={selectClassName}
                value={form.status}
                onChange={(event) => updateField('status', event.target.value as ProjectStatus)}
              >
                {PROJECT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {t.projects.statuses[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {form.channels.includes('sale') || form.channels.includes('rent') ? (
            <div className="grid gap-1.5">
              <Label htmlFor="project-layout">{t.projects.layout}</Label>
              <Input
                id="project-layout"
                value={form.layout}
                placeholder={t.projects.layoutPlaceholder}
                onChange={(event) => updateField('layout', event.target.value)}
              />
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="project-price">{t.projects.price}</Label>
              <Input
                id="project-price"
                value={form.price}
                placeholder={t.projects.pricePlaceholder}
                onChange={(event) => updateField('price', event.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="project-units">{t.projects.units}</Label>
              <Input
                id="project-units"
                type="number"
                min={0}
                value={form.units}
                onChange={(event) => updateField('units', event.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="project-area">{t.projects.areaSqm}</Label>
              <Input
                id="project-area"
                type="number"
                min={0}
                step={1}
                value={form.areaSqm}
                placeholder={t.projects.areaPlaceholder}
                onChange={(event) => updateField('areaSqm', event.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="project-year">{t.projects.year}</Label>
              <Input
                id="project-year"
                type="number"
                min={1990}
                max={2100}
                value={form.year}
                onChange={(event) => updateField('year', event.target.value)}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => updateField('featured', event.target.checked)}
            />
            {t.projects.featured}
          </label>

          <div className="grid gap-1.5">
            <Label htmlFor="project-website">{t.projects.websiteUrl}</Label>
            <Input
              id="project-website"
              type="url"
              value={form.websiteUrl}
              onChange={(event) => updateField('websiteUrl', event.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="project-image">{t.projects.heroImage}</Label>
            <input
              id="project-image"
              className={fileClassName}
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) {
                  setHeroFile(null)
                  return
                }
                setCompressing(true)
                void compressImage(file)
                  .then(setHeroFile)
                  .finally(() => setCompressing(false))
              }}
            />
            <p className="text-xs text-muted-foreground">{t.projects.heroImageHint}</p>
            {compressing && !galleryFiles.length ? (
              <p className="text-xs text-muted-foreground">{t.projects.compressing}</p>
            ) : null}
            {heroPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                className="mt-1 h-28 w-full rounded-lg border object-cover"
                src={heroPreview}
              />
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="project-gallery">{t.projects.galleryImages}</Label>
            <input
              id="project-gallery"
              className={fileClassName}
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
            <p className="text-xs text-muted-foreground">{t.projects.galleryImagesHint}</p>
            {galleryFiles.length || compressing ? (
              <p className="text-xs text-muted-foreground">
                {compressing
                  ? t.projects.compressing
                  : `${galleryFiles.length} ${t.projects.filesSelected}`}
              </p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="project-desc-cs">{t.projects.descriptionCs}</Label>
            <textarea
              id="project-desc-cs"
              className={textareaClassName}
              value={form.descriptionCs}
              onChange={(event) => updateField('descriptionCs', event.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="project-desc-en">{t.projects.descriptionEn}</Label>
            <textarea
              id="project-desc-en"
              className={textareaClassName}
              value={form.descriptionEn}
              onChange={(event) => updateField('descriptionEn', event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {isEdit ? (
              <button
                type="button"
                className={cn(buttonVariants({ variant: 'destructive' }))}
                disabled={pending}
                onClick={() => {
                  if (!project || !window.confirm(t.projects.confirmDelete)) return
                  startTransition(async () => {
                    const result = await deleteProject(project._id)
                    if (!result.ok) {
                      const message = t.projects.errors[result.error]
                      setError(message)
                      toast.error(message)
                      return
                    }
                    toast.success(t.projects.deleted)
                    onClose()
                    router.refresh()
                  })
                }}
              >
                {pending ? t.projects.deleting : t.projects.delete}
              </button>
            ) : null}
            <button
              type="button"
              className={cn(buttonVariants({ variant: 'outline' }), 'ml-auto')}
              onClick={onClose}
              disabled={pending}
            >
              {t.projects.cancel}
            </button>
            <button type="submit" className={cn(buttonVariants())} disabled={pending || compressing}>
              {pending ? t.projects.saving : t.projects.save}
            </button>
          </div>
        </form>
      </aside>
    </div>,
    document.body,
  )
}

export function AddProjectButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" className={cn(buttonVariants())} onClick={onClick}>
      <Plus className="size-4" />
      {label}
    </button>
  )
}
