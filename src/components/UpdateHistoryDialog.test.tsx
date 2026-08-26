import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App, { LabApplication } from '../app/App'
import { createInitialLabState } from '../app/labReducer'
import { LabProvider } from '../app/LabProvider'
import type { LabStage } from '../domain/model'
import { UPDATE_HISTORY } from '../content/updateHistory'
import UpdateHistoryButton from './UpdateHistoryButton'
import UpdateHistoryDialog from './UpdateHistoryDialog'

const originalInnerWidth = window.innerWidth

afterEach(() => {
  cleanup()
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth })
})

function ControlledHistory() {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  return (
    <>
      <UpdateHistoryButton ref={triggerRef} onOpen={() => setOpen(true)} />
      {open ? <UpdateHistoryDialog entries={UPDATE_HISTORY} onClose={() => setOpen(false)} returnFocusRef={triggerRef} /> : null}
    </>
  )
}

describe('UpdateHistoryDialog', () => {
  it('provides a small shell trigger and an accessible dated history dialog', async () => {
    const user = userEvent.setup()
    render(<ControlledHistory />)

    const trigger = screen.getByRole('button', { name: '업데이트 내역' })
    expect(trigger).toBeVisible()
    expect(trigger).toHaveClass('update-history-trigger')
    await user.click(trigger)

    const dialog = screen.getByRole('dialog', { name: '업데이트 내역' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('4개 사례 MVP 학습 흐름 구현')).toBeVisible()
    expect(screen.getByText('실제 앱이나 운영체제에 그대로 일반화하지 않도록 경계를 명시함')).toBeVisible()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '업데이트 내역 닫기' }))
  })

  it('keeps the trigger in normal flow and aligned safely at 375px', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 })
    render(<UpdateHistoryButton onOpen={vi.fn()} />)

    const area = screen.getByTestId('update-history-trigger-area')
    const trigger = screen.getByRole('button', { name: '업데이트 내역' })
    expect(area).toHaveClass('update-history-trigger-area')
    expect(area).toHaveStyle({ display: 'flex', justifyContent: 'flex-end', width: '100%', boxSizing: 'border-box', position: 'static' })
    expect(area).toHaveStyle({ padding: '0.75rem 1rem' })
    expect(trigger).toHaveStyle({ maxWidth: '100%' })
    expect(getComputedStyle(area).position).not.toBe('fixed')
    expect(getComputedStyle(area).position).not.toBe('absolute')
    expect(getComputedStyle(area).position).not.toBe('sticky')
  })

  it('keeps dialog focus after an unrelated app-shell rerender', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '업데이트 내역' }))
    const close = screen.getByRole('button', { name: '업데이트 내역 닫기' })
    await user.tab()
    const confirm = screen.getByRole('button', { name: '확인' })
    expect(document.activeElement).toBe(confirm)

    fireEvent.click(screen.getByRole('button', { name: /사진 스캔 과제함/ }))
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(document.activeElement).not.toBe(close)
    expect(document.activeElement).toBe(confirm)
  })

  it('closes with Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<ControlledHistory />)
    const trigger = screen.getByRole('button', { name: '업데이트 내역' })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(trigger)
  })

  it('traps Tab and Shift+Tab within dialog controls', async () => {
    const user = userEvent.setup()
    render(<ControlledHistory />)
    await user.click(screen.getByRole('button', { name: '업데이트 내역' }))
    const close = screen.getByRole('button', { name: '업데이트 내역 닫기' })
    const last = screen.getByRole('button', { name: '확인' })

    expect(document.activeElement).toBe(close)
    await user.tab()
    expect(document.activeElement).toBe(last)
    await user.tab()
    expect(document.activeElement).toBe(close)
    await user.tab({ shift: true })
    expect(document.activeElement).toBe(last)
  })

  it('closes through the explicit close action', async () => {
    const user = userEvent.setup()
    render(<ControlledHistory />)
    await user.click(screen.getByRole('button', { name: '업데이트 내역' }))
    await user.click(screen.getByRole('button', { name: '업데이트 내역 닫기' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the trigger in the app shell before and after choosing a case', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('button', { name: '업데이트 내역' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: /사진 스캔 과제함/ }))
    expect(screen.getByRole('button', { name: '업데이트 내역' })).toBeVisible()
  })

  it.each([
    ['start', { stage: 'start', activeCaseId: null }],
    ['specification', { stage: 'specification', activeCaseId: 'photo-scan' }],
    ['initial-review', { stage: 'initial-review', activeCaseId: 'photo-scan' }],
    ['impact', { stage: 'impact', activeCaseId: 'photo-scan' }],
    ['revision-review', { stage: 'revision-review', activeCaseId: 'photo-scan' }],
    ['revocation', { stage: 'revocation', activeCaseId: null }],
    ['report', { stage: 'report', activeCaseId: null }],
  ] as const)('%s stage keeps the update-history trigger in the app shell', (stage, fixture) => {
    const initialState = { ...createInitialLabState(), ...fixture, stage: fixture.stage as LabStage }
    render(<LabProvider initialState={initialState}><LabApplication /></LabProvider>)
    expect(screen.getByRole('button', { name: '업데이트 내역' })).toBeVisible()
  })

  it('calls onOpen exactly once for a trigger click', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<UpdateHistoryButton onOpen={onOpen} />)
    await user.click(screen.getByRole('button', { name: '업데이트 내역' }))
    expect(onOpen).toHaveBeenCalledOnce()
  })
})
