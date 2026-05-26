import { cs } from './cs';
import { en } from './en';
import type { Locale, Translations } from './types';

export type { Locale, Translations } from './types';

const dictionaries: Record<Locale, Translations> = {
  cs,
  en,
};

export const defaultLocale: Locale = 'cs';

export function getTranslations(locale: Locale): Translations {
  return dictionaries[locale];
}

export function isLocale(value: string): value is Locale {
  return value === 'cs' || value === 'en';
}
