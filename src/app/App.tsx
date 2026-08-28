import { useCallback, useRef, useState, type ReactElement } from 'react'
import { APP_CASES, CASE_ORDER } from '../content/cases'
import AppHeader from '../components/AppHeader'
import type { AppCase, CaseId, LabState, LabStage, PermissionDecision, RevocationDecision, ConditionalScenarioId, FeatureSwitchId, ReasonTagId } from '../domain/model'
import { LabProvider, useLab } from './LabProvider'
import StartScreen from '../features/start/StartScreen'
import FeatureSpecScreen from '../features/specification/FeatureSpecScreen'
import PermissionReviewScreen from '../features/review/PermissionReviewScreen'
import ImpactScreen from '../features/impact/ImpactScreen'
import RevokeTrainingScreen from '../features/revoke/RevokeTrainingScreen'
import { areAllCasesComplete, isCaseProgressComplete } from './labSelectors'
import StageFocusManager from '../components/StageFocusManager'
import PrimaryActionButton from '../components/PrimaryActionButton'
import { buildReport } from '../domain/buildReport'
import ReportScreen from '../features/report/ReportScreen'
import UpdateHistoryButton from '../components/UpdateHistoryButton'
import UpdateHistoryDialog from '../components/UpdateHistoryDialog'
import { UPDATE_HISTORY } from '../content/updateHistory'

export default function App(): ReactElement {
  return <LabProvider><LabApplication /></LabProvider>
}

export function LabApplication(): ReactElement {
  const { state, dispatch, setSaveOnDevice, loadSavedProgressOnRequest, clearSavedProgressOnRequest } = useLab()
  const [isUpdateHistoryOpen, setIsUpdateHistoryOpen] = useState(false)
  const updateHistoryTriggerRef = useRef<HTMLButtonElement>(null)
  const openUpdateHistory = useCallback(() => setIsUpdateHistoryOpen(true), [])
  const closeUpdateHistory = useCallback(() => setIsUpdateHistoryOpen(false), [])
  const activeCase = getActiveCase(state.activeCaseId)
  const completedCaseCount = CASE_ORDER.filter((caseId) => isCaseProgressComplete(caseId, state.caseProgress[caseId])).length
  const callbacks: StageCallbacks = {
    state,
    onSelectCase: (caseId) => dispatch({ type: 'SELECT_CASE', caseId }),
    onOpenSpecification: () => dispatch({ type: 'OPEN_SPECIFICATION' }),
    onSaveOnDeviceChange: setSaveOnDevice,
    onLoadSavedProgress: loadSavedProgressOnRequest,
    onClearSavedProgress: clearSavedProgressOnRequest,
    onBeginReview: () => dispatch({ type: 'OPEN_SPECIFICATION' }),
    onInitialDecision: (decision) => state.activeCaseId && dispatch({ type: 'SET_INITIAL_DECISION', caseId: state.activeCaseId, decision }),
    onOpenImpact: () => dispatch({ type: 'OPEN_IMPACT' }),
    onFeatureSwitchChange: (caseId, switchId, enabled) => dispatch({ type: 'SET_FEATURE_SWITCH', caseId, switchId, enabled }),
    onAcknowledgeCondition: (caseId, conditionId) => dispatch({ type: 'ACKNOWLEDGE_CONDITION', caseId, conditionId }),
    onControlActionChange: (caseId, action) => dispatch({ type: 'SET_CONTROL_ACTION', caseId, action }),
    onRevisedDecision: (decision) => state.activeCaseId && dispatch({ type: 'SET_REVISED_DECISION', caseId: state.activeCaseId, decision }),
    onRationaleTextChange: (caseId, value) => dispatch({ type: 'SET_CASE_RATIONALE_TEXT', caseId, value }),
    onReasonTagToggle: (caseId, tagId) => dispatch({ type: 'TOGGLE_CASE_REASON_TAG', caseId, tagId }),
    onCompleteCase: () => state.activeCaseId && dispatch({ type: 'COMPLETE_CASE', caseId: state.activeCaseId }),
    onOpenRevocation: () => dispatch({ type: 'OPEN_REVOCATION' }),
    onRevocationDecision: (decision) => dispatch({ type: 'SET_REVOCATION_DECISION', decision }),
    onCompleteRevocation: () => dispatch({ type: 'COMPLETE_REVOCATION' }),
    onOpenReport: () => dispatch({ type: 'OPEN_REPORT' }),
    onReset: () => {
      if (state.saveOnDevice) setSaveOnDevice(false)
      dispatch({ type: 'RESET_LAB' })
    },
  }

  return <>
    <AppHeader stage={state.stage} completedCaseCount={completedCaseCount} totalCaseCount={CASE_ORDER.length} />
    <StageFocusManager stage={state.stage}>
      {renderStage(state.stage, activeCase, callbacks)}
    </StageFocusManager>
    <UpdateHistoryButton ref={updateHistoryTriggerRef} onOpen={openUpdateHistory} />
    {isUpdateHistoryOpen ? <UpdateHistoryDialog entries={UPDATE_HISTORY} onClose={closeUpdateHistory} returnFocusRef={updateHistoryTriggerRef} /> : null}
  </>
}

interface StageCallbacks {
  state: LabState
  onSelectCase: (caseId: CaseId) => void
  onOpenSpecification: () => void
  onSaveOnDeviceChange: (enabled: boolean) => void
  onLoadSavedProgress: () => void
  onClearSavedProgress: () => void
  onBeginReview: () => void
  onInitialDecision: (decision: PermissionDecision) => void
  onOpenImpact: () => void
  onFeatureSwitchChange: (caseId: CaseId, switchId: FeatureSwitchId, enabled: boolean) => void
  onAcknowledgeCondition: (caseId: CaseId, conditionId: ConditionalScenarioId) => void
  onControlActionChange: (caseId: CaseId, action: 'alternative' | 'revoke') => void
  onRevisedDecision: (decision: import('../domain/model').PermissionDecision) => void
  onRationaleTextChange: (caseId: CaseId, value: string) => void
  onReasonTagToggle: (caseId: CaseId, tagId: ReasonTagId) => void
  onCompleteCase: () => void
  onOpenRevocation: () => void
  onRevocationDecision: (decision: RevocationDecision) => void
  onCompleteRevocation: () => void
  onOpenReport: () => void
  onReset: () => void
}

function renderStage(stage: LabStage, activeCase: AppCase | null, callbacks: StageCallbacks): ReactElement {
  switch (stage) {
    case 'start':
      return areAllCasesComplete(callbacks.state)
        ? <RevocationReadyScreen onOpenRevocation={callbacks.onOpenRevocation} />
        : <StartScreen {...callbacks} />
    case 'specification':
      return activeCase
        ? <FeatureSpecScreen appCase={activeCase} onBeginReview={callbacks.onBeginReview} />
        : <CaseRecoveryScreen onRecover={callbacks.onReset} />
    case 'initial-review':
      return activeCase
        ? <PermissionReviewScreen appCase={activeCase} mode="initial" progress={callbacks.state.caseProgress[activeCase.id]} onDecision={callbacks.onInitialDecision} onRationaleTextChange={callbacks.onRationaleTextChange} onReasonTagToggle={callbacks.onReasonTagToggle} onReview={callbacks.onOpenImpact} />
        : <CaseRecoveryScreen onRecover={callbacks.onReset} />
    case 'impact':
      return activeCase
        ? <ImpactScreen
            appCase={activeCase}
            progress={callbacks.state.caseProgress[activeCase.id]}
            onFeatureSwitchChange={callbacks.onFeatureSwitchChange}
            onAcknowledgeCondition={callbacks.onAcknowledgeCondition}
            onControlActionChange={callbacks.onControlActionChange}
            onBeginRevision={callbacks.onOpenImpact}
          />
        : <CaseRecoveryScreen onRecover={callbacks.onReset} />
    case 'revision-review':
      return activeCase
        ? <PermissionReviewScreen appCase={activeCase} mode="revision" progress={callbacks.state.caseProgress[activeCase.id]} onDecision={callbacks.onRevisedDecision} onRationaleTextChange={callbacks.onRationaleTextChange} onReasonTagToggle={callbacks.onReasonTagToggle} onReview={callbacks.onCompleteCase} />
        : <CaseRecoveryScreen onRecover={callbacks.onReset} />
    case 'revocation':
      return <RevokeTrainingScreen
        eligible={areAllCasesComplete(callbacks.state)}
        decisions={callbacks.state.revocationDecisions}
        revocationCompleted={callbacks.state.revocationCompleted}
        onDecision={callbacks.onRevocationDecision}
        onComplete={callbacks.onCompleteRevocation}
        onOpenReport={callbacks.onOpenReport}
        onReset={callbacks.onReset}
      />
    case 'report':
      try {
        return <ReportScreen report={buildReport(callbacks.state)} onPrint={() => window.print()} onReset={callbacks.onReset} />
      } catch {
        return <ReportRecoveryScreen onRecover={callbacks.onReset} />
      }
    default:
      return assertNever(stage)
  }
}

function RevocationReadyScreen({ onOpenRevocation }: { onOpenRevocation: () => void }): ReactElement {
  return (
    <main>
      <h2 data-stage-heading tabIndex={-1}>네 사례를 모두 완료했습니다</h2>
      <p>이제 가상 사용 기록을 살펴보고, 필요하지 않은 권한을 철회하는 연습을 시작할 수 있습니다.</p>
      <PrimaryActionButton pulse stepNumber={6} onClick={onOpenRevocation}>
        권한 철회 연습 시작
      </PrimaryActionButton>
    </main>
  )
}

function getActiveCase(activeCaseId: LabState['activeCaseId']): AppCase | null {
  if (typeof activeCaseId !== 'string' || !Object.prototype.hasOwnProperty.call(APP_CASES, activeCaseId)) return null
  return APP_CASES[activeCaseId as CaseId] ?? null
}

function assertNever(value: never): never {
  throw new Error(`처리되지 않은 학습 단계: ${String(value)}`)
}

function CaseRecoveryScreen({ onRecover }: { onRecover: () => void }): ReactElement {
  return <main><h2 data-stage-heading tabIndex={-1}>사례를 다시 선택해 주세요</h2><p>선택한 사례를 확인할 수 없습니다. 시작 화면으로 돌아가 사례를 다시 선택하세요.</p><button type="button" onClick={onRecover}>사례 선택으로 돌아가기</button></main>
}

function ReportRecoveryScreen({ onRecover }: { onRecover: () => void }): ReactElement {
  const handleRecover = () => {
    if (window.confirm('학습 기록이 완전하지 않습니다. 지금 기록을 지우고 처음부터 다시 시작하시겠습니까?')) onRecover()
  }
  return <main><h2 data-stage-heading tabIndex={-1}>보고서를 만들 수 없습니다</h2><p>학습 기록이 완전하지 않아 보고서를 표시할 수 없습니다. 기록을 지우고 처음부터 다시 시작해 주세요.</p><button type="button" onClick={handleRecover}>처음부터 다시 하기</button></main>
}
