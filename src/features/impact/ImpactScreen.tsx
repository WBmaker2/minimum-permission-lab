import { useId, useMemo, useState, type ReactElement } from 'react'

import LearningModelNotice from '../../components/LearningModelNotice'
import PrimaryActionButton from '../../components/PrimaryActionButton'
import StatusLiveRegion from '../../components/StatusLiveRegion'
import { CONDITIONAL_SCENARIOS, CONDITIONAL_SCENARIO_ORDER } from '../../content/conditionalScenarios'
import { buildFunctionImpacts } from '../../domain/buildFunctionImpacts'
import { areCaseConditionsSatisfied } from '../../app/labSelectors'
import type {
  AppCase,
  CaseId,
  CaseProgress,
  ConditionalScenarioId,
  FeatureSwitchId,
} from '../../domain/model'
import ConditionalScenarioCard from './ConditionalScenarioCard'
import FunctionImpactList from './FunctionImpactList'

export interface ImpactScreenProps {
  appCase: AppCase
  progress: CaseProgress
  onFeatureSwitchChange: (caseId: CaseId, switchId: FeatureSwitchId, enabled: boolean) => void
  onAcknowledgeCondition: (caseId: CaseId, conditionId: ConditionalScenarioId) => void
  onControlActionChange: (caseId: CaseId, action: 'alternative' | 'revoke') => void
  onBeginRevision: () => void
}

export default function ImpactScreen({
  appCase,
  progress,
  onFeatureSwitchChange,
  onAcknowledgeCondition,
  onControlActionChange,
  onBeginRevision,
}: ImpactScreenProps): ReactElement {
  const titleId = `${useId()}-impact-title`
  const [statusMessage, setStatusMessage] = useState('')
  const impacts = useMemo(
    () => buildFunctionImpacts(appCase, progress.initialDecisions, progress.enabledFeatureSwitchIds, progress.acknowledgedConditionIds),
    [appCase, progress.initialDecisions, progress.enabledFeatureSwitchIds, progress.acknowledgedConditionIds],
  )
  const scenarios = CONDITIONAL_SCENARIO_ORDER
    .map((scenarioId) => CONDITIONAL_SCENARIOS[scenarioId])
    .filter((scenario) => scenario.caseId === appCase.id)
  const ready = progress.controlAction !== null && areCaseConditionsSatisfied(appCase.id, progress)

  const handleSwitchChange = (caseId: CaseId, switchId: FeatureSwitchId, enabled: boolean) => {
    onFeatureSwitchChange(caseId, switchId, enabled)
    setStatusMessage(enabled ? '학습용 기능 스위치를 켰습니다. 권한 조건을 다시 비교합니다.' : '학습용 기능 스위치를 껐습니다. 기본 기능의 권한 조건을 확인합니다.')
  }

  const handleAcknowledge = (caseId: CaseId, conditionId: ConditionalScenarioId) => {
    if (progress.acknowledgedConditionIds.includes(conditionId)) return
    onAcknowledgeCondition(caseId, conditionId)
    setStatusMessage('조건 비교를 확인했습니다. 수정 권한안을 준비할 수 있습니다.')
  }

  return (
    <main aria-labelledby={titleId}>
      <h2 id={titleId} data-stage-heading tabIndex={-1}>기능 영향 시뮬레이션</h2>
      <p>{appCase.title}: 선택한 권한이 기능에 미치는 영향을 살펴봅니다.</p>
      <LearningModelNotice />
      <StatusLiveRegion message={statusMessage} />
      <FunctionImpactList impacts={impacts} />
      {scenarios.length > 0 && (
        <section aria-labelledby="conditional-scenarios-title">
          <h3 id="conditional-scenarios-title">조건부 기능 비교</h3>
          {scenarios.map((scenario) => (
            <ConditionalScenarioCard
              key={scenario.id}
              scenario={scenario}
              switchEnabled={scenario.featureSwitchId ? progress.enabledFeatureSwitchIds.includes(scenario.featureSwitchId) : true}
              acknowledged={progress.acknowledgedConditionIds.includes(scenario.id)}
              onSwitchChange={handleSwitchChange}
              onAcknowledge={handleAcknowledge}
            />
          ))}
        </section>
      )}
      <fieldset>
        <legend>다음 수정 방향을 고르세요. 둘 다 가상 학습용 행동이며 실제 기기 설정을 바꾸지 않습니다.</legend>
        <label>
          <input
            type="radio"
            name="impact-control-action"
            value="alternative"
            checked={progress.controlAction === 'alternative'}
            onChange={() => onControlActionChange(appCase.id, 'alternative')}
          />
          대안 사용
        </label>
        <label>
          <input
            type="radio"
            name="impact-control-action"
            value="revoke"
            checked={progress.controlAction === 'revoke'}
            onChange={() => onControlActionChange(appCase.id, 'revoke')}
          />
          권한 철회
        </label>
      </fieldset>
      <PrimaryActionButton pulse={ready} stepNumber={4} disabled={!ready} onClick={onBeginRevision}>
        최소 권한안 수정
      </PrimaryActionButton>
    </main>
  )
}
