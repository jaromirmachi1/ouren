import { OverviewView } from '@/components/views/overview-view'
import { getDashboardStats } from '@/lib/sanity'

export default async function OverviewPage() {
  const { stats, customers, inquiries, projects } = await getDashboardStats()
  return (
    <OverviewView
      stats={stats}
      customers={customers}
      inquiries={inquiries}
      projects={projects}
    />
  )
}
