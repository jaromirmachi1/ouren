'use client'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language">
      <button
        type="button"
        className={cn(buttonVariants({ variant: locale === 'cs' ? 'secondary' : 'ghost', size: 'sm' }))}
        onClick={() => setLocale('cs')}
      >
        {t.langCs}
      </button>
      <button
        type="button"
        className={cn(buttonVariants({ variant: locale === 'en' ? 'secondary' : 'ghost', size: 'sm' }))}
        onClick={() => setLocale('en')}
      >
        {t.langEn}
      </button>
    </div>
  )
}
