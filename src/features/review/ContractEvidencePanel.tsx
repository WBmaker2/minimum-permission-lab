import { useEffect, useId, useRef, type ReactElement } from 'react'
import { getPermissionDefinition } from '../../content/permissions'
import type { PermissionRule } from '../../domain/model'

export interface ContractEvidencePanelProps {
  rule: PermissionRule
  expanded: boolean
  onToggle: () => void
}

const QUESTIONS = [
  ['이 기능에 어떤 정보가 필요한가요?', 'neededInformation'],
  ['앱을 사용하는 동안만 필요한가요, 항상 필요한가요?', 'timing'],
  ['권한을 주지 않으면 어떤 기능만 제한되나요?', 'denialImpact'],
  ['더 적은 정보로 같은 목적을 이룰 방법이 있나요?', 'alternative'],
] as const

export default function ContractEvidencePanel({
  rule,
  expanded,
  onToggle,
}: ContractEvidencePanelProps): ReactElement {
  const permissionLabel = getPermissionDefinition(rule.permissionId).label
  const idPrefix = useId()
  const panelId = `${idPrefix}-evidence-panel`
  const headingId = `${idPrefix}-evidence-heading`
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (expanded) headingRef.current?.focus()
  }, [expanded])

  return (
    <section data-evidence-panel>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        {permissionLabel} 기능 계약 근거 {expanded ? '닫기' : '보기'}
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        hidden={!expanded}
      >
        <h4 id={headingId} tabIndex={-1} ref={headingRef}>{permissionLabel} 기능 계약 근거</h4>
        {QUESTIONS.map(([question, key]) => (
          <div key={key}>
            <h5>{question}</h5>
            <p>{rule[key]}</p>
          </div>
        ))}
        <h5>기능 계약 근거</h5>
        <p>{rule.contractEvidence}</p>
      </div>
    </section>
  )
}
