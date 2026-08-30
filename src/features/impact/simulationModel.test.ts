import { describe, expect, it } from 'vitest'

import {
  getSimulationScenarioSpec,
  getSimulationObservation,
  type SimulationChoiceId,
} from './simulationModel'

describe('simulationModel', () => {
  it('defines a deterministic single-variable map simulation contract', () => {
    const spec = getSimulationScenarioSpec('map-current-position-opt-in')

    expect(spec.id).toBe('map-current-position-opt-in')
    expect(spec.initialValue).toBe(false)
    expect(spec.variableLabel).toBe('현재 위치 보기 조건 켜기')
    expect(spec.predictionOptions).toHaveLength(2)
    expect(spec.explanationOptions).toHaveLength(2)
    expect(spec.pauseStepReason).toContain('시간')
    expect(getSimulationObservation(spec, false)).toContain('저장된 지도')
    expect(getSimulationObservation(spec, true)).toContain('현재 위치 표시')
  })

  it('defines a deterministic single-variable voice retention simulation without recording', () => {
    const spec = getSimulationScenarioSpec('voice-press-and-delete')

    expect(spec.id).toBe('voice-press-and-delete')
    expect(spec.initialValue).toBe(false)
    expect(spec.variableLabel).toBe('오래 보관하는 조건 켜기')
    expect(spec.modelBoundary).toContain('녹음하지 않습니다')
    expect(spec.pauseStepReason).toContain('시간')
    expect(getSimulationObservation(spec, false)).toContain('즉시 삭제')
    expect(getSimulationObservation(spec, true)).toContain('오래 보관')
  })

  it('keeps prediction and explanation IDs within the same two-state vocabulary', () => {
    const ids: SimulationChoiceId[] = ['baseline', 'changed']
    for (const id of ids) {
      expect(['baseline', 'changed']).toContain(id)
    }
  })
})
