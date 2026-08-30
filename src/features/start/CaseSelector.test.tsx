import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CASE_ORDER } from '../../content/cases'
import type { CaseId } from '../../domain/model'
import CaseSelector from './CaseSelector'

afterEach(cleanup)

describe('CaseSelector', () => {
  it('shows selected, completed, and available states without relying on color', () => {
    render(
      <CaseSelector
        completedCaseIds={['voice-reading']}
        selectedCaseId="photo-scan"
        onSelect={vi.fn<(caseId: CaseId) => void>()}
      />,
    )

    const selectedCard = screen.getByRole('button', { name: '사진 스캔 과제함' }).closest('[data-case-card]')
    const completedCard = screen.getByRole('button', { name: '음성 읽기 연습' }).closest('[data-case-card]')
    const availableCard = screen.getByRole('button', { name: '교실 지도 안내' }).closest('[data-case-card]')

    expect(selectedCard).toHaveAttribute('data-case-state', 'selected')
    expect(withinText(selectedCard)).toContain('지금 선택한 사례')
    expect(completedCard).toHaveAttribute('data-case-state', 'completed')
    expect(withinText(completedCard)).toContain('완료한 사례')
    expect(availableCard).toHaveAttribute('data-case-state', 'available')
    expect(withinText(availableCard)).toContain('선택 가능')
    expect(screen.getByRole('button', { name: '음성 읽기 연습' })).toBeDisabled()
    expect(CASE_ORDER).toHaveLength(4)
  })
})

function withinText(element: Element | null): string {
  return element?.textContent ?? ''
}
