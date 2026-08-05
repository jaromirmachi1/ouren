'use client'

import Link from 'next/link'
import { Building2, Inbox, Users, Home } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CustomerStatusBadge, InquiryStatusBadge, formatDate } from '@/lib/format'
import { useLanguage } from '@/components/language-provider'
import type { Customer, Inquiry, Project } from '@/lib/types'

type Props = {
  stats: {
    projects: number
    availableUnits: number
    customers: number
    newInquiries: number
  }
  customers: Customer[]
  inquiries: Inquiry[]
  projects: Project[]
}

export function OverviewView({ stats, customers, inquiries, projects }: Props) {
  const { locale, t } = useLanguage()

  const cards = [
    { label: t.overview.projects, value: stats.projects, icon: Building2, href: '/projects' },
    { label: t.overview.availableUnits, value: stats.availableUnits, icon: Home, href: '/units' },
    { label: t.overview.customers, value: stats.customers, icon: Users, href: '/customers' },
    { label: t.overview.newInquiries, value: stats.newInquiries, icon: Inbox, href: '/inquiries' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t.overview.title}</h1>
        <p className="text-sm text-muted-foreground">{t.overview.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-colors hover:bg-muted/40">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>{card.label}</CardDescription>
                <card.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tracking-tight">{card.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.overview.recentCustomers}</CardTitle>
            <CardDescription>{t.overview.activePipeline}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.customers.customer}</TableHead>
                  <TableHead>{t.customers.status}</TableHead>
                  <TableHead>{t.overview.interest}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.slice(0, 5).map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.email || customer.phone || '—'}</div>
                    </TableCell>
                    <TableCell>
                      <CustomerStatusBadge status={customer.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.interestedProjects?.join(', ') || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.overview.latestInquiries}</CardTitle>
            <CardDescription>{t.overview.fromForms}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.customers.customer}</TableHead>
                  <TableHead>{t.inquiries.type}</TableHead>
                  <TableHead>{t.inquiries.status}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.slice(0, 5).map((inquiry) => (
                  <TableRow key={inquiry._id}>
                    <TableCell>
                      <div className="font-medium">{inquiry.name}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(inquiry.createdAt, locale)}</div>
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">{inquiry.type}</TableCell>
                    <TableCell>
                      <InquiryStatusBadge status={inquiry.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.overview.featuredInventory}</CardTitle>
          <CardDescription>{t.overview.currentlyInMarket}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <div key={project._id} className="rounded-xl border p-4">
              <p className="font-medium">{project.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{project.location}</p>
              <p className="mt-3 text-sm">{project.price}</p>
              <p className="text-xs text-muted-foreground">
                {project.units} {t.overview.unitsYear} · {project.year}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
