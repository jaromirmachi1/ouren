import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { InquiryStatusBadge, formatDate } from '@/lib/format'
import { getInquiries } from '@/lib/sanity'

export default async function InquiriesPage() {
  const inquiries = await getInquiries()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inquiries</h1>
        <p className="text-sm text-muted-foreground">
          Form submissions from sell-with-us and contact flows.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>{inquiries.length} inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Project / details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry._id}>
                  <TableCell>
                    <div className="font-medium">{inquiry.name}</div>
                    <div className="text-xs text-muted-foreground">{inquiry.email || inquiry.phone || '—'}</div>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">{inquiry.type}</TableCell>
                  <TableCell>
                    <div className="text-sm">{inquiry.relatedProjectName || inquiry.propertyType || '—'}</div>
                    {inquiry.message && (
                      <div className="mt-1 line-clamp-2 max-w-md text-xs text-muted-foreground">
                        {inquiry.message}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <InquiryStatusBadge status={inquiry.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(inquiry.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
