import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Project } from '@/lib/types'

const dataDir = path.join(process.cwd(), '.data')
const dataFile = path.join(dataDir, 'projects.json')
const deletedFile = path.join(dataDir, 'deleted-project-ids.json')

async function writeJson(file: string, value: unknown) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(file, JSON.stringify(value, null, 2) + '\n', 'utf8')
}

export async function readLocalProjects(): Promise<Project[]> {
  try {
    const raw = await readFile(dataFile, 'utf8')
    const parsed = JSON.parse(raw) as Project[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function upsertLocalProject(project: Project) {
  const projects = await readLocalProjects()
  const index = projects.findIndex((item) => item._id === project._id)
  if (index >= 0) projects[index] = project
  else projects.unshift(project)
  await writeJson(dataFile, projects)
}

export async function readDeletedProjectIds(): Promise<string[]> {
  try {
    const raw = await readFile(deletedFile, 'utf8')
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function removeLocalProject(id: string) {
  const projects = (await readLocalProjects()).filter((project) => project._id !== id)
  await writeJson(dataFile, projects)
  const deleted = await readDeletedProjectIds()
  if (!deleted.includes(id)) {
    deleted.push(id)
    await writeJson(deletedFile, deleted)
  }
}
