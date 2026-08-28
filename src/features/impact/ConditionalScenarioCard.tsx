import { useId, type ReactElement } from 'react'

import type { ConditionalScenario } from '../../content/conditionalScenarios'
import { MAP_CURRENT_POSITION_FEATURE_LABEL } from '../../domain/buildFunctionImpacts'
import type { CaseId, ConditionalScenarioId, FeatureSwitchId } from '../../domain/model'

export interface ConditionalScenarioCardProps {
  scenario: ConditionalScenario
  switchEnabled: boolean
  acknowledged: boolean
  onSwitchChange: (caseId: CaseId, switchId: FeatureSwitchId, enabled: boolean) => void
  onAcknowledge: (caseId: CaseId, conditionId: ConditionalScenarioId) => void
}

export default function ConditionalScenarioCard({
  scenario,
  switchEnabled,
  acknowledged,
  onSwitchChange,
  onAcknowledge,
}: ConditionalScenarioCardProps): ReactElement {
  const hintId = `${useId()}-condition-hint`
  const hasSwitch = scenario.featureSwitchId !== undefined
  const switchLabel = `${MAP_CURRENT_POSITION_FEATURE_LABEL} 기능 켜기`

  return (
    <article>
      <h4>{scenario.changedContract}</h4>
      {hasSwitch && scenario.featureSwitchId ? (
        <label>
          <input
            type="checkbox"
            aria-label={switchLabel}
            checked={switchEnabled}
            onChange={(event) => onSwitchChange(scenario.caseId, scenario.featureSwitchId!, event.target.checked)}
          />
          {switchLabel}
        </label>
      ) : <p>마이크는 실제 녹음 없이 누르는 동안만 처리하는 가상 조건입니다.</p>}
      <p>{scenario.comparisonPrompt}</p>
      <ul>
        {scenario.requiredConditions.map((condition) => <li key={condition}>{condition}</li>)}
      </ul>
      <button
        type="button"
        disabled={acknowledged || (hasSwitch && !switchEnabled)}
        aria-describedby={hasSwitch && !switchEnabled ? hintId : undefined}
        onClick={() => onAcknowledge(scenario.caseId, scenario.id)}
      >
        {acknowledged ? '비교 확인 완료' : '비교 확인'}
      </button>
      {hasSwitch && !switchEnabled && <p id={hintId} role="note">먼저 학습용 기능 스위치를 켜면 비교할 수 있습니다.</p>}
    </article>
  )
}
