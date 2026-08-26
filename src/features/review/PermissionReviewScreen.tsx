import { useId, useState, type ReactElement } from 'react'
import type { AppCase, CaseId, CaseProgress, LearnerChoice, LabStage, PermissionDecision, PermissionId, ReasonTagId } from '../../domain/model'
import PrimaryActionButton from '../../components/PrimaryActionButton'
import StatusLiveRegion from '../../components/StatusLiveRegion'
import PermissionCard from './PermissionCard'
import RationaleComposer from './RationaleComposer'

export interface PermissionReviewScreenProps {
  appCase: AppCase
  mode: 'initial' | 'revision'
  progress: CaseProgress
  onDecision: (decision: PermissionDecision) => void
  onRationaleTextChange: (caseId: CaseId, value: string) => void
  onReasonTagToggle: (caseId: CaseId, tagId: ReasonTagId) => void
  onReview: () => void
  stage?: Extract<LabStage, 'initial-review' | 'revision-review'>
}

const CHOICE_LABELS: Readonly<Record<LearnerChoice, string>> = {
  'allow-current-feature': '이번 기능에만 허용',
  deny: '허용하지 않음',
  'more-info': '설명을 더 확인',
}

export default function PermissionReviewScreen({
  appCase,
  mode,
  progress,
  onDecision,
  onRationaleTextChange,
  onReasonTagToggle,
  onReview,
}: PermissionReviewScreenProps): ReactElement {
  const [expandedPermissionId, setExpandedPermissionId] = useState<PermissionId | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const titleId = `${useId()}-permission-review-title`
  const decisions = mode === 'initial' ? progress.initialDecisions : progress.revisedDecisions
  const allDecisionsMade = appCase.requestedPermissions.every((permissionId) => decisions[permissionId]?.permissionId === permissionId)
  const rationaleReady = mode === 'initial' || (progress.reasonTags.length >= 1 && progress.rationaleText.trim().length > 0)
  const ready = allDecisionsMade && rationaleReady
  const stepNumber = mode === 'initial' ? 3 : 5

  const handleDecision = (permissionId: PermissionId, choice: LearnerChoice) => {
    onDecision({ permissionId, choice })
    if (choice === 'more-info') setExpandedPermissionId(permissionId)
    else if (expandedPermissionId === permissionId) setExpandedPermissionId(null)
    setStatusMessage(`${permissionId === 'microphone' ? '마이크' : permissionId === 'camera' ? '카메라' : permissionId === 'location' ? '위치' : '연락처'} 권한을 ${CHOICE_LABELS[choice]}으로 선택했습니다. 학습용 판단입니다.`)
  }

  return (
    <main>
      <h2>{mode === 'initial' ? '최초 권한 심사' : '수정 권한 심사'}</h2>
      <p>{appCase.title}: {appCase.coreFunction}</p>
      <p>각 권한은 이 기능 계약에 필요한 만큼만 판단합니다. 실제 기기 권한을 요청하지 않습니다.</p>
      <StatusLiveRegion message={statusMessage} />
      <section aria-labelledby={titleId}>
        <h3 id={titleId}>권한 선택</h3>
        {appCase.requestedPermissions.map((permissionId) => (
          <PermissionCard
            key={permissionId}
            permissionId={permissionId}
            rule={appCase.rules[permissionId]}
            value={decisions[permissionId]?.choice}
            expanded={expandedPermissionId === permissionId}
            onChange={(choice) => handleDecision(permissionId, choice)}
            onToggleEvidence={() => setExpandedPermissionId((current) => current === permissionId ? null : permissionId)}
          />
        ))}
      </section>
      {mode === 'revision' && (
        <RationaleComposer
          caseId={appCase.id}
          value={progress.rationaleText}
          selectedTags={progress.reasonTags}
          onTextChange={onRationaleTextChange}
          onTagToggle={onReasonTagToggle}
        />
      )}
      <PrimaryActionButton pulse={ready} stepNumber={stepNumber} disabled={!ready} onClick={onReview}>
        선택 검토
      </PrimaryActionButton>
    </main>
  )
}
