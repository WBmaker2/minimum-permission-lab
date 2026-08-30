import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import LearningOverview from './LearningOverview'

afterEach(cleanup)

describe('LearningOverview', () => {
  it('gives a learner the first action and progress in short language', () => {
    render(<LearningOverview selectedCase={false} completedCaseCount={1} totalCaseCount={4} />)
    expect(screen.getByRole('heading', { name: '학습 목표' })).toBeVisible()
    expect(screen.getByText('오늘 배울 것')).toBeVisible()
    expect(screen.getByText(/필요한 권한만 최소한으로 허용/)).toBeVisible()
    expect(screen.getByText('사례를 골라 시작해 보세요.')).toBeVisible()
    expect(screen.getByText('사례를 골라 시작해 보세요.')).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByText('완료한 사례 1/4')).toBeVisible()
  })

  it('announces the next action after a case is selected', () => {
    render(<LearningOverview selectedCase completedCaseCount={1} totalCaseCount={4} />)
    const nextAction = screen.getByText('아래 버튼을 눌러 기능 명세를 확인해 보세요.')
    expect(nextAction).toBeVisible()
    expect(nextAction).toHaveAttribute('aria-live', 'polite')
  })
})
