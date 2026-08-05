import { Suspense } from 'react'
import { LanguageProvider } from '@/components/language-provider'
import { LanguageToggle } from '@/components/language-toggle'
import { LoginForm } from '@/components/login-form'
import { LoginCopy } from '@/components/login-copy'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <LanguageProvider>
      <div className="relative flex min-h-svh items-center justify-center bg-[linear-gradient(160deg,#f7f9fc_0%,#e8eef6_45%,#d9e6f4_100%)] px-4">
        <div className="absolute right-4 top-4">
          <LanguageToggle />
        </div>
        <Card className="w-full max-w-md border-white/70 bg-white/90 shadow-sm backdrop-blur">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                O
              </span>
              <LoginCopy />
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </LanguageProvider>
  )
}
