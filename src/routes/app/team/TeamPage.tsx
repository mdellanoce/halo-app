/**
 * Halo Team — /app/team composer (Phase 5, plan 05-04).
 *
 * Composes TeamTable + TeamEmptyState + InviteTeammateModal into the /app/team
 * page. Replaces the Phase 3 placeholder.
 *
 * Data flow:
 *   - listTeammates(workspaceId) → teammates (via useMemo + refreshKey).
 *   - updateTeammate(workspaceId, id, patch) on inline role change (D-05).
 *   - createTeammate(workspaceId, input) inside InviteTeammateModal (D-03).
 *   - Refresh ticker: any mutation bumps refreshKey → teammates useMemo re-reads.
 *
 * Header "Invite teammate" button only renders when teammates.length > 0.
 * When empty, the TeamEmptyState CTA is the only entry point for the modal.
 *
 * Defensive narrowing mirrors ListsPage line 100 belt-and-suspenders pattern.
 */

import { useState, useMemo } from 'react'
import { Stack, Group, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { IconUserPlus, IconCheck } from '@tabler/icons-react'
import { Button } from '../../../ui/primitives'
import { PENDO_IDS } from '../../../pendo/PENDO_IDS'
import { trackEvent } from '../../../pendo/track'
import { useAuthStore } from '../../../auth/authStore'
import { listTeammates, updateTeammate } from '../../../team/teamsRepo'
import { TeamTable } from '../../../team/components/TeamTable'
import { TeamEmptyState } from '../../../team/components/TeamEmptyState'
import { InviteTeammateModal } from '../../../team/components/InviteTeammateModal'
import type { WorkspaceRole } from '../../../team/types'

export function TeamPage(): React.JSX.Element {
  const { t } = useTranslation()
  const visitor = useAuthStore((s) => s.currentVisitor)
  const workspace = useAuthStore((s) => s.currentWorkspace)
  const workspaceId = workspace?.id

  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey((k) => k + 1)
  const [inviteOpen, setInviteOpen] = useState(false)

  const teammates = useMemo(
    () => (workspaceId ? listTeammates(workspaceId) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspaceId, refreshKey],
  )

  // Defensive narrowing — RequireAuth + AppLayout already gate this, but
  // mirror ListsPage line 100 belt-and-suspenders pattern.
  if (!workspaceId || !visitor || !workspace) return <></>

  const handleRoleChange = (teammateId: string, nextRole: WorkspaceRole) => {
    const previousRole = teammates.find((tm) => tm.id === teammateId)?.workspaceRole
    const updated = updateTeammate(workspaceId, teammateId, { workspaceRole: nextRole })
    if (updated) {
      // Pendo Track Event: teammate's new workspace role saved.
      trackEvent('Teammate role updated', {
        new_role: nextRole,
        previous_role: previousRole ?? null,
        teammate_status: updated.status,
      })
    }
    notifications.show({
      title: t('team.notifications.roleUpdated'),
      message: '',
      color: 'green',
      icon: <IconCheck size={18} />,
      autoClose: 3000,
    })
    refresh()
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Title order={3}>{t('team.title')}</Title>
        {teammates.length > 0 && (
          <Button
            variant="filled"
            leftSection={<IconUserPlus size={16} />}
            pendoId={PENDO_IDS.team.header.inviteButton}
            onClick={() => setInviteOpen(true)}
          >
            {t('team.inviteTeammate')}
          </Button>
        )}
      </Group>

      {teammates.length === 0 ? (
        <TeamEmptyState
          workspaceName={workspace.companyName}
          onInviteClick={() => setInviteOpen(true)}
        />
      ) : (
        <TeamTable
          teammates={teammates}
          onRoleChange={handleRoleChange}
        />
      )}

      <InviteTeammateModal
        opened={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSuccess={refresh}
        workspaceId={workspaceId}
      />
    </Stack>
  )
}
