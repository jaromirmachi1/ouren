import { auth, listPortalEmails, signOut } from '@/lib/auth'
import { SettingsView } from '@/components/views/settings-view'

export default async function SettingsPage() {
  const session = await auth()
  const emails = listPortalEmails()

  return (
    <SettingsView
      currentEmail={session?.user?.email ?? ''}
      portalEmails={emails}
      signOutAction={async () => {
        'use server'
        await signOut({ redirectTo: '/login' })
      }}
    />
  )
}
