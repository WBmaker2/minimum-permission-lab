import { APP_CASES, CASE_ORDER } from '../content/cases'
import { CONDITIONAL_SCENARIOS } from '../content/conditionalScenarios'
import type { CaseId, CaseProgress, LabState, LearnerChoice, PermissionId, ReasonTagId } from '../domain/model'

const PERMISSION_IDS: readonly PermissionId[] = ['camera', 'microphone', 'location', 'contacts']

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isLearnerChoice(value: unknown): value is LearnerChoice {
  return value === 'allow-current-feature' || value === 'deny' || value === 'more-info'
}

function hasAllLearnerDecisions(decisions: unknown, permissionIds: readonly PermissionId[] = PERMISSION_IDS): boolean {
  if (!isRecord(decisions)) return false
  return permissionIds.every((permissionId) => {
    const decision = decisions[permissionId]
    return isRecord(decision) && decision.permissionId === permissionId && isLearnerChoice(decision.choice)
  })
}

function hasAllDecisions<T extends { permissionId: PermissionId }>(decisions: Partial<Record<PermissionId, T>>): boolean {
  return PERMISSION_IDS.every((permissionId) => decisions[permissionId]?.permissionId === permissionId)
}

function requiredConditions(caseId: CaseId): readonly string[] {
  const appCase = APP_CASES[caseId]
  return Object.values(CONDITIONAL_SCENARIOS)
    .filter((scenario) => scenario.caseId === caseId && appCase.rules[scenario.permissionId]?.conditionId === scenario.id)
    .map((scenario) => scenario.id)
}

function hasAllConditions(caseId: CaseId, acknowledged: unknown): boolean {
  const expected = requiredConditions(caseId)
  if (!Array.isArray(acknowledged) || acknowledged.some((conditionId) => typeof conditionId !== 'string')) return false
  if (new Set(acknowledged).size !== acknowledged.length) return false
  return acknowledged.every((conditionId) => expected.includes(conditionId)) && expected.every((conditionId) => acknowledged.includes(conditionId))
}

function hasValidReasonTags(value: unknown): value is readonly ReasonTagId[] {
  const reasonTags: readonly ReasonTagId[] = ['function-connection', 'data-minimization', 'user-control', 'respect-others']
  return Array.isArray(value)
    && value.length > 0
    && value.every((tagId) => reasonTags.includes(tagId as ReasonTagId))
    && new Set(value).size === value.length
}

/**
 * The semantic completion contract shared by UI selectors, storage restore, and reports.
 * A completed flag alone is never sufficient to enter the completed-cases flow.
 */
export function isCaseProgressComplete(caseId: CaseId, progress: CaseProgress | null | undefined): boolean {
  const appCase = APP_CASES[caseId]
  if (!appCase || !isRecord(progress) || progress.completed !== true) return false
  return (
    hasAllLearnerDecisions(progress.initialDecisions, appCase.requestedPermissions) &&
    hasAllLearnerDecisions(progress.revisedDecisions, appCase.requestedPermissions) &&
    progress.impactViewed === true &&
    hasAllConditions(caseId, progress.acknowledgedConditionIds) &&
    hasValidReasonTags(progress.reasonTags) &&
    typeof progress.rationaleText === 'string' &&
    progress.rationaleText.trim().length > 0 &&
    (progress.controlAction === 'alternative' || progress.controlAction === 'revoke')
  )
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
  return CASE_ORDER.every((caseId) => isCaseProgressComplete(caseId, state.caseProgress?.[caseId]))
}

export function isRevocationReadyToComplete(state: LabState): boolean {
  return state.stage === 'revocation' && hasAllDecisions(state.revocationDecisions) && Object.values(state.revocationDecisions).some((decision) => decision?.action === 'revoke-now')
}

export function getNextIncompleteCaseId(state: LabState): CaseId | null {
  return CASE_ORDER.find((caseId) => !state.caseProgress[caseId]?.completed) ?? null
}
