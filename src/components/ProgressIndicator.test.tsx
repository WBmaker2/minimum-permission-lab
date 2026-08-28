import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import ProgressIndicator from './ProgressIndicator'

describe('ProgressIndicator', () => {
  it('shows the learner-friendly stage and completed case progress in one polite live status', () => {
    render(<ProgressIndicator stage="specification" completedCaseCount={1} totalCaseCount={4} />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('현재 단계: 2/7 · 기능 살펴보기')
    expect(status).toHaveTextContent('완료한 사례: 1/4')
    expect(status).toHaveAttribute('aria-live', 'polite')
  })
})
