import type { Metadata } from 'next'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { AuthSessionProvider } from '@/components/auth-session-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ouren Portal',
  description: 'Internal customer and inventory workspace for Ouren Real Estate.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className="h-full antialiased">
      <body className="min-h-full bg-background font-sans text-foreground">
        <AuthSessionProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
