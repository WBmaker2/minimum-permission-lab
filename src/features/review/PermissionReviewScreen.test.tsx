import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'

import { APP_CASES } from '../../content/cases'
import { getPermissionDefinition } from '../../content/permissions'
import type { CaseProgress, LearnerChoice, PermissionDecision, ReasonTagId } from '../../domain/model'
import { createInitialLabState } from '../../app/labReducer'
import PermissionReviewScreen from './PermissionReviewScreen'

afterEach(cleanup)

function progress(overrides: Partial<CaseProgress> = {}): CaseProgress {
  return { ...createInitialLabState().caseProgress['photo-scan'], ...overrides }
}

function renderReview(overrides: Partial<React.ComponentProps<typeof PermissionReviewScreen>> = {}) {
  const onDecision = vi.fn<(decision: PermissionDecision) => void>()
  const onRationaleTextChange = vi.fn<(caseId: import('../../domain/model').CaseId, value: string) => void>()
  const onReasonTagToggle = vi.fn<(caseId: import('../../domain/model').CaseId, tagId: ReasonTagId) => void>()
  const onReview = vi.fn()
  const initialProps = {
    appCase: APP_CASES['photo-scan'], mode: 'initial' as const, progress: progress(),
    onDecision, onRationaleTextChange, onReasonTagToggle, onReview, ...overrides,
  }
  function StatefulReview() {
    const [currentProgress, setCurrentProgress] = useState(initialProps.progress)
    return <PermissionReviewScreen {...initialProps} progress={currentProgress}
      onDecision={(decision) => {
        onDecision(decision)
        const key = initialProps.mode === 'initial' ? 'initialDecisions' : 'revisedDecisions'
        setCurrentProgress((current) => ({ ...current, [key]: { ...current[key], [decision.permissionId]: decision } }))
      }}
      onRationaleTextChange={(caseId, value) => {
        onRationaleTextChange(caseId, value)
        setCurrentProgress((current) => ({ ...current, rationaleText: value }))
      }}
      onReasonTagToggle={(caseId, tagId) => {
        onReasonTagToggle(caseId, tagId)
        setCurrentProgress((current) => ({ ...current, reasonTags: current.reasonTags.includes(tagId) ? current.reasonTags.filter((tag) => tag !== tagId) : [...current.reasonTags, tagId] }))
      }} />
  }
  const result = render(<StatefulReview />)
  return { ...result, onDecision, onRationaleTextChange, onReasonTagToggle, onReview }
}

describe('PermissionReviewScreen', () => {
  it('renders four accessible permission fieldsets with three native choices', () => {
    renderReview()
    const fieldsets = screen.getAllByRole('group')
    expect(fieldsets).toHaveLength(4)
    for (const permissionId of APP_CASES['photo-scan'].requestedPermissions) {
      const definition = getPermissionDefinition(permissionId)
      const fieldset = fieldsets.find((item) => item.textContent?.includes(definition.label))
      expect(fieldset).toBeDefined()
      expect(within(fieldset!).getByText(definition.label)).toBeVisible()
      expect(within(fieldset!).getByText(definition.shapeLabel)).toBeVisible()
      expect(within(fieldset!).getByText('학습용 선택지')).toBeVisible()
      expect(within(fieldset!).getAllByRole('radio')).toHaveLength(3)
      expect(within(fieldset!).getByRole('radio', { name: '이번 기능에만 허용' })).toHaveAttribute('value', 'allow-current-feature')
      expect(within(fieldset!).getByRole('radio', { name: '허용하지 않음' })).toHaveAttribute('value', 'deny')
      expect(within(fieldset!).getByRole('radio', { name: '설명을 더 확인' })).toHaveAttribute('value', 'more-info')
    }
  })

  it('uses native keyboard selection and announces the learning choice', async () => {
    const user = userEvent.setup()
    renderReview()
    const cameraAllow = screen.getAllByRole('radio', { name: '이번 기능에만 허용' })[0]
    await user.tab()
    expect(cameraAllow).toHaveFocus()
    await user.keyboard(' ')
    expect(cameraAllow).toBeChecked()
    expect(screen.getByRole('status')).toHaveTextContent(/카메라.*이번 기능에만 허용.*학습용 판단/)
  })

  it('gates initial review until four decisions and pulses only the ready action', async () => {
    const user = userEvent.setup()
    const { onDecision } = renderReview()
    const action = screen.getByRole('button', { name: '선택 검토' })
    expect(action).toBeDisabled()
    expect(action).not.toHaveClass('gi-pulse')
    for (const radio of screen.getAllByRole('radio', { name: '허용하지 않음' })) await user.click(radio)
    expect(onDecision).toHaveBeenCalledTimes(4)
    expect(onDecision.mock.calls.map(([decision]) => decision.permissionId)).toEqual(['camera', 'microphone', 'location', 'contacts'])
    expect(action).toBeEnabled()
    expect(action).toHaveClass('gi-pulse')
    expect(screen.getAllByRole('button', { name: /선택 검토/ }).filter((button) => button.classList.contains('gi-pulse'))).toHaveLength(1)
  })

  it('shows revision rationale controls and keeps whitespace unready', async () => {
    const user = userEvent.setup()
    const { onRationaleTextChange, onReasonTagToggle } = renderReview({
      mode: 'revision',
      progress: progress({ reasonTags: [], rationaleText: '' }),
    })
    expect(screen.queryByRole('textbox', { name: '내 판단 근거' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '선택 검토' })).toBeDisabled()
    for (const radio of screen.getAllByRole('radio', { name: '허용하지 않음' })) await user.click(radio)
    await user.click(screen.getByRole('checkbox', { name: '정보 최소화' }))
    expect(onReasonTagToggle).toHaveBeenCalledWith('photo-scan', 'data-minimization')
    await user.type(screen.getByRole('textbox', { name: '내 판단 근거' }), '   ')
    expect(onRationaleTextChange).toHaveBeenLastCalledWith('photo-scan', '   ')
    expect(screen.getByRole('button', { name: '선택 검토' })).toBeDisabled()
  })

  it('shows the exact sentence frame for a revision rationale', () => {
    renderReview({ mode: 'revision', progress: progress({ reasonTags: ['function-connection'], rationaleText: '근거' }) })
    expect(screen.getByText('문장틀: 나는 [기능]을 위해 [권한]을 [선택]하겠습니다. 그 이유는 [근거]이며, 필요하지 않을 때는 [대안 또는 철회]하겠습니다.')).toBeVisible()
  })

  it('requires a tag and nonblank rationale, passing the exact case id', async () => {
    const user = userEvent.setup()
    renderReview({ mode: 'revision', progress: progress({ reasonTags: [], rationaleText: '' }) })
    for (const radio of screen.getAllByRole('radio', { name: '허용하지 않음' })) await user.click(radio)
    await user.click(screen.getByRole('checkbox', { name: '기능 연결' }))
    await user.type(screen.getByRole('textbox', { name: '내 판단 근거' }), '필요한 기능에만 연결했습니다.')
    expect(screen.getByRole('button', { name: '선택 검토' })).toBeEnabled()
    expect(screen.getByRole('button', { name: '선택 검토' })).toHaveClass('gi-pulse')
  })

  it('expands and focuses the correct contract evidence for more-info', async () => {
    const user = userEvent.setup()
    renderReview()
    const locationMoreInfo = screen.getAllByRole('radio', { name: '설명을 더 확인' })[2]
    await user.click(locationMoreInfo)
    const heading = screen.getByRole('heading', { name: /위치.*기능 계약 근거/ })
    expect(heading).toHaveFocus()
    const panel = heading.closest('[data-evidence-panel]') as HTMLElement
    const region = heading.closest('[role="region"]') as HTMLElement
    expect(panel).not.toHaveAttribute('aria-expanded')
    expect(screen.getByRole('button', { name: /위치.*기능 계약 근거 닫기/ })).toHaveAttribute('aria-expanded', 'true')
    expect(region).toHaveAttribute('aria-labelledby', heading.id)
    expect(within(panel).getByText('이 기능에 어떤 정보가 필요한가요?')).toBeVisible()
    expect(within(panel).getByText(APP_CASES['photo-scan'].rules.location.contractEvidence)).toBeVisible()
    expect(screen.getByRole('button', { name: /위치.*기능 계약 근거 닫기/ })).toHaveAttribute('aria-controls', panel.querySelector('[role="region"]')?.id)
  })

  it('keeps a real hidden region target for collapsed evidence controls', async () => {
    const user = userEvent.setup()
    renderReview()
    const toggle = screen.getAllByRole('button', { name: /카메라.*기능 계약 근거 보기/ })[0]
    const panelId = toggle.getAttribute('aria-controls')
    expect(panelId).toBeTruthy()
    const collapsedRegion = document.getElementById(panelId!)
    expect(collapsedRegion).toBeInTheDocument()
    expect(collapsedRegion).toHaveAttribute('role', 'region')
    expect(collapsedRegion).toHaveAttribute('hidden')
    expect(collapsedRegion).toHaveAttribute('aria-labelledby')
    const collapsedHeading = document.getElementById(collapsedRegion!.getAttribute('aria-labelledby')!)
    expect(collapsedHeading).toBeInTheDocument()
    await user.click(toggle)
    const visibleRegion = document.getElementById(panelId!)
    expect(visibleRegion).toBeVisible()
    expect(visibleRegion).toHaveAttribute('role', 'region')
    const headingId = visibleRegion!.getAttribute('aria-labelledby')
    expect(document.getElementById(headingId!)).toHaveFocus()
  })

  it('keeps expansion state only on the toggle and controlled region', () => {
    renderReview()
    const toggle = screen.getAllByRole('button', { name: /카메라.*기능 계약 근거 보기/ })[0]
    const outer = toggle.closest('[data-evidence-panel]')
    expect(outer).not.toHaveAttribute('aria-expanded')
    expect(outer).not.toHaveAttribute('aria-labelledby')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById(toggle.getAttribute('aria-controls')!)).toHaveAttribute('role', 'region')
  })

  it('uses unique screen headings and card descriptions for multiple instances', () => {
    render(
      <>
        <PermissionReviewScreen
          appCase={APP_CASES['photo-scan']}
          mode="initial"
          progress={progress()}
          onDecision={vi.fn()}
          onRationaleTextChange={vi.fn()}
          onReasonTagToggle={vi.fn()}
          onReview={vi.fn()}
        />
        <PermissionReviewScreen
          appCase={APP_CASES['photo-scan']}
          mode="initial"
          progress={progress()}
          onDecision={vi.fn()}
          onRationaleTextChange={vi.fn()}
          onReasonTagToggle={vi.fn()}
          onReview={vi.fn()}
        />
      </>,
    )
    const reviewHeadings = screen.getAllByRole('heading', { level: 3, name: '권한 선택' })
    expect(new Set(reviewHeadings.map((heading) => heading.id)).size).toBe(2)
    for (const heading of reviewHeadings) expect(heading.closest('section')).toHaveAttribute('aria-labelledby', heading.id)

    const radios = screen.getAllByRole('radio')
    const descriptionIds = radios.map((radio) => radio.getAttribute('aria-describedby'))
    expect(new Set(descriptionIds).size).toBe(8)
    for (const radio of radios) {
      const descriptionId = radio.getAttribute('aria-describedby')
      expect(descriptionId).toBeTruthy()
      expect(document.getElementById(descriptionId!)).toBeInTheDocument()
      expect(radio.closest('fieldset')?.querySelector(`#${CSS.escape(descriptionId!)}`)).toBeInTheDocument()
    }
  })

  it('reads distinct initial and revision records without overwriting the initial object', () => {
    const initialDecision = { permissionId: 'camera' as const, choice: 'allow-current-feature' as LearnerChoice }
    const revisedDecision = { permissionId: 'camera' as const, choice: 'deny' as LearnerChoice }
    const initial = { camera: initialDecision }
    const revised = { camera: revisedDecision }
    const { rerender } = renderReview({ progress: progress({ initialDecisions: initial, revisedDecisions: revised }) })
    expect(screen.getAllByRole('radio', { name: '이번 기능에만 허용' })[0]).toBeChecked()
    rerender(
      <PermissionReviewScreen
        appCase={APP_CASES['photo-scan']}
        mode="revision"
        progress={progress({ initialDecisions: initial, revisedDecisions: revised })}
        onDecision={vi.fn()}
        onRationaleTextChange={vi.fn()}
        onReasonTagToggle={vi.fn()}
        onReview={vi.fn()}
      />,
    )
    expect(screen.getAllByRole('radio', { name: '허용하지 않음' })[0]).toBeChecked()
    expect(initial).toEqual({ camera: initialDecision })
  })

  it('does not include fear-based or wrong-answer feedback', () => {
    renderReview()
    expect(screen.queryByText(/틀렸|무서|위험하니 반드시/)).not.toBeInTheDocument()
  })

  it('shows the initial choices as a read-only comparison during revision', async () => {
    const user = userEvent.setup()
    const initialDecisions = {
      camera: { permissionId: 'camera' as const, choice: 'allow-current-feature' as const },
      microphone: { permissionId: 'microphone' as const, choice: 'deny' as const },
      location: { permissionId: 'location' as const, choice: 'more-info' as const },
      contacts: { permissionId: 'contacts' as const, choice: 'deny' as const },
    }
    const { rerender } = renderReview({ mode: 'revision', progress: progress({ initialDecisions, revisedDecisions: {} }) })
    const comparison = screen.getByRole('heading', { level: 3, name: '최초 선택 비교' }).closest('section')!
    expect(within(comparison).getByText('카메라')).toBeVisible()
    expect(within(comparison).getByText('이번 기능에만 허용')).toBeVisible()
    expect(within(comparison).getAllByText('허용하지 않음')).toHaveLength(2)
    expect(within(comparison).getByText('설명을 더 확인')).toBeVisible()
    expect(within(comparison).queryAllByRole('radio')).toHaveLength(0)
    expect(within(comparison).queryAllByRole('checkbox')).toHaveLength(0)

    const initialSnapshot = structuredClone(initialDecisions)
    rerender(
      <PermissionReviewScreen
        appCase={APP_CASES['photo-scan']}
        mode="revision"
        progress={progress({ initialDecisions, revisedDecisions: { camera: { permissionId: 'camera', choice: 'deny' } } })}
        onDecision={vi.fn()}
        onRationaleTextChange={vi.fn()}
        onReasonTagToggle={vi.fn()}
        onReview={vi.fn()}
      />,
    )
    await user.click(screen.getAllByRole('radio', { name: '이번 기능에만 허용' })[1])
    expect(initialDecisions).toEqual(initialSnapshot)
  })
})
