import type { ReactElement } from 'react'
import { LEARNING_MODEL_DETAILS, LEARNING_MODEL_SUMMARY } from '../content/learningNotices'

export default function LearningModelNotice(): ReactElement {
  return (
    <div className="learning-model-notice" role="note">
      <p className="learning-model-notice__title">가상 학습 모델</p>
      <p className="learning-model-notice__summary">{LEARNING_MODEL_SUMMARY}</p>
      <details className="learning-model-notice__details">
        <summary>자세히 보기</summary>
        <p>{LEARNING_MODEL_DETAILS}</p>
      </details>
    </div>
  )
}
