'use client'

import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProjectStatusBadge } from '@/lib/format'
import { useLanguage } from '@/components/language-provider'
import type { Project } from '@/lib/types'

export function ProjectsView({ projects }: { projects: Project[] }) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t.projects.title}</h1>
        <p className="text-sm text-muted-foreground">{t.projects.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.projects.all}</CardTitle>
          <CardDescription>
            {projects.length} {t.projects.developments}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.projects.project}</TableHead>
                <TableHead>{t.projects.type}</TableHead>
                <TableHead>{t.projects.status}</TableHead>
                <TableHead>{t.projects.price}</TableHead>
                <TableHead>{t.projects.units}</TableHead>
                <TableHead>{t.projects.year}</TableHead>
                <TableHead className="text-right">{t.projects.link}</TableHead>
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
