import { auth } from '@/lib/auth'
import type { PortalRole } from '@/lib/roles'

export type Permission =
  | 'manageCustomers'
  | 'manageProjects'
  | 'manageInquiries'
  | 'manageRoles'

const ROLE_PERMISSIONS: Record<PortalRole, readonly Permission[]> = {
  viewer: [],
  re_agent: ['manageCustomers', 'manageProjects', 'manageInquiries'],
  ceo: ['manageCustomers', 'manageProjects', 'manageInquiries', 'manageRoles'],
}

export function can(role: PortalRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}

export class PermissionError extends Error {
  constructor() {
    super('Forbidden')
    this.name = 'PermissionError'
  }
}

export async function requirePermission(permission: Permission) {
  const session = await auth()
  const role = session?.user?.role ?? 'viewer'
  if (!can(role, permission)) {
    throw new PermissionError()
  }
  return session
}
