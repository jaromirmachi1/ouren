import { DashboardShell } from '@/components/dashboard-shell'
import { isSanityConfigured } from '@/lib/sanity'
import { signOut } from '@/lib/auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  async function signOutAction() {
    'use server'
    await signOut({ redirectTo: '/login' })
  }

  return (
    <DashboardShell sanityLive={isSanityConfigured} signOutAction={signOutAction}>
      {children}
    </DashboardShell>
  )
}
