'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CustomerStatusBadge } from '@/lib/format'
import { useLanguage } from '@/components/language-provider'
import { AddCustomerButton, CustomerEditor } from '@/components/customer-editor'
import { deleteCustomer } from '@/lib/actions/customers'
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
  'h-8 min-w-[10.5rem] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none',
  'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
)

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function CustomersView({
  customers,
  projects,
  canManageCustomers = false,
}: {
  customers: Customer[]
  projects: Project[]
  canManageCustomers?: boolean
}) {
  const { t } = useLanguage()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | CustomerStatus>('all')
  const [source, setSource] = useState('all')
  const [layout, setLayout] = useState<'all' | FlatLayout>('all')
  const [editor, setEditor] = useState<Customer | 'new' | null>(null)
  const [, startTransition] = useTransition()

  const sources = useMemo(() => {
    const unique = new Set(
      customers.map((customer) => customer.source).filter((value): value is string => Boolean(value)),
    )
    return Array.from(unique).sort((a, b) => a.localeCompare(b, 'cs'))
  }, [customers])

  const filtered = useMemo(() => {
    const q = normalize(query.trim())

    return customers.filter((customer) => {
      if (status !== 'all' && customer.status !== status) return false
      if (source !== 'all' && customer.source !== source) return false
      if (layout !== 'all' && !customer.lookingForLayouts?.includes(layout)) return false
      if (!q) return true

      const haystack = normalize(
        [customer.name, customer.email, customer.phone, customer.source, customer.notes]
          .filter(Boolean)
          .join(' '),
      )
      return haystack.includes(q)
    })
  }, [customers, query, status, source, layout])

  const hasFilters = query.trim() !== '' || status !== 'all' || source !== 'all' || layout !== 'all'

  function clearFilters() {
    setQuery('')
    setStatus('all')
    setSource('all')
    setLayout('all')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t.customers.title}</h1>
          <p className="text-sm text-muted-foreground">{t.customers.subtitle}</p>
        </div>
        {canManageCustomers ? (
          <AddCustomerButton label={t.customers.add} onClick={() => setEditor('new')} />
        ) : null}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <Input
          className="sm:max-w-xs"
          placeholder={t.customers.search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          className={selectClassName}
          value={status}
          onChange={(event) => setStatus(event.target.value as 'all' | CustomerStatus)}
          aria-label={t.customers.status}
        >
          <option value="all">{t.customers.allStatuses}</option>
          {CUSTOMER_STATUSES.map((value) => (
            <option key={value} value={value}>
              {t.status.customer[value]}
            </option>
          ))}
        </select>
        <select
          className={cn(selectClassName, 'min-w-[14rem] max-w-full')}
          value={source}
          onChange={(event) => setSource(event.target.value)}
          aria-label={t.customers.source}
        >
          <option value="all">{t.customers.allSources}</option>
          {sources.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          className={selectClassName}
          value={layout}
          onChange={(event) => setLayout(event.target.value as 'all' | FlatLayout)}
          aria-label={t.customers.layouts}
        >
          <option value="all">{t.customers.allLayouts}</option>
          {FLAT_LAYOUTS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {hasFilters ? (
          <button
            type="button"
            className="h-8 rounded-lg px-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={clearFilters}
          >
            {t.customers.clearFilters}
          </button>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.customers.all}</CardTitle>
          <CardDescription>
            {filtered.length}
            {hasFilters ? ` / ${customers.length}` : ''} {t.customers.records}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.customers.customer}</TableHead>
                <TableHead>{t.customers.status}</TableHead>
                <TableHead>{t.customers.layouts}</TableHead>
                <TableHead>{t.customers.budget}</TableHead>
                <TableHead>{t.customers.projects}</TableHead>
                <TableHead>{t.customers.portal}</TableHead>
                <TableHead>{t.customers.source}</TableHead>
                {canManageCustomers ? (
                  <TableHead className="w-[1%] text-right">{t.customers.edit}</TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canManageCustomers ? 8 : 7} className="py-10 text-center text-muted-foreground">
                    {t.customers.noResults}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((customer) => (
                  <TableRow
                    key={customer._id}
                    className={canManageCustomers ? 'cursor-pointer' : undefined}
                    onClick={canManageCustomers ? () => setEditor(customer) : undefined}
                  >
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {customer.email || customer.phone || '—'}
                      </div>
                      {customer.email && customer.phone ? (
                        <div className="text-xs text-muted-foreground">{customer.phone}</div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <CustomerStatusBadge status={customer.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.lookingForLayouts?.length
                        ? customer.lookingForLayouts.join(', ')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{customer.budget || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.interestedProjects?.join(', ') || '-'}
                    </TableCell>
                    <TableCell>
                      {customer.portalAccess ? (
                        <Badge variant="default">{t.customers.enabled}</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">{t.customers.off}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{customer.source || '-'}</TableCell>
                    {canManageCustomers ? (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            className="text-sm font-medium text-primary hover:underline"
                            onClick={(event) => {
                              event.stopPropagation()
                              setEditor(customer)
                            }}
                          >
                            {t.customers.edit}
                          </button>
                          <button
                            type="button"
                            className="text-sm font-medium text-destructive hover:underline"
                            onClick={(event) => {
                              event.stopPropagation()
                              if (!window.confirm(t.customers.confirmDelete)) return
                              startTransition(async () => {
                                const result = await deleteCustomer(customer._id)
                                if (!result.ok) {
                                  toast.error(t.customers.errors[result.error])
                                  return
                                }
                                toast.success(t.customers.deleted)
                                router.refresh()
                              })
                            }}
                          >
                            {t.customers.delete}
                          </button>
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {canManageCustomers ? (
        <CustomerEditor
          projects={projects}
          customer={editor && editor !== 'new' ? editor : null}
          open={editor !== null}
          onClose={() => setEditor(null)}
        />
      ) : null}
    </div>
  )
}
