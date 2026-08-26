import { describe, expect, it } from 'vitest'

import { CASE_ORDER } from '../content/cases'
import { createInitialLabState } from '../app/labReducer'
import { buildReport, buildRubricEvidence } from './buildReport'
import type { LabState, PermissionId, ReasonTagId } from './model'

const PERMISSION_IDS: readonly PermissionId[] = ['camera', 'microphone', 'location', 'contacts']

function validState(): LabState {
  const base = createInitialLabState()
  const decisions = Object.fromEntries(PERMISSION_IDS.map((permissionId) => [permissionId, { permissionId, choice: 'deny' as const }])) as LabState['caseProgress']['photo-scan']['initialDecisions']
  return {
    ...base,
    stage: 'report',
    revocationCompleted: true,
    revocationDecisions: {
      camera: { permissionId: 'camera', action: 'revoke-now' },
      microphone: { permissionId: 'microphone', action: 'keep-current-feature' },
      location: { permissionId: 'location', action: 'keep-current-feature' },
      contacts: { permissionId: 'contacts', action: 'revoke-now' },
    },
    caseProgress: Object.fromEntries(CASE_ORDER.map((caseId) => [caseId, {
      ...base.caseProgress[caseId],
      initialDecisions: decisions,
      revisedDecisions: { ...decisions, camera: { permissionId: 'camera', choice: 'allow-current-feature' } },
      reasonTags: ['function-connection', 'user-control'],
      rationaleText: `${caseId}에서 필요한 권한만 골랐습니다.`,
      controlAction: 'alternative',
      completed: true,
    }])) as unknown as LabState['caseProgress'],
  }
}

describe('buildRubricEvidence', () => {
  it('always returns the four rubric dimensions from tags only', () => {
    expect(buildRubricEvidence(['data-minimization'])).toEqual({
      'function-connection': 'needs-support',
      'data-minimization': 'sufficient',
      'user-control': 'needs-support',
      'respect-others': 'needs-support',
    })
  })

  it('ignores unknown runtime tags and does not inspect wording', () => {
    expect(buildRubricEvidence(['function-connection', 'not-a-tag'] as readonly ReasonTagId[])).toEqual({
      'function-connection': 'sufficient',
      'data-minimization': 'needs-support',
      'user-control': 'needs-support',
      'respect-others': 'needs-support',
    })
  })
})

describe('buildReport', () => {
  it('builds ordered, immutable comparison results and revoked permissions', () => {
    const state = validState()
    const report = buildReport(state)

    expect(report.cases.map((item) => item.caseId)).toEqual(CASE_ORDER)
    expect(report.cases[0].initial.map((item) => item.permissionId)).toEqual(PERMISSION_IDS)
    expect(report.cases[0].revised.map((item) => item.permissionId)).toEqual(PERMISSION_IDS)
    expect(report.cases[0].changedPermissionIds).toEqual(['camera'])
    expect(report.cases[0].reasonTags).toEqual(['function-connection', 'user-control'])
    expect(report.cases[0].controlAction).toBe('alternative')
    expect(report.revokedPermissionIds).toEqual(['camera', 'contacts'])
    expect(Object.isFrozen(report)).toBe(true)
    expect(Object.isFrozen(report.cases)).toBe(true)
    expect(Object.isFrozen(report.cases[0])).toBe(true)
    expect(Object.isFrozen(report.cases[0].initial)).toBe(true)
    expect(Object.isFrozen(report.cases[0].initial[0])).toBe(true)
    expect(Object.isFrozen(report.cases[0].rubricEvidence)).toBe(true)
    expect(state.caseProgress['photo-scan'].initialDecisions.camera?.choice).toBe('deny')
  })

  it('changes only rubric dimensions represented by tags', () => {
    const state = validState()
    const reportA = buildReport(state)
    const changedState = {
      ...state,
      caseProgress: {
        ...state.caseProgress,
        'photo-scan': { ...state.caseProgress['photo-scan'], reasonTags: ['respect-others'] as const },
      },
    }
    const reportB = buildReport(changedState)
    expect(reportA.cases[0].rubricEvidence['function-connection']).toBe('sufficient')
    expect(reportB.cases[0].rubricEvidence['function-connection']).toBe('needs-support')
    expect(reportB.cases[0].rubricEvidence['respect-others']).toBe('sufficient')
  })

  it('keeps rubric evidence unchanged when only rationale wording changes', () => {
    const first = validState()
    const second = {
      ...first,
      caseProgress: {
        ...first.caseProgress,
        'photo-scan': { ...first.caseProgress['photo-scan'], rationaleText: '전혀 다른 설명을 적었습니다.' },
      },
    }
    const firstReport = buildReport(first)
    const secondReport = buildReport(second)
    expect(firstReport.cases[0].rubricEvidence).toEqual(secondReport.cases[0].rubricEvidence)
    expect(secondReport.cases[0].rationaleText).toBe('전혀 다른 설명을 적었습니다.')
  })

  it.each([
    ['incomplete case', (state: LabState) => ({ ...state, caseProgress: { ...state.caseProgress, 'photo-scan': { ...state.caseProgress['photo-scan'], completed: false } } })],
    ['missing initial decision', (state: LabState) => ({ ...state, caseProgress: { ...state.caseProgress, 'photo-scan': { ...state.caseProgress['photo-scan'], initialDecisions: {} } } })],
    ['mismatched decision', (state: LabState) => ({ ...state, caseProgress: { ...state.caseProgress, 'photo-scan': { ...state.caseProgress['photo-scan'], revisedDecisions: { ...state.caseProgress['photo-scan'].revisedDecisions, camera: { permissionId: 'location', choice: 'deny' } } } } })],
    ['invalid control action', (state: LabState) => ({ ...state, caseProgress: { ...state.caseProgress, 'photo-scan': { ...state.caseProgress['photo-scan'], controlAction: null } } })],
    ['invalid reason tag', (state: LabState) => ({ ...state, caseProgress: { ...state.caseProgress, 'photo-scan': { ...state.caseProgress['photo-scan'], reasonTags: ['not-a-tag'] } } })],
    ['duplicate reason tag', (state: LabState) => ({ ...state, caseProgress: { ...state.caseProgress, 'photo-scan': { ...state.caseProgress['photo-scan'], reasonTags: ['data-minimization', 'data-minimization'] } } })],
    ['empty reason tags', (state: LabState) => ({ ...state, caseProgress: { ...state.caseProgress, 'photo-scan': { ...state.caseProgress['photo-scan'], reasonTags: [] } } })],
    ['nonboolean completed', (state: LabState) => ({ ...state, caseProgress: { ...state.caseProgress, 'photo-scan': { ...state.caseProgress['photo-scan'], completed: 'true' } } })],
    ['whitespace rationale', (state: LabState) => ({ ...state, caseProgress: { ...state.caseProgress, 'photo-scan': { ...state.caseProgress['photo-scan'], rationaleText: '   \n ' } } })],
    ['incomplete revocation', (state: LabState) => ({ ...state, revocationDecisions: { camera: { permissionId: 'camera' as const, action: 'revoke-now' as const } } })],
    ['uncompleted revocation', (state: LabState) => ({ ...state, revocationCompleted: false })],
    ['nonboolean revocation completed', (state: LabState) => ({ ...state, revocationCompleted: 'true' })],
    ['no revoked permission', (state: LabState) => ({ ...state, revocationDecisions: {
      camera: { permissionId: 'camera' as const, action: 'keep-current-feature' as const },
      microphone: { permissionId: 'microphone' as const, action: 'keep-current-feature' as const },
      location: { permissionId: 'location' as const, action: 'keep-current-feature' as const },
      contacts: { permissionId: 'contacts' as const, action: 'keep-current-feature' as const },
    } })],
  ])('fails closed for %s', (_label, mutate) => {
    expect(() => buildReport(mutate(validState()) as LabState)).toThrow(/보고서/)
  })
})
