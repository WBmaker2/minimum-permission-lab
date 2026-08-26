export type CaseId =
  | 'photo-scan'
  | 'voice-reading'
  | 'class-map'
  | 'group-board'

export type PermissionId = 'camera' | 'microphone' | 'location' | 'contacts'

export type LearnerChoice = 'allow-current-feature' | 'deny' | 'more-info'

export type ContractVerdict = 'required' | 'unnecessary' | 'conditional'

export type ConditionalScenarioId =
  | 'voice-press-and-delete'
  | 'map-current-position-opt-in'

export type FeatureSwitchId = 'map-current-position'

export type ReasonTagId =
  | 'function-connection'
  | 'data-minimization'
  | 'user-control'
  | 'respect-others'

export type LabStage =
  | 'start'
  | 'specification'
  | 'initial-review'
  | 'impact'
  | 'revision-review'
  | 'revocation'
  | 'report'

export interface PermissionDefinition {
  readonly id: PermissionId
  readonly label: string
  readonly shortDescription: string
  readonly detailDescription: string
  readonly shapeLabel: string
  readonly iconName: 'camera-frame' | 'sound-wave' | 'map-pin' | 'people-card'
}

export interface PermissionRule {
  permissionId: PermissionId
  verdict: ContractVerdict
  neededInformation: string
  timing: string
  denialImpact: string
  alternative: string
  contractEvidence: string
  conditionId?: ConditionalScenarioId
}

export interface AppCase {
  id: CaseId
  title: string
  coreFunction: string
  dataFlow: readonly string[]
  retentionPromise: string
  requestedPermissions: readonly PermissionId[]
  rules: Readonly<Record<PermissionId, PermissionRule>>
}

export interface PermissionDecision {
  permissionId: PermissionId
  choice: LearnerChoice
}

export interface CaseProgress {
  initialDecisions: Partial<Record<PermissionId, PermissionDecision>>
  revisedDecisions: Partial<Record<PermissionId, PermissionDecision>>
  reasonTags: readonly ReasonTagId[]
  rationaleText: string
  enabledFeatureSwitchIds: readonly FeatureSwitchId[]
  acknowledgedConditionIds: readonly ConditionalScenarioId[]
  impactViewed: boolean
  controlAction: 'alternative' | 'revoke' | null
  completed: boolean
}

export interface LabState {
  stage: LabStage
  activeCaseId: CaseId | null
  caseProgress: Record<CaseId, CaseProgress>
  revocationCompleted: boolean
  revocationDecisions: Partial<Record<PermissionId, RevocationDecision>>
  saveOnDevice: boolean
  statusMessage: string
}

export interface JudgmentResult {
  permissionId: PermissionId
  verdict: ContractVerdict
  alignment: 'supported' | 'review-contract' | 'needs-information'
  feedback: string
  contractEvidence: string
  denialImpact: string
  alternative: string
  nextAction: 'continue' | 'open-details' | 'compare-condition'
}

export interface RevocationDecision {
  permissionId: PermissionId
  action: 'keep-current-feature' | 'revoke-now'
}

export interface ReportCaseResult {
  caseId: CaseId
  initial: readonly PermissionDecision[]
  revised: readonly PermissionDecision[]
  changedPermissionIds: readonly PermissionId[]
  reasonTags: readonly ReasonTagId[]
  rationaleText: string
  rubricEvidence: Readonly<
    Record<ReasonTagId, 'sufficient' | 'needs-support'>
  >
  controlAction: 'alternative' | 'revoke'
}

export interface LabReport {
  cases: readonly ReportCaseResult[]
  revokedPermissionIds: readonly PermissionId[]
}
