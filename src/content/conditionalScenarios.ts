import type {
  CaseId,
  ConditionalScenarioId,
  FeatureSwitchId,
  PermissionId,
} from '../domain/model'

export interface ConditionalScenario {
  readonly id: ConditionalScenarioId
  readonly caseId: CaseId
  readonly permissionId: PermissionId
  readonly featureSwitchId?: FeatureSwitchId
  readonly changedContract: string
  readonly requiredConditions: readonly string[]
  readonly comparisonPrompt: string
}

export const CONDITIONAL_SCENARIO_ORDER = Object.freeze([
  'voice-press-and-delete',
  'map-current-position-opt-in',
] as const)

export const CONDITIONAL_SCENARIOS: Readonly<
  Record<ConditionalScenarioId, ConditionalScenario>
> = Object.freeze({
  'voice-press-and-delete': Object.freeze({
    id: 'voice-press-and-delete',
    caseId: 'voice-reading',
    permissionId: 'microphone',
    changedContract: '음성은 누르는 동안만 처리하고 바로 삭제할 때만 짧게 사용합니다.',
    requiredConditions: Object.freeze([
      '녹음 버튼을 누르고 있는 동안에만 음성을 처리합니다.',
      '손을 떼면 음성을 바로 재생합니다.',
      '재생이 끝나면 음성을 즉시 삭제합니다.',
    ]),
    comparisonPrompt: '바로 삭제할 때와 오래 보관할 때 무엇이 달라지는지 예상해 보세요.',
  }),
  'map-current-position-opt-in': Object.freeze({
    id: 'map-current-position-opt-in',
    caseId: 'class-map',
    permissionId: 'location',
    featureSwitchId: 'map-current-position',
    changedContract: '저장된 지도는 그대로 두고 현재 위치 보기만 켜서 차이를 확인합니다.',
    requiredConditions: Object.freeze([
      '스위치를 끄면 저장된 지도는 위치 권한 없이 볼 수 있습니다.',
      '현재 위치 보기는 학습자가 스위치를 켰을 때만 사용합니다.',
      '위치는 현재 위치 보기 기능을 쓰는 동안에만 사용합니다.',
    ]),
    comparisonPrompt: '현재 위치 보기만 켰을 때 무엇이 달라지는지 예상해 보세요.',
  }),
})
