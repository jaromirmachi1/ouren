'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProjectStatusBadge } from '@/lib/format'
import { useLanguage } from '@/components/language-provider'
import { AddProjectButton, ProjectEditor } from '@/components/project-editor'
import { deleteProject } from '@/lib/actions/projects'
import { normalizeProjectChannels, type Project } from '@/lib/types'

export function ProjectsView({
  projects,
  canManageProjects = false,
}: {
  projects: Project[]
  canManageProjects?: boolean
}) {
  const { t } = useLanguage()
  const router = useRouter()
  const [editor, setEditor] = useState<Project | 'new' | null>(null)
  const [, startTransition] = useTransition()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t.projects.title}</h1>
          <p className="text-sm text-muted-foreground">{t.projects.subtitle}</p>
        </div>
        {canManageProjects ? (
          <AddProjectButton label={t.projects.add} onClick={() => setEditor('new')} />
        ) : null}
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
                <TableHead>{t.projects.channel}</TableHead>
                <TableHead>{t.projects.type}</TableHead>
                <TableHead>{t.projects.status}</TableHead>
                <TableHead>{t.projects.price}</TableHead>
                <TableHead>{t.projects.units}</TableHead>
                <TableHead>{t.projects.areaSqm}</TableHead>
                <TableHead>{t.projects.year}</TableHead>
                <TableHead className="text-right">{t.projects.link}</TableHead>
                {canManageProjects ? (
                  <TableHead className="w-[1%] text-right">{t.projects.actions}</TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={canManageProjects ? 10 : 9}
                    className="py-10 text-center text-muted-foreground"
                  >
                    —
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow
                    key={project._id}
                    className={canManageProjects ? 'cursor-pointer' : undefined}
                    onClick={() => {
                      if (canManageProjects) setEditor(project)
                    }}
                  >
                    <TableCell>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-xs text-muted-foreground">{project.location}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {normalizeProjectChannels(project.channels, project.channel)
                        .map((channel) => t.projects.channels[channel])
                        .join(' · ')}
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">{project.type}</TableCell>
                    <TableCell>
                      <ProjectStatusBadge status={project.status} />
                    </TableCell>
                    <TableCell>{project.price}</TableCell>
                    <TableCell>{project.units}</TableCell>
                    <TableCell>{project.areaSqm ? `${project.areaSqm} m²` : '-'}</TableCell>
                    <TableCell>{project.year}</TableCell>
                    <TableCell className="text-right">
                      {project.websiteUrl ? (
                        <a
                          className="inline-flex size-7 items-center justify-center rounded-md hover:bg-muted"
                          href={project.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    {canManageProjects ? (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            type="button"
                            className="text-sm font-medium text-primary hover:underline"
                            onClick={(event) => {
                              event.stopPropagation()
                              setEditor(project)
                            }}
                          >
                            {t.projects.edit}
                          </button>
                          <button
                            type="button"
                            className="text-sm font-medium text-destructive hover:underline"
                            onClick={(event) => {
                              event.stopPropagation()
                              if (!window.confirm(t.projects.confirmDelete)) return
                              startTransition(async () => {
                                const result = await deleteProject(project._id)
                                if (!result.ok) {
                                  toast.error(t.projects.errors[result.error])
                                  return
                                }
                                toast.success(t.projects.deleted)
                                router.refresh()
                              })
                            }}
                          >
                            {t.projects.delete}
                          </button>
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {canManageProjects ? (
        <ProjectEditor
          open={editor !== null}
          project={editor === 'new' ? null : editor}
          onClose={() => setEditor(null)}
        />
      ) : null}
    </div>
  )
}
