import { ProjectsView } from '@/components/views/projects-view'
import { auth } from '@/lib/auth'
import { can } from '@/lib/permissions'
import { getProjects } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const session = await auth()
  const role = session?.user?.role ?? 'viewer'
  const projects = await getProjects()

  return (
    <ProjectsView
      projects={projects}
      canManageProjects={can(role, 'manageProjects')}
    />
  )
}
