'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/components/language-provider'
import { updateUserRole } from '@/lib/actions/roles'
import { PORTAL_ROLES, type PortalRole } from '@/lib/roles'
import { cn } from '@/lib/utils'

const selectClassName = cn(
  'h-8 min-w-[10rem] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none',
  'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
)

export function SettingsView({
  currentEmail,
  currentRole,
  portalUsers,
  canManageRoles,
  signOutAction,
}: {
  currentEmail: string
  currentRole: PortalRole
  portalUsers: { email: string; role: PortalRole }[]
  canManageRoles: boolean
  signOutAction: () => Promise<void>
}) {
  const { t } = useLanguage()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function roleLabel(role: PortalRole) {
    return t.settings.roles[role]
  }

  function onRoleChange(email: string, role: PortalRole) {
    startTransition(async () => {
      const result = await updateUserRole(email, role)
      if (!result.ok) {
        toast.error(t.settings.roleErrors[result.error])
        return
      }
      toast.success(t.settings.roleUpdated)
      if (email === currentEmail) {
        toast.message(t.settings.roleReLogin)
      }
      router.refresh()
    })
  }

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
          <div className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">{t.settings.signedInAs}</p>
              <p className="font-medium">{currentEmail || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.settings.yourRole}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline">{roleLabel(currentRole)}</Badge>
                <span className="text-xs text-muted-foreground">
                  {t.settings.roleDescriptions[currentRole]}
                </span>
              </div>
            </div>
          </div>
          <form action={signOutAction}>
            <Button type="submit" variant="outline">
              {t.settings.signOut}
            </Button>
          </form>
        </CardContent>
      </Card>

      {canManageRoles ? (
        <Card>
          <CardHeader>
            <CardTitle>{t.settings.teamAccess}</CardTitle>
            <CardDescription>{t.settings.rolesHint}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {portalUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.settings.noUsers}</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-left">
                      <th className="px-4 py-3 font-medium">{t.login.email}</th>
                      <th className="px-4 py-3 font-medium">{t.settings.roleColumn}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portalUsers.map((user) => (
                      <tr key={user.email} className="border-b last:border-b-0">
                        <td className="px-4 py-3 font-medium">{user.email}</td>
                        <td className="px-4 py-3">
                          <select
                            className={selectClassName}
                            value={user.role}
                            disabled={pending}
                            onChange={(event) =>
                              onRoleChange(user.email, event.target.value as PortalRole)
                            }
                            aria-label={`${t.settings.roleColumn} — ${user.email}`}
                          >
                            {PORTAL_ROLES.map((role) => (
                              <option key={role} value={role}>
                                {roleLabel(role)}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {t.settings.roleDescriptions[user.role]}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
      ) : null}
    </div>
  )
}
