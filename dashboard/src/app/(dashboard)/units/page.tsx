import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UnitStatusBadge, formatCzk } from '@/lib/format'
import { getUnits } from '@/lib/sanity'

export default async function UnitsPage() {
  const units = await getUnits()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Units</h1>
        <p className="text-sm text-muted-foreground">
          Unit-level inventory with assignment to customers.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>{units.length} units</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Rooms</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Customer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit._id}>
                  <TableCell className="font-medium">{unit.label}</TableCell>
                  <TableCell className="text-muted-foreground">{unit.projectName}</TableCell>
                  <TableCell>
                    <UnitStatusBadge status={unit.status} />
                  </TableCell>
                  <TableCell>{unit.floor ?? '—'}</TableCell>
                  <TableCell>{unit.rooms ?? '—'}</TableCell>
                  <TableCell>{unit.areaSqm ? `${unit.areaSqm} m²` : '—'}</TableCell>
                  <TableCell>{formatCzk(unit.priceCzk)}</TableCell>
                  <TableCell className="text-muted-foreground">{unit.customerName || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
