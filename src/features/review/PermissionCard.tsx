import { useId, type ReactElement } from 'react'
import { getPermissionDefinition } from '../../content/permissions'
import type { LearnerChoice, PermissionId, PermissionRule } from '../../domain/model'
import PermissionGlyph from '../../components/PermissionGlyph'
import ContractEvidencePanel from './ContractEvidencePanel'
import PermissionChoiceGroup from './PermissionChoiceGroup'

export interface PermissionCardProps {
  permissionId: PermissionId
  rule: PermissionRule
  value: LearnerChoice | undefined
  expanded: boolean
  onChange: (choice: LearnerChoice) => void
  onToggleEvidence: () => void
}

export default function PermissionCard({
  permissionId,
  rule,
  value,
  expanded,
  onChange,
  onToggleEvidence,
}: PermissionCardProps): ReactElement {
  const permission = getPermissionDefinition(permissionId)
  const descriptionId = `${useId()}-review-description`

  return (
    <fieldset>
      <legend>
        <PermissionGlyph permissionId={permissionId} />
        <span>{permission.label}</span>
        <span>{permission.shapeLabel}</span>
      </legend>
      <p id={descriptionId}>{permission.detailDescription}</p>
      <p>필요 정보: {rule.neededInformation}</p>
      <p>사용 시점: {rule.timing}</p>
      <p>거부하면: {rule.denialImpact}</p>
      <p>덜 받는 방법: {rule.alternative}</p>
      <PermissionChoiceGroup
        permission={permission}
        value={value}
        onChange={onChange}
        describedBy={descriptionId}
      />
      <ContractEvidencePanel
        rule={rule}
        expanded={expanded}
        onToggle={onToggleEvidence}
      />
    </fieldset>
  )
}
