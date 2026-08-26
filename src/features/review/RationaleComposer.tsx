import { useId, type ReactElement } from 'react'
import type { CaseId, ReasonTagId } from '../../domain/model'

export interface RationaleComposerProps {
  caseId: CaseId
  value: string
  selectedTags: readonly ReasonTagId[]
  onTextChange: (caseId: CaseId, value: string) => void
  onTagToggle: (caseId: CaseId, tagId: ReasonTagId) => void
}

const REASON_TAGS: readonly { id: ReasonTagId; label: string }[] = [
  { id: 'function-connection', label: '기능 연결' },
  { id: 'data-minimization', label: '정보 최소화' },
  { id: 'user-control', label: '사용자 통제' },
  { id: 'respect-others', label: '다른 사람 존중' },
]

export default function RationaleComposer({
  caseId,
  value,
  selectedTags,
  onTextChange,
  onTagToggle,
}: RationaleComposerProps): ReactElement {
  const idPrefix = useId()
  const helpId = `${idPrefix}-help`

  return (
    <section aria-labelledby={`${idPrefix}-title`}>
      <h3 id={`${idPrefix}-title`}>수정한 이유 기록</h3>
      <label htmlFor={`${idPrefix}-text`}>내 판단 근거</label>
      <textarea
        id={`${idPrefix}-text`}
        value={value}
        rows={4}
        aria-describedby={helpId}
        onChange={(event) => onTextChange(caseId, event.target.value)}
      />
      <p id={helpId}>
        실제 이름·전화번호·주소 등 개인정보를 입력하지 마세요. 이 문장은 AI나 키워드로 채점하지 않으며, 입력한 원문을 바꾸지 않습니다.
      </p>
      <p>문장틀: 나는 [기능]을 위해 [권한]을 [선택]하겠습니다. 그 이유는 [근거]이며, 필요하지 않을 때는 [대안 또는 철회]하겠습니다.</p>
      <div role="group" aria-labelledby={`${idPrefix}-tags-title`}>
        <h4 id={`${idPrefix}-tags-title`}>판단 근거 태그</h4>
        {REASON_TAGS.map(({ id, label }) => {
          const checkboxId = `${idPrefix}-${id}`
          return (
            <label key={id} htmlFor={checkboxId}>
              <input
                id={checkboxId}
                type="checkbox"
                checked={selectedTags.includes(id)}
                onChange={() => onTagToggle(caseId, id)}
              />
              {label}
            </label>
          )
        })}
      </div>
    </section>
  )
}
