import type { ReactElement } from 'react'

export interface LearningOverviewProps {
  readonly selectedCase: boolean
  readonly completedCaseCount: number
  readonly totalCaseCount: number
}

export default function LearningOverview({
  selectedCase,
  completedCaseCount,
  totalCaseCount,
}: LearningOverviewProps): ReactElement {
  return (
    <section className="learning-overview" aria-labelledby="learning-overview-title">
      <p className="learning-overview__label">오늘 배울 것</p>
      <h3 id="learning-overview-title">학습 목표</h3>
      <p>기능 설명을 읽고 필요한 권한만 최소한으로 허용할지 생각해 봅니다.</p>
      <p className="learning-overview__next-action" aria-live="polite">
        {selectedCase ? '아래 버튼을 눌러 기능 명세를 확인해 보세요.' : '사례를 골라 시작해 보세요.'}
      </p>
      <p className="learning-overview__progress" aria-live="polite">
        완료한 사례 {completedCaseCount}/{totalCaseCount}
      </p>
    </section>
  )
}
