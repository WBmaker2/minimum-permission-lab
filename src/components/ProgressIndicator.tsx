import type { ReactElement } from 'react'
import type { LabStage } from '../domain/model'

const STAGE_LABELS: Readonly<Record<LabStage, string>> = {
  start: '시작',
  specification: '기능 명세',
  'initial-review': '최초 권한 심사',
  impact: '기능 영향 시뮬레이션',
  'revision-review': '수정 권한 심사',
  revocation: '권한 철회 미니 활동',
  report: '학습 보고서',
}

interface ProgressIndicatorProps {
  stage: LabStage
}

export default function ProgressIndicator({ stage }: ProgressIndicatorProps): ReactElement {
  return <p aria-label="현재 단계">현재 단계: {STAGE_LABELS[stage]}</p>
}
