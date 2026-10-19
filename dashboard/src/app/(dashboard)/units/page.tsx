import { UnitsView } from '@/components/views/units-view'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'
import { getProjects, getUnits } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export default async function UnitsPage() {
  const session = await auth()
  const role = session?.user?.role ?? 'viewer'
  const [units, projects] = await Promise.all([getUnits(), getProjects()])

  return (
    <UnitsView
      canManage={can(role, 'manageProjects')}
      projects={projects.map((project) => ({ _id: project._id, name: project.name }))}
      units={units}
    />
  )
}
