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
    expect(screen.getByText('먼저 네 가지 사례 중 하나를 골라 학습을 시작해 보세요.')).toBeVisible()
    expect(screen.getByText('완료한 사례 1/4')).toBeVisible()
  })
})
