/**
 * i18n bootstrap — i18next + react-i18next.
 *
 * Supported locales: `en` (default / fallback), `es`, `fr`.
 * Catalogs live in `src/locales/<locale>.json` (single `translation` namespace).
 *
 * Active locale resolution (i18next-browser-languagedetector):
 *   1. localStorage['halo.locale'] — written by the LanguageSwitcher
 *   2. navigator.language(s)       — browser preference
 *   3. `en`                        — fallback
 *
 * The resolved locale is mirrored onto `<html lang>` and passed to Pendo as
 * `visitor.locale` (see src/main.tsx + src/pendo/PendoBridge.tsx).
 *
 * Imported for side effects from src/main.tsx BEFORE pendo.initialize so the
 * locale is known at Pendo boot.
 */
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import es from '../locales/es.json'
import fr from '../locales/fr.json'

export const SUPPORTED_LOCALES = ['en', 'es', 'fr'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: SupportedLocale = 'en'
export const LOCALE_STORAGE_KEY = 'halo.locale'

/** Endonyms for the language switcher — intentionally not translated. */
export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
    },
    // Regional browser codes resolve to their base language (es-MX → es,
    // fr-CA → fr) and anything else to `en`, so i18n.language — and what the
    // detector caches — is always one of SUPPORTED_LOCALES.
    // (Don't add load: 'languageOnly' / nonExplicitSupportedLngs — either
    // makes i18next keep the raw regional code.)
    supportedLngs: SUPPORTED_LOCALES,
    fallbackLng: DEFAULT_LOCALE,
    interpolation: { escapeValue: false }, // React already escapes
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LOCALE_STORAGE_KEY,
      caches: ['localStorage'],
    },
  })

/** The active locale, normalized to one of SUPPORTED_LOCALES. */
export function getActiveLocale(): SupportedLocale {
  const lng = i18n.resolvedLanguage ?? i18n.language
  return (SUPPORTED_LOCALES as readonly string[]).includes(lng)
    ? (lng as SupportedLocale)
    : DEFAULT_LOCALE
}

function syncHtmlLang(): void {
  document.documentElement.lang = getActiveLocale()
}
syncHtmlLang()
i18n.on('languageChanged', syncHtmlLang)

export default i18n
