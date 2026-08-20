import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { DEFAULT_PORTAL_ROLE, type PortalRole } from './roles'

const dataDir = path.join(process.cwd(), '.data')
const rolesFile = path.join(dataDir, 'user-roles.json')

type RoleMap = Record<string, PortalRole>

export async function readRoleOverrides(): Promise<RoleMap> {
  try {
    const raw = await readFile(rolesFile, 'utf8')
    const parsed = JSON.parse(raw) as RoleMap
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed
  } catch {
    return {}
  }
}

export async function setRoleOverride(email: string, role: PortalRole) {
  const roles = await readRoleOverrides()
  roles[email.trim().toLowerCase()] = role
  await mkdir(dataDir, { recursive: true })
  await writeFile(rolesFile, JSON.stringify(roles, null, 2) + '\n', 'utf8')
}

export async function resolveUserRole(email: string, envRole?: PortalRole): Promise<PortalRole> {
  const overrides = await readRoleOverrides()
  const key = email.trim().toLowerCase()
  if (overrides[key]) return overrides[key]
  if (envRole) return envRole
  return DEFAULT_PORTAL_ROLE
}
