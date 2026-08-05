import { ProjectsView } from '@/components/views/projects-view'
import { getProjects } from '@/lib/sanity'

export default async function ProjectsPage() {
  const projects = await getProjects()
  return <ProjectsView projects={projects} />
}
