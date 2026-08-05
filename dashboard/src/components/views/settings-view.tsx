'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/components/language-provider'

export function SettingsView({
  currentEmail,
  portalEmails,
  signOutAction,
}: {
  currentEmail: string
  portalEmails: string[]
  signOutAction: () => Promise<void>
}) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t.settings.title}</h1>
        <p className="text-sm text-muted-foreground">{t.settings.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.settings.account}</CardTitle>
          <CardDescription>{t.settings.accountHint}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t.settings.signedInAs}</p>
            <p className="font-medium">{currentEmail || '—'}</p>
          </div>
          <form action={signOutAction}>
            <Button type="submit" variant="outline">
              {t.settings.signOut}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.settings.teamAccess}</CardTitle>
          <CardDescription>{t.settings.teamHint}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {portalEmails.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.settings.noUsers}</p>
            ) : (
              portalEmails.map((email) => (
                <Badge key={email} variant="outline" className="font-normal">
                  {email}
                </Badge>
              ))
            )}
          </div>
          <div className="rounded-lg border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
            <p className="mb-2 font-medium text-foreground">{t.settings.howToAdd}</p>
            <ol className="list-decimal space-y-1 pl-4">
              <li>{t.settings.step1}</li>
              <li>
                <code className="rounded bg-background px-1.5 py-0.5 text-xs">{t.settings.step2}</code>
              </li>
              <li>{t.settings.step3}</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
