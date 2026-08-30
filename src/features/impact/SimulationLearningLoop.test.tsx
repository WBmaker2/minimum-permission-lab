import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CONDITIONAL_SCENARIOS } from '../../content/conditionalScenarios'
import SimulationLearningLoop from './SimulationLearningLoop'

afterEach(cleanup)

describe('SimulationLearningLoop', () => {
  it('requires prediction before one-variable manipulation and explanation before comparison', async () => {
    const user = userEvent.setup()
    const onSwitchChange = vi.fn()
    const onAcknowledge = vi.fn()
    render(
      <SimulationLearningLoop
        scenario={CONDITIONAL_SCENARIOS['map-current-position-opt-in']}
        switchEnabled={false}
        acknowledged={false}
        onSwitchChange={onSwitchChange}
        onAcknowledge={onAcknowledge}
      />,
    )

    const variable = screen.getByRole('checkbox', { name: '현재 위치 보기 조건 켜기' })
    expect(variable).toBeDisabled()
    expect(screen.getByRole('button', { name: '비교 결과 확인' })).toBeDisabled()
    await user.click(screen.getByRole('radio', { name: '저장된 지도만 보여서 달라지지 않아요.' }))
    expect(variable).toBeEnabled()
    await user.click(variable)
    expect(variable).toBeChecked()
    expect(screen.getByText(/관찰:/)).toBeVisible()
    expect(screen.getByRole('button', { name: '비교 결과 확인' })).toBeDisabled()
    await user.click(screen.getByRole('radio', { name: '스위치를 켜면 현재 위치 보기 기능이 함께 켜져요.' }))
    const compare = screen.getByRole('button', { name: '비교 결과 확인' })
    expect(compare).toBeEnabled()
    expect(compare).toHaveClass('gi-pulse')
    await user.click(compare)
    expect(onAcknowledge).toHaveBeenCalledWith('class-map', 'map-current-position-opt-in')
    expect(onAcknowledge).toHaveBeenCalledTimes(1)
    expect(onSwitchChange).toHaveBeenCalledWith('class-map', 'map-current-position', true)
  })

  it('resets the map condition and clears local prediction and explanation', async () => {
    const user = userEvent.setup()
    const onSwitchChange = vi.fn()
    render(
      <SimulationLearningLoop
        scenario={CONDITIONAL_SCENARIOS['map-current-position-opt-in']}
        switchEnabled={false}
        acknowledged={false}
        onSwitchChange={onSwitchChange}
        onAcknowledge={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('radio', { name: '저장된 지도만 보여서 달라지지 않아요.' }))
    const variable = screen.getByRole('checkbox', { name: '현재 위치 보기 조건 켜기' })
    await user.click(variable)
    await user.click(screen.getByRole('button', { name: '처음 조건으로 돌아가기' }))
    expect(variable).not.toBeChecked()
    expect(screen.queryByText(/관찰:/)).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '저장된 지도만 보여서 달라지지 않아요.' })).not.toBeChecked()
    expect(onSwitchChange).toHaveBeenLastCalledWith('class-map', 'map-current-position', false)
  })

  it('offers the voice retention comparison without a recording control', async () => {
    const user = userEvent.setup()
    const onAcknowledge = vi.fn()
    render(
      <SimulationLearningLoop
        scenario={CONDITIONAL_SCENARIOS['voice-press-and-delete']}
        switchEnabled={false}
        acknowledged={false}
        onSwitchChange={vi.fn()}
        onAcknowledge={onAcknowledge}
      />,
    )

    expect(screen.queryByRole('button', { name: /녹음|재생/ })).not.toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: '누르는 동안만 처리하고 바로 삭제해요.' }))
    const retention = screen.getByRole('checkbox', { name: '오래 보관하는 조건 켜기' })
    expect(retention).toBeEnabled()
    await user.click(retention)
    expect(document.querySelector('.simulation-loop__observation')).toHaveTextContent('오래 보관')
    await user.click(screen.getByRole('radio', { name: '오래 보관하면 더 긴 기간 동안 정보가 남아요.' }))
    await user.click(screen.getByRole('button', { name: '비교 결과 확인' }))
    expect(onAcknowledge).toHaveBeenCalledWith('voice-reading', 'voice-press-and-delete')
  })
})
