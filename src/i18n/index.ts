import en from '../content/i18n/en.json';
import es from '../content/i18n/es.json';
import fr from '../content/i18n/fr.json';
import de from '../content/i18n/de.json';
import ar from '../content/i18n/ar.json';

export const DEFAULT_LOCALE = 'en' as const;

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ar';

export const LOCALES: Locale[] = ['en', 'es', 'fr', 'de', 'ar'];

// Non-default locales get a URL prefix (English stays at "/").
export const NON_DEFAULT_LOCALES: Locale[] = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export type Content = typeof en;

const bundles: Record<Locale, Content> = { en, es, fr, de, ar };

// Each language is shown in its own name in the switcher.
export const LANG_NAMES: Record<Locale, { code: string; name: string }> = {
  en: { code: 'EN', name: 'English' },
  es: { code: 'ES', name: 'Español' },
  fr: { code: 'FR', name: 'Français' },
  de: { code: 'DE', name: 'Deutsch' },
  ar: { code: 'AR', name: 'العربية' },
};

// BCP-47 codes for date formatting.
export const BCP47: Record<Locale, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  ar: 'ar',
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export function getContent(locale: Locale): Content {
  return bundles[locale] ?? bundles[DEFAULT_LOCALE];
}

export function dir(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

// Build a path for the given locale (default locale has no prefix).
export function localizedPath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\//, '');
  const base = locale === DEFAULT_LOCALE ? '/' : `/${locale}/`;
  return clean ? `${base}${clean}` : base;
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(BCP47[locale], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
