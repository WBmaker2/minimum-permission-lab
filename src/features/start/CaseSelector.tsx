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
    <section aria-labelledby="case-selector-title">
      <h2 id="case-selector-title">사례 선택</h2>
      <div role="list">
        {CASE_ORDER.map((caseId) => {
          const appCase = APP_CASES[caseId]
          const completed = completedCaseIds.includes(caseId)
          return (
            <div key={caseId} role="listitem">
              <button
                type="button"
                aria-pressed={selectedCaseId === caseId}
                disabled={completed}
                onClick={() => onSelect(caseId)}
              >
                {appCase.title}
              </button>
              <p>{appCase.coreFunction}</p>
              {completed && <span>완료</span>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
