import { useId, useState, type ChangeEvent, type ReactElement } from 'react'

import type { ConditionalScenario } from '../../content/conditionalScenarios'
import type { CaseId, ConditionalScenarioId, FeatureSwitchId } from '../../domain/model'
import {
  getSimulationObservation,
  getSimulationScenarioSpec,
  type SimulationChoiceId,
} from './simulationModel'

export interface SimulationLearningLoopProps {
  readonly scenario: ConditionalScenario
  readonly switchEnabled: boolean
  readonly acknowledged: boolean
  readonly onSwitchChange: (caseId: CaseId, switchId: FeatureSwitchId, enabled: boolean) => void
  readonly onAcknowledge: (caseId: CaseId, conditionId: ConditionalScenarioId) => void
}

export default function SimulationLearningLoop({
  scenario,
  switchEnabled,
  acknowledged,
  onSwitchChange,
  onAcknowledge,
}: SimulationLearningLoopProps): ReactElement {
  const spec = getSimulationScenarioSpec(scenario.id)
  const idPrefix = useId()
  const titleId = `${idPrefix}-simulation-title`
  const predictionName = `${idPrefix}-prediction`
  const variableId = `${idPrefix}-variable`
  const variableHelpId = `${idPrefix}-variable-help`
  const observationId = `${idPrefix}-observation`
  const explanationName = `${idPrefix}-explanation`
  const resetId = `${idPrefix}-reset`
  const [variableValue, setVariableValue] = useState(switchEnabled)
  const [prediction, setPrediction] = useState<SimulationChoiceId | null>(null)
  const [explanation, setExplanation] = useState<SimulationChoiceId | null>(null)
  const [hasManipulated, setHasManipulated] = useState(() => switchEnabled !== spec.initialValue)
  const [hasConfirmed, setHasConfirmed] = useState(acknowledged)

  const canManipulate = prediction !== null
  const canExplain = hasManipulated
  const canCompare = canManipulate && canExplain && explanation !== null && !hasConfirmed
  const resetDisabled = !hasManipulated && prediction === null && explanation === null

  const handlePredictionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrediction(event.target.value as SimulationChoiceId)
    setExplanation(null)
  }

  const handleVariableChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.checked
    setVariableValue(nextValue)
    setHasManipulated(true)
    setHasConfirmed(false)
    setExplanation(null)
    if (scenario.featureSwitchId) onSwitchChange(scenario.caseId, scenario.featureSwitchId, nextValue)
  }

  const handleReset = () => {
    setVariableValue(spec.initialValue)
    setPrediction(null)
    setExplanation(null)
    setHasManipulated(false)
    setHasConfirmed(false)
    if (scenario.featureSwitchId) onSwitchChange(scenario.caseId, scenario.featureSwitchId, spec.initialValue)
  }

  const handleCompare = () => {
    if (!canCompare) return
    setHasConfirmed(true)
    onAcknowledge(scenario.caseId, scenario.id)
  }

  return (
    <section className="simulation-loop" aria-labelledby={titleId}>
      <h5 id={titleId}>먼저 예상하고 한 가지 조건을 바꿔 보세요</h5>
      <fieldset className="simulation-loop__fieldset">
        <legend>{spec.predictionPrompt}</legend>
        {spec.predictionOptions.map((option) => {
          const optionId = `${predictionName}-${option.id}`
          return (
            <label key={option.id} htmlFor={optionId}>
              <input
                id={optionId}
                type="radio"
                name={predictionName}
                value={option.id}
                checked={prediction === option.id}
                onChange={handlePredictionChange}
              />
              {option.label}
            </label>
          )
        })}
      </fieldset>

      <div className="simulation-loop__manipulation">
        <label htmlFor={variableId}>
          <input
            id={variableId}
            type="checkbox"
            checked={variableValue}
            disabled={!canManipulate}
            aria-describedby={variableHelpId}
            onChange={handleVariableChange}
          />
          {spec.variableLabel}
        </label>
        <p id={variableHelpId}>{spec.variableHelp}</p>
      </div>

      {hasManipulated && (
        <p id={observationId} className="simulation-loop__observation" aria-live="polite">
          {getSimulationObservation(spec, variableValue)}
        </p>
      )}

      <fieldset className="simulation-loop__fieldset" disabled={!canExplain}>
        <legend>{spec.explanationPrompt}</legend>
        {spec.explanationOptions.map((option) => {
          const optionId = `${explanationName}-${option.id}`
          return (
            <label key={option.id} htmlFor={optionId}>
              <input
                id={optionId}
                type="radio"
                name={explanationName}
                value={option.id}
                checked={explanation === option.id}
                onChange={(event) => setExplanation(event.target.value as SimulationChoiceId)}
              />
              {option.label}
            </label>
          )
        })}
      </fieldset>

      <div className="simulation-loop__actions">
        <button type="button" className={canCompare ? 'gi-pulse' : ''} disabled={!canCompare} onClick={handleCompare}>
          {hasConfirmed ? '비교 결과 확인 완료' : '비교 결과 확인'}
        </button>
        <button id={resetId} type="button" className="secondary-action" disabled={resetDisabled} onClick={handleReset}>
          처음 조건으로 돌아가기
        </button>
      </div>

      <details className="simulation-loop__boundary">
        <summary>실험 범위 보기</summary>
        <p>{spec.modelBoundary}</p>
        <p>{spec.pauseStepReason}</p>
      </details>
    </section>
  )
}
