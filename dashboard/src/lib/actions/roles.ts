'use server'

import { revalidatePath } from 'next/cache'
import { listPortalEmails } from '@/lib/auth'
import { requirePermission } from '@/lib/permissions'
import { isPortalRole, type PortalRole } from '@/lib/roles'
import { setRoleOverride } from '@/lib/user-roles'

export type RoleActionResult =
  | { ok: true }
  | { ok: false; error: 'forbidden' | 'invalidRole' | 'unknownUser' | 'saveFailed' }

export async function updateUserRole(email: string, role: string): Promise<RoleActionResult> {
  try {
    await requirePermission('manageRoles')
  } catch {
    return { ok: false, error: 'forbidden' }
  }

  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail || !isPortalRole(role)) {
    return { ok: false, error: 'invalidRole' }
  }

  const allowedEmails = listPortalEmails()
  if (!allowedEmails.includes(normalizedEmail)) {
    return { ok: false, error: 'unknownUser' }
  }

  try {
    await setRoleOverride(normalizedEmail, role as PortalRole)
    revalidatePath('/settings')
    return { ok: true }
  } catch {
    return { ok: false, error: 'saveFailed' }
  }
}
