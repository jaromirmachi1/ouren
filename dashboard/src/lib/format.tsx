import { Badge } from '@/components/ui/badge'
import type { CustomerStatus, InquiryStatus, ProjectStatus, UnitStatus } from '@/lib/types'

const projectStatusMap: Record<ProjectStatus, { label: string; className: string }> = {
  available: { label: 'Available', className: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' },
  reserved: { label: 'Reserved', className: 'bg-amber-500/15 text-amber-700 border-amber-500/30' },
  sold: { label: 'Sold', className: 'bg-slate-500/15 text-slate-600 border-slate-500/30' },
  inProgress: { label: 'In progress', className: 'bg-sky-500/15 text-sky-700 border-sky-500/30' },
}

const customerStatusMap: Record<CustomerStatus, { label: string; className: string }> = {
  lead: { label: 'Lead', className: 'bg-slate-500/15 text-slate-700 border-slate-500/30' },
  qualified: { label: 'Qualified', className: 'bg-sky-500/15 text-sky-700 border-sky-500/30' },
  reservation: { label: 'Reservation', className: 'bg-amber-500/15 text-amber-700 border-amber-500/30' },
  contract: { label: 'Contract', className: 'bg-violet-500/15 text-violet-700 border-violet-500/30' },
  closed: { label: 'Closed', className: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' },
  lost: { label: 'Lost', className: 'bg-rose-500/15 text-rose-700 border-rose-500/30' },
}

const inquiryStatusMap: Record<InquiryStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-sky-500/15 text-sky-700 border-sky-500/30' },
  inProgress: { label: 'In progress', className: 'bg-amber-500/15 text-amber-700 border-amber-500/30' },
  done: { label: 'Done', className: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' },
  spam: { label: 'Spam', className: 'bg-slate-500/15 text-slate-600 border-slate-500/30' },
}

const unitStatusMap: Record<UnitStatus, { label: string; className: string }> = {
  available: { label: 'Available', className: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' },
  reserved: { label: 'Reserved', className: 'bg-amber-500/15 text-amber-700 border-amber-500/30' },
  sold: { label: 'Sold', className: 'bg-slate-500/15 text-slate-600 border-slate-500/30' },
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const item = projectStatusMap[status]
  return <Badge variant="outline" className={item.className}>{item.label}</Badge>
}

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const item = customerStatusMap[status]
  return <Badge variant="outline" className={item.className}>{item.label}</Badge>
}

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  const item = inquiryStatusMap[status]
  return <Badge variant="outline" className={item.className}>{item.label}</Badge>
}

export function UnitStatusBadge({ status }: { status: UnitStatus }) {
  const item = unitStatusMap[status]
  return <Badge variant="outline" className={item.className}>{item.label}</Badge>
}

export function formatCzk(value?: number) {
  if (value == null) return '—'
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(value?: string) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('cs-CZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}
