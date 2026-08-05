import Link from 'next/link'
import { Building2, Inbox, Users, Home } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CustomerStatusBadge, InquiryStatusBadge, formatDate } from '@/lib/format'
import { getDashboardStats } from '@/lib/sanity'

export default async function OverviewPage() {
  const { stats, customers, inquiries, projects } = await getDashboardStats()

  const cards = [
    { label: 'Projects', value: stats.projects, icon: Building2, href: '/projects' },
    { label: 'Available units', value: stats.availableUnits, icon: Home, href: '/units' },
    { label: 'Customers', value: stats.customers, icon: Users, href: '/customers' },
    { label: 'New inquiries', value: stats.newInquiries, icon: Inbox, href: '/inquiries' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Pipeline, inventory, and client activity for Ouren.
        </p>
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
            <CardTitle>Recent customers</CardTitle>
            <CardDescription>Active pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Interest</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.slice(0, 5).map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.email}</div>
                    </TableCell>
                    <TableCell>
                      <CustomerStatusBadge status={customer.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.interestedProjects?.join(', ') || '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest inquiries</CardTitle>
            <CardDescription>From website forms</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.slice(0, 5).map((inquiry) => (
                  <TableRow key={inquiry._id}>
                    <TableCell>
                      <div className="font-medium">{inquiry.name}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(inquiry.createdAt)}</div>
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
          <CardTitle>Featured inventory</CardTitle>
          <CardDescription>Projects currently in market</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <div key={project._id} className="rounded-xl border p-4">
              <p className="font-medium">{project.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{project.location}</p>
              <p className="mt-3 text-sm">{project.price}</p>
              <p className="text-xs text-muted-foreground">{project.units} units · {project.year}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
