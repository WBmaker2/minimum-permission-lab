import { useId, type ChangeEvent, type ReactElement } from 'react'

export interface FictionalAliasPracticeProps {
  examples: readonly string[]
  value: string
  onChange: (value: string) => void
  onUseExample: (example: string) => void
}

export default function FictionalAliasPractice({ examples, value, onChange, onUseExample }: FictionalAliasPracticeProps): ReactElement {
  const instanceId = useId()
  const titleId = `alias-practice-title-${instanceId}`
  const inputId = `fictional-alias-${instanceId}`
  const warningId = `alias-practice-warning-${instanceId}`

  return (
    <section aria-labelledby={titleId}>
      <h3 id={titleId}>가상 별명 연습</h3>
      <label htmlFor={inputId}>가상 별명 연습</label>
      <input
        id={inputId}
        type="text"
        autoComplete="off"
        maxLength={12}
        value={value}
        aria-describedby={warningId}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      />
      <p>12자 이내의 가상 별명을 입력하세요. 예시를 눌러도 안전한 연습용 값만 채워집니다.</p>
      <div aria-label="가상 별명 예시">
        {examples.map((example) => (
          <button key={example} type="button" onClick={() => onUseExample(example)}>
            예시 사용: <span>{example}</span>
          </button>
        ))}
      </div>
      <p id={warningId}>실제 이름·전화번호·주소 등 개인정보를 입력하지 말 것. 입력은 임시 미리보기이며 저장/전송 안 됨.</p>
      {value && <p>미리보기: {value}</p>}
    </section>
  )
}
