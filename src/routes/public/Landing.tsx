import React from 'react'
import { Anchor, Image, Stack, Text, useComputedColorScheme } from '@mantine/core'
import { useTranslation } from 'react-i18next'

/**
 * Phase 1 landing page — placeholder for the public index route `/`.
 *
 * Phase-specific notes:
 *   - Phase 2 adds real /signin and /signup routes. The Anchor links below are
 *     intentionally non-functional in Phase 1 — they confirm the Landing component
 *     is rendering as the index of `/` and provide visible placeholders.
 *   - Phase 1 uses Mantine's <Anchor> directly. Plan 06 (UI primitives) has not
 *     run yet in the wave order, so the wrapped primitive is not available here.
 */
export function Landing(): React.JSX.Element {
  const { t } = useTranslation()
  const colorScheme = useComputedColorScheme('light')
  return (
    <Stack gap="lg" pt="xl">
      <Image
        src={colorScheme === 'dark' ? '/halo-logo-dark.png' : '/halo-logo.png'}
        alt="Halo"
        h={56}
        w="auto"
        fit="contain"
      />
      <Text c="dimmed" size="lg">
        {t('landing.tagline')}
      </Text>
      <Stack gap="xs">
        <Anchor href="/signin">{t('landing.signInLink')}</Anchor>
        <Anchor href="/signup">{t('landing.signUpLink')}</Anchor>
      </Stack>
    </Stack>
  )
}
