import type { ReactElement } from 'react'
import { getPermissionDefinition } from '../../content/permissions'
import PermissionGlyph from '../../components/PermissionGlyph'
import type { PermissionDecision, PermissionId } from '../../domain/model'

export interface DecisionComparisonTableProps {
  readonly initial: readonly PermissionDecision[]
  readonly revised: readonly PermissionDecision[]
  readonly changedPermissionIds: readonly PermissionId[]
}

const CHOICE_LABELS = {
  'allow-current-feature': '이번 기능에만 허용',
  deny: '허용하지 않음',
  'more-info': '설명을 더 확인',
} as const

const PERMISSION_IDS: readonly PermissionId[] = ['camera', 'microphone', 'location', 'contacts']

export default function DecisionComparisonTable({ initial, revised, changedPermissionIds }: DecisionComparisonTableProps): ReactElement {
  const initialById = new Map(initial.map((decision) => [decision.permissionId, decision]))
  const revisedById = new Map(revised.map((decision) => [decision.permissionId, decision]))
  return (
    <table>
      <caption>최초 선택과 수정 선택 비교</caption>
      <thead>
        <tr><th scope="col">권한</th><th scope="col">최초 선택</th><th scope="col">수정 선택</th><th scope="col">변경 여부</th></tr>
      </thead>
      <tbody>
        {PERMISSION_IDS.map((permissionId) => {
          const definition = getPermissionDefinition(permissionId)
          const initialChoice = initialById.get(permissionId)?.choice
          const revisedChoice = revisedById.get(permissionId)?.choice
          const changed = changedPermissionIds.includes(permissionId)
          return (
            <tr key={permissionId}>
              <th scope="row"><PermissionGlyph permissionId={permissionId} /><span>{definition.label}</span><span>{definition.shapeLabel}</span></th>
              <td>{initialChoice ? CHOICE_LABELS[initialChoice] : '기록 없음'}</td>
              <td>{revisedChoice ? CHOICE_LABELS[revisedChoice] : '기록 없음'}</td>
              <td>{changed ? <span aria-label="판단 변경">◆ 판단 변경</span> : '변경 없음'}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
