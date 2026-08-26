import type {
  ConditionalScenarioId,
  JudgmentResult,
  LearnerChoice,
  PermissionRule,
} from './model'

export interface ConditionalJudgmentContext {
  readonly conditionAcknowledged: boolean
  readonly featureSwitchEnabled: boolean
}

type JudgmentAlignment = JudgmentResult['alignment']
type JudgmentAction = JudgmentResult['nextAction']

function makeResult(
  rule: PermissionRule,
  alignment: JudgmentAlignment,
  feedback: string,
  nextAction: JudgmentAction,
): JudgmentResult {
  return Object.freeze({
    permissionId: rule.permissionId,
    verdict: rule.verdict,
    alignment,
    feedback,
    contractEvidence: rule.contractEvidence,
    denialImpact: rule.denialImpact,
    alternative: rule.alternative,
    nextAction,
  })
}

function assertNever(value: never): never {
  throw new Error(`Unsupported conditional scenario: ${String(value)}`)
}

function getEffectiveRule(
  rule: PermissionRule,
  conditionId: ConditionalScenarioId,
  context: ConditionalJudgmentContext,
): PermissionRule {
  switch (conditionId) {
    case 'map-current-position-opt-in':
      if (!context.featureSwitchEnabled) {
        return rule
      }

      return { ...rule, verdict: 'conditional' }
    case 'voice-press-and-delete':
      return rule
    default:
      return assertNever(conditionId)
  }
}

export function judgePermission(
  rule: PermissionRule,
  choice: LearnerChoice,
): JudgmentResult {
  if (choice === 'more-info') {
    return makeResult(
      rule,
      'needs-information',
      '기능 계약과 권한이 필요한 시점, 보관 범위를 자세히 확인해 보세요.',
      'open-details',
    )
  }

  if (rule.verdict === 'required') {
    if (choice === 'allow-current-feature') {
      return makeResult(
        rule,
        'supported',
        '현재 기능 계약에 필요한 권한으로, 기능을 계속 사용할 수 있습니다.',
        'continue',
      )
    }

    return makeResult(
      rule,
      'review-contract',
      '권한을 거부하면 해당 기능이 제한될 수 있으므로 대안을 함께 검토합니다.',
      'continue',
    )
  }

  if (rule.verdict === 'unnecessary') {
    if (choice === 'deny') {
      return makeResult(
        rule,
        'supported',
        '현재 기능에 필요하지 않은 권한을 거부했으며, 기능을 계속 사용할 수 있습니다.',
        'continue',
      )
    }

    return makeResult(
      rule,
      'review-contract',
      '현재 기능 계약에 없는 정보이므로, 최소 정보로 가능한 대안을 검토합니다.',
      'continue',
    )
  }

  return makeResult(
    rule,
    'review-contract',
    '조건부 권한은 사용 시점·보관·기능 켜기 계약을 비교해 확인합니다.',
    'compare-condition',
  )
}

export function judgeConditionalScenario(
  rule: PermissionRule,
  choice: LearnerChoice,
  context: ConditionalJudgmentContext,
): JudgmentResult {
  const conditionId = rule.conditionId
  if (!conditionId) {
    return judgePermission(rule, choice)
  }

  const effectiveRule = getEffectiveRule(rule, conditionId, context)

  if (choice === 'more-info') {
    return judgePermission(effectiveRule, choice)
  }

  const result = judgePermission(effectiveRule, choice)
  if (!context.conditionAcknowledged) {
    return result
  }

  return Object.freeze({
    ...result,
    feedback: '조건부 계약의 사용 시점과 보관 범위를 확인했습니다. 선택한 기능 계약을 계속 살펴봅니다.',
    nextAction: 'continue' as const,
  })
}
