import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ComponentProps } from 'react'
import type { LabState, PermissionId, RevocationDecision } from '../../domain/model'
import { labReducer } from '../../app/labReducer'
import { createStateWithCompletedCases } from '../../test/fixtures'
import { LabProvider } from '../../app/LabProvider'
import { LabApplication } from '../../app/App'
import RevokeTrainingScreen from './RevokeTrainingScreen'
import { PERMISSION_USE_LOG_ENTRIES } from './PermissionUseLog'

afterEach(cleanup)

const permissionIds: PermissionId[] = ['camera', 'microphone', 'location', 'contacts']

function renderActivity(overrides: Partial<ComponentProps<typeof RevokeTrainingScreen>> = {}) {
  const props: ComponentProps<typeof RevokeTrainingScreen> = {
    eligible: true,
    decisions: {},
    revocationCompleted: false,
    onDecision: vi.fn(),
    onComplete: vi.fn(),
    onOpenReport: vi.fn(),
    onReset: vi.fn(),
    ...overrides,
  }
  return { ...render(<RevokeTrainingScreen {...props} />), props }
}

describe('RevokeTrainingScreen', () => {
  it('does not expose the activity before all four cases are complete', () => {
    const onReset = vi.fn()
    renderActivity({ eligible: false, onReset })

    expect(screen.getByText('네 사례를 먼저 완료해 주세요')).toBeVisible()
    expect(screen.queryByText('가상 사용 기록 예시')).not.toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '권한 철회 연습' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /철회 판단 완료/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '학습 보고서 보기' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '사례 선택으로 돌아가기' })).toBeVisible()
    screen.getByRole('button', { name: '사례 선택으로 돌아가기' }).click()
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('renders exactly four fictional use records with no device controls', () => {
    renderActivity()

    expect(screen.getByRole('heading', { level: 2, name: '권한 철회 미니 활동' })).toBeVisible()
    expect(screen.getByText('가상 사용 기록 예시')).toBeVisible()
    expect(screen.getByText(/실제 기기 권한은 읽거나 바꾸지 않습니다/)).toBeVisible()
    expect(screen.getAllByRole('group')).toHaveLength(4)
    expect(screen.getAllByRole('radio')).toHaveLength(8)
    expect(screen.queryByText(/드래그|끌어/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /설정/ })).not.toBeInTheDocument()
    expect(PERMISSION_USE_LOG_ENTRIES).toHaveLength(4)
  })

  it('uses controlled native radios and announces the virtual decision context', async () => {
    const user = userEvent.setup()
    const onDecision = vi.fn()
    renderActivity({ onDecision })

    const revokeCamera = within(screen.getAllByRole('group')[0]).getByRole('radio', { name: '지금 철회' })
    await user.click(revokeCamera)

    expect(onDecision).toHaveBeenCalledWith({ permissionId: 'camera', action: 'revoke-now' })
    const liveMessage = screen.getAllByRole('status')[0]
    expect(liveMessage).toHaveTextContent('카메라')
    expect(liveMessage).toHaveTextContent('지금 철회')
    expect(liveMessage).toHaveTextContent('가상 학습')
  })

  it('keeps the conditional microphone option valid and requires one revocation', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    const decisions: Partial<Record<PermissionId, RevocationDecision>> = Object.fromEntries(
      permissionIds.map((permissionId) => [permissionId, { permissionId, action: 'keep-current-feature' }]),
    )
    const { props } = renderActivity({ decisions, onComplete })
    const complete = screen.getByRole('button', { name: /철회 판단 완료/ })

    expect(complete).toBeDisabled()
    expect(screen.getByText(/사용하지 않는 권한 하나 이상을 철회/)).toBeVisible()
    await user.click(within(screen.getAllByRole('group')[0]).getByRole('radio', { name: '지금 철회' }))
    const updatedDecisions = { ...decisions, camera: { permissionId: 'camera' as const, action: 'revoke-now' as const } }
    const completeScreen = render(<RevokeTrainingScreen eligible decisions={updatedDecisions} revocationCompleted={false} onDecision={props.onDecision} onComplete={onComplete} onOpenReport={vi.fn()} onReset={vi.fn()} />)
    const updatedComplete = screen.getAllByRole('button', { name: /철회 판단 완료/ })[1]
    expect(updatedComplete).not.toBeDisabled()
    expect(updatedComplete).toHaveClass('gi-pulse')
    expect(props.onDecision).toHaveBeenCalledWith({ permissionId: 'camera', action: 'revoke-now' })
    await user.click(updatedComplete)
    expect(onComplete).toHaveBeenCalledTimes(1)
    completeScreen.unmount()
  })

  it('freezes radio inputs after completion and opens report only then', async () => {
    const user = userEvent.setup()
    const onOpenReport = vi.fn()
    renderActivity({
      revocationCompleted: true,
      decisions: Object.fromEntries(permissionIds.map((permissionId) => [permissionId, { permissionId, action: permissionId === 'microphone' ? 'keep-current-feature' : 'revoke-now' }])) as ComponentProps<typeof RevokeTrainingScreen>['decisions'],
      onOpenReport,
    })

    expect(screen.getAllByRole('radio').every((radio) => (radio as HTMLInputElement).disabled)).toBe(true)
    expect(screen.getByRole('button', { name: /철회 판단 완료/ })).toBeDisabled()
    const reportButton = screen.getByRole('button', { name: '학습 보고서 보기' })
    expect(reportButton).toBeEnabled()
    expect(reportButton).toHaveClass('gi-pulse')
    await user.click(reportButton)
    expect(onOpenReport).toHaveBeenCalledTimes(1)
  })

  it('keeps report unavailable for malformed or ineligible completed props', () => {
    renderActivity({ revocationCompleted: true, decisions: {} })
    expect(screen.getByRole('button', { name: '학습 보고서 보기' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '학습 보고서 보기' })).not.toHaveClass('gi-pulse')
    cleanup()
    renderActivity({
      eligible: false,
      revocationCompleted: true,
      decisions: Object.fromEntries(permissionIds.map((permissionId) => [permissionId, { permissionId, action: 'revoke-now' }])) as ComponentProps<typeof RevokeTrainingScreen>['decisions'],
    })
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '철회 판단 완료' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '학습 보고서 보기' })).not.toBeInTheDocument()
  })

  it('resets an inconsistent revocation stage through the app boundary', async () => {
    const user = userEvent.setup()
    const state: LabState = { ...createStateWithCompletedCases(['photo-scan']), stage: 'revocation', activeCaseId: null }
    render(<LabProvider initialState={state}><LabApplication /></LabProvider>)
    expect(screen.queryByText('가상 사용 기록 예시')).not.toBeInTheDocument()
    expect(screen.getByText('네 사례를 먼저 완료해 주세요')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '사례 선택으로 돌아가기' }))
    expect(screen.getByRole('heading', { level: 2, name: '학습 시작' })).toBeVisible()
  })

  it('supports keyboard Tab and Space for each native decision group', async () => {
    const user = userEvent.setup()
    const onDecision = vi.fn()
    renderActivity({ onDecision })

    await user.tab()
    await user.keyboard(' ')
    expect(onDecision).toHaveBeenCalledWith({ permissionId: 'camera', action: 'keep-current-feature' })
  })
})

describe('reducer-backed revocation flow', () => {
  it('opens only after all four cases, completes with one revoke, and freezes after completion', () => {
    let state: LabState = createStateWithCompletedCases()
    state = labReducer(state, { type: 'OPEN_REVOCATION' })
    expect(state.stage).toBe('revocation')
    for (const permissionId of permissionIds) {
      state = labReducer(state, { type: 'SET_REVOCATION_DECISION', decision: { permissionId, action: permissionId === 'microphone' ? 'keep-current-feature' : 'revoke-now' } })
    }
    state = labReducer(state, { type: 'COMPLETE_REVOCATION' })
    expect(state.revocationCompleted).toBe(true)
    expect(labReducer(state, { type: 'SET_REVOCATION_DECISION', decision: { permissionId: 'camera', action: 'keep-current-feature' } })).toBe(state)
    expect(labReducer(state, { type: 'OPEN_REPORT' }).stage).toBe('report')
  })

  it('rejects malformed runtime actions even when another canonical permission is revoked', () => {
    let state = labReducer(createStateWithCompletedCases(), { type: 'OPEN_REVOCATION' })
    for (const permissionId of permissionIds) {
      state = labReducer(state, { type: 'SET_REVOCATION_DECISION', decision: { permissionId, action: permissionId === 'camera' ? 'revoke-now' : 'keep-current-feature' } })
    }
    const malformed = {
      ...state,
      revocationDecisions: {
        ...state.revocationDecisions,
        microphone: { permissionId: 'microphone' as const, action: 'unexpected-runtime-action' as never },
      },
    }
    expect(labReducer(malformed, { type: 'COMPLETE_REVOCATION' })).toBe(malformed)
    const invalidCompleted = { ...malformed, revocationCompleted: true }
    expect(labReducer(invalidCompleted, { type: 'OPEN_REPORT' })).toBe(invalidCompleted)
  })

  it('rejects completion when a case is incomplete, even with four valid decisions', () => {
    const state = labReducer(createStateWithCompletedCases(['photo-scan', 'voice-reading', 'class-map']), { type: 'OPEN_REVOCATION' })
    const impossibleState: LabState = { ...state, stage: 'revocation' }
    for (const permissionId of permissionIds) {
      impossibleState.revocationDecisions[permissionId] = { permissionId, action: permissionId === 'camera' ? 'revoke-now' : 'keep-current-feature' }
    }
    expect(labReducer(impossibleState, { type: 'COMPLETE_REVOCATION' })).toBe(impossibleState)
  })

  it('does not re-enter revocation after it has already been completed', () => {
    const state: LabState = { ...createStateWithCompletedCases(), revocationCompleted: true, stage: 'start' }
    expect(labReducer(state, { type: 'OPEN_REVOCATION' })).toBe(state)
  })

  it('copies the submitted revocation decision before storing it', () => {
    const state = labReducer(createStateWithCompletedCases(), { type: 'OPEN_REVOCATION' })
    const decision: RevocationDecision = { permissionId: 'camera', action: 'revoke-now' }
    const next = labReducer(state, { type: 'SET_REVOCATION_DECISION', decision })
    decision.action = 'keep-current-feature'
    expect(next.revocationDecisions.camera).toEqual({ permissionId: 'camera', action: 'revoke-now' })
  })
})
