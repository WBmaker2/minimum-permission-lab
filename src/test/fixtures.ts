import { APP_CASES, CASE_ORDER } from '../content/cases'
import { CONDITIONAL_SCENARIOS } from '../content/conditionalScenarios'
import { createInitialLabState } from '../app/labReducer'
import type { CaseId, CaseProgress, LabState, LearnerChoice, PermissionDecision, PermissionId } from '../domain/model'

const PERMISSION_IDS: readonly PermissionId[] = ['camera', 'microphone', 'location', 'contacts']

export function createDecision(permissionId: PermissionId, choice: LearnerChoice = 'deny'): PermissionDecision {
  return { permissionId, choice }
}

export function createCompleteCaseProgress(caseId: CaseId): CaseProgress {
  const acknowledgedConditionIds = Object.values(CONDITIONAL_SCENARIOS)
    .filter((scenario) => scenario.caseId === caseId)
    .map((scenario) => scenario.id)
  const enabledFeatureSwitchIds = Object.values(CONDITIONAL_SCENARIOS)
    .filter((scenario) => scenario.caseId === caseId && scenario.featureSwitchId)
    .map((scenario) => scenario.featureSwitchId!)
  const decisions = Object.fromEntries(PERMISSION_IDS.map((id) => [id, createDecision(id)])) as Record<PermissionId, PermissionDecision>
  return {
    initialDecisions: decisions,
    revisedDecisions: { ...decisions },
    reasonTags: ['data-minimization'],
    rationaleText: `${APP_CASES[caseId].title}에 필요한 권한만 선택했습니다.`,
    enabledFeatureSwitchIds,
    acknowledgedConditionIds,
    impactViewed: true,
    controlAction: 'alternative',
    completed: true,
  }
}

export function createStateWithCompletedCases(completedCaseIds: readonly CaseId[] = CASE_ORDER): LabState {
  const state = createInitialLabState()
  const completed = new Set(completedCaseIds)
  return {
    ...state,
    caseProgress: Object.fromEntries(CASE_ORDER.map((caseId) => [caseId, completed.has(caseId) ? createCompleteCaseProgress(caseId) : state.caseProgress[caseId]])) as Record<CaseId, CaseProgress>,
  }
}
