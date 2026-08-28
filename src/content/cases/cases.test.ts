import { describe, expect, it } from 'vitest'

import { PERMISSION_CATALOG } from '../permissions'
import {
  APP_CASES,
  CASE_ORDER,
  GROUP_BOARD_ALIAS_EXAMPLES,
} from './index'
import {
  CONDITIONAL_SCENARIOS,
  CONDITIONAL_SCENARIO_ORDER,
} from '../conditionalScenarios'
import type { CaseId, PermissionId } from '../../domain/model'

const permissionOrder = PERMISSION_CATALOG.map(({ id }) => id)
const expectedCaseOrder = [
  'photo-scan',
  'voice-reading',
  'class-map',
  'group-board',
] as const satisfies readonly CaseId[]

describe('four virtual learning cases', () => {
  it('exports the cases in the required order', () => {
    expect(CASE_ORDER).toEqual(expectedCaseOrder)
    expect(Object.keys(APP_CASES)).toEqual(expectedCaseOrder)
  })

  it('requests every catalog permission in catalog order and gives four rules', () => {
    for (const caseId of CASE_ORDER) {
      const appCase = APP_CASES[caseId]

      expect(appCase.requestedPermissions).toEqual(permissionOrder)
      expect(Object.keys(appCase.rules)).toEqual(permissionOrder)
      expect(Object.values(appCase.rules)).toHaveLength(4)
      for (const permissionId of permissionOrder as PermissionId[]) {
        const rule = appCase.rules[permissionId]
        expect(rule.permissionId).toBe(permissionId)
        expect(rule.neededInformation.trim()).not.toBe('')
        expect(rule.timing.trim()).not.toBe('')
        expect(rule.denialImpact.trim()).not.toBe('')
        expect(rule.alternative.trim()).not.toBe('')
        expect(rule.contractEvidence.trim()).not.toBe('')
      }
    }
  })

  it('marks the minimum verdicts for each case', () => {
    expect(
      CASE_ORDER.map((caseId) =>
        permissionOrder.map((permissionId) => APP_CASES[caseId].rules[permissionId].verdict),
      ),
    ).toEqual([
      ['required', 'unnecessary', 'unnecessary', 'unnecessary'],
      ['unnecessary', 'conditional', 'unnecessary', 'unnecessary'],
      ['unnecessary', 'unnecessary', 'unnecessary', 'unnecessary'],
      ['unnecessary', 'unnecessary', 'unnecessary', 'unnecessary'],
    ])
  })

  it('keeps class map location permission-free in the base contract', () => {
    expect(APP_CASES['class-map'].rules.location.verdict).toBe('unnecessary')
    expect(APP_CASES['class-map'].rules.location.conditionId).toBe(
      'map-current-position-opt-in',
    )
  })

  it('describes class-map flow as the learner choosing a classroom name', () => {
    expect(APP_CASES['class-map'].dataFlow).toContain('학습자가 교실 이름을 선택')
  })

  it('keeps alias examples as content and out of case state fields', () => {
    expect(GROUP_BOARD_ALIAS_EXAMPLES).toEqual(['햇살', '새싹', '푸른별'])
    expect(Object.keys(APP_CASES['group-board'])).not.toContain('alias')
    expect(Object.keys(APP_CASES['group-board'])).not.toContain('aliasInput')
    expect(
      JSON.stringify(APP_CASES['group-board']),
    ).not.toMatch(/aliasInput|alias/i)
  })

  it('exports exactly the two conditional scenarios in the required order', () => {
    expect(CONDITIONAL_SCENARIO_ORDER).toEqual([
      'voice-press-and-delete',
      'map-current-position-opt-in',
    ])
    expect(Object.keys(CONDITIONAL_SCENARIOS)).toEqual(
      CONDITIONAL_SCENARIO_ORDER,
    )
    expect(Object.keys(CONDITIONAL_SCENARIOS)).toHaveLength(2)
  })

  it('connects each conditional scenario to its changed permission contract', () => {
    const voice = CONDITIONAL_SCENARIOS['voice-press-and-delete']
    expect(voice.caseId).toBe('voice-reading')
    expect(voice.permissionId).toBe('microphone')
    expect(voice.featureSwitchId).toBeUndefined()
    expect(voice.changedContract).toMatch(/누르고 있는 동안|바로 재생|즉시 삭제/)
    expect(voice.requiredConditions).toHaveLength(3)
    expect(voice.comparisonPrompt).toMatch(/사용 시점|저장 기간/)

    const map = CONDITIONAL_SCENARIOS['map-current-position-opt-in']
    expect(map.caseId).toBe('class-map')
    expect(map.permissionId).toBe('location')
    expect(map.featureSwitchId).toBe('map-current-position')
    expect(map.changedContract).toMatch(/저장 지도|스위치|현재 위치/)
    expect(map.requiredConditions).toHaveLength(3)
    expect(map.comparisonPrompt).toMatch(/껐을 때|켰을 때/)
  })

  it('does not use real brands or victim stories in case content', () => {
    const caseText = JSON.stringify(APP_CASES)
    expect(caseText).not.toMatch(/Google|Apple|Microsoft|카카오|네이버|피해자|범죄|실제 사건/i)
  })

  it('freezes the shared case collections and nested case data', () => {
    expect(Object.isFrozen(CASE_ORDER)).toBe(true)
    expect(Object.isFrozen(APP_CASES)).toBe(true)
    for (const caseId of CASE_ORDER) {
      expect(Object.isFrozen(APP_CASES[caseId])).toBe(true)
      expect(Object.isFrozen(APP_CASES[caseId].requestedPermissions)).toBe(true)
      expect(Object.isFrozen(APP_CASES[caseId].dataFlow)).toBe(true)
      expect(Object.isFrozen(APP_CASES[caseId].rules)).toBe(true)
    }
  })

  it('freezes each permission rule and conditional scenario object', () => {
    for (const caseId of CASE_ORDER) {
      for (const permissionId of permissionOrder as PermissionId[]) {
        expect(Object.isFrozen(APP_CASES[caseId].rules[permissionId])).toBe(true)
      }
    }
    for (const scenarioId of CONDITIONAL_SCENARIO_ORDER) {
      expect(Object.isFrozen(CONDITIONAL_SCENARIOS[scenarioId])).toBe(true)
      expect(
        Object.isFrozen(CONDITIONAL_SCENARIOS[scenarioId].requiredConditions),
      ).toBe(true)
    }
  })
})
