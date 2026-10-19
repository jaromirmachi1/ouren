'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UnitStatusBadge, formatCzk } from '@/lib/format'
import { useLanguage } from '@/components/language-provider'
import { AddUnitButton, UnitEditor } from '@/components/unit-editor'
import { deleteUnit } from '@/lib/actions/units'
import type { Unit } from '@/lib/types'

type ProjectOption = { _id: string; name: string }

export function UnitsView({
  units,
  projects,
  canManage = false,
}: {
  units: Unit[]
  projects: ProjectOption[]
  canManage?: boolean
}) {
  const { locale, t } = useLanguage()
  const router = useRouter()
  const [editor, setEditor] = useState<Unit | 'new' | null>(null)
  const [, startTransition] = useTransition()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t.units.title}</h1>
          <p className="text-sm text-muted-foreground">{t.units.subtitle}</p>
        </div>
        {canManage ? <AddUnitButton label={t.units.add} onClick={() => setEditor('new')} /> : null}
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
                <TableHead>{t.units.kind}</TableHead>
                <TableHead>{t.units.project}</TableHead>
                <TableHead>{t.units.sale}</TableHead>
                <TableHead>{t.units.rent}</TableHead>
                <TableHead>{t.units.status}</TableHead>
                <TableHead>{t.units.area}</TableHead>
                <TableHead>{t.units.price}</TableHead>
                {canManage ? <TableHead className="text-right">{t.units.actions}</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canManage ? 9 : 8} className="py-10 text-center text-muted-foreground">
                    {t.units.empty}
                  </TableCell>
                </TableRow>
              ) : (
                units.map((unit) => (
                  <TableRow
                    key={unit._id}
                    className={canManage ? 'cursor-pointer' : undefined}
                    onClick={() => {
                      if (canManage) setEditor(unit)
                    }}
                  >
                    <TableCell>
                      <div className="font-medium">{unit.label}</div>
                      <div className="text-xs text-muted-foreground">{unit.location || unit.layout || ''}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {t.units.kinds[
                        unit.kind === 'house' || unit.kind === 'land' ? unit.kind : 'apartment'
                      ]}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{unit.projectName || t.units.noProject}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {unit.listOnSale !== false ? t.units.onSale : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {unit.listOnRent ? t.units.onRent : '—'}
                    </TableCell>
                    <TableCell>
                      <UnitStatusBadge status={unit.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {unit.kind === 'land'
                        ? unit.landAreaSqm
                          ? `${unit.landAreaSqm} m²`
                          : '-'
                        : [
                            unit.areaSqm ? `${unit.areaSqm} m²` : null,
                            unit.kind === 'house' && unit.landAreaSqm
                              ? `${unit.landAreaSqm} m² ${t.units.landArea.toLowerCase()}`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(' · ') || '-'}
                    </TableCell>
                    <TableCell>{formatCzk(unit.priceCzk, locale)}</TableCell>
                    {canManage ? (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            className="text-sm font-medium text-primary hover:underline"
                            onClick={(event) => {
                              event.stopPropagation()
                              setEditor(unit)
                            }}
                          >
                            {t.units.edit}
                          </button>
                          <button
                            type="button"
                            className="text-sm font-medium text-destructive hover:underline"
                            onClick={(event) => {
                              event.stopPropagation()
                              if (!window.confirm(t.units.confirmDelete)) return
                              startTransition(async () => {
                                const result = await deleteUnit(unit._id)
                                if (!result.ok) {
                                  toast.error(t.units.errors[result.error])
                                  return
                                }
                                toast.success(t.units.deleted)
                                router.refresh()
                              })
                            }}
                          >
                            {t.units.delete}
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

      {canManage ? (
        <UnitEditor
          open={editor !== null}
          projects={projects}
          unit={editor === 'new' ? null : editor}
          onClose={() => setEditor(null)}
        />
      ) : null}
    </div>
  )
}
