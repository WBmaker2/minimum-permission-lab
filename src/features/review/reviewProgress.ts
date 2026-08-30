import type { PermissionDecision, PermissionId } from '../../domain/model'

export interface DecisionHintOptions {
  mode: 'initial' | 'revision'
  selectedCount: number
  totalCount: number
  rationaleReady?: boolean
}

const PERMISSION_IDS: readonly PermissionId[] = ['camera', 'microphone', 'location', 'contacts']

export function countSelectedDecisions(
  decisions: Partial<Record<PermissionId, PermissionDecision>>,
  permissionIds: readonly PermissionId[] = PERMISSION_IDS,
): number {
  return permissionIds.filter((permissionId) => decisions[permissionId]?.permissionId === permissionId).length
}

export function getDecisionHint({ mode, selectedCount, totalCount, rationaleReady = false }: DecisionHintOptions): string {
  if (selectedCount < totalCount) {
    return `${mode === 'initial' ? '권한' : '수정 선택'} ${selectedCount}/${totalCount} 선택 — 모든 권한을 선택하면 다음 단계로 갈 수 있습니다.`
  }
  if (mode === 'revision' && !rationaleReady) return '수정한 이유를 하나 고르고 짧은 근거 문장을 쓰면 다음 단계로 갈 수 있습니다.'
  return '모든 선택이 준비되었습니다.'
}
