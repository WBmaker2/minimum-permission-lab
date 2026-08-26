import { APP_CASES, CASE_ORDER } from '../content/cases'
import { CONDITIONAL_SCENARIOS } from '../content/conditionalScenarios'
import type { CaseId, LabState, PermissionId } from '../domain/model'

const PERMISSION_IDS: readonly PermissionId[] = ['camera', 'microphone', 'location', 'contacts']

function hasAllDecisions<T extends { permissionId: PermissionId }>(decisions: Partial<Record<PermissionId, T>>): boolean {
  return PERMISSION_IDS.every((permissionId) => decisions[permissionId]?.permissionId === permissionId)
}

function requiredConditions(caseId: CaseId): string[] {
  return Object.values(CONDITIONAL_SCENARIOS).filter((scenario) => scenario.caseId === caseId).map((scenario) => scenario.id)
}

function hasAllConditions(caseId: CaseId, acknowledged: readonly string[]): boolean {
  return requiredConditions(caseId).every((conditionId) => acknowledged.includes(conditionId))
}

export function isCurrentCaseReadyForImpact(state: LabState): boolean {
  if (!state.activeCaseId || !APP_CASES[state.activeCaseId] || state.stage !== 'initial-review') return false
  return hasAllDecisions(state.caseProgress[state.activeCaseId].initialDecisions)
}

export function isCurrentCaseReadyToComplete(state: LabState): boolean {
  if (!state.activeCaseId || !APP_CASES[state.activeCaseId] || state.stage !== 'revision-review') return false
  const progress = state.caseProgress[state.activeCaseId]
  return hasAllDecisions(progress.initialDecisions) && progress.impactViewed && hasAllConditions(state.activeCaseId, progress.acknowledgedConditionIds) && hasAllDecisions(progress.revisedDecisions) && progress.reasonTags.length >= 1 && progress.rationaleText.trim().length > 0 && progress.controlAction !== null
}

export function areAllCasesComplete(state: LabState): boolean {
  return CASE_ORDER.every((caseId) => state.caseProgress[caseId]?.completed === true)
}

export function isRevocationReadyToComplete(state: LabState): boolean {
  return state.stage === 'revocation' && hasAllDecisions(state.revocationDecisions) && Object.values(state.revocationDecisions).some((decision) => decision?.action === 'revoke-now')
}

export function getNextIncompleteCaseId(state: LabState): CaseId | null {
  return CASE_ORDER.find((caseId) => !state.caseProgress[caseId]?.completed) ?? null
}
