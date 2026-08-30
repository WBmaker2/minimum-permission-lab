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
      <h3 id={`${idPrefix}-title`}>고른 이유를 써 보세요</h3>
      <label htmlFor={`${idPrefix}-text`}>내가 고른 이유</label>
      <textarea
        id={`${idPrefix}-text`}
        value={value}
        rows={4}
        maxLength={240}
        aria-describedby={helpId}
        onChange={(event) => onTextChange(caseId, event.target.value)}
      />
      <p>남은 글자 수: {Math.max(0, 240 - value.length)}자</p>
      <p id={helpId}>실제 이름·전화번호·주소는 쓰지 마세요. 저장 동의를 켜면 입력한 문장이 이 기기에 남을 수 있습니다.</p>
      <p>이 문장은 자동으로 채점하지 않습니다. 입력한 글을 그대로 보관할 수 있습니다.</p>
      <p>문장 도움말: 나는 [기능]을 위해 [권한]을 [선택]하겠습니다. 그 이유는 [근거]이며, 필요하지 않을 때는 [대안 또는 철회]하겠습니다.</p>
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
