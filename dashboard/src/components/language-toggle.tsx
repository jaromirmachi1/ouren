'use client'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant={locale === 'cs' ? 'secondary' : 'ghost'}
        onClick={() => setLocale('cs')}
      >
        {t.langCs}
      </Button>
      <Button
        size="sm"
        variant={locale === 'en' ? 'secondary' : 'ghost'}
        onClick={() => setLocale('en')}
      >
        {t.langEn}
      </Button>
    </div>
  )
}
