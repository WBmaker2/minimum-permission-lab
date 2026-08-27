import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useReducer } from 'react'

import { APP_CASES } from '../../content/cases'
import { createInitialLabState, labReducer } from '../../app/labReducer'
import type { CaseProgress, LabState } from '../../domain/model'
import ImpactScreen from './ImpactScreen'

afterEach(cleanup)

function progress(overrides: Partial<CaseProgress> = {}): CaseProgress {
  return { ...createInitialLabState().caseProgress['class-map'], ...overrides }
}

function renderImpact(overrides: Partial<React.ComponentProps<typeof ImpactScreen>> = {}) {
  const props: React.ComponentProps<typeof ImpactScreen> = {
    appCase: APP_CASES['class-map'],
    progress: progress({
      initialDecisions: { location: { permissionId: 'location', choice: 'deny' } },
      impactViewed: true,
    }),
    onFeatureSwitchChange: vi.fn(),
    onAcknowledgeCondition: vi.fn(),
    onControlActionChange: vi.fn(),
    onBeginRevision: vi.fn(),
    ...overrides,
  }
  return { ...render(<ImpactScreen {...props} />), props }
}

function controlledImpactState(): LabState {
  const initial = createInitialLabState()
  const mapProgress = initial.caseProgress['class-map']
  return {
    ...initial,
    stage: 'impact',
    activeCaseId: 'class-map',
    caseProgress: {
      ...initial.caseProgress,
      'class-map': {
        ...mapProgress,
        initialDecisions: { location: { permissionId: 'location', choice: 'allow-current-feature' } },
        impactViewed: true,
      },
    },
  }
}

function renderControlledImpact(onBeginRevision = vi.fn()) {
  function ControlledImpact() {
    const [state, dispatch] = useReducer(labReducer, undefined, controlledImpactState)
    const progress = state.caseProgress['class-map']
    return (
      <>
        <ImpactScreen
          appCase={APP_CASES['class-map']}
          progress={progress}
          onFeatureSwitchChange={(caseId, switchId, enabled) => dispatch({ type: 'SET_FEATURE_SWITCH', caseId, switchId, enabled })}
          onAcknowledgeCondition={(caseId, conditionId) => dispatch({ type: 'ACKNOWLEDGE_CONDITION', caseId, conditionId })}
          onControlActionChange={(caseId, action) => dispatch({ type: 'SET_CONTROL_ACTION', caseId, action })}
          onBeginRevision={() => {
            onBeginRevision()
            dispatch({ type: 'OPEN_IMPACT' })
          }}
        />
        <span data-testid="controlled-stage">{state.stage}</span>
      </>
    )
  }
  return render(<ControlledImpact />)
}

describe('ImpactScreen', () => {
  it('shows available, limited, neutral feedback, evidence, and alternatives', () => {
    renderImpact()
    expect(screen.getByRole('heading', { level: 2, name: '기능 영향 시뮬레이션' })).toBeVisible()
    expect(screen.getByText(/가상 학습 모델/)).toBeVisible()
    expect(screen.getByText('사용 가능한 기능')).toBeVisible()
    expect(screen.getByText('제한되는 기능')).toBeVisible()
    expect(screen.getAllByText('판정 근거').length).toBeGreaterThan(0)
    expect(screen.getAllByText('대안').length).toBeGreaterThan(0)
    expect(screen.queryByText(/틀렸|정답|위험하니 반드시/)).not.toBeInTheDocument()
  })

  it('runs the real reducer-backed switch, comparison, control, and revision flow', async () => {
    const user = userEvent.setup()
    const onBeginRevision = vi.fn()
    renderControlledImpact(onBeginRevision)
    const switchControl = screen.getByRole('checkbox', { name: '학습용 내 위치 표시 기능 켜기' })
    expect(switchControl).not.toBeChecked()
    expect(screen.getByRole('heading', { name: /위치 · 불필요/ })).toBeVisible()
    expect(screen.getByRole('button', { name: '비교 확인' })).toBeDisabled()
    await user.click(switchControl)
    expect(switchControl).toBeChecked()
    expect(screen.getByRole('heading', { name: /위치 · 조건부/ })).toBeVisible()
    expect(screen.getByText('학습용 내 위치 표시')).toBeVisible()
    expect(screen.getAllByRole('status')[0]).toHaveTextContent('스위치를 켰습니다')
    const compare = screen.getByRole('button', { name: '비교 확인' })
    expect(compare).toBeEnabled()
    await user.click(compare)
    expect(screen.getByRole('button', { name: '비교 확인 완료' })).toBeDisabled()
    expect(screen.getAllByRole('status')[0]).toHaveTextContent('조건 비교를 확인했습니다')
    const revisionButton = screen.getByRole('button', { name: '최소 권한안 수정' })
    expect(revisionButton).toBeDisabled()
    expect(revisionButton).not.toHaveClass('gi-pulse')
    await user.click(screen.getByRole('radio', { name: '대안 사용' }))
    expect(revisionButton).toBeEnabled()
    expect(revisionButton).toHaveClass('gi-pulse')
    expect(screen.getAllByRole('button').filter((button) => button.classList.contains('gi-pulse'))).toHaveLength(1)
    await user.click(switchControl)
    expect(switchControl).not.toBeChecked()
    expect(revisionButton).toBeDisabled()
    await user.click(switchControl)
    expect(switchControl).toBeChecked()
    const recheck = screen.getByRole('button', { name: '비교 확인' })
    expect(recheck).toBeEnabled()
    await user.click(recheck)
    expect(screen.getByRole('button', { name: '비교 확인 완료' })).toBeDisabled()
    expect(revisionButton).toBeEnabled()
    await user.click(revisionButton)
    expect(onBeginRevision).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('controlled-stage')).toHaveTextContent('revision-review')
  })

  it('calls acknowledgement once and gates revision on action and all scenarios', async () => {
    const user = userEvent.setup()
    const onAcknowledgeCondition = vi.fn()
    const onControlActionChange = vi.fn()
    const onBeginRevision = vi.fn()
    renderImpact({
      progress: progress({ initialDecisions: { location: { permissionId: 'location', choice: 'allow-current-feature' } }, enabledFeatureSwitchIds: ['map-current-position'] }),
      onAcknowledgeCondition,
      onControlActionChange,
      onBeginRevision,
    })
    const compare = screen.getByRole('button', { name: '비교 확인' })
    await user.click(compare)
    expect(onAcknowledgeCondition).toHaveBeenCalledWith('class-map', 'map-current-position-opt-in')
    expect(screen.getByRole('button', { name: '최소 권한안 수정' })).toBeDisabled()
    await user.click(screen.getByRole('radio', { name: '대안 사용' }))
    expect(onControlActionChange).toHaveBeenCalledWith('class-map', 'alternative')
    expect(onBeginRevision).not.toHaveBeenCalled()
  })

  it('renders the voice press-only and delete conditions without a recording control', () => {
    renderImpact({
      appCase: APP_CASES['voice-reading'],
      progress: { ...progress(), initialDecisions: { microphone: { permissionId: 'microphone', choice: 'allow-current-feature' } } },
    })
    expect(screen.getAllByText(/누르고 있는 동안에만 음성을 처리/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/바로 재생/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/즉시 삭제/).length).toBeGreaterThan(0)
    expect(screen.queryByRole('button', { name: /녹음/ })).not.toBeInTheDocument()
  })
})
