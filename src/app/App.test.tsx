import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from './App'
import { createInitialLabState } from './labReducer'
import { LabProvider } from './LabProvider'
import { LabApplication } from './App'
import type { LabState } from '../domain/model'
import { PROGRESS_STORAGE_KEY } from '../storage/progressStorage'

afterEach(cleanup)

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

  it('routes case selection to specification and then initial review', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /사진 스캔 과제함/ }))
    await user.click(screen.getByRole('button', { name: /기능 명세 보기/ }))
    expect(screen.getByRole('heading', { level: 2, name: '사진 스캔 과제함' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: /권한 심사 시작/ }))
    expect(screen.getByRole('heading', { level: 2, name: '최초 권한 심사' })).toBeVisible()
  })

  it('keeps the app header visible and wires save/load through the provider', async () => {
    const user = userEvent.setup()
    const initialState = createInitialLabState()
    const savedState: LabState = {
      ...initialState,
      stage: 'specification',
      activeCaseId: 'photo-scan',
    }
    const storage = {
      getItem: vi.fn((key: string) => key === PROGRESS_STORAGE_KEY ? JSON.stringify({ version: 1, state: { ...savedState, statusMessage: undefined } }) : null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }
    render(
      <LabProvider storage={storage} initialState={initialState}>
        <LabApplication />
      </LabProvider>,
    )
    expect(screen.getByRole('heading', { level: 1, name: '앱 권한 최소허용 연구소' })).toBeVisible()
    await user.click(screen.getByRole('checkbox', { name: '이 기기에 저장' }))
    expect(screen.getByRole('checkbox', { name: '이 기기에 저장' })).toBeChecked()
    expect(storage.setItem).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: '이 기기에 저장한 기록 불러오기' }))
    expect(storage.getItem).toHaveBeenCalledTimes(1)
    expect(storage.getItem).toHaveBeenCalledWith(PROGRESS_STORAGE_KEY)
    expect(storage.setItem).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('heading', { level: 2, name: '사진 스캔 과제함' })).toBeVisible()
  })

  it('recovers from a specification state without an active case', async () => {
    const user = userEvent.setup()
    const state = { ...createInitialLabState(), stage: 'specification' as const, activeCaseId: null }
    render(<LabProvider initialState={state}><LabApplication /></LabProvider>)
    expect(screen.getByRole('heading', { level: 2, name: '사례를 다시 선택해 주세요' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: '사례 선택으로 돌아가기' }))
    expect(screen.getByRole('heading', { level: 2, name: '학습 시작' })).toBeVisible()
  })

  it('recovers from an invalid active case id instead of showing a report', async () => {
    const user = userEvent.setup()
    const state = { ...createInitialLabState(), stage: 'specification' as const, activeCaseId: 'invalid-case' as LabState['activeCaseId'] }
    render(<LabProvider initialState={state}><LabApplication /></LabProvider>)
    expect(screen.getByRole('heading', { level: 2, name: '사례를 다시 선택해 주세요' })).toBeVisible()
    expect(screen.queryByRole('heading', { level: 2, name: '학습 보고서' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '사례 선택으로 돌아가기' }))
    expect(screen.getByRole('heading', { level: 2, name: '학습 시작' })).toBeVisible()
  })

  it('keeps the current stage to at most one emphasized next action', () => {
    const stageStates: LabState[] = [
      createInitialLabState(),
      { ...createInitialLabState(), activeCaseId: 'photo-scan', stage: 'specification' },
      { ...createInitialLabState(), activeCaseId: 'photo-scan', stage: 'initial-review' },
      { ...createInitialLabState(), activeCaseId: 'photo-scan', stage: 'impact' },
      { ...createInitialLabState(), activeCaseId: 'photo-scan', stage: 'revision-review' },
      { ...createInitialLabState(), stage: 'revocation' },
    ]

    for (const state of stageStates) {
      const view = render(<LabProvider initialState={state}><LabApplication /></LabProvider>)
      expect(view.container.querySelectorAll('.gi-pulse').length).toBeLessThanOrEqual(1)
      cleanup()
    }
  })
})
