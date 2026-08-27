import { APP_CASES, CASE_ORDER } from '../content/cases'
import { CONDITIONAL_SCENARIOS } from '../content/conditionalScenarios'
import type {
  CaseId,
  CaseProgress,
  ConditionalScenarioId,
  FeatureSwitchId,
  LabState,
  PermissionDecision,
  PermissionId,
  ReasonTagId,
  RevocationDecision,
} from '../domain/model'
import { RESTORED_STATUS_MESSAGE } from '../storage/progressStorage'
import { areAllCasesComplete, areCaseConditionsSatisfied, isCaseProgressReadyForCompletion, isCaseProgressComplete } from './labSelectors'

export type LabAction =
  | { type: 'SELECT_CASE'; caseId: CaseId }
  | { type: 'OPEN_SPECIFICATION' }
  | { type: 'SET_INITIAL_DECISION'; caseId: CaseId; decision: PermissionDecision }
  | { type: 'OPEN_IMPACT' }
  | { type: 'SET_FEATURE_SWITCH'; caseId: CaseId; switchId: FeatureSwitchId; enabled: boolean }
  | { type: 'ACKNOWLEDGE_CONDITION'; caseId: CaseId; conditionId: ConditionalScenarioId }
  | { type: 'SET_REVISED_DECISION'; caseId: CaseId; decision: PermissionDecision }
  | { type: 'SET_CASE_RATIONALE_TEXT'; caseId: CaseId; value: string }
  | { type: 'TOGGLE_CASE_REASON_TAG'; caseId: CaseId; tagId: ReasonTagId }
  | { type: 'SET_CONTROL_ACTION'; caseId: CaseId; action: 'alternative' | 'revoke' }
  | { type: 'COMPLETE_CASE'; caseId: CaseId }
  | { type: 'OPEN_REVOCATION' }
  | { type: 'SET_REVOCATION_DECISION'; decision: RevocationDecision }
  | { type: 'COMPLETE_REVOCATION' }
  | { type: 'OPEN_REPORT' }
  | { type: 'SET_SAVE_ON_DEVICE'; enabled: boolean }
  | { type: 'LOAD_SAVED_PROGRESS'; state: LabState }
  | { type: 'RESET_LAB' }

const PERMISSION_IDS: readonly PermissionId[] = ['camera', 'microphone', 'location', 'contacts']

function emptyCaseProgress(): CaseProgress {
  return {
    initialDecisions: {},
    revisedDecisions: {},
    reasonTags: [],
    rationaleText: '',
    enabledFeatureSwitchIds: [],
    acknowledgedConditionIds: [],
    impactViewed: false,
    controlAction: null,
    completed: false,
  }
}

function sameDecision(a: PermissionDecision | undefined, b: PermissionDecision): boolean {
  return a?.permissionId === b.permissionId && a?.choice === b.choice
}

function isKnownCase(caseId: CaseId): boolean {
  return Object.prototype.hasOwnProperty.call(APP_CASES, caseId)
}

function isKnownPermission(permissionId: PermissionId): boolean {
  return PERMISSION_IDS.includes(permissionId)
}

function isRevocationAction(action: unknown): action is RevocationDecision['action'] {
  return action === 'keep-current-feature' || action === 'revoke-now'
}

function hasAllDecisions<T extends { permissionId: PermissionId }>(decisions: Partial<Record<PermissionId, T>>): boolean {
  return PERMISSION_IDS.every((permissionId) => decisions[permissionId]?.permissionId === permissionId)
}

function hasValidRevocationDecisions(decisions: Partial<Record<PermissionId, RevocationDecision>>): boolean {
  return PERMISSION_IDS.every((permissionId) => {
    const decision = decisions[permissionId]
    return decision?.permissionId === permissionId && isRevocationAction(decision.action)
  })
}

function withCaseProgress(state: LabState, caseId: CaseId, progress: CaseProgress): LabState {
  return { ...state, caseProgress: { ...state.caseProgress, [caseId]: progress } }
}

function copyLabState(state: LabState): LabState {
  const caseProgress = {} as Record<CaseId, CaseProgress>
  for (const caseId of CASE_ORDER) {
    const progress = state.caseProgress[caseId]
    caseProgress[caseId] = {
      initialDecisions: Object.fromEntries(Object.entries(progress.initialDecisions).map(([id, decision]) => [id, { ...decision }])) as CaseProgress['initialDecisions'],
      revisedDecisions: Object.fromEntries(Object.entries(progress.revisedDecisions).map(([id, decision]) => [id, { ...decision }])) as CaseProgress['revisedDecisions'],
      reasonTags: [...progress.reasonTags],
      rationaleText: progress.rationaleText,
      enabledFeatureSwitchIds: [...progress.enabledFeatureSwitchIds],
      acknowledgedConditionIds: [...progress.acknowledgedConditionIds],
      impactViewed: progress.impactViewed,
      controlAction: progress.controlAction,
      completed: progress.completed,
    }
  }
  return {
    stage: state.stage,
    activeCaseId: state.activeCaseId,
    caseProgress,
    revocationCompleted: state.revocationCompleted,
    revocationDecisions: Object.fromEntries(Object.entries(state.revocationDecisions).map(([id, decision]) => [id, { ...decision }])) as LabState['revocationDecisions'],
    saveOnDevice: state.saveOnDevice,
    statusMessage: RESTORED_STATUS_MESSAGE,
  }
}

export function createInitialLabState(): LabState {
  const caseProgress = Object.fromEntries(CASE_ORDER.map((caseId) => [caseId, emptyCaseProgress()])) as Record<CaseId, CaseProgress>
  return {
    stage: 'start',
    activeCaseId: null,
    caseProgress,
    revocationCompleted: false,
    revocationDecisions: {},
    saveOnDevice: false,
    statusMessage: '이 앱은 실제 권한을 요청하지 않으며, 개인정보를 입력하거나 저장하지 않습니다.',
  }
}

export function labReducer(state: LabState, action: LabAction): LabState {
  switch (action.type) {
    case 'SELECT_CASE': {
      const progress = state.caseProgress[action.caseId]
      if (state.stage !== 'start' || !isKnownCase(action.caseId) || !progress || isCaseProgressComplete(action.caseId, progress)) return state
      if (state.activeCaseId === action.caseId) return state
      return { ...state, activeCaseId: action.caseId }
    }
    case 'OPEN_SPECIFICATION': {
      if (!state.activeCaseId || !isKnownCase(state.activeCaseId)) return state
      const progress = state.caseProgress[state.activeCaseId]
      if (progress && isCaseProgressComplete(state.activeCaseId, progress)) return state
      if (state.stage === 'start') return { ...state, stage: 'specification' }
      if (state.stage === 'specification') return { ...state, stage: 'initial-review' }
      return state
    }
    case 'SET_INITIAL_DECISION': {
      if (state.stage !== 'initial-review' || state.activeCaseId !== action.caseId || !isKnownPermission(action.decision.permissionId)) return state
      const progress = state.caseProgress[action.caseId]
      if (!progress || !APP_CASES[action.caseId].requestedPermissions.includes(action.decision.permissionId)) return state
      if (sameDecision(progress.initialDecisions[action.decision.permissionId], action.decision)) return state
      return withCaseProgress(state, action.caseId, {
        ...progress,
        initialDecisions: { ...progress.initialDecisions, [action.decision.permissionId]: action.decision },
      })
    }
    case 'OPEN_IMPACT': {
      if (!state.activeCaseId || !isKnownCase(state.activeCaseId)) return state
      const progress = state.caseProgress[state.activeCaseId]
      if (!progress) return state
      if (state.stage === 'initial-review' && hasAllDecisions(progress.initialDecisions)) {
        return withCaseProgress({ ...state, stage: 'impact' }, state.activeCaseId, { ...progress, impactViewed: true })
      }
      if (state.stage === 'impact' && progress.controlAction !== null && areCaseConditionsSatisfied(state.activeCaseId, progress)) {
        return { ...state, stage: 'revision-review' }
      }
      return state
    }
    case 'SET_FEATURE_SWITCH': {
      if (state.stage !== 'impact' || state.activeCaseId !== action.caseId) return state
      const progress = state.caseProgress[action.caseId]
      const scenario = Object.values(CONDITIONAL_SCENARIOS).find((item) => item.featureSwitchId === action.switchId)
      if (!progress || !scenario || scenario.caseId !== action.caseId) return state
      const hasSwitch = progress.enabledFeatureSwitchIds.includes(action.switchId)
      if (hasSwitch === action.enabled) return state
      const enabledFeatureSwitchIds = action.enabled
        ? [...progress.enabledFeatureSwitchIds, action.switchId]
        : progress.enabledFeatureSwitchIds.filter((switchId) => switchId !== action.switchId)
      const acknowledgedConditionIds = action.enabled
        ? progress.acknowledgedConditionIds
        : progress.acknowledgedConditionIds.filter((conditionId) => !Object.values(CONDITIONAL_SCENARIOS).some((item) => item.caseId === action.caseId && item.featureSwitchId === action.switchId && item.id === conditionId))
      return withCaseProgress(state, action.caseId, { ...progress, enabledFeatureSwitchIds, acknowledgedConditionIds })
    }
    case 'ACKNOWLEDGE_CONDITION': {
      if (state.stage !== 'impact' || state.activeCaseId !== action.caseId) return state
      const progress = state.caseProgress[action.caseId]
      const scenario = CONDITIONAL_SCENARIOS[action.conditionId]
      if (!progress || !scenario || scenario.caseId !== action.caseId) return state
      if (scenario.featureSwitchId && !progress.enabledFeatureSwitchIds.includes(scenario.featureSwitchId)) return state
      if (progress.acknowledgedConditionIds.includes(action.conditionId)) return state
      return withCaseProgress(state, action.caseId, {
        ...progress,
        acknowledgedConditionIds: [...progress.acknowledgedConditionIds, action.conditionId],
      })
    }
    case 'SET_CONTROL_ACTION': {
      if (state.stage !== 'impact' || state.activeCaseId !== action.caseId) return state
      const progress = state.caseProgress[action.caseId]
      if (!progress || progress.controlAction === action.action) return state
      return withCaseProgress(state, action.caseId, { ...progress, controlAction: action.action })
    }
    case 'SET_REVISED_DECISION': {
      if (state.stage !== 'revision-review' || state.activeCaseId !== action.caseId || !isKnownPermission(action.decision.permissionId)) return state
      const progress = state.caseProgress[action.caseId]
      if (!progress || !APP_CASES[action.caseId].requestedPermissions.includes(action.decision.permissionId)) return state
      if (sameDecision(progress.revisedDecisions[action.decision.permissionId], action.decision)) return state
      return withCaseProgress(state, action.caseId, {
        ...progress,
        revisedDecisions: { ...progress.revisedDecisions, [action.decision.permissionId]: action.decision },
      })
    }
    case 'SET_CASE_RATIONALE_TEXT': {
      if (state.stage !== 'revision-review' || state.activeCaseId !== action.caseId) return state
      const progress = state.caseProgress[action.caseId]
      if (!progress || progress.rationaleText === action.value) return state
      return withCaseProgress(state, action.caseId, { ...progress, rationaleText: action.value })
    }
    case 'TOGGLE_CASE_REASON_TAG': {
      if (state.stage !== 'revision-review' || state.activeCaseId !== action.caseId) return state
      const progress = state.caseProgress[action.caseId]
      if (!progress) return state
      const hasTag = progress.reasonTags.includes(action.tagId)
      const reasonTags = hasTag ? progress.reasonTags.filter((tag) => tag !== action.tagId) : [...progress.reasonTags, action.tagId]
      return withCaseProgress(state, action.caseId, { ...progress, reasonTags })
    }
    case 'COMPLETE_CASE': {
      if (state.stage !== 'revision-review' || state.activeCaseId !== action.caseId) return state
      const progress = state.caseProgress[action.caseId]
      if (!progress || !isCaseProgressReadyForCompletion(action.caseId, progress)) return state
      return withCaseProgress({ ...state, stage: 'start', activeCaseId: null }, action.caseId, { ...progress, completed: true })
    }
    case 'OPEN_REVOCATION':
      if (state.stage !== 'start' || state.revocationCompleted || !areAllCasesComplete(state)) return state
      return { ...state, stage: 'revocation', activeCaseId: null }
    case 'SET_REVOCATION_DECISION':
      if (state.stage !== 'revocation' || state.revocationCompleted || !isKnownPermission(action.decision.permissionId) || !isRevocationAction(action.decision.action)) return state
      if (state.revocationDecisions[action.decision.permissionId]?.action === action.decision.action) return state
      return { ...state, revocationDecisions: { ...state.revocationDecisions, [action.decision.permissionId]: { ...action.decision } } }
    case 'COMPLETE_REVOCATION':
      if (state.stage !== 'revocation' || !areAllCasesComplete(state) || !hasValidRevocationDecisions(state.revocationDecisions) || !Object.values(state.revocationDecisions).some((decision) => decision?.action === 'revoke-now')) return state
      if (state.revocationCompleted) return state
      return { ...state, revocationCompleted: true }
    case 'OPEN_REPORT':
      if (state.stage !== 'revocation' || !areAllCasesComplete(state) || !state.revocationCompleted || !hasValidRevocationDecisions(state.revocationDecisions) || !Object.values(state.revocationDecisions).some((decision) => decision?.action === 'revoke-now')) return state
      return { ...state, stage: 'report', activeCaseId: null }
    case 'SET_SAVE_ON_DEVICE':
      return state.saveOnDevice === action.enabled ? state : { ...state, saveOnDevice: action.enabled }
    case 'LOAD_SAVED_PROGRESS':
      return state.stage === 'start' ? copyLabState(action.state) : state
    case 'RESET_LAB':
      return createInitialLabState()
  }
}
