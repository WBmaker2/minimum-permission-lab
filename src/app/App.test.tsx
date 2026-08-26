import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App smoke shell', () => {
  it('shows the learning lab title and virtual-model notice', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '앱 권한 최소허용 연구소',
      }),
    ).toBeVisible()
    expect(screen.getByText('가상 학습 모델')).toBeVisible()
  })
})
