import { useEffect, useId, useRef, type ReactElement } from 'react'
import {
  HELP_REQUEST_NOTICE,
  NOT_IN_SCOPE_NOTICE,
  TEACHER_GUIDE_NOTICE,
} from '../../content/learningNotices'
import { CASE_ORDER } from '../../content/cases'
import type { CaseId, LabState } from '../../domain/model'
import PrimaryActionButton from '../../components/PrimaryActionButton'
import CaseSelector from './CaseSelector'
import { isCaseProgressComplete } from '../../app/labSelectors'
import ActionRequirementHint from '../../components/ActionRequirementHint'
import LearningOverview from './LearningOverview'

export interface StartScreenProps {
  state: LabState
  onSelectCase: (caseId: CaseId) => void
  onOpenSpecification: () => void
  onSaveOnDeviceChange: (enabled: boolean) => void
  onLoadSavedProgress: () => void
  onClearSavedProgress: () => void
}

export default function StartScreen({
  state,
  onSelectCase,
  onOpenSpecification,
  onSaveOnDeviceChange,
  onLoadSavedProgress,
  onClearSavedProgress,
}: StartScreenProps): ReactElement {
  const clearHintId = `${useId()}-clear-storage-hint`
  const primaryActionRef = useRef<HTMLButtonElement>(null)
  const pendingSelectionRef = useRef(false)
  const completedCaseIds = Object.entries(state.caseProgress)
    .filter(([caseId, progress]) => isCaseProgressComplete(caseId as CaseId, progress))
    .map(([caseId]) => caseId as CaseId)

  const handleCaseSelect = (caseId: CaseId) => {
    pendingSelectionRef.current = true
    onSelectCase(caseId)
  }

  useEffect(() => {
    if (!pendingSelectionRef.current || state.activeCaseId === null) return
    pendingSelectionRef.current = false
    if (document.querySelector('[role="dialog"][aria-modal="true"]')) return
    primaryActionRef.current?.focus()
  }, [state.activeCaseId])

  return (
    <main>
      <h2 data-stage-heading tabIndex={-1}>학습 시작</h2>
      <LearningOverview
        selectedCase={state.activeCaseId !== null}
        completedCaseCount={completedCaseIds.length}
        totalCaseCount={CASE_ORDER.length}
      />
      <CaseSelector
        completedCaseIds={completedCaseIds}
        selectedCaseId={state.activeCaseId}
        onSelect={handleCaseSelect}
      />
      <PrimaryActionButton
        ref={primaryActionRef}
        pulse={state.activeCaseId !== null}
        stepNumber={1}
        disabled={state.activeCaseId === null}
        onClick={onOpenSpecification}
      >
        기능 명세 보기
      </PrimaryActionButton>
      <section className="start-safety" aria-labelledby="learning-boundary-title">
        <h3 id="learning-boundary-title">학습 범위와 안전</h3>
        <p className="start-safety-summary">실제 권한 없음 · 개인정보 입력 금지 · 저장은 직접 선택합니다.</p>
        <p>이 활동은 가상 학습 모델이며 실제 앱 판정이 아님을 알려 드립니다. 실제 권한을 묻지 않습니다.</p>
        <details className="start-details">
          <summary>학습 범위와 안전 더 보기</summary>
          <p>{NOT_IN_SCOPE_NOTICE}</p>
          <details>
            <summary>교사용 안내</summary>
            <p>{TEACHER_GUIDE_NOTICE}</p>
            <p>{HELP_REQUEST_NOTICE}</p>
          </details>
        </details>
      </section>
      <section className="start-storage" aria-labelledby="save-title">
        <h3 id="save-title">학습 기록</h3>
        <label className="storage-choice">
          <input
            type="checkbox"
            name="saveOnDevice"
            checked={state.saveOnDevice}
            onChange={(event) => onSaveOnDeviceChange(event.target.checked)}
          />
          이 기기에 저장
        </label>
        {state.saveOnDevice ? (
          <p>권한 선택과 근거 문장만 이 기기에 저장 중입니다. 별명과 실제 개인정보는 저장하지 않습니다.</p>
        ) : (
          <p>공용 기기에서는 저장하지 않고 사용 후 기록을 삭제하세요.</p>
        )}
        <details className="start-details">
          <summary>저장 범위와 삭제 방법</summary>
          <p>저장에 동의하면 권한 선택과 근거 원문이 이 기기에 남을 수 있습니다. 별명과 실제 개인정보는 입력하지 마세요.</p>
          <p>공용 기기에서는 저장을 끄고, 아래의 저장 기록 지우기 버튼을 눌러 학습 기록을 삭제하세요.</p>
        </details>
        <button className="secondary-action" type="button" onClick={onLoadSavedProgress}>
          이 기기에 저장한 기록 불러오기
        </button>
        <ActionRequirementHint id={clearHintId} message="이 앱의 전용 학습 기록만 지우며 다른 저장 정보는 건드리지 않습니다." />
        <button className="destructive-action" type="button" aria-describedby={clearHintId} onClick={onClearSavedProgress}>
          저장 기록 지우기
        </button>
      </section>
      {state.statusMessage && <p role="status">{state.statusMessage}</p>}
    </main>
  )
}
