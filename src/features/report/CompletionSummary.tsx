import { useId, type ReactElement } from 'react'
import type { LabReport } from '../../domain/model'

export interface CompletionSummaryProps {
  readonly report: LabReport
}

export default function CompletionSummary({ report }: CompletionSummaryProps): ReactElement {
  const titleId = `${useId()}-completion-summary-title`
  const completedCount = report.cases.length
  const changedCaseCount = report.cases.filter((result) => result.changedPermissionIds.length > 0).length
  const changedPermissionCount = report.cases.reduce((count, result) => count + result.changedPermissionIds.length, 0)
  const alternativesCount = report.cases.filter((result) => result.controlAction === 'alternative').length
  const revocationCount = report.revokedPermissionIds.length

  return (
    <section aria-labelledby={titleId}>
      <h3 id={titleId}>네 사례 완료 요약</h3>
      <dl>
        <div><dt>완료한 사례</dt><dd>{completedCount} / 4</dd></div>
        <div><dt>판단이 바뀐 사례</dt><dd>{changedCaseCount}개</dd></div>
        <div><dt>바뀐 권한 선택</dt><dd>{changedPermissionCount}개</dd></div>
        <div><dt>대안을 사용한 사례</dt><dd>{alternativesCount}개</dd></div>
        <div><dt>철회한 권한</dt><dd>{revocationCount}개</dd></div>
      </dl>
      <p>판단이 바뀐 것은 배움의 증거예요</p>
      <p>최초안과 수정안의 차이는 각 사례 비교표의 판단 변경 표시로 확인할 수 있습니다.</p>
    </section>
  )
}
