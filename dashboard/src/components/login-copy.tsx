'use client'

import { useLanguage } from '@/components/language-provider'

export function LoginCopy() {
  const { t } = useLanguage()
  return (
    <div>
      <p className="font-semibold tracking-tight">{t.brand}</p>
      <p className="text-sm text-muted-foreground">{t.login.subtitle}</p>
    </div>
  )
}
