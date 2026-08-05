import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CustomerStatusBadge } from '@/lib/format'
import { getCustomers } from '@/lib/sanity'

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Leads, reservations, and portal access for Ouren clients.
          </p>
        </div>
        <Input className="max-w-xs" placeholder="Search customers..." disabled />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All customers</CardTitle>
          <CardDescription>{customers.length} records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Portal</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-xs text-muted-foreground">{customer.email}</div>
                    {customer.phone ? (
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
                      <Badge variant="default">Enabled</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Off</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{customer.source || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
