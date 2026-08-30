import type { ReactElement } from 'react'
import type { LabStage } from '../domain/model'

const STAGE_LABELS: Readonly<Record<LabStage, string>> = {
  start: '시작',
  specification: '기능 살펴보기',
  'initial-review': '권한 고르기',
  impact: '영향 비교하기',
  'revision-review': '다시 고르기',
  revocation: '철회 연습',
  report: '학습 보고서',
}

export interface ProgressIndicatorProps {
  stage: LabStage
  completedCaseCount: number
  totalCaseCount: number
}

const STAGE_NUMBERS: Readonly<Record<LabStage, number>> = {
  start: 1,
  specification: 2,
  'initial-review': 3,
  impact: 4,
  'revision-review': 5,
  revocation: 6,
  report: 7,
}

export default function ProgressIndicator({ stage, completedCaseCount, totalCaseCount }: ProgressIndicatorProps): ReactElement {
  return (
    <p className="progress-indicator" role="status" aria-live="polite" aria-atomic="true">
      현재 단계: {STAGE_NUMBERS[stage]}/7 · {STAGE_LABELS[stage]} · 완료한 사례: {completedCaseCount}/{totalCaseCount}
    </p>
  )
}
