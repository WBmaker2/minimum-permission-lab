import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { createRef } from 'react'

import PrimaryActionButton from './PrimaryActionButton'

afterEach(cleanup)

describe('PrimaryActionButton', () => {
  it('forwards a native button ref while preserving the step and pulse contract', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<PrimaryActionButton ref={ref} pulse stepNumber={4}>다음 단계</PrimaryActionButton>)

    const button = screen.getByRole('button', { name: '다음 단계' })
    expect(ref.current).toBe(button)
    expect(button).toHaveAttribute('data-step', '4')
    expect(button).toHaveClass('gi-pulse')
  })
})
