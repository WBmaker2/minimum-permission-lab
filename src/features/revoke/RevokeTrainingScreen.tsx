import { useState, type ReactElement } from 'react'
import PrimaryActionButton from '../../components/PrimaryActionButton'
import StatusLiveRegion from '../../components/StatusLiveRegion'
import { getPermissionDefinition } from '../../content/permissions'
import type { PermissionId, RevocationDecision } from '../../domain/model'
import PermissionUseLog, { PERMISSION_USE_LOG_ENTRIES } from './PermissionUseLog'

export interface RevokeTrainingScreenProps {
  readonly eligible: boolean
  readonly decisions: Partial<Record<PermissionId, RevocationDecision>>
  readonly revocationCompleted: boolean
  readonly onDecision: (decision: RevocationDecision) => void
  readonly onComplete: () => void
  readonly onOpenReport: () => void
  readonly onReset: () => void
}

const PERMISSION_IDS: readonly PermissionId[] = ['camera', 'microphone', 'location', 'contacts']

function isRevocationAction(action: unknown): action is RevocationDecision['action'] {
  return action === 'keep-current-feature' || action === 'revoke-now'
}

function hasAllValidDecisions(decisions: Partial<Record<PermissionId, RevocationDecision>>): boolean {
  return PERMISSION_IDS.every((permissionId) => {
    const decision = decisions[permissionId]
    return decision?.permissionId === permissionId && isRevocationAction(decision.action)
  })
}

function hasRevocation(decisions: Partial<Record<PermissionId, RevocationDecision>>): boolean {
  return PERMISSION_IDS.some((permissionId) => decisions[permissionId]?.action === 'revoke-now')
}

function actionLabel(action: RevocationDecision['action']): string {
  return action === 'revoke-now' ? '지금 철회' : '현재 기능에 유지'
}

export default function RevokeTrainingScreen({
  eligible,
  decisions,
  revocationCompleted,
  onDecision,
  onComplete,
  onOpenReport,
  onReset,
}: RevokeTrainingScreenProps): ReactElement {
  const [statusMessage, setStatusMessage] = useState('')
  const allValid = hasAllValidDecisions(decisions)
  const ready = eligible && allValid && hasRevocation(decisions) && !revocationCompleted
  const reportReady = eligible && revocationCompleted && allValid && hasRevocation(decisions)
  const allKeep = eligible && allValid && !hasRevocation(decisions)

  const handleDecision = (decision: RevocationDecision) => {
    if (revocationCompleted) return
    onDecision(decision)
    const permissionLabel = getPermissionDefinition(decision.permissionId).label
    setStatusMessage(`${permissionLabel} 권한의 선택: ${actionLabel(decision.action)}. 실제 권한이 아닌 가상 학습 기록이며, 필요한 순간만 최소한으로 사용하고 나중에 철회할 수 있습니다.`)
  }

  return (
    <main>
      <h2 data-stage-heading tabIndex={-1}>권한 철회 미니 활동</h2>
      <p>사례를 마친 뒤 권한 사용 기록을 돌아보고, 계속 필요한 권한과 이제 필요 없는 권한을 구분합니다.</p>
      <StatusLiveRegion message={statusMessage} />
      {!eligible ? (
        <section aria-labelledby="revocation-boundary-title">
          <h3 id="revocation-boundary-title">네 사례를 먼저 완료해 주세요</h3>
          <p>네 사례의 권한 판단과 수정 이유를 모두 기록하면 이 가상 철회 연습을 시작할 수 있습니다.</p>
          <button type="button" onClick={onReset}>사례 선택으로 돌아가기</button>
        </section>
      ) : (
        <>
          <PermissionUseLog decisions={decisions} onDecision={handleDecision} disabled={revocationCompleted} />
          {!revocationCompleted && (
            <p>
              {!allValid
                ? '네 권한의 판단을 모두 선택하고, 사용하지 않는 권한 하나 이상을 철회해 보세요.'
                : allKeep
                  ? '모든 권한을 유지하기로 했습니다. 현재 사용하지 않는 권한 하나 이상을 철회해 보세요.'
                  : '네 권한의 판단이 모였습니다. 철회 판단을 완료할 수 있습니다.'}
            </p>
          )}
          {revocationCompleted && <p>가상 철회 판단을 기록했습니다. 실제 기기 설정이나 권한은 바뀌지 않았습니다.</p>}
          <PrimaryActionButton
            pulse={ready}
            stepNumber={6}
            disabled={!ready}
            onClick={onComplete}
          >
            철회 판단 완료
          </PrimaryActionButton>
          <PrimaryActionButton
            pulse={reportReady}
            stepNumber={7}
            disabled={!reportReady}
            onClick={onOpenReport}
          >
            학습 보고서 보기
          </PrimaryActionButton>
          <p>이 활동은 실제 권한을 요청하거나 읽거나 바꾸지 않는 학습용 판단입니다.</p>
        </>
      )}
    </main>
  )
}

export { PERMISSION_USE_LOG_ENTRIES }
