import { describe, expect, it } from 'vitest'

import { APP_CASES } from '../content/cases'
import { judgeConditionalScenario, judgePermission } from './judgePermission'
import type {
  ContractVerdict,
  LearnerChoice,
  PermissionRule,
} from './model'

const rules: Record<ContractVerdict, PermissionRule> = {
  required: APP_CASES['photo-scan'].rules.camera,
  unnecessary: APP_CASES['photo-scan'].rules.microphone,
  conditional: APP_CASES['voice-reading'].rules.microphone,
}

describe('judgePermission', () => {
  it.each([
    ['required', 'allow-current-feature', 'supported', 'continue'],
    ['required', 'deny', 'review-contract', 'continue'],
    ['required', 'more-info', 'needs-information', 'open-details'],
    ['unnecessary', 'allow-current-feature', 'review-contract', 'continue'],
    ['unnecessary', 'deny', 'supported', 'continue'],
    ['unnecessary', 'more-info', 'needs-information', 'open-details'],
    ['conditional', 'allow-current-feature', 'review-contract', 'compare-condition'],
    ['conditional', 'deny', 'review-contract', 'compare-condition'],
    ['conditional', 'more-info', 'needs-information', 'open-details'],
  ] as const)('%s with %s gives %s and %s', (verdict, choice, alignment, nextAction) => {
    const rule = rules[verdict]
    const before = { ...rule }
    const result = judgePermission(rule, choice)

    expect(result.permissionId).toBe(rule.permissionId)
    expect(result.verdict).toBe(verdict)
    expect(result.alignment).toBe(alignment)
    expect(result.nextAction).toBe(nextAction)
    expect(result.contractEvidence).toBe(rule.contractEvidence)
    expect(result.denialImpact).toBe(rule.denialImpact)
    expect(result.alternative).toBe(rule.alternative)
    expect(result.feedback.trim()).not.toBe('')
    expect(rule).toEqual(before)
  })

  it('uses neutral information language and does not label a choice as an error', () => {
    const feedback = ([
      ...(['required', 'unnecessary', 'conditional'] as const).flatMap((verdict) =>
        (['allow-current-feature', 'deny', 'more-info'] as const).map((choice) =>
          judgePermission(rules[verdict], choice).feedback,
        ),
      ),
      judgeConditionalScenario(rules.conditional, 'allow-current-feature', {
        conditionAcknowledged: true,
        featureSwitchEnabled: true,
      }).feedback,
      judgeConditionalScenario(
        APP_CASES['class-map'].rules.location,
        'allow-current-feature',
        { conditionAcknowledged: true, featureSwitchEnabled: true },
      ).feedback,
    ]).join(' ')

    expect(feedback).toMatch(/기능 계약|근거|확인/)
    expect(feedback).not.toMatch(/허용해서 틀림|무조건 위험|안전한 앱으로 판정|실제 측정|측정 결과|안전성을 검증/)
  })

  it('freezes the returned result and preserves the contract fields', () => {
    const result = judgePermission(rules.required, 'deny')

    expect(Object.isFrozen(result)).toBe(true)
    expect(result).toMatchObject({
      permissionId: rules.required.permissionId,
      verdict: 'required',
      contractEvidence: rules.required.contractEvidence,
      denialImpact: rules.required.denialImpact,
      alternative: rules.required.alternative,
    })
  })
})

describe('judgeConditionalScenario', () => {
  const mapRule = APP_CASES['class-map'].rules.location
  const voiceRule = APP_CASES['voice-reading'].rules.microphone

  it('returns the base unnecessary judgment when map location is switched off', () => {
    const result = judgeConditionalScenario(mapRule, 'deny', {
      conditionAcknowledged: false,
      featureSwitchEnabled: false,
    })

    expect(result.verdict).toBe('unnecessary')
    expect(result.alignment).toBe('supported')
    expect(result.nextAction).toBe('continue')
  })

  it('opens a condition comparison when the map feature is on but unacknowledged', () => {
    const result = judgeConditionalScenario(mapRule, 'allow-current-feature', {
      conditionAcknowledged: false,
      featureSwitchEnabled: true,
    })

    expect(result.verdict).toBe('conditional')
    expect(result.alignment).toBe('review-contract')
    expect(result.nextAction).toBe('compare-condition')
  })

  it('continues after the enabled map condition is acknowledged', () => {
    const result = judgeConditionalScenario(mapRule, 'allow-current-feature', {
      conditionAcknowledged: true,
      featureSwitchEnabled: true,
    })

    expect(result.verdict).toBe('conditional')
    expect(result.alignment).toBe('review-contract')
    expect(result.nextAction).toBe('continue')
  })

  it('requires comparison for an unacknowledged voice condition', () => {
    const result = judgeConditionalScenario(voiceRule, 'deny', {
      conditionAcknowledged: false,
      featureSwitchEnabled: false,
    })

    expect(result.verdict).toBe('conditional')
    expect(result.alignment).toBe('review-contract')
    expect(result.nextAction).toBe('compare-condition')
  })

  it('keeps the neutral conditional judgment after voice conditions are acknowledged', () => {
    const result = judgeConditionalScenario(voiceRule, 'allow-current-feature', {
      conditionAcknowledged: true,
      featureSwitchEnabled: true,
    })

    expect(result.verdict).toBe('conditional')
    expect(result.alignment).toBe('review-contract')
    expect(result.nextAction).toBe('continue')
  })

  it('keeps more-info as the highest-priority action in every condition state', () => {
    for (const rule of [mapRule, voiceRule]) {
      for (const featureSwitchEnabled of [false, true]) {
        for (const conditionAcknowledged of [false, true]) {
          const result = judgeConditionalScenario(rule, 'more-info', {
            conditionAcknowledged,
            featureSwitchEnabled,
          })

          expect(result.alignment).toBe('needs-information')
          expect(result.nextAction).toBe('open-details')
        }
      }
    }
  })

  it('delegates an ordinary rule without a condition to the base judgment', () => {
    const choice: LearnerChoice = 'deny'
    const result = judgeConditionalScenario(rules.required, choice, {
      conditionAcknowledged: true,
      featureSwitchEnabled: true,
    })

    expect(result).toEqual(judgePermission(rules.required, choice))
  })

  it('fails closed for an unknown runtime condition id', () => {
    const unknownRule = {
      ...voiceRule,
      conditionId: 'unknown-condition' as unknown as NonNullable<PermissionRule['conditionId']>,
    }

    expect(() =>
      judgeConditionalScenario(unknownRule, 'deny', {
        conditionAcknowledged: false,
        featureSwitchEnabled: false,
      }),
    ).toThrow('Unsupported conditional scenario: unknown-condition')
  })
})
