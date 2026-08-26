import { useId, useState, type ReactElement } from 'react'

export interface FictionalAliasPracticeProps {
  examples: readonly string[]
}

export default function FictionalAliasPractice({ examples }: FictionalAliasPracticeProps): ReactElement {
  const instanceId = useId()
  const [alias, setAlias] = useState('')
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
        value={alias}
        aria-describedby={warningId}
        onChange={(event) => setAlias(event.target.value)}
      />
      <p>예시: {examples.map((example) => <span key={example}> {example} </span>)}</p>
      <p id={warningId}>실제 이름·전화번호·주소 등 개인정보를 입력하지 말 것. 입력은 임시 미리보기이며 저장/전송 안 됨.</p>
      {alias && <p>미리보기: {alias}</p>}
    </section>
  )
}
