import type { ConditionalScenarioId } from '../../domain/model'

export type SimulationChoiceId = 'baseline' | 'changed'

export interface SimulationChoice {
  readonly id: SimulationChoiceId
  readonly label: string
}

export interface SimulationScenarioSpec {
  readonly id: ConditionalScenarioId
  readonly variableLabel: string
  readonly variableHelp: string
  readonly initialValue: boolean
  readonly predictionPrompt: string
  readonly predictionOptions: readonly SimulationChoice[]
  readonly explanationPrompt: string
  readonly explanationOptions: readonly SimulationChoice[]
  readonly baselineObservation: string
  readonly changedObservation: string
  readonly modelBoundary: string
  readonly pauseStepReason: string
}

const TWO_STATE_CHOICES: readonly SimulationChoice[] = Object.freeze([
  { id: 'baseline', label: '' },
  { id: 'changed', label: '' },
])

const SIMULATION_SCENARIOS: Readonly<Record<ConditionalScenarioId, SimulationScenarioSpec>> = Object.freeze({
  'map-current-position-opt-in': Object.freeze({
    id: 'map-current-position-opt-in',
    variableLabel: '현재 위치 보기 조건 켜기',
    variableHelp: '저장된 지도는 그대로 두고 한 가지 조건만 바꿉니다.',
    initialValue: false,
    predictionPrompt: '현재 위치 보기만 켜면 무엇이 달라질지 먼저 예상해 보세요.',
    predictionOptions: Object.freeze([
      { ...TWO_STATE_CHOICES[0], label: '저장된 지도만 보여서 달라지지 않아요.' },
      { ...TWO_STATE_CHOICES[1], label: '현재 위치 보기 기능이 함께 켜져요.' },
    ]),
    explanationPrompt: '관찰한 결과를 가장 잘 설명하는 문장을 골라 보세요.',
    explanationOptions: Object.freeze([
      { ...TWO_STATE_CHOICES[0], label: '스위치를 끄면 저장된 지도만 보여요.' },
      { ...TWO_STATE_CHOICES[1], label: '스위치를 켜면 현재 위치 보기 기능이 함께 켜져요.' },
    ]),
    baselineObservation: '관찰: 저장된 지도만 보여서 위치 권한이 필요하지 않습니다.',
    changedObservation: '관찰: 현재 위치 표시가 켜져서, 이 가상 기능을 쓰는 동안 위치 권한이 필요할 수 있습니다.',
    modelBoundary: '실제 위치를 읽지 않는 가상 학습 모델입니다.',
    pauseStepReason: '시간에 따라 자동으로 변하지 않으므로 일시 정지나 한 단계씩 진행하는 조작은 사용하지 않습니다.',
  }),
  'voice-press-and-delete': Object.freeze({
    id: 'voice-press-and-delete',
    variableLabel: '오래 보관하는 조건 켜기',
    variableHelp: '실제 음성은 녹음하지 않고 보관 조건 하나만 바꿉니다.',
    initialValue: false,
    predictionPrompt: '보관 조건을 바꾸면 정보가 남는 기간이 어떻게 될지 먼저 예상해 보세요.',
    predictionOptions: Object.freeze([
      { ...TWO_STATE_CHOICES[0], label: '누르는 동안만 처리하고 바로 삭제해요.' },
      { ...TWO_STATE_CHOICES[1], label: '오래 보관하면 더 긴 기간이 필요해요.' },
    ]),
    explanationPrompt: '관찰한 결과를 가장 잘 설명하는 문장을 골라 보세요.',
    explanationOptions: Object.freeze([
      { ...TWO_STATE_CHOICES[0], label: '짧게 처리하고 재생 뒤 바로 삭제해요.' },
      { ...TWO_STATE_CHOICES[1], label: '오래 보관하면 더 긴 기간 동안 정보가 남아요.' },
    ]),
    baselineObservation: '관찰: 누르는 동안만 처리하고 재생 뒤 음성을 즉시 삭제합니다.',
    changedObservation: '관찰: 음성을 오래 보관하는 조건이라 필요한 기간과 정보 범위가 늘어납니다.',
    modelBoundary: '실제 음성을 녹음하지 않습니다. 마이크와 재생을 사용하지 않는 가상 학습 모델입니다.',
    pauseStepReason: '실제 녹음과 시간 진행이 없으므로 일시 정지나 한 단계씩 진행하는 조작은 사용하지 않습니다.',
  }),
})

export function getSimulationScenarioSpec(id: ConditionalScenarioId): SimulationScenarioSpec {
  return SIMULATION_SCENARIOS[id]
}

export function getSimulationObservation(spec: SimulationScenarioSpec, changed: boolean): string {
  return changed ? spec.changedObservation : spec.baselineObservation
}
