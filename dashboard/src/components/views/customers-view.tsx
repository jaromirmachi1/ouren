'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CustomerStatusBadge } from '@/lib/format'
import { useLanguage } from '@/components/language-provider'
import type { Customer, CustomerStatus } from '@/lib/types'
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

export function CustomersView({ customers }: { customers: Customer[] }) {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | CustomerStatus>('all')
  const [source, setSource] = useState('all')

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
      if (!q) return true

      const haystack = normalize(
        [customer.name, customer.email, customer.phone, customer.source, customer.notes]
          .filter(Boolean)
          .join(' '),
      )
      return haystack.includes(q)
    })
  }, [customers, query, status, source])

  const hasFilters = query.trim() !== '' || status !== 'all' || source !== 'all'

  function clearFilters() {
    setQuery('')
    setStatus('all')
    setSource('all')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t.customers.title}</h1>
          <p className="text-sm text-muted-foreground">{t.customers.subtitle}</p>
        </div>
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
        {hasFilters ? (
          <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
            {t.customers.clearFilters}
          </Button>
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
                <TableHead>{t.customers.budget}</TableHead>
                <TableHead>{t.customers.projects}</TableHead>
                <TableHead>{t.customers.portal}</TableHead>
                <TableHead>{t.customers.source}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    {t.customers.noResults}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((customer) => (
                  <TableRow key={customer._id}>
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
