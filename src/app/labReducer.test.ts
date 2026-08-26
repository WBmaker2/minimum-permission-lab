import { describe, expect, it } from 'vitest'
import { CASE_ORDER } from '../content/cases'
import { CONDITIONAL_SCENARIOS } from '../content/conditionalScenarios'
import type { LabState, PermissionId } from '../domain/model'
import {
  createInitialLabState,
  labReducer,
  type LabAction,
} from './labReducer'
import { createDecision, createStateWithCompletedCases } from '../test/fixtures'
import {
  areAllCasesComplete,
  getNextIncompleteCaseId,
  isCurrentCaseReadyForImpact,
  isCurrentCaseReadyToComplete,
  isRevocationReadyToComplete,
} from './labSelectors'

const allPermissions: PermissionId[] = ['camera', 'microphone', 'location', 'contacts']
const decisions = allPermissions.map((permissionId) => createDecision(permissionId))

function reduce(state: LabState, ...actions: LabAction[]): LabState {
  return actions.reduce(labReducer, state)
}

function toImpact(state = createInitialLabState()): LabState {
  return reduce(
    state,
    { type: 'SELECT_CASE', caseId: 'voice-reading' },
    { type: 'OPEN_SPECIFICATION' },
    { type: 'OPEN_SPECIFICATION' },
    ...decisions.map((decision) => ({
      type: 'SET_INITIAL_DECISION' as const,
      caseId: 'voice-reading' as const,
      decision,
    })),
    { type: 'OPEN_IMPACT' },
  )
}

describe('labReducer', () => {
  it('starts with four empty cases and no personal data', () => {
    const state = createInitialLabState()
    expect(state.stage).toBe('start')
    expect(state.activeCaseId).toBeNull()
    expect(CASE_ORDER.every((id) => state.caseProgress[id].completed === false)).toBe(true)
    expect(state.saveOnDevice).toBe(false)
    expect(state.statusMessage).toContain('개인정보')
  })

  it('guards the start to specification to initial review flow', () => {
    const initial = createInitialLabState()
    expect(labReducer(initial, { type: 'OPEN_SPECIFICATION' })).toBe(initial)
    const selected = labReducer(initial, { type: 'SELECT_CASE', caseId: 'photo-scan' })
    const specification = labReducer(selected, { type: 'OPEN_SPECIFICATION' })
    expect(specification.stage).toBe('specification')
    expect(labReducer(specification, { type: 'OPEN_IMPACT' })).toBe(specification)
    expect(labReducer(specification, { type: 'SET_INITIAL_DECISION', caseId: 'photo-scan', decision: decisions[0] })).toBe(specification)
    const review = labReducer(specification, { type: 'OPEN_SPECIFICATION' })
    expect(review.stage).toBe('initial-review')
  })

  it('requires all four initial decisions before impact and preserves the initial record', () => {
    let state = reduce(
      createInitialLabState(),
      { type: 'SELECT_CASE', caseId: 'photo-scan' },
      { type: 'OPEN_SPECIFICATION' },
      { type: 'OPEN_SPECIFICATION' },
    )
    for (const decision of decisions.slice(0, 3)) {
      state = labReducer(state, { type: 'SET_INITIAL_DECISION', caseId: 'photo-scan', decision })
    }
    expect(isCurrentCaseReadyForImpact(state)).toBe(false)
    expect(labReducer(state, { type: 'OPEN_IMPACT' })).toBe(state)
    state = labReducer(state, { type: 'SET_INITIAL_DECISION', caseId: 'photo-scan', decision: decisions[3] })
    expect(isCurrentCaseReadyForImpact(state)).toBe(true)
    const snapshot = structuredClone(state.caseProgress['photo-scan'].initialDecisions)
    const initialRef = state.caseProgress['photo-scan'].initialDecisions
    expect(state.caseProgress['photo-scan'].initialDecisions).toEqual(snapshot)
    const impact = labReducer(state, { type: 'OPEN_IMPACT' })
    expect(impact.stage).toBe('impact')
    expect(impact.caseProgress['photo-scan'].impactViewed).toBe(true)
    expect(impact.caseProgress['photo-scan'].initialDecisions).toBe(initialRef)
  })

  it('requires voice condition acknowledgement and control action before revision review', () => {
    let state = toImpact()
    expect(labReducer(state, { type: 'OPEN_IMPACT' })).toBe(state)
    state = labReducer(state, { type: 'SET_CONTROL_ACTION', caseId: 'voice-reading', action: 'alternative' })
    expect(labReducer(state, { type: 'OPEN_IMPACT' })).toBe(state)
    state = labReducer(state, { type: 'ACKNOWLEDGE_CONDITION', caseId: 'voice-reading', conditionId: 'voice-press-and-delete' })
    expect(labReducer(state, { type: 'OPEN_IMPACT' }).stage).toBe('revision-review')
  })

  it('requires map switch before acknowledging the opt-in condition', () => {
    let state = reduce(
      createInitialLabState(),
      { type: 'SELECT_CASE', caseId: 'class-map' },
      { type: 'OPEN_SPECIFICATION' },
      { type: 'OPEN_SPECIFICATION' },
      ...decisions.map((decision) => ({ type: 'SET_INITIAL_DECISION' as const, caseId: 'class-map' as const, decision })),
      { type: 'OPEN_IMPACT' },
    )
    const before = state
    expect(labReducer(state, { type: 'ACKNOWLEDGE_CONDITION', caseId: 'class-map', conditionId: 'map-current-position-opt-in' })).toBe(before)
    state = labReducer(state, { type: 'SET_FEATURE_SWITCH', caseId: 'class-map', switchId: 'map-current-position', enabled: true })
    state = labReducer(state, { type: 'ACKNOWLEDGE_CONDITION', caseId: 'class-map', conditionId: 'map-current-position-opt-in' })
    expect(state.caseProgress['class-map'].acknowledgedConditionIds).toEqual(['map-current-position-opt-in'])
    state = labReducer(state, { type: 'SET_FEATURE_SWITCH', caseId: 'class-map', switchId: 'map-current-position', enabled: true })
    expect(state.caseProgress['class-map'].enabledFeatureSwitchIds).toEqual(['map-current-position'])
  })

  it('guards impact controls by active case and stage while preserving progress identity on duplicates', () => {
    const state = toImpact()
    expect(labReducer(state, { type: 'SET_CONTROL_ACTION', caseId: 'photo-scan', action: 'alternative' })).toBe(state)
    expect(labReducer(state, { type: 'SET_FEATURE_SWITCH', caseId: 'voice-reading', switchId: 'map-current-position', enabled: true })).toBe(state)
    expect(labReducer(state, { type: 'ACKNOWLEDGE_CONDITION', caseId: 'voice-reading', conditionId: 'map-current-position-opt-in' })).toBe(state)

    const selected = labReducer(state, { type: 'SET_CONTROL_ACTION', caseId: 'voice-reading', action: 'alternative' })
    expect(selected.caseProgress['voice-reading'].initialDecisions).toBe(state.caseProgress['voice-reading'].initialDecisions)
    expect(labReducer(selected, { type: 'SET_CONTROL_ACTION', caseId: 'voice-reading', action: 'alternative' })).toBe(selected)
    expect(labReducer(selected, { type: 'OPEN_IMPACT' })).toBe(selected)
  })

  it('treats cases without conditions as automatically satisfied', () => {
    const state = reduce(
      createInitialLabState(),
      { type: 'SELECT_CASE', caseId: 'photo-scan' },
      { type: 'OPEN_SPECIFICATION' },
      { type: 'OPEN_SPECIFICATION' },
      ...decisions.map((decision) => ({ type: 'SET_INITIAL_DECISION' as const, caseId: 'photo-scan' as const, decision })),
      { type: 'OPEN_IMPACT' },
      { type: 'SET_CONTROL_ACTION', caseId: 'photo-scan', action: 'revoke' },
      { type: 'OPEN_IMPACT' },
    )
    expect(state.stage).toBe('revision-review')
  })

  it('keeps initial decisions unchanged while editing revision, rationale, and tags', () => {
    let state = toImpact()
    state = reduce(
      state,
      { type: 'SET_CONTROL_ACTION', caseId: 'voice-reading', action: 'alternative' },
      { type: 'ACKNOWLEDGE_CONDITION', caseId: 'voice-reading', conditionId: 'voice-press-and-delete' },
      { type: 'OPEN_IMPACT' },
    )
    const initialRef = state.caseProgress['voice-reading'].initialDecisions
    const initialSnapshot = structuredClone(initialRef)
    state = labReducer(state, { type: 'SET_REVISED_DECISION', caseId: 'voice-reading', decision: createDecision('camera', 'more-info') })
    state = labReducer(state, { type: 'SET_CASE_RATIONALE_TEXT', caseId: 'voice-reading', value: '  최소 권한으로 충분한 이유  ' })
    state = labReducer(state, { type: 'TOGGLE_CASE_REASON_TAG', caseId: 'voice-reading', tagId: 'data-minimization' })
    expect(state.caseProgress['voice-reading'].initialDecisions).toBe(initialRef)
    expect(state.caseProgress['voice-reading'].initialDecisions).toEqual(initialSnapshot)
    expect(state.caseProgress['voice-reading'].rationaleText).toBe('  최소 권한으로 충분한 이유  ')
    expect(state.caseProgress['voice-reading'].reasonTags).toEqual(['data-minimization'])
  })

  it('checks every completion requirement', () => {
    let state = toImpact()
    state = reduce(
      state,
      { type: 'SET_CONTROL_ACTION', caseId: 'voice-reading', action: 'alternative' },
      { type: 'ACKNOWLEDGE_CONDITION', caseId: 'voice-reading', conditionId: 'voice-press-and-delete' },
      { type: 'OPEN_IMPACT' },
    )
    expect(isCurrentCaseReadyToComplete(state)).toBe(false)
    for (const decision of decisions) {
      state = labReducer(state, { type: 'SET_REVISED_DECISION', caseId: 'voice-reading', decision })
    }
    expect(isCurrentCaseReadyToComplete(state)).toBe(false)
    state = labReducer(state, { type: 'TOGGLE_CASE_REASON_TAG', caseId: 'voice-reading', tagId: 'user-control' })
    expect(isCurrentCaseReadyToComplete(state)).toBe(false)
    state = labReducer(state, { type: 'SET_CASE_RATIONALE_TEXT', caseId: 'voice-reading', value: '  근거  ' })
    expect(isCurrentCaseReadyToComplete(state)).toBe(true)
    state = labReducer(state, { type: 'COMPLETE_CASE', caseId: 'voice-reading' })
    expect(state.stage).toBe('start')
    expect(state.activeCaseId).toBeNull()
    expect(state.caseProgress['voice-reading'].completed).toBe(true)
  })

  it('orders next case and opens report only after revocation', () => {
    let state = createStateWithCompletedCases(['photo-scan', 'voice-reading', 'class-map'])
    expect(areAllCasesComplete(state)).toBe(false)
    expect(getNextIncompleteCaseId(state)).toBe('group-board')
    expect(labReducer(state, { type: 'OPEN_REVOCATION' })).toBe(state)
    state = createStateWithCompletedCases(CASE_ORDER)
    expect(getNextIncompleteCaseId(state)).toBeNull()
    state = labReducer(state, { type: 'OPEN_REVOCATION' })
    expect(state.stage).toBe('revocation')
    expect(labReducer(state, { type: 'OPEN_REPORT' })).toBe(state)
    for (const permissionId of allPermissions) {
      state = labReducer(state, { type: 'SET_REVOCATION_DECISION', decision: { permissionId, action: 'keep-current-feature' } })
    }
    expect(isRevocationReadyToComplete(state)).toBe(false)
    state = labReducer(state, { type: 'SET_REVOCATION_DECISION', decision: { permissionId: 'camera', action: 'revoke-now' } })
    expect(isRevocationReadyToComplete(state)).toBe(true)
    state = labReducer(state, { type: 'COMPLETE_REVOCATION' })
    expect(state.stage).toBe('revocation')
    expect(state.revocationCompleted).toBe(true)
    expect(labReducer(state, { type: 'OPEN_REPORT' }).stage).toBe('report')
  })

  it('uses immutable duplicate-safe updates and has no persistence side effect', () => {
    const initial = createInitialLabState()
    const selected = labReducer(initial, { type: 'SELECT_CASE', caseId: 'photo-scan' })
    const selectedAgain = labReducer(selected, { type: 'SELECT_CASE', caseId: 'photo-scan' })
    expect(selectedAgain).toBe(selected)
    const flagged = labReducer(selected, { type: 'SET_SAVE_ON_DEVICE', enabled: true })
    expect(flagged.saveOnDevice).toBe(true)
    expect(initial.saveOnDevice).toBe(false)
    const loaded: LabState = { ...initial, saveOnDevice: true, statusMessage: '학습 진행을 불러왔습니다.' }
    const loadedState = labReducer(initial, { type: 'LOAD_SAVED_PROGRESS', state: loaded })
    expect(loadedState).toEqual(expect.objectContaining({ ...loaded, statusMessage: expect.any(String) }))
    expect(loadedState).not.toBe(loaded)
    expect(loadedState.caseProgress).not.toBe(loaded.caseProgress)
    loaded.caseProgress['photo-scan'].reasonTags = ['user-control']
    expect(loadedState.caseProgress['photo-scan'].reasonTags).toEqual([])
    loaded.revocationDecisions.camera = { permissionId: 'camera', action: 'revoke-now' }
    expect(loadedState.revocationDecisions).toEqual({})
    const reset = labReducer(flagged, { type: 'RESET_LAB' })
    expect(reset).not.toBe(flagged)
    expect(reset).toEqual(createInitialLabState())
    expect(CONDITIONAL_SCENARIOS['voice-press-and-delete'].caseId).toBe('voice-reading')
  })
})
