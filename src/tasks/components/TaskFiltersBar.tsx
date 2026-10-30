/**
 * Halo Lists — Filter bar (Phase 4, plan 04-03 Task 1.B).
 *
 * Three `<Select>` controls (Status / Priority / Assignee) per D-03. "All" is
 * the default + cleared state for each; `clearable={false}` so the user cannot
 * empty a Select into an undefined value. Filter state lives in the parent
 * (`ListsPage`) per D-05 — component state only, no URL persistence in Phase 4.
 *
 * The Group container carries `data-pendo-id={PENDO_IDS.lists.filter.bar}` so
 * Pendo can target the bar as a class. Each Select forwards its own pendoId
 * via the wrapped primitive (TS-enforced).
 */

import { Group } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { Select } from '../../ui/primitives'
import { PENDO_IDS } from '../../pendo/PENDO_IDS'
import { taskStatusLabel, taskPriorityLabel } from '../labels'
import { TaskStatusEnum, TaskPriorityEnum } from '../schemas'
import { getAssigneeOptions } from '../assigneeOptions'
import type { Visitor } from '../../auth/types'

export type TaskFiltersBarProps = {
  workspaceId: string
  visitor: Visitor
  statusValue: string
  priorityValue: string
  assigneeValue: string
  onChange: (next: {
    status?: string
    priority?: string
    assignee?: string
  }) => void
}

export function TaskFiltersBar({
  workspaceId,
  visitor,
  statusValue,
  priorityValue,
  assigneeValue,
  onChange,
}: TaskFiltersBarProps): React.JSX.Element {
  const { t } = useTranslation()
  const ALL_OPTION = { value: 'all', label: t('tasks.filters.all') }
  const statusOptions = [
    ALL_OPTION,
    ...TaskStatusEnum.options.map((s) => ({ value: s, label: taskStatusLabel(t, s) })),
  ]
  const priorityOptions = [
    ALL_OPTION,
    ...TaskPriorityEnum.options.map((p) => ({
      value: p,
      label: taskPriorityLabel(t, p),
    })),
  ]
  const assigneeOptions = [
    ALL_OPTION,
    ...getAssigneeOptions(workspaceId, visitor),
  ]

  return (
    <Group gap="md" data-pendo-id={PENDO_IDS.lists.filter.bar}>
      <Select
        label={t('tasks.fields.status')}
        data={statusOptions}
        value={statusValue}
        onChange={(v) => onChange({ status: v ?? 'all' })}
        clearable={false}
        w={160}
        pendoId={PENDO_IDS.lists.filter.status}
      />
      <Select
        label={t('tasks.fields.priority')}
        data={priorityOptions}
        value={priorityValue}
        onChange={(v) => onChange({ priority: v ?? 'all' })}
        clearable={false}
        w={160}
        pendoId={PENDO_IDS.lists.filter.priority}
      />
      <Select
        label={t('tasks.fields.assignee')}
        data={assigneeOptions}
        value={assigneeValue}
        onChange={(v) => onChange({ assignee: v ?? 'all' })}
        clearable={false}
        w={200}
        pendoId={PENDO_IDS.lists.filter.assignee}
      />
    </Group>
  )
}
