import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { AppSidebar } from '@/components/app-sidebar'
import { isSanityConfigured } from '@/lib/sanity'
import { Badge } from '@/components/ui/badge'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <p className="text-sm text-muted-foreground">Internal customer workspace</p>
          <div className="ml-auto">
            <Badge variant="outline" className={isSanityConfigured ? 'border-emerald-500/40 text-emerald-700' : 'border-amber-500/40 text-amber-700'}>
              {isSanityConfigured ? 'Sanity live' : 'Mock data'}
            </Badge>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
