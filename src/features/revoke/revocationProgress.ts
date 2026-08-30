export interface RevocationRequirementOptions {
  readonly eligible: boolean
  readonly selectedCount: number
  readonly totalCount: number
  readonly revokedCount: number
  readonly revocationCompleted: boolean
  readonly reportReady: boolean
}

export function getRevocationRequirementMessage({
  eligible,
  selectedCount,
  totalCount,
  revokedCount,
  revocationCompleted,
  reportReady,
}: RevocationRequirementOptions): string {
  if (!eligible) return '네 사례를 먼저 완료하면 철회 연습을 시작할 수 있습니다.'
  if (revocationCompleted && reportReady) return '철회 기록이 준비되었습니다. 학습 보고서를 열어 돌아보세요.'
  if (selectedCount < totalCount) return `권한 ${selectedCount}/${totalCount} 선택 — 네 권한의 유지 또는 철회를 모두 골라 주세요.`
  if (revokedCount === 0) return '철회한 권한 0개 — 지금은 필요하지 않은 권한 하나를 골라 철회해 보세요.'
  return '네 권한의 철회 선택이 준비되었습니다.'
}
