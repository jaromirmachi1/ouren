import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProjectStatusBadge } from '@/lib/format'
import { getProjects } from '@/lib/sanity'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Developments managed in Sanity and shown on the marketing site.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All projects</CardTitle>
          <CardDescription>{projects.length} developments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-muted-foreground">{project.location}</div>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">{project.type}</TableCell>
                  <TableCell>
                    <ProjectStatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>{project.price}</TableCell>
                  <TableCell>{project.units}</TableCell>
                  <TableCell>{project.year}</TableCell>
                  <TableCell className="text-right">
                    {project.websiteUrl ? (
                      <a
                        className="inline-flex size-7 items-center justify-center rounded-md hover:bg-muted"
                        href={project.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
