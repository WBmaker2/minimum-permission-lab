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
    if (hasDisabledFeatureSwitch) return `비교 ${acknowledgedConditionCount}/${conditionCount} — 먼저 조건을 바꾼 뒤, 보이는 결과를 확인해 주세요.`
    return `비교 ${acknowledgedConditionCount}/${conditionCount} — 각 조건을 바꾸고 보이는 결과를 확인해 주세요.`
  }
  if (controlAction === null) return '대안 사용 또는 권한 철회 중 하나를 골라야 다음 단계로 갈 수 있습니다.'
  return '모든 비교와 다음 방향을 골랐습니다.'
}
