export interface ImpactRequirementOptions {
  readonly conditionCount: number
  readonly acknowledgedConditionCount: number
  readonly conditionsSatisfied: boolean
  readonly hasDisabledFeatureSwitch: boolean
  readonly controlAction: 'alternative' | 'revoke' | null
}

export function getImpactRequirementMessage({
  conditionCount,
  acknowledgedConditionCount,
  conditionsSatisfied,
  hasDisabledFeatureSwitch,
  controlAction,
}: ImpactRequirementOptions): string {
  if (!conditionsSatisfied) {
    if (hasDisabledFeatureSwitch) return `조건부 비교 ${acknowledgedConditionCount}/${conditionCount} — 기능 스위치를 켠 뒤 비교 확인을 눌러 주세요.`
    return `조건부 비교 ${acknowledgedConditionCount}/${conditionCount} — 각 조건의 비교 확인을 눌러 주세요.`
  }
  if (controlAction === null) return '대안 사용 또는 권한 철회 중 하나를 골라야 다음 단계로 갈 수 있습니다.'
  return '모든 조건과 수정 방향이 준비되었습니다.'
}
