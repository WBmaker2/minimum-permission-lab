import { CASE_ORDER } from '../content/cases'
import type {
  CaseId,
  CaseProgress,
  ConditionalScenarioId,
  FeatureSwitchId,
  LabStage,
  LabState,
  LearnerChoice,
  PermissionDecision,
  PermissionId,
  ReasonTagId,
  RevocationDecision,
} from '../domain/model'

export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export const PROGRESS_STORAGE_KEY = 'minimum-permission-lab:v1'

export interface SavedProgressV1 {
  readonly version: 1
  readonly state: LabState
}

export const RESTORED_STATUS_MESSAGE = '학습 진행을 불러왔습니다. 이 앱은 실제 권한을 요청하지 않습니다.'

const PERMISSION_IDS: readonly PermissionId[] = ['camera', 'microphone', 'location', 'contacts']
const LEARNER_CHOICES: readonly LearnerChoice[] = ['allow-current-feature', 'deny', 'more-info']
const LAB_STAGES: readonly LabStage[] = ['start', 'specification', 'initial-review', 'impact', 'revision-review', 'revocation', 'report']
const REASON_TAG_IDS: readonly ReasonTagId[] = ['function-connection', 'data-minimization', 'user-control', 'respect-others']
const CONDITIONAL_IDS: readonly ConditionalScenarioId[] = ['voice-press-and-delete', 'map-current-position-opt-in']
const FEATURE_SWITCH_IDS: readonly FeatureSwitchId[] = ['map-current-position']
const CONTROL_ACTIONS = ['alternative', 'revoke'] as const
const REVOCATION_ACTIONS = ['keep-current-feature', 'revoke-now'] as const
const RESTORED_STATE_KEYS = ['stage', 'activeCaseId', 'caseProgress', 'revocationCompleted', 'revocationDecisions', 'saveOnDevice'] as const
const CASE_PROGRESS_KEYS = ['initialDecisions', 'revisedDecisions', 'reasonTags', 'rationaleText', 'enabledFeatureSwitchIds', 'acknowledgedConditionIds', 'impactViewed', 'controlAction', 'completed'] as const
const DECISION_KEYS = ['permissionId', 'choice'] as const
const REVOCATION_DECISION_KEYS = ['permissionId', 'action'] as const

type JsonRecord = Record<string, unknown>

function isRecord(value: unknown): value is JsonRecord {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function hasExactKeys(value: JsonRecord, keys: readonly string[]): boolean {
  const actual = Object.keys(value)
  return actual.length === keys.length && keys.every((key) => actual.includes(key))
}

function isOneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && values.includes(value as T)
}

function copyDecision(value: PermissionDecision): PermissionDecision {
  return { permissionId: value.permissionId, choice: value.choice }
}

function validateDecisionRecord(value: unknown): Partial<Record<PermissionId, PermissionDecision>> | null {
  if (!isRecord(value)) return null
  const result: Partial<Record<PermissionId, PermissionDecision>> = {}
  for (const key of Object.keys(value)) {
    if (!isOneOf(PERMISSION_IDS, key)) return null
    const decision = value[key]
    if (!isRecord(decision) || !hasExactKeys(decision, DECISION_KEYS)) return null
    if (decision.permissionId !== key || !isOneOf(LEARNER_CHOICES, decision.choice)) return null
    result[key] = { permissionId: key, choice: decision.choice }
  }
  return result
}

function validateRevocationRecord(value: unknown): Partial<Record<PermissionId, RevocationDecision>> | null {
  if (!isRecord(value)) return null
  const result: Partial<Record<PermissionId, RevocationDecision>> = {}
  for (const key of Object.keys(value)) {
    if (!isOneOf(PERMISSION_IDS, key)) return null
    const decision = value[key]
    if (!isRecord(decision) || !hasExactKeys(decision, REVOCATION_DECISION_KEYS)) return null
    if (decision.permissionId !== key || !isOneOf(REVOCATION_ACTIONS, decision.action)) return null
    result[key] = { permissionId: key, action: decision.action }
  }
  return result
}

function canonicalValues<T extends string>(value: unknown, allowed: readonly T[]): T[] | null {
  if (!Array.isArray(value) || value.some((item) => !isOneOf(allowed, item))) return null
  if (new Set(value).size !== value.length) return null
  const accepted = value as T[]
  return accepted.length === 0 ? [] : [...allowed].filter((item) => accepted.includes(item))
}

function validateCaseProgress(value: unknown, caseId: CaseId): CaseProgress | null {
  if (!isRecord(value) || !hasExactKeys(value, CASE_PROGRESS_KEYS)) return null
  const initialDecisions = validateDecisionRecord(value.initialDecisions)
  const revisedDecisions = validateDecisionRecord(value.revisedDecisions)
  const reasonTags = canonicalValues(value.reasonTags, REASON_TAG_IDS)
  const enabledFeatureSwitchIds = canonicalValues(value.enabledFeatureSwitchIds, FEATURE_SWITCH_IDS)
  const acknowledgedConditionIds = canonicalValues(value.acknowledgedConditionIds, CONDITIONAL_IDS)
  const controlAction = value.controlAction === null || isOneOf(CONTROL_ACTIONS, value.controlAction) ? value.controlAction : null
  if (!initialDecisions || !revisedDecisions || !reasonTags || !enabledFeatureSwitchIds || !acknowledgedConditionIds) return null
  if (value.controlAction !== controlAction || typeof value.rationaleText !== 'string' || typeof value.impactViewed !== 'boolean' || typeof value.completed !== 'boolean') return null
  if (caseId !== 'class-map' && enabledFeatureSwitchIds.length > 0) return null
  if (caseId === 'voice-reading' && acknowledgedConditionIds.some((id) => id !== 'voice-press-and-delete')) return null
  if (caseId === 'class-map' && acknowledgedConditionIds.some((id) => id !== 'map-current-position-opt-in')) return null
  if (caseId !== 'voice-reading' && caseId !== 'class-map' && acknowledgedConditionIds.length > 0) return null
  if (caseId === 'class-map' && enabledFeatureSwitchIds.length === 0 && acknowledgedConditionIds.length > 0) return null
  return {
    initialDecisions: copyDecisionRecord(initialDecisions),
    revisedDecisions: copyDecisionRecord(revisedDecisions),
    reasonTags: [...reasonTags],
    rationaleText: value.rationaleText,
    enabledFeatureSwitchIds: [...enabledFeatureSwitchIds],
    acknowledgedConditionIds: [...acknowledgedConditionIds],
    impactViewed: value.impactViewed,
    controlAction,
    completed: value.completed,
  }
}

function copyDecisionRecord(value: Partial<Record<PermissionId, PermissionDecision>>): Partial<Record<PermissionId, PermissionDecision>> {
  const result: Partial<Record<PermissionId, PermissionDecision>> = {}
  for (const permissionId of PERMISSION_IDS) {
    const decision = value[permissionId]
    if (decision) result[permissionId] = copyDecision(decision)
  }
  return result
}

function validateState(value: unknown): LabState | null {
  if (!isRecord(value) || !hasExactKeys(value, RESTORED_STATE_KEYS)) return null
  if (!isOneOf(LAB_STAGES, value.stage)) return null
  if (value.activeCaseId !== null && !isOneOf(CASE_ORDER, value.activeCaseId)) return null
  if (typeof value.caseProgress !== 'object' || value.caseProgress === null || Array.isArray(value.caseProgress)) return null
  const rawProgress = value.caseProgress as JsonRecord
  if (!hasExactKeys(rawProgress, CASE_ORDER)) return null
  const caseProgress = {} as Record<CaseId, CaseProgress>
  for (const caseId of CASE_ORDER) {
    const progress = validateCaseProgress(rawProgress[caseId], caseId)
    if (!progress) return null
    caseProgress[caseId] = progress
  }
  const revocationDecisions = validateRevocationRecord(value.revocationDecisions)
  if (!revocationDecisions || typeof value.revocationCompleted !== 'boolean' || typeof value.saveOnDevice !== 'boolean') return null
  return {
    stage: value.stage,
    activeCaseId: value.activeCaseId,
    caseProgress,
    revocationCompleted: value.revocationCompleted,
    revocationDecisions,
    saveOnDevice: value.saveOnDevice,
    statusMessage: RESTORED_STATUS_MESSAGE,
  }
}

function serializeDecisionRecord(value: Partial<Record<PermissionId, PermissionDecision>>): JsonRecord {
  const result: JsonRecord = {}
  for (const permissionId of PERMISSION_IDS) {
    const decision = value[permissionId]
    if (decision) result[permissionId] = copyDecision(decision)
  }
  return result
}

function serializeCaseProgress(value: CaseProgress): JsonRecord {
  return {
    initialDecisions: serializeDecisionRecord(value.initialDecisions),
    revisedDecisions: serializeDecisionRecord(value.revisedDecisions),
    reasonTags: [...REASON_TAG_IDS].filter((tag) => value.reasonTags.includes(tag)),
    rationaleText: value.rationaleText,
    enabledFeatureSwitchIds: [...FEATURE_SWITCH_IDS].filter((id) => value.enabledFeatureSwitchIds.includes(id)),
    acknowledgedConditionIds: [...CONDITIONAL_IDS].filter((id) => value.acknowledgedConditionIds.includes(id)),
    impactViewed: value.impactViewed,
    controlAction: value.controlAction,
    completed: value.completed,
  }
}

function serializeState(state: LabState): JsonRecord {
  const caseProgress = {} as JsonRecord
  for (const caseId of CASE_ORDER) caseProgress[caseId] = serializeCaseProgress(state.caseProgress[caseId])
  const revocationDecisions: JsonRecord = {}
  for (const permissionId of PERMISSION_IDS) {
    const decision = state.revocationDecisions[permissionId]
    if (decision) revocationDecisions[permissionId] = { permissionId, action: decision.action }
  }
  return {
    stage: state.stage,
    activeCaseId: state.activeCaseId,
    caseProgress,
    revocationCompleted: state.revocationCompleted,
    revocationDecisions,
    saveOnDevice: state.saveOnDevice,
  }
}

export function loadSavedProgress(storage: KeyValueStorage): LabState | null {
  try {
    const serialized = storage.getItem(PROGRESS_STORAGE_KEY)
    if (serialized === null) return null
    const payload: unknown = JSON.parse(serialized)
    if (!isRecord(payload) || !hasExactKeys(payload, ['version', 'state']) || payload.version !== 1) return null
    return validateState(payload.state)
  } catch {
    return null
  }
}

export function saveProgress(storage: KeyValueStorage, state: LabState): void {
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ version: 1, state: serializeState(state) }))
  } catch {
    // Local storage is optional. A blocked or full adapter must not break learning.
  }
}

export function clearSavedProgress(storage: KeyValueStorage): void {
  try {
    storage.removeItem(PROGRESS_STORAGE_KEY)
  } catch {
    // Clearing is best effort and remains limited to the dedicated key.
  }
}
