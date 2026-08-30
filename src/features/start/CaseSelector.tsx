import type { ReactElement } from 'react'
import { APP_CASES, CASE_ORDER } from '../../content/cases'
import type { CaseId } from '../../domain/model'

export interface CaseSelectorProps {
  completedCaseIds: readonly CaseId[]
  selectedCaseId: CaseId | null
  onSelect: (caseId: CaseId) => void
}

export default function CaseSelector({
  completedCaseIds,
  selectedCaseId,
  onSelect,
}: CaseSelectorProps): ReactElement {
  return (
    <section className="case-selector" aria-labelledby="case-selector-title">
      <h2 id="case-selector-title">사례 선택</h2>
      <p className="case-selector__prompt">네 가지 중 하나를 골라 어떤 권한이 필요한지 살펴봅니다.</p>
      <div className="case-selector__grid" role="list">
        {CASE_ORDER.map((caseId) => {
          const appCase = APP_CASES[caseId]
          const completed = completedCaseIds.includes(caseId)
          const selected = selectedCaseId === caseId
          const cardState = completed ? 'completed' : selected ? 'selected' : 'available'
          const descriptionId = `${caseId}-case-description`
          const statusId = `${caseId}-case-status`
          return (
            <div
              key={caseId}
              className={`case-card case-card--${cardState}`}
              data-case-card
              data-case-state={cardState}
              role="listitem"
            >
              <div className="case-card__header">
                <button
                  type="button"
                  aria-pressed={selected}
                  aria-describedby={`${descriptionId} ${statusId}`}
                  disabled={completed}
                  onClick={() => onSelect(caseId)}
                >
                  {appCase.title}
                </button>
                <span id={statusId} className="case-card__status">
                  {completed ? '완료한 사례' : selected ? '지금 선택한 사례' : '선택 가능'}
                </span>
              </div>
              <p id={descriptionId} className="case-card__description">{appCase.coreFunction}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
