import { CustomersView } from '@/components/views/customers-view'
import { getCustomers } from '@/lib/sanity'

export default async function CustomersPage() {
  const customers = await getCustomers()
  return <CustomersView customers={customers} />
}
