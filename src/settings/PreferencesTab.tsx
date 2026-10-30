/**
 * Settings — Preferences tab (SET-04 + Danger zone trigger for SET-06).
 *
 * Two stacked sections:
 *
 *   1. Theme toggle. A Mantine `<SegmentedControl>` bound to
 *      `useMantineColorScheme()` with Light / Dark / System segments.
 *      Persistence is owned by Mantine — writes to localStorage key
 *      `mantine-color-scheme-value`, which is OUTSIDE the halo:v* envelope
 *      so it survives Reset demo data (D-16 + D-26 locks).
 *
 *   2. Language. The shared `<LanguageSwitcher>` (also in the top bar) with
 *      a note that the choice is persisted per browser.
 *
 *   3. Danger zone. A bordered `<Paper>` with a red title + body copy +
 *      outline-red "Reset demo data" button that opens
 *      `ResetDemoDataModal`. The destructive flow is gated by the modal —
 *      no inline confirm. UI-03 + D-17 + SET-06.
 *
 * Plan 04-01 wired the boot path (`defaultColorScheme="auto"` in App.tsx +
 * the inline ColorSchemeScript in index.html) so changing the segment
 * here propagates instantly through every Mantine surface that uses
 * `var(--mantine-color-*)` tokens — the AppShell, Dashboard, Lists,
 * Reports, and Settings itself.
 */

import { useState } from 'react'
import { Stack, Group, Paper, Title, Text, Box, SegmentedControl, useMantineColorScheme } from '@mantine/core'
import { IconSun, IconMoon, IconDeviceLaptop, IconAlertTriangle } from '@tabler/icons-react'
import { Button } from '../ui/primitives'
import { PENDO_IDS } from '../pendo/PENDO_IDS'
import { ResetDemoDataModal } from './ResetDemoDataModal'
import { LanguageSwitcher } from '../i18n/LanguageSwitcher'
import { useTranslation } from 'react-i18next'

type ColorScheme = 'light' | 'dark' | 'auto'

export function PreferencesTab(): React.JSX.Element {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const [resetOpen, setResetOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <Stack gap="xl">
      {/* Theme toggle — Light / Dark / System SegmentedControl */}
      <Stack gap="sm">
        <Text size="sm" fw={500}>{t('preferences.theme')}</Text>
        <SegmentedControl
          data={[
            { value: 'light', label: <Group gap={8} wrap="nowrap"><IconSun size={14} />{t('preferences.themeLight')}</Group> },
            { value: 'dark', label: <Group gap={8} wrap="nowrap"><IconMoon size={14} />{t('preferences.themeDark')}</Group> },
            { value: 'auto', label: <Group gap={8} wrap="nowrap"><IconDeviceLaptop size={14} />{t('preferences.themeSystem')}</Group> },
          ]}
          value={colorScheme}
          onChange={(v) => setColorScheme(v as ColorScheme)}
          data-pendo-id={PENDO_IDS.settings.preferences.themeToggle}
        />
      </Stack>

      {/* Language — same switcher as the top bar */}
      <Stack gap="sm">
        <Text size="sm" fw={500}>{t('preferences.language')}</Text>
        <Text size="sm" c="dimmed">{t('preferences.languageDescription')}</Text>
        <LanguageSwitcher pendoId={PENDO_IDS.settings.preferences.languageSelect} />
      </Stack>

      {/* Danger zone card (D-17 + UI-03) */}
      <Paper withBorder p="lg" radius="md" mt="xl">
        <Stack gap="md">
          <Title order={3} c="red.7">{t('preferences.dangerZone')}</Title>
          <Text size="md">{t('preferences.dangerZoneBody')}</Text>
          <Box>
            <Button
              color="red"
              variant="outline"
              leftSection={<IconAlertTriangle size={16} />}
              pendoId={PENDO_IDS.settings.dangerZone.button}
              onClick={() => setResetOpen(true)}
            >
              {t('preferences.resetDemoData')}
            </Button>
          </Box>
        </Stack>
      </Paper>

      <ResetDemoDataModal opened={resetOpen} onClose={() => setResetOpen(false)} />
    </Stack>
  )
}
