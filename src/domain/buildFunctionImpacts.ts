import { judgeConditionalScenario, judgePermission } from './judgePermission'
import type {
  AppCase,
  ConditionalScenarioId,
  FeatureSwitchId,
  JudgmentResult,
  LearnerChoice,
  PermissionDecision,
  PermissionId,
} from './model'

export const MAP_CURRENT_POSITION_FEATURE_LABEL = '학습용 내 위치 표시'

export interface FunctionImpact {
  readonly permissionId: PermissionId
  readonly choice: LearnerChoice
  readonly availableFunctions: readonly string[]
  readonly limitedFunctions: readonly string[]
  readonly judgment: JudgmentResult
}

type Decisions = Partial<Record<PermissionId, PermissionDecision>>

function isLearnerChoice(value: unknown): value is LearnerChoice {
  return value === 'allow-current-feature' || value === 'deny' || value === 'more-info'
}

function freezeList(items: readonly string[]): readonly string[] {
  return Object.freeze([...items])
}

function freezeImpact(
  permissionId: PermissionId,
  choice: LearnerChoice,
  availableFunctions: readonly string[],
  limitedFunctions: readonly string[],
  judgment: JudgmentResult,
): FunctionImpact {
  return Object.freeze({
    permissionId,
    choice,
    availableFunctions: freezeList(availableFunctions),
    limitedFunctions: freezeList(limitedFunctions),
    judgment,
  })
}

function impactFunctions(
  appCase: AppCase,
  permissionId: PermissionId,
  choice: LearnerChoice,
  judgment: JudgmentResult,
  conditionAcknowledged: boolean,
  mapSwitchEnabled: boolean,
): Pick<FunctionImpact, 'availableFunctions' | 'limitedFunctions'> {
  if (choice === 'more-info') return { availableFunctions: [], limitedFunctions: [] }

  const rule = appCase.rules[permissionId]
  const isMapCurrentPosition = permissionId === 'location' && rule.conditionId === 'map-current-position-opt-in'
  if (isMapCurrentPosition && mapSwitchEnabled) {
    if (choice === 'deny') {
      return {
        availableFunctions: [appCase.coreFunction],
        limitedFunctions: [MAP_CURRENT_POSITION_FEATURE_LABEL],
      }
    }
    return conditionAcknowledged
      ? { availableFunctions: [appCase.coreFunction], limitedFunctions: [] }
      : { availableFunctions: [appCase.coreFunction], limitedFunctions: [MAP_CURRENT_POSITION_FEATURE_LABEL] }
  }

  if (rule.conditionId && !isMapCurrentPosition) {
    if (choice === 'deny') {
      return {
        availableFunctions: [rule.alternative],
        limitedFunctions: [rule.denialImpact],
      }
    }
    return conditionAcknowledged
      ? { availableFunctions: [appCase.coreFunction], limitedFunctions: [] }
      : { availableFunctions: [], limitedFunctions: [rule.denialImpact] }
  }

  if (rule.verdict === 'required') {
    return choice === 'allow-current-feature'
      ? { availableFunctions: [appCase.coreFunction], limitedFunctions: [] }
      : { availableFunctions: [rule.alternative], limitedFunctions: [rule.denialImpact] }
  }

  return { availableFunctions: [appCase.coreFunction], limitedFunctions: [] }
}

function isMapScenario(conditionId: ConditionalScenarioId | undefined): boolean {
  return conditionId === 'map-current-position-opt-in'
}

export function buildFunctionImpacts(
  appCase: AppCase,
  decisions: Decisions,
  enabledFeatureSwitchIds: readonly FeatureSwitchId[],
  acknowledgedConditionIds: readonly ConditionalScenarioId[],
): readonly FunctionImpact[] {
  const mapSwitchEnabled = enabledFeatureSwitchIds.includes('map-current-position')
  const impacts: FunctionImpact[] = []

  for (const permissionId of appCase.requestedPermissions) {
    const decision = decisions[permissionId]
    if (!decision || decision.permissionId !== permissionId || !isLearnerChoice(decision.choice)) continue

    const rule = appCase.rules[permissionId]
    const isMap = isMapScenario(rule.conditionId)
    const conditionAcknowledged = rule.conditionId !== undefined && acknowledgedConditionIds.includes(rule.conditionId)
    const judgment = rule.conditionId && (!isMap || mapSwitchEnabled)
      ? judgeConditionalScenario(rule, decision.choice, {
          conditionAcknowledged,
          featureSwitchEnabled: mapSwitchEnabled,
        })
      : judgePermission(rule, decision.choice)
    const functions = impactFunctions(
      appCase,
      permissionId,
      decision.choice,
      judgment,
      conditionAcknowledged,
      mapSwitchEnabled,
    )
    impacts.push(freezeImpact(permissionId, decision.choice, functions.availableFunctions, functions.limitedFunctions, judgment))
  }

  return Object.freeze(impacts)
}
