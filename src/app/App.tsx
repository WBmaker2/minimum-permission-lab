import type { ReactElement } from 'react'
import { APP_CASES } from '../content/cases'
import AppHeader from '../components/AppHeader'
import type { AppCase, CaseId, LabState, LabStage } from '../domain/model'
import { LabProvider, useLab } from './LabProvider'
import StartScreen from '../features/start/StartScreen'
import FeatureSpecScreen from '../features/specification/FeatureSpecScreen'
import PermissionReviewScreen from '../features/review/PermissionReviewScreen'

export default function App(): ReactElement {
  return <LabProvider><LabApplication /></LabProvider>
}

export function LabApplication(): ReactElement {
  const { state, dispatch, setSaveOnDevice, loadSavedProgressOnRequest } = useLab()
  const activeCase = getActiveCase(state.activeCaseId)
  const callbacks: StageCallbacks = {
    state,
    onSelectCase: (caseId) => dispatch({ type: 'SELECT_CASE', caseId }),
    onOpenSpecification: () => dispatch({ type: 'OPEN_SPECIFICATION' }),
    onSaveOnDeviceChange: setSaveOnDevice,
    onLoadSavedProgress: loadSavedProgressOnRequest,
    onBeginReview: () => dispatch({ type: 'OPEN_SPECIFICATION' }),
    onInitialDecision: (decision) => state.activeCaseId && dispatch({ type: 'SET_INITIAL_DECISION', caseId: state.activeCaseId, decision }),
    onOpenImpact: () => dispatch({ type: 'OPEN_IMPACT' }),
    onRevisedDecision: (decision) => state.activeCaseId && dispatch({ type: 'SET_REVISED_DECISION', caseId: state.activeCaseId, decision }),
    onRationaleTextChange: (caseId, value) => dispatch({ type: 'SET_CASE_RATIONALE_TEXT', caseId, value }),
    onReasonTagToggle: (caseId, tagId) => dispatch({ type: 'TOGGLE_CASE_REASON_TAG', caseId, tagId }),
    onCompleteCase: () => state.activeCaseId && dispatch({ type: 'COMPLETE_CASE', caseId: state.activeCaseId }),
    onReset: () => dispatch({ type: 'RESET_LAB' }),
  }

  return <><AppHeader stage={state.stage} />{renderStage(state.stage, activeCase, callbacks)}</>
}

interface StageCallbacks {
  state: LabState
  onSelectCase: (caseId: CaseId) => void
  onOpenSpecification: () => void
  onSaveOnDeviceChange: (enabled: boolean) => void
  onLoadSavedProgress: () => void
  onBeginReview: () => void
  onInitialDecision: (decision: import('../domain/model').PermissionDecision) => void
  onOpenImpact: () => void
  onRevisedDecision: (decision: import('../domain/model').PermissionDecision) => void
  onRationaleTextChange: (caseId: CaseId, value: string) => void
  onReasonTagToggle: (caseId: CaseId, tagId: import('../domain/model').ReasonTagId) => void
  onCompleteCase: () => void
  onReset: () => void
}

function renderStage(stage: LabStage, activeCase: AppCase | null, callbacks: StageCallbacks): ReactElement {
  switch (stage) {
    case 'start':
      return <StartScreen {...callbacks} />
    case 'specification':
      return activeCase
        ? <FeatureSpecScreen appCase={activeCase} onBeginReview={callbacks.onBeginReview} />
        : <CaseRecoveryScreen onRecover={callbacks.onReset} />
    case 'initial-review':
      return activeCase
        ? <PermissionReviewScreen appCase={activeCase} mode="initial" progress={callbacks.state.caseProgress[activeCase.id]} onDecision={callbacks.onInitialDecision} onRationaleTextChange={callbacks.onRationaleTextChange} onReasonTagToggle={callbacks.onReasonTagToggle} onReview={callbacks.onOpenImpact} />
        : <CaseRecoveryScreen onRecover={callbacks.onReset} />
    case 'impact':
      return <StageScreen heading="기능 영향 시뮬레이션" />
    case 'revision-review':
      return activeCase
        ? <PermissionReviewScreen appCase={activeCase} mode="revision" progress={callbacks.state.caseProgress[activeCase.id]} onDecision={callbacks.onRevisedDecision} onRationaleTextChange={callbacks.onRationaleTextChange} onReasonTagToggle={callbacks.onReasonTagToggle} onReview={callbacks.onCompleteCase} />
        : <CaseRecoveryScreen onRecover={callbacks.onReset} />
    case 'revocation':
      return <StageScreen heading="권한 철회 미니 활동" />
    case 'report':
      return <StageScreen heading="학습 보고서" />
    default:
      return assertNever(stage)
  }
}

function getActiveCase(activeCaseId: LabState['activeCaseId']): AppCase | null {
  if (typeof activeCaseId !== 'string' || !Object.prototype.hasOwnProperty.call(APP_CASES, activeCaseId)) return null
  return APP_CASES[activeCaseId as CaseId] ?? null
}

function assertNever(value: never): never {
  throw new Error(`처리되지 않은 학습 단계: ${String(value)}`)
}

function CaseRecoveryScreen({ onRecover }: { onRecover: () => void }): ReactElement {
  return <main><h2>사례를 다시 선택해 주세요</h2><p>선택한 사례를 확인할 수 없습니다. 시작 화면으로 돌아가 사례를 다시 선택하세요.</p><button type="button" onClick={onRecover}>사례 선택으로 돌아가기</button></main>
}

function StageScreen({ heading }: { heading: string }): ReactElement {
  return <main><h2>{heading}</h2><p>선택한 사례의 학습 계약을 바탕으로 다음 활동을 준비합니다.</p></main>
}
