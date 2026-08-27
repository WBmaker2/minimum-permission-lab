import { CASE_ORDER } from '../content/cases'
import { isCaseProgressComplete } from '../app/labSelectors'
import type {
  LabReport,
  LabState,
  LearnerChoice,
  PermissionDecision,
  PermissionId,
  ReasonTagId,
  ReportCaseResult,
  RevocationDecision,
} from './model'

const PERMISSION_IDS: readonly PermissionId[] = ['camera', 'microphone', 'location', 'contacts']
const REASON_TAG_IDS: readonly ReasonTagId[] = ['function-connection', 'data-minimization', 'user-control', 'respect-others']
const LEARNER_CHOICES: readonly LearnerChoice[] = ['allow-current-feature', 'deny', 'more-info']
const REVOCATION_ACTIONS: readonly RevocationDecision['action'][] = ['keep-current-feature', 'revoke-now']

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isLearnerChoice(value: unknown): value is LearnerChoice {
  return LEARNER_CHOICES.includes(value as LearnerChoice)
}

function isReasonTagId(value: unknown): value is ReasonTagId {
  return REASON_TAG_IDS.includes(value as ReasonTagId)
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).length === keys.length && keys.every((key) => Object.prototype.hasOwnProperty.call(value, key))
}

function freezeDecision(decision: PermissionDecision): PermissionDecision {
  return Object.freeze({ permissionId: decision.permissionId, choice: decision.choice })
}

function reportError(caseId: string, message: string): Error {
  return new Error(`보고서를 만들 수 없습니다 (${caseId}): ${message}`)
}

function readDecisions(value: unknown, caseId: string, recordName: string): readonly PermissionDecision[] {
  if (!isRecord(value) || Object.keys(value).length !== PERMISSION_IDS.length || PERMISSION_IDS.some((id) => !Object.prototype.hasOwnProperty.call(value, id))) {
    throw reportError(caseId, `${recordName} 네 권한 기록이 완전하지 않습니다.`)
  }
  return Object.freeze(PERMISSION_IDS.map((permissionId) => {
    const raw = value[permissionId]
    if (!isRecord(raw) || !hasExactKeys(raw, ['permissionId', 'choice']) || raw.permissionId !== permissionId || !isLearnerChoice(raw.choice)) {
      throw reportError(caseId, `${recordName} 권한 기록이 올바르지 않습니다.`)
    }
    return freezeDecision({ permissionId, choice: raw.choice })
  }))
}

export function buildRubricEvidence(reasonTags: readonly ReasonTagId[]): Readonly<Record<ReasonTagId, 'sufficient' | 'needs-support'>> {
  const tagSet = new Set(reasonTags.filter(isReasonTagId))
  return Object.freeze(Object.fromEntries(REASON_TAG_IDS.map((tagId) => [tagId, tagSet.has(tagId) ? 'sufficient' : 'needs-support'])) as Record<ReasonTagId, 'sufficient' | 'needs-support'>)
}

function copyReasonTags(value: unknown, caseId: string): readonly ReasonTagId[] {
  if (!Array.isArray(value) || value.length === 0 || value.some((tagId) => !isReasonTagId(tagId)) || new Set(value).size !== value.length) {
    throw reportError(caseId, '판단 근거 태그는 중복 없이 하나 이상 필요합니다.')
  }
  return Object.freeze([...value])
}

function readRevocationDecisions(state: LabState): readonly RevocationDecision[] {
  const value = state.revocationDecisions
  if (!isRecord(value) || Object.keys(value).length !== PERMISSION_IDS.length || PERMISSION_IDS.some((id) => !Object.prototype.hasOwnProperty.call(value, id))) {
    throw reportError('공통', '권한 철회 기록이 네 권한 모두에 대해 필요합니다.')
  }
  return PERMISSION_IDS.map((permissionId) => {
    const raw = value[permissionId]
    if (!isRecord(raw) || !hasExactKeys(raw, ['permissionId', 'action']) || raw.permissionId !== permissionId || !REVOCATION_ACTIONS.includes(raw.action as RevocationDecision['action'])) {
      throw reportError('공통', '권한 철회 기록이 올바르지 않습니다.')
    }
    return { permissionId, action: raw.action as RevocationDecision['action'] }
  })
}

function buildCaseResult(state: LabState, caseId: (typeof CASE_ORDER)[number]): ReportCaseResult {
  const progress = state.caseProgress?.[caseId]
  if (!isCaseProgressComplete(caseId, progress)) throw reportError(caseId, '의미 있는 사례 완료 기록이 필요합니다.')
  const initial = readDecisions(progress.initialDecisions, caseId, '최초')
  const revised = readDecisions(progress.revisedDecisions, caseId, '수정')
  if (typeof progress.rationaleText !== 'string' || progress.rationaleText.trim().length === 0) throw reportError(caseId, '수정 이유 기록이 없습니다.')
  if (progress.controlAction !== 'alternative' && progress.controlAction !== 'revoke') throw reportError(caseId, '대안 또는 철회 행동 기록이 필요합니다.')
  const reasonTags = copyReasonTags(progress.reasonTags, caseId)
  const changedPermissionIds = Object.freeze(PERMISSION_IDS.filter((permissionId) => initial.find((item) => item.permissionId === permissionId)?.choice !== revised.find((item) => item.permissionId === permissionId)?.choice))
  return Object.freeze({
    caseId,
    initial,
    revised,
    changedPermissionIds,
    reasonTags,
    rationaleText: progress.rationaleText,
    rubricEvidence: buildRubricEvidence(reasonTags),
    controlAction: progress.controlAction,
  })
}

export function buildReport(state: LabState): LabReport {
  if (!state || typeof state !== 'object') throw reportError('전체', '학습 상태가 없습니다.')
  if (state.revocationCompleted !== true) throw reportError('공통', '권한 철회 활동을 완료해야 합니다.')
  const revocations = readRevocationDecisions(state)
  const revokedPermissionIds = Object.freeze(revocations.filter((decision) => decision.action === 'revoke-now').map((decision) => decision.permissionId))
  if (revokedPermissionIds.length === 0) throw reportError('공통', '하나 이상의 권한을 철회해야 합니다.')
  const cases = Object.freeze(CASE_ORDER.map((caseId) => buildCaseResult(state, caseId)))
  return Object.freeze({ cases, revokedPermissionIds })
}
