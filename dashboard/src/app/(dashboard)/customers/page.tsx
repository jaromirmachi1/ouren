import { CustomersView } from '@/components/views/customers-view'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'
import { getCustomers, getProjects } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  const session = await auth()
  const role = session?.user?.role ?? 'viewer'
  const [customers, projects] = await Promise.all([getCustomers(), getProjects()])

  return (
    <CustomersView
      customers={customers}
      projects={projects}
      canManageCustomers={can(role, 'manageCustomers')}
    />
  )
}
