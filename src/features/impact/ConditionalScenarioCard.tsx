import { useId, type ReactElement } from 'react'

import type { ConditionalScenario } from '../../content/conditionalScenarios'
import type { CaseId, ConditionalScenarioId, FeatureSwitchId } from '../../domain/model'
import SimulationLearningLoop from './SimulationLearningLoop'

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

  return (
    <article className="conditional-scenario-card">
      <h4>{scenario.changedContract}</h4>
      <p>{scenario.comparisonPrompt}</p>
      <SimulationLearningLoop
        scenario={scenario}
        switchEnabled={hasSwitch ? switchEnabled : false}
        acknowledged={acknowledged}
        onSwitchChange={onSwitchChange}
        onAcknowledge={onAcknowledge}
      />
      <details>
        <summary>조건을 다시 확인해 보세요</summary>
        <ul>
          {scenario.requiredConditions.map((condition) => <li key={condition}>{condition}</li>)}
        </ul>
      </details>
      {hasSwitch && !switchEnabled && <p id={hintId} role="note">먼저 예상한 뒤 현재 위치 보기 조건을 켜면 관찰할 수 있습니다.</p>}
    </article>
  )
}
