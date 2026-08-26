import type { ReactElement } from 'react'
import type { LabStage } from '../domain/model'
import ProgressIndicator from './ProgressIndicator'
import LearningModelNotice from './LearningModelNotice'

interface AppHeaderProps {
  stage: LabStage
}

export default function AppHeader({ stage }: AppHeaderProps): ReactElement {
  return (
    <header>
      <h1>앱 권한 최소허용 연구소</h1>
      <ProgressIndicator stage={stage} />
      <p>
        <span role="status">가상 학습 모델</span>
      </p>
      <LearningModelNotice />
    </header>
  )
}
