import { auth, listPortalUsers, signOut } from '@/lib/auth'
import { can } from '@/lib/permissions'
import { SettingsView } from '@/components/views/settings-view'

export default async function SettingsPage() {
  const session = await auth()
  const role = session?.user?.role ?? 'viewer'
  const portalUsers = await listPortalUsers()

  return (
    <SettingsView
      currentEmail={session?.user?.email ?? ''}
      currentRole={role}
      portalUsers={portalUsers}
      canManageRoles={can(role, 'manageRoles')}
      signOutAction={async () => {
        'use server'
        await signOut({ redirectTo: '/login' })
      }}
    />
  )
}
