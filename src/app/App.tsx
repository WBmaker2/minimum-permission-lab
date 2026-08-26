import type { ReactElement } from 'react'
import { APP_CASES } from '../content/cases'
import AppHeader from '../components/AppHeader'
import type { AppCase, CaseId, LabState, LabStage } from '../domain/model'
import { LabProvider, useLab } from './LabProvider'
import StartScreen from '../features/start/StartScreen'
import FeatureSpecScreen from '../features/specification/FeatureSpecScreen'

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
      return <StageScreen heading="최초 권한 심사" />
    case 'impact':
      return <StageScreen heading="기능 영향 시뮬레이션" />
    case 'revision-review':
      return <StageScreen heading="수정 권한 심사" />
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
