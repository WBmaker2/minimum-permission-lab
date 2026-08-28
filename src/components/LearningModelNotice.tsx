import type { ReactElement } from 'react'
import { LEARNING_MODEL_DETAILS, LEARNING_MODEL_SUMMARY } from '../content/learningNotices'

export default function LearningModelNotice(): ReactElement {
  return (
    <>
      <p>{LEARNING_MODEL_SUMMARY}</p>
      <details>
        <summary>자세히 보기</summary>
        <p>{LEARNING_MODEL_DETAILS}</p>
      </details>
    </>
  )
}
