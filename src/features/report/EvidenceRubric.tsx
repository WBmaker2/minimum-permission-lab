import { useId, type ReactElement } from 'react'
import type { ReasonTagId, ReportCaseResult } from '../../domain/model'

export interface EvidenceRubricProps {
  readonly evidence: ReportCaseResult['rubricEvidence']
}

const RUBRIC_LABELS: Readonly<Record<ReasonTagId, string>> = {
  'function-connection': '기능 연결',
  'data-minimization': '정보 최소화',
  'user-control': '사용자 통제',
  'respect-others': '다른 사람 존중',
}

const RUBRIC_ORDER: readonly ReasonTagId[] = ['function-connection', 'data-minimization', 'user-control', 'respect-others']

export default function EvidenceRubric({ evidence }: EvidenceRubricProps): ReactElement {
  const titleId = `${useId()}-evidence-rubric-title`
  return (
    <section aria-labelledby={titleId}>
      <h4 id={titleId}>근거 차원 확인</h4>
      <ul>
        {RUBRIC_ORDER.map((tagId) => {
          const sufficient = evidence[tagId] === 'sufficient'
          return <li key={tagId}><span>{RUBRIC_LABELS[tagId]}</span> <span>{sufficient ? '● 근거 있음' : '△ 근거 보완'}</span></li>
        })}
      </ul>
    </section>
  )
}
