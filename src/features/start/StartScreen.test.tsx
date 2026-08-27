import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { createInitialLabState } from '../../app/labReducer'
import { createStateWithCompletedCases } from '../../test/fixtures'
import type { CaseId } from '../../domain/model'
import { CASE_ORDER } from '../../content/cases'
import StartScreen from './StartScreen'

afterEach(cleanup)

describe('StartScreen', () => {
  const props = () => ({
    state: createInitialLabState(),
    onSelectCase: vi.fn<(caseId: CaseId) => void>(),
    onOpenSpecification: vi.fn(),
    onSaveOnDeviceChange: vi.fn(),
    onLoadSavedProgress: vi.fn(),
  })

  it('shows goal, boundaries, teacher guidance and all four cases', () => {
    render(<StartScreen {...props()} />)
    expect(screen.getByText(/필요한 권한만 최소한으로 허용/)).toBeVisible()
    expect(screen.getByText(/실제 앱 판정이 아님/)).toBeVisible()
    expect(screen.getByText(/다루지 않습니다/)).toBeVisible()
    expect(screen.getByText('교사용 안내')).toBeVisible()
    expect(screen.getByText(/권한 선택이 어렵거나/)).toBeInTheDocument()
    for (const caseId of CASE_ORDER) expect(screen.getByRole('button', { name: new RegExp(caseId === 'photo-scan' ? '사진 스캔 과제함' : caseId === 'voice-reading' ? '음성 읽기 연습' : caseId === 'class-map' ? '교실 지도 안내' : '모둠 알림판') })).toBeVisible()
  })

  it('selects a case, marks completed cases, and enables one primary action', async () => {
    const user = userEvent.setup()
    const p = props()
    p.state = createStateWithCompletedCases(['photo-scan'])
    const view = render(<StartScreen {...p} />)
    expect(screen.getByText('완료')).toBeVisible()
    const start = screen.getByRole('button', { name: '기능 명세 보기' })
    expect(start).toBeDisabled()
    expect(start).not.toHaveClass('gi-pulse')
    expect(view.container.querySelectorAll('.gi-pulse')).toHaveLength(0)
    await user.click(screen.getByRole('button', { name: /음성 읽기 연습/ }))
    expect(p.onSelectCase).toHaveBeenCalledWith('voice-reading')
    view.rerender(<StartScreen {...p} state={{ ...p.state, activeCaseId: 'voice-reading' }} />)
    const selectedStart = screen.getByRole('button', { name: '기능 명세 보기' })
    expect(selectedStart).toBeEnabled()
    expect(selectedStart).toHaveClass('gi-pulse')
    expect(view.container.querySelectorAll('.gi-pulse')).toHaveLength(1)
    expect(selectedStart.querySelector('.gi-pulse__step')?.textContent).toBe('단계 1')
  })

  it('controls explicit save/load actions and selected state', async () => {
    const user = userEvent.setup()
    const p = props()
    const view = render(<StartScreen {...p} />)
    const checkbox = screen.getByRole('checkbox', { name: '이 기기에 저장' })
    await user.click(checkbox)
    expect(p.onSaveOnDeviceChange).toHaveBeenCalledWith(true)
    await user.click(screen.getByRole('button', { name: '이 기기에 저장한 기록 불러오기' }))
    expect(p.onLoadSavedProgress).toHaveBeenCalledOnce()
    await user.click(screen.getByRole('button', { name: /사진 스캔 과제함/ }))
    view.rerender(<StartScreen {...p} state={{ ...p.state, activeCaseId: 'photo-scan' }} />)
    expect(screen.getByRole('button', { name: /사진 스캔 과제함/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/공용 기기에서는 저장하지 않고/)).toBeVisible()
  })
})
