import { InquiriesView } from '@/components/views/inquiries-view'
import { getInquiries } from '@/lib/sanity'

export default async function InquiriesPage() {
  const inquiries = await getInquiries()
  return <InquiriesView inquiries={inquiries} />
}
