import type { ReactElement } from 'react'
import type { LabStage } from '../domain/model'
import ProgressIndicator from './ProgressIndicator'
import LearningModelNotice from './LearningModelNotice'

interface AppHeaderProps {
  stage: LabStage
  completedCaseCount: number
  totalCaseCount: number
}

export default function AppHeader({ stage, completedCaseCount, totalCaseCount }: AppHeaderProps): ReactElement {
  return (
    <header>
      <h1>앱 권한 최소허용 연구소</h1>
      <ProgressIndicator stage={stage} completedCaseCount={completedCaseCount} totalCaseCount={totalCaseCount} />
      <p>
        <span>가상 학습 모델</span>
      </p>
      <LearningModelNotice />
    </header>
  )
}
