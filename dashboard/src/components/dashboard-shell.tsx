'use client'

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { AppSidebar } from '@/components/app-sidebar'
import { Badge } from '@/components/ui/badge'
import { LanguageProvider, useLanguage } from '@/components/language-provider'
import { LanguageToggle } from '@/components/language-toggle'
import { AdminBackground } from '@/components/admin-background'

function ShellInner({
  children,
  sanityLive,
  signOutAction,
}: {
  children: React.ReactNode
  sanityLive: boolean
  signOutAction?: () => Promise<void>
}) {
  const { t } = useLanguage()

  return (
    <SidebarProvider>
      <AdminBackground />
      <AppSidebar signOutAction={signOutAction} />
      <SidebarInset className="bg-transparent">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-white/75 px-4 backdrop-blur-md">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <p className="hidden text-sm text-muted-foreground sm:block">{t.headerSubtitle}</p>
          <div className="ml-auto flex items-center gap-2">
            <LanguageToggle />
            <Badge
              variant="outline"
              className={
                sanityLive
                  ? 'border-emerald-500/40 text-emerald-700'
                  : 'border-amber-500/40 text-amber-700'
              }
            >
              {sanityLive ? t.sanityLive : t.mockData}
            </Badge>
          </div>
        </header>
        <div className="relative z-10 flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function DashboardShell({
  children,
  sanityLive,
  signOutAction,
}: {
  children: React.ReactNode
  sanityLive: boolean
  signOutAction?: () => Promise<void>
}) {
  return (
    <LanguageProvider>
      <ShellInner sanityLive={sanityLive} signOutAction={signOutAction}>
        {children}
      </ShellInner>
    </LanguageProvider>
  )
}
