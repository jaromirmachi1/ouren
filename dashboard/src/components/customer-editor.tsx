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
import { createCustomer, deleteCustomer, updateCustomer } from '@/lib/actions/customers'
import type { Customer, CustomerStatus, FlatLayout, Project } from '@/lib/types'
import { FLAT_LAYOUTS } from '@/lib/types'
import { cn } from '@/lib/utils'

const CUSTOMER_STATUSES: CustomerStatus[] = [
  'lead',
  'qualified',
  'reservation',
  'contract',
  'closed',
  'lost',
]

const selectClassName = cn(
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none',
  'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
)

const textareaClassName = cn(
  'min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none',
  'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
)

type FormState = {
  name: string
  email: string
  phone: string
  status: CustomerStatus
  source: string
  budget: string
  notes: string
  projectId: string
  lookingForLayouts: FlatLayout[]
  portalAccess: boolean
}

const emptyForm: FormState = {
  name: '',
  email: '',
  phone: '',
  status: 'lead',
  source: '',
  budget: '',
  notes: '',
  projectId: '',
  lookingForLayouts: [],
  portalAccess: false,
}

function formFromCustomer(customer: Customer | null, projects: Project[]): FormState {
  if (!customer) return emptyForm
  const projectId =
    projects.find((project) => customer.interestedProjects?.includes(project.name))?._id ?? ''
  return {
    name: customer.name,
    email: customer.email ?? '',
    phone: customer.phone ?? '',
    status: customer.status,
    source: customer.source ?? '',
    budget: customer.budget ?? '',
    notes: customer.notes ?? '',
    projectId,
    lookingForLayouts: customer.lookingForLayouts ?? [],
    portalAccess: Boolean(customer.portalAccess),
  }
}

export function CustomerEditor({
  projects,
  customer,
  open,
  onClose,
}: {
  projects: Project[]
  customer: Customer | null
  open: boolean
  onClose: () => void
}) {
  const { t } = useLanguage()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()
  const isEdit = Boolean(customer)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    setForm(formFromCustomer(customer, projects))
    setError('')
  }, [open, customer, projects])

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

    startTransition(async () => {
      const payload = {
        id: customer?._id,
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        status: form.status,
        source: form.source || undefined,
        budget: form.budget || undefined,
        notes: form.notes || undefined,
        projectId: form.projectId || undefined,
        lookingForLayouts: form.lookingForLayouts,
        portalAccess: form.portalAccess,
      }
      const result = isEdit ? await updateCustomer(payload) : await createCustomer(payload)

      if (!result.ok) {
        const message = t.customers.errors[result.error].replace(
          '{name}',
          result.existingName || '',
        )
        setError(message)
        toast.error(message)
        return
      }

      toast.success(isEdit ? t.customers.updated : t.customers.created)
      onClose()
      router.refresh()
    })
  }

  if (!open || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-200 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        aria-label={t.customers.cancel}
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l bg-white shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b p-4">
          <div>
            <h2 className="text-base font-medium">
              {isEdit ? t.customers.editTitle : t.customers.addTitle}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEdit ? t.customers.editDescription : t.customers.addDescription}
            </p>
          </div>
          <button
            type="button"
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }))}
            onClick={onClose}
          >
            <X />
            <span className="sr-only">{t.customers.cancel}</span>
          </button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">{t.customers.name}</Label>
            <Input
              id="customer-name"
              required
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-email">{t.customers.email}</Label>
            <Input
              id="customer-email"
              type="email"
              value={form.email}
              autoComplete="off"
              onChange={(event) => updateField('email', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-phone">{t.customers.phone}</Label>
            <Input
              id="customer-phone"
              type="tel"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-status">{t.customers.status}</Label>
            <select
              id="customer-status"
              className={selectClassName}
              value={form.status}
              onChange={(event) => updateField('status', event.target.value as CustomerStatus)}
            >
              {CUSTOMER_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {t.status.customer[value]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>{t.customers.layouts}</Label>
            <p className="text-xs text-muted-foreground">{t.customers.layoutsHint}</p>
            <div className="flex flex-wrap gap-2">
              {FLAT_LAYOUTS.map((layout) => {
                const checked = form.lookingForLayouts.includes(layout)
                return (
                  <label
                    key={layout}
                    className={cn(
                      'cursor-pointer rounded-lg border px-3 py-1.5 text-sm',
                      checked
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-input text-muted-foreground',
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => {
                        updateField(
                          'lookingForLayouts',
                          checked
                            ? form.lookingForLayouts.filter((item) => item !== layout)
                            : [...form.lookingForLayouts, layout],
                        )
                      }}
                    />
                    {layout}
                  </label>
                )
              })}
            </div>
          </div>
          {projects.length > 0 ? (
            <div className="space-y-2">
              <Label htmlFor="customer-project">{t.customers.projects}</Label>
              <select
                id="customer-project"
                className={selectClassName}
                value={form.projectId}
                onChange={(event) => updateField('projectId', event.target.value)}
              >
                <option value="">{t.customers.noProject}</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="customer-source">{t.customers.source}</Label>
            <Input
              id="customer-source"
              value={form.source}
              onChange={(event) => updateField('source', event.target.value)}
              placeholder={t.customers.sourcePlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-budget">{t.customers.budget}</Label>
            <Input
              id="customer-budget"
              value={form.budget}
              onChange={(event) => updateField('budget', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-notes">{t.customers.notes}</Label>
            <textarea
              id="customer-notes"
              className={textareaClassName}
              value={form.notes}
              onChange={(event) => updateField('notes', event.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.portalAccess}
              onChange={(event) => updateField('portalAccess', event.target.checked)}
              className="size-4 rounded border-input"
            />
            {t.customers.portalAccess}
          </label>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {isEdit ? (
              <button
                type="button"
                className={cn(buttonVariants({ variant: 'destructive' }))}
                disabled={pending}
                onClick={() => {
                  if (!customer || !window.confirm(t.customers.confirmDelete)) return
                  startTransition(async () => {
                    const result = await deleteCustomer(customer._id)
                    if (!result.ok) {
                      const message = t.customers.errors[result.error]
                      setError(message)
                      toast.error(message)
                      return
                    }
                    toast.success(t.customers.deleted)
                    onClose()
                    router.refresh()
                  })
                }}
              >
                {pending ? t.customers.deleting : t.customers.delete}
              </button>
            ) : null}
            <button
              type="button"
              className={cn(buttonVariants({ variant: 'outline' }), 'ml-auto')}
              onClick={onClose}
              disabled={pending}
            >
              {t.customers.cancel}
            </button>
            <button type="submit" className={cn(buttonVariants())} disabled={pending}>
              {pending ? t.customers.saving : t.customers.save}
            </button>
          </div>
        </form>
      </aside>
    </div>,
    document.body,
  )
}

export function AddCustomerButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" className={cn(buttonVariants())} onClick={onClick}>
      <Plus className="size-4" />
      {label}
    </button>
  )
}
