import React from 'react'
import { Select } from '@mantine/core'
import { IconWorld } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import type { PendoId } from '../pendo/PENDO_IDS'
import { LOCALE_LABELS, SUPPORTED_LOCALES, getActiveLocale } from '.'

/**
 * Language switcher — changes the i18next language, which the detector
 * persists to localStorage['halo.locale'] and the i18n module mirrors onto
 * `<html lang>`. Mounted in the AppLayout top bar, the PublicLayout header row
 * and Settings → Preferences, each with its own `pendoId`.
 */
export function LanguageSwitcher({ pendoId }: { pendoId: PendoId }): React.JSX.Element {
  // useTranslation re-renders on languageChanged; getActiveLocale maps
  // regional browser locales (fr-CA) onto a supported one.
  const { t, i18n } = useTranslation()

  return (
    <Select
      aria-label={t('common.language')}
      size="xs"
      w={130}
      allowDeselect={false}
      leftSection={<IconWorld size={14} />}
      data={SUPPORTED_LOCALES.map((value) => ({ value, label: LOCALE_LABELS[value] }))}
      value={getActiveLocale()}
      onChange={(value) => {
        if (value) void i18n.changeLanguage(value)
      }}
      data-pendo-id={pendoId}
    />
  )
}
