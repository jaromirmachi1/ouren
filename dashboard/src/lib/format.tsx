'use client'

import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/components/language-provider'
import type { CustomerStatus, InquiryStatus, ProjectStatus, UnitStatus } from '@/lib/types'
import type { Locale } from '@/lib/i18n'

const projectClass: Record<ProjectStatus, string> = {
  available: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  reserved: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  sold: 'bg-slate-500/15 text-slate-600 border-slate-500/30',
  inProgress: 'bg-sky-500/15 text-sky-700 border-sky-500/30',
}

const customerClass: Record<CustomerStatus, string> = {
  lead: 'bg-slate-500/15 text-slate-700 border-slate-500/30',
  qualified: 'bg-sky-500/15 text-sky-700 border-sky-500/30',
  reservation: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  contract: 'bg-violet-500/15 text-violet-700 border-violet-500/30',
  closed: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  lost: 'bg-rose-500/15 text-rose-700 border-rose-500/30',
}

const inquiryClass: Record<InquiryStatus, string> = {
  new: 'bg-sky-500/15 text-sky-700 border-sky-500/30',
  inProgress: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  done: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  spam: 'bg-slate-500/15 text-slate-600 border-slate-500/30',
}

const unitClass: Record<UnitStatus, string> = {
  available: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  reserved: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  sold: 'bg-slate-500/15 text-slate-600 border-slate-500/30',
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { t } = useLanguage()
  return <Badge variant="outline" className={projectClass[status]}>{t.status.project[status]}</Badge>
}

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const { t } = useLanguage()
  return <Badge variant="outline" className={customerClass[status]}>{t.status.customer[status]}</Badge>
}

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  const { t } = useLanguage()
  return <Badge variant="outline" className={inquiryClass[status]}>{t.status.inquiry[status]}</Badge>
}

export function UnitStatusBadge({ status }: { status: UnitStatus }) {
  const { t } = useLanguage()
  return <Badge variant="outline" className={unitClass[status]}>{t.status.unit[status]}</Badge>
}

export function formatCzk(value?: number, locale: Locale = 'cs') {
  if (value == null) return '-'
  return new Intl.NumberFormat(locale === 'cs' ? 'cs-CZ' : 'en-GB', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(value?: string, locale: Locale = 'cs') {
  if (!value) return '-'
  return new Intl.DateTimeFormat(locale === 'cs' ? 'cs-CZ' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}
