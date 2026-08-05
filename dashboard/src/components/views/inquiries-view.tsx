'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { InquiryStatusBadge, formatDate } from '@/lib/format'
import { useLanguage } from '@/components/language-provider'
import type { Inquiry } from '@/lib/types'

export function InquiriesView({ inquiries }: { inquiries: Inquiry[] }) {
  const { locale, t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t.inquiries.title}</h1>
        <p className="text-sm text-muted-foreground">{t.inquiries.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.inquiries.inbox}</CardTitle>
          <CardDescription>
            {inquiries.length} {t.inquiries.count}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.inquiries.contact}</TableHead>
                <TableHead>{t.inquiries.type}</TableHead>
                <TableHead>{t.inquiries.details}</TableHead>
                <TableHead>{t.inquiries.status}</TableHead>
                <TableHead>{t.inquiries.received}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry._id}>
                  <TableCell>
                    <div className="font-medium">{inquiry.name}</div>
                    <div className="text-xs text-muted-foreground">{inquiry.email || inquiry.phone || '-'}</div>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">{inquiry.type}</TableCell>
                  <TableCell>
                    <div className="text-sm">{inquiry.relatedProjectName || inquiry.propertyType || '-'}</div>
                    {inquiry.message ? (
                      <div className="mt-1 line-clamp-2 max-w-md text-xs text-muted-foreground">
                        {inquiry.message}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <InquiryStatusBadge status={inquiry.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(inquiry.createdAt, locale)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
