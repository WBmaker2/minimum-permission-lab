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
    <header className="app-header">
      <div className="app-header__bar">
        <h1>앱 권한 최소허용 연구소</h1>
        <ProgressIndicator stage={stage} completedCaseCount={completedCaseCount} totalCaseCount={totalCaseCount} />
      </div>
      <LearningModelNotice />
    </header>
  )
}
