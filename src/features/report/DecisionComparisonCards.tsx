import type { ReactElement } from 'react'
import { getPermissionDefinition } from '../../content/permissions'
import PermissionGlyph from '../../components/PermissionGlyph'
import type { PermissionDecision, PermissionId } from '../../domain/model'
import { CHOICE_LABELS } from './decisionComparisonLabels'

export interface DecisionComparisonCardsProps {
  readonly initial: readonly PermissionDecision[]
  readonly revised: readonly PermissionDecision[]
  readonly changedPermissionIds: readonly PermissionId[]
}

const PERMISSION_IDS: readonly PermissionId[] = ['camera', 'microphone', 'location', 'contacts']

export default function DecisionComparisonCards({ initial, revised, changedPermissionIds }: DecisionComparisonCardsProps): ReactElement {
  const initialById = new Map(initial.map((decision) => [decision.permissionId, decision]))
  const revisedById = new Map(revised.map((decision) => [decision.permissionId, decision]))

  return (
    <div className="decision-comparison-cards" aria-label="권한별 비교 카드 목록">
      {PERMISSION_IDS.map((permissionId) => {
        const definition = getPermissionDefinition(permissionId)
        const initialChoice = initialById.get(permissionId)?.choice
        const revisedChoice = revisedById.get(permissionId)?.choice
        const changed = changedPermissionIds.includes(permissionId)
        const headingId = `comparison-card-${permissionId}`
        return (
          <div key={permissionId} className="decision-comparison-card" role="group" aria-labelledby={headingId}>
            <h5 id={headingId}>
              <PermissionGlyph permissionId={permissionId} />
              <span>{definition.label}</span>
            </h5>
            <p className="permission-shape-label" aria-hidden="true">모양: {definition.shapeLabel}</p>
            <dl>
              <div><dt>최초 선택</dt><dd>{initialChoice ? CHOICE_LABELS[initialChoice] : '기록 없음'}</dd></div>
              <div><dt>수정 선택</dt><dd>{revisedChoice ? CHOICE_LABELS[revisedChoice] : '기록 없음'}</dd></div>
              <div><dt>변경 여부</dt><dd>{changed ? <span aria-label="판단 변경">◆ 판단 변경</span> : '변경 없음'}</dd></div>
            </dl>
          </div>
        )
      })}
    </div>
  )
}
