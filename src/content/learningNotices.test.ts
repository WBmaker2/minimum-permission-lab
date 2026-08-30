import { describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { createElement } from 'react'

import {
  HELP_REQUEST_NOTICE,
  LEARNING_MODEL_DETAILS,
  LEARNING_MODEL_NOTICE,
  LEARNING_MODEL_SUMMARY,
  NOT_IN_SCOPE_NOTICE,
  TEACHER_GUIDE_NOTICE,
} from './learningNotices'
import { GROUP_BOARD_ALIAS_EXAMPLES } from './cases/groupBoard'
import RationaleComposer from '../features/review/RationaleComposer'
import LearningModelNotice from '../components/LearningModelNotice'
import { createInitialLabState } from '../app/labReducer'
import StartScreen from '../features/start/StartScreen'

afterEach(cleanup)

describe('learning safety notices', () => {
  it('keeps the scan-friendly summary separate from the storage boundary details', () => {
    expect(LEARNING_MODEL_SUMMARY).toBe('실제 권한을 묻지 않는 가상 학습 모델입니다. 개인정보를 입력하지 마세요. 저장은 직접 선택합니다.')
    expect(LEARNING_MODEL_SUMMARY.split('. ').filter(Boolean)).toHaveLength(3)
    expect(LEARNING_MODEL_DETAILS).toContain('저장 동의')
    expect(LEARNING_MODEL_DETAILS).toContain('근거 원문')
    expect(LEARNING_MODEL_DETAILS).toContain('이 기기')
    expect(LEARNING_MODEL_DETAILS).toContain('가상 별명과 실제 개인정보는 수집하지 않습니다')
  })

  it('renders one compact non-interactive header summary', () => {
    render(createElement(LearningModelNotice))
    expect(screen.getByText(LEARNING_MODEL_SUMMARY)).toBeVisible()
    const notice = screen.getByRole('note')
    expect(notice.querySelector('details')).toBeNull()
    expect(notice.querySelector('summary')).toBeNull()
    expect(screen.queryByText(LEARNING_MODEL_DETAILS)).not.toBeInTheDocument()
  })

  it('states that judgments belong to a virtual learning model', () => {
    expect(LEARNING_MODEL_NOTICE).toContain('가상 학습 모델이며 실제 앱 판정이 아님')
  })

  it('states the common safety contract for the virtual practice', () => {
    expect(LEARNING_MODEL_NOTICE).toContain('실제 기기 권한을 요청하지 않는 가상 실습')
    expect(LEARNING_MODEL_NOTICE).toContain('입력한 별명은 임시')
    expect(LEARNING_MODEL_NOTICE).toContain('저장하거나 전송하지 않습니다')
    expect(LEARNING_MODEL_NOTICE).toMatch(/이름[·,、 ]*전화번호[·,、 ]*주소.*개인정보.*입력하지 않습니다/)
    expect(LEARNING_MODEL_NOTICE).toContain('필요한 순간에 최소한으로 허용')
    expect(LEARNING_MODEL_NOTICE).toContain('나중에 철회할 수 있습니다')
    expect(LEARNING_MODEL_NOTICE).toContain('이 기기에 저장을 선택하면 권한 판단과 근거 원문은 로컬 학습 기록에 보관될 수 있지만')
    expect(LEARNING_MODEL_NOTICE).toContain('가상 별명과 실제 개인정보는 수집·저장하지 않습니다')
  })

  it('uses the canonical fictional alias examples without copying implementation state', () => {
    expect([...GROUP_BOARD_ALIAS_EXAMPLES]).toEqual(['햇살', '새싹', '푸른별'])
    for (const alias of GROUP_BOARD_ALIAS_EXAMPLES) {
      expect(alias).not.toMatch(/실제|이름|전화번호|주소/)
    }
  })

  it('explains platform variation and points to official guidance', () => {
    expect(TEACHER_GUIDE_NOTICE).toContain('기기와 운영체제에 따라 다를 수 있음')
    expect(TEACHER_GUIDE_NOTICE).toMatch(/공식 안내|공식 지침/)
    expect(TEACHER_GUIDE_NOTICE).toContain('실제 앱의 안전성을 판정하는 보안 도구가 아님')
    expect(TEACHER_GUIDE_NOTICE).not.toMatch(/설정 >|메뉴에서|눌러|단계별/)
  })

  it('asks learners to seek calm help from an adult', () => {
    expect(HELP_REQUEST_NOTICE).toContain('교사나 보호자에게 도움을 요청')
    expect(HELP_REQUEST_NOTICE).not.toMatch(/위험|무섭|큰일|처벌|두려/)
  })

  it('explicitly names what the learning model does not cover', () => {
    for (const excludedTerm of [
      '데이터 정제',
      '미디어 사용 시간 진단',
      '실제 보안 검사',
      '실제 앱 추천',
      '실제 앱 차단',
    ]) {
      expect(NOT_IN_SCOPE_NOTICE).toContain(excludedTerm)
    }
    expect(NOT_IN_SCOPE_NOTICE).not.toMatch(/보안 상태를 측정|보안을 검사했/)
  })

  it('renders an honest personal-information warning for rationale input', () => {
    render(createElement(
      RationaleComposer,
      {
        caseId: 'photo-scan',
        value: '',
        selectedTags: [],
        onTextChange: () => undefined,
        onTagToggle: () => undefined,
      },
    ))

    expect(screen.getByText(/실제 이름·전화번호·주소는 쓰지 마세요/)).toBeVisible()
    expect(screen.getByText(/저장 동의.*이 기기에 남을 수 있습니다/)).toBeVisible()
    expect(screen.getByText(/자동으로 채점하지 않/)).toBeVisible()
  })

  it('renders a compact safety summary and reveals details on request', async () => {
    const user = userEvent.setup()
    render(createElement(StartScreen, {
      state: createInitialLabState(),
      onSelectCase: vi.fn(),
      onOpenSpecification: vi.fn(),
      onSaveOnDeviceChange: vi.fn(),
      onLoadSavedProgress: vi.fn(),
      onClearSavedProgress: vi.fn(),
    }))

    const boundary = screen.getByRole('heading', { name: '학습 범위와 안전' }).parentElement
    expect(boundary).not.toBeNull()
    expect(screen.getByText('실제 권한 없음 · 개인정보 입력 금지 · 저장은 직접 선택합니다.')).toBeVisible()
    const modelNotice = [...boundary!.querySelectorAll(':scope > p')]
      .find((paragraph) => paragraph.textContent?.includes('가상 학습 모델이며 실제 앱 판정이 아님'))
    expect(modelNotice).toBeDefined()
    expect(getComputedStyle(modelNotice!).display).not.toBe('none')
    const safetySummary = screen.getByText('학습 범위와 안전 더 보기')
    const safetyDetails = safetySummary.closest('details') as HTMLDetailsElement
    expect(safetyDetails.open).toBe(false)
    expect(screen.getByText(NOT_IN_SCOPE_NOTICE)).not.toBeVisible()
    await user.click(safetySummary)
    expect(screen.getByText(NOT_IN_SCOPE_NOTICE)).toBeVisible()
    const teacherSummary = screen.getByText('교사용 안내')
    expect(teacherSummary).toBeVisible()
    await user.click(teacherSummary)
    const teacherDetails = teacherSummary.parentElement
    expect(teacherDetails?.tagName).toBe('DETAILS')
    expect((teacherDetails as HTMLDetailsElement).open).toBe(true)
    const teacherText = teacherDetails?.textContent ?? ''
    expect(teacherText).toContain('교사나 보호자에게 도움을 요청')
    expect(teacherText).toContain('기기와 운영체제에 따라 다를 수 있음')
    expect(teacherText).toContain('공식 안내')
    expect(teacherText).toContain('실제 앱의 안전성을 판정하는 보안 도구가 아님')
    for (const paragraph of [...teacherDetails!.querySelectorAll('p')]) {
      expect(getComputedStyle(paragraph).display).not.toBe('none')
    }
  })
})
