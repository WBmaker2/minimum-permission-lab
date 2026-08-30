import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { buildReport } from '../../domain/buildReport'
import { createInitialLabState } from '../../app/labReducer'
import { CONDITIONAL_SCENARIOS } from '../../content/conditionalScenarios'
import { LabProvider } from '../../app/LabProvider'
import { LabApplication } from '../../app/App'
import { PROGRESS_STORAGE_KEY } from '../../storage/progressStorage'
import ReportScreen from './ReportScreen'
import type { LabReport, LabState, PermissionId } from '../../domain/model'

afterEach(cleanup)

function reportState(saveOnDevice = false): LabState {
  const base = createInitialLabState()
  const ids: readonly PermissionId[] = ['camera', 'microphone', 'location', 'contacts']
  const decisions = Object.fromEntries(ids.map((permissionId) => [permissionId, { permissionId, choice: 'deny' as const }]))
  const state: LabState = {
    ...base,
    stage: 'report',
    saveOnDevice,
    revocationCompleted: true,
    revocationDecisions: {
      camera: { permissionId: 'camera', action: 'revoke-now' },
      microphone: { permissionId: 'microphone', action: 'keep-current-feature' },
      location: { permissionId: 'location', action: 'keep-current-feature' },
      contacts: { permissionId: 'contacts', action: 'revoke-now' },
    },
    caseProgress: Object.fromEntries(Object.entries(base.caseProgress).map(([caseId, progress], index) => [caseId, {
      ...progress, initialDecisions: decisions, revisedDecisions: decisions, reasonTags: ['data-minimization'], rationaleText: `${caseId} 근거`, controlAction: index % 2 === 0 ? 'alternative' : 'revoke', completed: true,
      enabledFeatureSwitchIds: Object.values(CONDITIONAL_SCENARIOS)
        .filter((scenario) => scenario.caseId === caseId && scenario.featureSwitchId)
        .map((scenario) => scenario.featureSwitchId!),
      acknowledgedConditionIds: Object.values(CONDITIONAL_SCENARIOS)
        .filter((scenario) => scenario.caseId === caseId)
        .map((scenario) => scenario.id),
      impactViewed: true,
    }])) as unknown as LabState['caseProgress'],
  }
  return state
}

function report(): LabReport {
  return buildReport(reportState())
}

describe('ReportScreen', () => {
  it('renders the four comparisons, rubric statuses, controls, and disclaimer', () => {
    render(<ReportScreen report={report()} onPrint={vi.fn()} onReset={vi.fn()} />)
    expect(screen.getByRole('heading', { level: 2, name: '최소 권한 학습 보고서' })).toBeVisible()
    expect(screen.getByRole('heading', { level: 3, name: '네 사례 완료 요약' })).toBeVisible()
    expect(screen.getByText('판단이 바뀐 것은 배움의 증거예요')).toBeVisible()
    expect(screen.getByText('가상 학습 모델이며 실제 앱 판정이 아님')).toBeVisible()
    expect(screen.getAllByRole('article')).toHaveLength(4)
    expect(screen.getAllByRole('columnheader', { name: '권한' })).toHaveLength(4)
    expect(screen.getAllByRole('columnheader', { name: '최초 선택' })).toHaveLength(4)
    expect(screen.getAllByText('변경 없음')).toHaveLength(32)
    expect(screen.getAllByText(/권한 철회/)).toHaveLength(4)
    expect(screen.getAllByText(/통제 후 허용/)).toHaveLength(2)
    expect(screen.getAllByText(/허용하지 않기/)).toHaveLength(2)
    expect(screen.getAllByText('● 근거 있음')).toHaveLength(4)
    expect(screen.getAllByText('△ 근거 보완')).toHaveLength(12)
    expect(screen.getAllByRole('blockquote')).toHaveLength(4)
    expect(screen.getAllByText('수정 선택')).toHaveLength(20)
    expect(screen.getAllByText('변경 여부')).toHaveLength(20)
    expect(screen.getAllByText('허용하지 않음')).toHaveLength(64)
    expect(screen.queryAllByText('설명을 더 확인')).toHaveLength(0)
    expect(screen.getAllByText('모양: 카메라 테두리')).toHaveLength(8)
    expect(screen.getAllByText('모양: 소리 물결')).toHaveLength(8)
    expect(screen.getAllByText('모양: 지도 위치표시')).toHaveLength(8)
    expect(screen.getAllByText('모양: 사람 카드')).toHaveLength(8)
    expect(screen.getByRole('heading', { level: 3, name: '공통 철회 권한' })).toBeVisible()
    expect(screen.getAllByText('카메라').length).toBeGreaterThan(0)
    expect(screen.getAllByText('연락처').length).toBeGreaterThan(0)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /추천|점수/ })).not.toBeInTheDocument()
  })

  it('explains the next learning action beside the report controls', () => {
    render(<ReportScreen report={report()} onPrint={vi.fn()} onReset={vi.fn()} />)
    const nextActions = screen.getByRole('region', { name: '다음 학습 행동' })
    expect(within(nextActions).getByRole('heading', { level: 3, name: '다음 학습 행동' })).toBeVisible()
    expect(within(nextActions).getByText(/인쇄해 수업에서 함께 돌아보기/)).toBeVisible()
    expect(within(nextActions).getByText(/다시 시작해 다른 사례를 연습하기/)).toBeVisible()
    expect(within(nextActions).getByRole('button', { name: '보고서 인쇄' })).toBeVisible()
    expect(within(nextActions).getByRole('button', { name: '처음부터 다시 하기' })).toBeVisible()
  })

  it('shows changed marker with text and shape', () => {
    const built = report()
    const first = built.cases[0]
    const changed = {
      ...built,
      cases: [{ ...first, changedPermissionIds: ['camera' as const], revised: first.revised.map((decision) => decision.permissionId === 'camera' ? { ...decision, choice: 'allow-current-feature' as const } : decision) }, ...built.cases.slice(1)],
    } as LabReport
    render(<ReportScreen report={changed} onPrint={vi.fn()} onReset={vi.fn()} />)
    const changedMarker = screen.getAllByText('◆ 판단 변경')[0]
    const changedRow = changedMarker.closest('tr')!
    expect(changedRow).toBeInTheDocument()
    expect(within(changedRow).getByText('허용하지 않음')).toBeVisible()
    expect(within(changedRow).getByText('이번 기능에만 허용')).toBeVisible()
    expect(within(changedRow).getAllByText('◆ 판단 변경')).toHaveLength(1)
  })

  it('prints once and confirms before resetting', async () => {
    const user = userEvent.setup()
    const onPrint = vi.fn()
    const onReset = vi.fn()
    const confirm = vi.spyOn(window, 'confirm')
    render(<ReportScreen report={report()} onPrint={onPrint} onReset={onReset} />)
    await user.click(screen.getByRole('button', { name: '보고서 인쇄' }))
    expect(onPrint).toHaveBeenCalledTimes(1)
    confirm.mockReturnValue(false)
    await user.click(screen.getByRole('button', { name: '처음부터 다시 하기' }))
    expect(onReset).not.toHaveBeenCalled()
    expect(confirm).toHaveBeenCalledWith(expect.stringContaining('처음부터'))
    confirm.mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: '처음부터 다시 하기' }))
    expect(onReset).toHaveBeenCalledTimes(1)
    confirm.mockRestore()
  })

  it('keeps the comparison table accessible', () => {
    render(<ReportScreen report={report()} onPrint={vi.fn()} onReset={vi.fn()} />)
    const article = screen.getAllByRole('article')[0]
    const table = within(article).getByRole('table')
    expect(within(table).getByRole('caption')).toHaveTextContent('최초 선택과 수정 선택 비교')
    expect(within(table).getAllByRole('row')).toHaveLength(5)
  })

  it('renders a mobile comparison card list with all four permission decisions', () => {
    render(<ReportScreen report={report()} onPrint={vi.fn()} onReset={vi.fn()} />)
    const comparisons = screen.getAllByRole('region', { name: '권한별 비교' })
    expect(comparisons).toHaveLength(4)
    const first = comparisons[0]
    expect(within(first).getByRole('heading', { name: '권한별 비교' })).toBeVisible()
    expect(within(first).getAllByRole('group')).toHaveLength(4)
    for (const permission of ['카메라', '마이크', '위치', '연락처']) {
      const card = within(first).getByRole('heading', { name: permission }).closest('[role="group"]') as HTMLElement | null
      expect(card).toBeInTheDocument()
      expect(within(card!).getByText('최초 선택')).toBeVisible()
      expect(within(card!).getByText('수정 선택')).toBeVisible()
      expect(within(card!).getByText('변경 여부')).toBeVisible()
      expect(within(card!).getAllByText('허용하지 않음')).toHaveLength(2)
    }
  })

  it('gives each rubric section a unique existing labelled heading', () => {
    render(<ReportScreen report={report()} onPrint={vi.fn()} onReset={vi.fn()} />)
    const sections = screen.getAllByRole('region', { name: '근거 차원 확인' })
    const ids = sections.map((section) => section.getAttribute('aria-labelledby'))
    expect(ids).toHaveLength(4)
    expect(new Set(ids).size).toBe(4)
    for (const id of ids) expect(id && document.getElementById(id)).toBeTruthy()
  })

  it('runs print and reset integration from the report stage', async () => {
    const user = userEvent.setup()
    const print = vi.spyOn(window, 'print').mockImplementation(() => undefined)
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const storage = { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn() }
    render(<LabProvider initialState={reportState(true)} storage={storage}><LabApplication /></LabProvider>)
    await user.click(screen.getByRole('button', { name: '보고서 인쇄' }))
    expect(print).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: '처음부터 다시 하기' }))
    expect(storage.removeItem).toHaveBeenCalledTimes(1)
    expect(storage.removeItem).toHaveBeenCalledWith(PROGRESS_STORAGE_KEY)
    expect(screen.getByRole('heading', { level: 2, name: '학습 시작' })).toBeVisible()
    print.mockRestore()
    confirm.mockRestore()
  })

  it('does not remove storage for an unsaved report reset', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const storage = { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn() }
    render(<LabProvider initialState={reportState(false)} storage={storage}><LabApplication /></LabProvider>)
    await user.click(screen.getByRole('button', { name: '처음부터 다시 하기' }))
    expect(storage.removeItem).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { level: 2, name: '학습 시작' })).toBeVisible()
    vi.restoreAllMocks()
  })

  it('requires confirmation before recovering a malformed report state', async () => {
    const user = userEvent.setup()
    const confirm = vi.spyOn(window, 'confirm')
    const storage = { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn() }
    render(<LabProvider initialState={{ ...reportState(), revocationCompleted: false }} storage={storage}><LabApplication /></LabProvider>)
    expect(screen.getByRole('heading', { level: 2, name: '보고서를 만들 수 없습니다' })).toBeVisible()
    confirm.mockReturnValue(false)
    await user.click(screen.getByRole('button', { name: '처음부터 다시 하기' }))
    expect(screen.getByRole('heading', { level: 2, name: '보고서를 만들 수 없습니다' })).toBeVisible()
    expect(storage.removeItem).not.toHaveBeenCalled()
    confirm.mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: '처음부터 다시 하기' }))
    expect(screen.getByRole('heading', { level: 2, name: '학습 시작' })).toBeVisible()
    confirm.mockRestore()
  })
})
