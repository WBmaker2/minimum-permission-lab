import type { ReactElement } from 'react'

import { getPermissionDefinition } from '../../content/permissions'
import type { ContractVerdict, LearnerChoice } from '../../domain/model'
import type { FunctionImpact } from '../../domain/buildFunctionImpacts'

export interface FunctionImpactListProps {
  impacts: readonly FunctionImpact[]
}

const VERDICT_LABELS: Readonly<Record<ContractVerdict, string>> = {
  required: '필수',
  unnecessary: '불필요',
  conditional: '조건부',
}

const CHOICE_LABELS: Readonly<Record<LearnerChoice, string>> = {
  'allow-current-feature': '이번 기능에만 허용',
  deny: '허용하지 않음',
  'more-info': '설명을 더 확인',
}

function FunctionList({ title, items }: { title: string; items: readonly string[] }): ReactElement {
  return (
    <section>
      <h5>{title}</h5>
      {items.length > 0 ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p>없음</p>}
    </section>
  )
}

export default function FunctionImpactList({ impacts }: FunctionImpactListProps): ReactElement {
  return (
    <section aria-labelledby="function-impact-list-title">
      <h3 id="function-impact-list-title">권한마다 달라지는 일</h3>
      {impacts.length === 0 ? <p>아직 확인할 권한 선택이 없습니다.</p> : impacts.map((impact) => {
        const permission = getPermissionDefinition(impact.permissionId)
        return (
          <article key={impact.permissionId}>
            <h4>{permission.label} · {VERDICT_LABELS[impact.judgment.verdict]}</h4>
            <p>선택: {CHOICE_LABELS[impact.choice]}</p>
            <FunctionList title="계속 할 수 있는 일" items={impact.availableFunctions} />
            <FunctionList title="제한되는 일" items={impact.limitedFunctions} />
            <section>
              <h5>이 선택의 설명</h5>
              <p>{impact.judgment.feedback}</p>
              <h5>왜 이렇게 판단했을까요?</h5>
              <p>{impact.judgment.contractEvidence}</p>
              <h5>다른 방법</h5>
              <p>{impact.judgment.alternative}</p>
            </section>
          </article>
        )
      })}
    </section>
  )
}
