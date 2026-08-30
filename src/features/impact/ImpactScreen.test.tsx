import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useReducer } from 'react'

import { APP_CASES } from '../../content/cases'
import { createInitialLabState, labReducer } from '../../app/labReducer'
import type { CaseProgress, LabState } from '../../domain/model'
import ImpactScreen from './ImpactScreen'
import { getImpactRequirementMessage } from './impactProgress'

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
  it('explains the remaining impact requirements through the disabled CTA', () => {
    renderImpact()

    const revisionButton = screen.getByRole('button', { name: '최소 권한안 수정' })
    const hint = screen.getByText(/비교 0\/1/)

    expect(revisionButton).toBeDisabled()
    expect(hint).toHaveTextContent('비교 0/1')
    expect(revisionButton).toHaveAttribute('aria-describedby', hint.id)
  })

  it('returns a concrete next action for every impact readiness state', () => {
    expect(getImpactRequirementMessage({ conditionCount: 1, acknowledgedConditionCount: 0, conditionsSatisfied: false, hasDisabledFeatureSwitch: true, controlAction: null })).toContain('조건을 바꾼 뒤')
    expect(getImpactRequirementMessage({ conditionCount: 1, acknowledgedConditionCount: 1, conditionsSatisfied: true, hasDisabledFeatureSwitch: false, controlAction: null })).toContain('대안 사용 또는 권한 철회')
    expect(getImpactRequirementMessage({ conditionCount: 0, acknowledgedConditionCount: 0, conditionsSatisfied: true, hasDisabledFeatureSwitch: false, controlAction: 'alternative' })).toContain('모든 비교와 다음 방향을 골랐습니다')
  })

  it('shows available, limited, neutral feedback, evidence, and alternatives', () => {
    renderImpact()
    expect(screen.getByRole('heading', { level: 2, name: '권한 영향 시뮬레이션' })).toBeVisible()
    expect(screen.getByText(/가상 실험/)).toBeVisible()
    expect(screen.getByText('계속 할 수 있는 일')).toBeVisible()
    expect(screen.getByText('제한되는 일')).toBeVisible()
    expect(screen.getAllByText('왜 이렇게 판단했을까요?').length).toBeGreaterThan(0)
    expect(screen.getAllByText('다른 방법').length).toBeGreaterThan(0)
    expect(screen.queryByText(/틀렸|정답|위험하니 반드시/)).not.toBeInTheDocument()
  })

  it('uses one-action learner wording for simulation and revision guidance', () => {
    renderImpact()
    expect(screen.getByText(/고른 권한이 켜져 있을 때 어떤 기능이 되는지 확인해 봅니다/)).toBeVisible()
    expect(screen.getByRole('heading', { level: 3, name: '조건을 바꿔 보세요' })).toBeVisible()
    expect(screen.getByText(/이제 다음 행동을 하나 고르세요/)).toBeVisible()
  })

  it('runs the real reducer-backed switch, comparison, control, and revision flow', async () => {
    const user = userEvent.setup()
    const onBeginRevision = vi.fn()
    renderControlledImpact(onBeginRevision)
    const prediction = screen.getByRole('radio', { name: '현재 위치 보기 기능이 함께 켜져요.' })
    await user.click(prediction)
    const switchControl = screen.getByRole('checkbox', { name: '현재 위치 보기 조건 켜기' })
    expect(switchControl).not.toBeChecked()
    expect(screen.getByRole('heading', { name: /위치 · 불필요/ })).toBeVisible()
    expect(screen.getByRole('button', { name: '비교 결과 확인' })).toBeDisabled()
    await user.click(switchControl)
    expect(switchControl).toBeChecked()
    expect(screen.getByRole('heading', { name: /위치 · 조건부/ })).toBeVisible()
    expect(screen.getByText('학습용 내 위치 표시')).toBeVisible()
    expect(screen.getAllByRole('status')[0]).toHaveTextContent('스위치를 켰습니다')
    await user.click(screen.getByRole('radio', { name: '스위치를 켜면 현재 위치 보기 기능이 함께 켜져요.' }))
    const compare = screen.getByRole('button', { name: '비교 결과 확인' })
    expect(compare).toBeEnabled()
    await user.click(compare)
    expect(screen.getByRole('button', { name: '비교 결과 확인 완료' })).toBeDisabled()
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
    await user.click(screen.getByRole('radio', { name: '스위치를 켜면 현재 위치 보기 기능이 함께 켜져요.' }))
    const recheck = screen.getByRole('button', { name: '비교 결과 확인' })
    expect(recheck).toBeEnabled()
    await user.click(recheck)
    expect(screen.getByRole('button', { name: '비교 결과 확인 완료' })).toBeDisabled()
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
    await user.click(screen.getByRole('radio', { name: '현재 위치 보기 기능이 함께 켜져요.' }))
    await user.click(screen.getByRole('radio', { name: '스위치를 켜면 현재 위치 보기 기능이 함께 켜져요.' }))
    const compare = screen.getByRole('button', { name: '비교 결과 확인' })
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
