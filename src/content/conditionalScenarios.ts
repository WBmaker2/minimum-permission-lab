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
    changedContract: '마이크는 녹음 버튼을 누르고 있는 동안에만 음성을 처리하고, 바로 재생한 뒤 즉시 삭제하는 경우에만 조건부입니다.',
    requiredConditions: Object.freeze([
      '녹음 버튼을 누르고 있는 동안에만 음성을 처리합니다.',
      '손을 떼면 음성을 바로 재생합니다.',
      '재생이 끝나면 음성을 즉시 삭제합니다.',
    ]),
    comparisonPrompt: '버튼을 누르는 동안만 사용하고 바로 삭제하는 경우와 오래 저장하는 경우는 사용 시점과 저장 기간이 어떻게 다른가요?',
  }),
  'map-current-position-opt-in': Object.freeze({
    id: 'map-current-position-opt-in',
    caseId: 'class-map',
    permissionId: 'location',
    featureSwitchId: 'map-current-position',
    changedContract: '기본 저장 지도는 권한 없이 사용할 수 있고, 학습자가 현재 위치 보기 스위치를 직접 켠 경우에만 위치가 조건부로 바뀝니다.',
    requiredConditions: Object.freeze([
      '기본 저장 지도는 스위치를 끈 상태에서 위치 권한 없이 사용할 수 있습니다.',
      '현재 위치 보기는 학습자가 명시적으로 스위치를 켠 때만 사용합니다.',
      '현재 위치 사용은 켜진 학습 기능에 필요한 동안으로 제한합니다.',
    ]),
    comparisonPrompt: '현재 위치 보기 스위치를 껐을 때와 켰을 때, 저장된 지도와 현재 위치 권한의 조건은 어떻게 달라지나요?',
  }),
})
