'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2,
  FileText,
  LayoutDashboard,
  Users,
  Inbox,
  ExternalLink,
  Settings,
  LogOut,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useLanguage } from '@/components/language-provider'

export function AppSidebar({
  signOutAction,
}: {
  signOutAction?: () => Promise<void>
}) {
  const pathname = usePathname()
  const { t } = useLanguage()

  const nav = [
    { title: t.nav.overview, href: '/', icon: LayoutDashboard },
    { title: t.nav.customers, href: '/customers', icon: Users },
    { title: t.nav.projects, href: '/projects', icon: Building2 },
    { title: t.nav.units, href: '/units', icon: FileText },
    { title: t.nav.inquiries, href: '/inquiries', icon: Inbox },
    { title: t.nav.settings, href: '/settings', icon: Settings },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-xs text-primary-foreground">
            O
          </span>
          <span className="group-data-[collapsible=icon]:hidden">{t.brand}</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>{t.workspace}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.title}
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t.marketingSite}
              render={<a href="/" />}
            >
              <ExternalLink />
              <span>{t.marketingSite}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {signOutAction ? (
            <SidebarMenuItem>
              <form action={signOutAction} className="w-full">
                <SidebarMenuButton type="submit" tooltip={t.settings.signOut} className="w-full">
                  <LogOut />
                  <span>{t.settings.signOut}</span>
                </SidebarMenuButton>
              </form>
            </SidebarMenuItem>
          ) : null}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
