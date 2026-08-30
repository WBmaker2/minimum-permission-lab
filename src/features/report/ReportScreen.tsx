import { useState, type ReactElement } from 'react'
import { APP_CASES, CASE_ORDER } from '../../content/cases'
import { getPermissionDefinition } from '../../content/permissions'
import PermissionGlyph from '../../components/PermissionGlyph'
import type { LabReport, PermissionId } from '../../domain/model'
import DecisionComparisonTable from './DecisionComparisonTable'
import EvidenceRubric from './EvidenceRubric'
import CompletionSummary from './CompletionSummary'

export interface ReportScreenProps {
  readonly report: LabReport
  readonly onPrint: () => void
  readonly onReset: () => void
}

export default function ReportScreen({ report, onPrint, onReset }: ReportScreenProps): ReactElement {
  const [statusMessage, setStatusMessage] = useState('')
  const reset = () => {
    if (window.confirm('처음부터 다시 하면 지금까지의 학습 기록이 모두 지워집니다. 처음부터 시작하시겠습니까?')) onReset()
  }
  return (
    <main>
      <h2 data-stage-heading tabIndex={-1}>최소 권한 학습 보고서</h2>
      <p role="note">가상 학습 모델이며 실제 앱 판정이 아님</p>
      <p>네 사례에서 처음 세운 권한안과 수정한 권한안을 나란히 돌아봅니다. 이 기록은 추천 점수나 실제 안전 판정이 아닙니다.</p>
      <CompletionSummary report={report} />
      {CASE_ORDER.map((caseId) => {
        const result = report.cases.find((item) => item.caseId === caseId)
        if (!result) return null
        const appCase = APP_CASES[caseId]
        return (
          <article key={caseId} data-report-case aria-labelledby={`${caseId}-report-title`}>
            <h3 id={`${caseId}-report-title`}>{appCase.title}</h3>
            <DecisionComparisonTable initial={result.initial} revised={result.revised} changedPermissionIds={result.changedPermissionIds} />
            <p>다음 행동: <span>{result.controlAction === 'alternative' ? '대안 사용' : '권한 철회'}</span> · <span>{result.controlAction === 'alternative' ? '통제 후 허용' : '허용하지 않기'}</span></p>
            <EvidenceRubric evidence={result.rubricEvidence} />
            <h4>내가 기록한 수정 이유</h4>
            <blockquote>{result.rationaleText}</blockquote>
          </article>
        )
      })}
      <section aria-labelledby="revoked-permissions-title">
        <h3 id="revoked-permissions-title">공통 철회 권한</h3>
        {report.revokedPermissionIds.length > 0 ? <ul>{report.revokedPermissionIds.map((permissionId: PermissionId) => {
          const definition = getPermissionDefinition(permissionId)
          return <li key={permissionId}><PermissionGlyph permissionId={permissionId} /><span>{definition.label}</span><span aria-hidden="true"> · 모양: {definition.shapeLabel}</span><span> · 권한 철회</span></li>
        })}</ul> : <p>철회한 권한 없음</p>}
      </section>
      <section className="report-next-actions" aria-labelledby="report-next-actions-title">
        <h3 id="report-next-actions-title">다음 학습 행동</h3>
        <p><strong>인쇄해 수업에서 함께 돌아보기:</strong> 처음 선택과 수정 선택을 비교하며 이유를 설명해 보세요.</p>
        <p><strong>다시 시작해 다른 사례를 연습하기:</strong> 다른 기능에서도 필요한 권한만 남길 수 있는지 살펴보세요.</p>
        <div className="report-next-actions__buttons">
          <button type="button" onClick={() => { onPrint(); setStatusMessage('보고서를 인쇄하도록 요청했습니다.') }}>보고서 인쇄</button>
          <button type="button" onClick={reset}>처음부터 다시 하기</button>
        </div>
        <p role="status" aria-live="polite" className="report-status">{statusMessage}</p>
      </section>
    </main>
  )
}
