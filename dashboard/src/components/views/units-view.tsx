'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UnitStatusBadge, formatCzk } from '@/lib/format'
import { useLanguage } from '@/components/language-provider'
import type { Unit } from '@/lib/types'

export function UnitsView({ units }: { units: Unit[] }) {
  const { locale, t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t.units.title}</h1>
        <p className="text-sm text-muted-foreground">{t.units.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.units.inventory}</CardTitle>
          <CardDescription>
            {units.length} {t.units.count}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.units.unit}</TableHead>
                <TableHead>{t.units.project}</TableHead>
                <TableHead>{t.units.status}</TableHead>
                <TableHead>{t.units.floor}</TableHead>
                <TableHead>{t.units.rooms}</TableHead>
                <TableHead>{t.units.area}</TableHead>
                <TableHead>{t.units.price}</TableHead>
                <TableHead>{t.units.customer}</TableHead>
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
                  <TableCell>{unit.floor ?? '-'}</TableCell>
                  <TableCell>{unit.rooms ?? '-'}</TableCell>
                  <TableCell>{unit.areaSqm ? `${unit.areaSqm} m²` : '-'}</TableCell>
                  <TableCell>{formatCzk(unit.priceCzk, locale)}</TableCell>
                  <TableCell className="text-muted-foreground">{unit.customerName || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
