import { describe, expect, it } from 'vitest'

import { UPDATE_HISTORY, type UpdateHistoryEntry } from './updateHistory'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

describe('UPDATE_HISTORY', () => {
  it('contains valid dated entries in newest-first stable order', () => {
    expect(UPDATE_HISTORY.length).toBeGreaterThanOrEqual(3)
    UPDATE_HISTORY.forEach((entry) => {
      expect(entry.date).toMatch(ISO_DATE)
      expect(Number.isNaN(Date.parse(entry.date))).toBe(false)
      expect(['설계', '개발', '개선', '콘텐츠 검수']).toContain(entry.category)
      expect(entry.summary.trim()).not.toBe('')
      expect(entry.reason.trim()).not.toBe('')
    })

    for (let index = 1; index < UPDATE_HISTORY.length; index += 1) {
      expect(UPDATE_HISTORY[index - 1].date >= UPDATE_HISTORY[index].date).toBe(true)
    }
  })

  it('keeps equal-date entries in declaration order', () => {
    const sameDate = UPDATE_HISTORY.filter((entry) => entry.date === '2026-08-26')
    expect(sameDate.map((entry) => entry.category)).toEqual(['설계', '개발', '콘텐츠 검수', '개선', '콘텐츠 검수', '콘텐츠 검수'])
  })

  it('records the required design, implementation, and content-review entries', () => {
    expect(UPDATE_HISTORY).toContainEqual(expect.objectContaining({
      date: '2026-08-26',
      category: '설계',
      summary: '최초 설계 문서 작성',
    }))
    expect(UPDATE_HISTORY).toContainEqual(expect.objectContaining({
      date: '2026-08-26',
      category: '개발',
      summary: '4개 사례 MVP 학습 흐름 구현',
    }))
    expect(UPDATE_HISTORY).toContainEqual({
      date: '2026-08-26',
      category: '콘텐츠 검수',
      summary: '가상 권한 모델과 사례 표현 검토',
      reason: '실제 앱이나 운영체제에 그대로 일반화하지 않도록 경계를 명시함',
    })
    expect(UPDATE_HISTORY).toContainEqual({
      date: '2026-08-26',
      category: '개선',
      summary: '핵심 버튼 강조와 모션 감소 대체 추가',
      reason: '중요한 다음 행동을 분명히 하면서 모션 감소 사용자는 고정 강조로 확인하도록 함',
    })
    expect(UPDATE_HISTORY).toContainEqual({
      date: '2026-08-26',
      category: '콘텐츠 검수',
      summary: '개인정보 및 가상 모델 안내 검증',
      reason: '실제 개인정보를 수집하지 않도록 입력 금지 원칙을 안내하고, 저장 동의 시 권한 판단과 근거 원문이 이 기기에 보관될 수 있음을 구분함',
    })
    expect(UPDATE_HISTORY).toContainEqual({
      date: '2026-08-26',
      category: '콘텐츠 검수',
      summary: '저장 동의 범위 안내 보강',
      reason: '가상 별명과 실제 개인정보는 수집·저장하지 않지만 저장 동의 시 권한 판단과 근거 원문은 로컬 학습 기록에 보관될 수 있음을 구분함',
    })
  })

  it('records the Task15 accessibility improvement entry', () => {
    expect(UPDATE_HISTORY).toContainEqual({
      date: '2026-08-27',
      category: '개선',
      summary: '모바일·키보드·구조적 보조기술 대응 보강',
      reason: '375px와 키보드 흐름, 자동 접근성 구조를 보강함; VoiceOver·TalkBack 수동 검증은 실행하지 않음',
    })
  })

  it('records the current learner usability scope without claiming a manual screen-reader run', () => {
    expect(UPDATE_HISTORY[0]).toEqual({
      date: '2026-08-30',
      category: '개선',
      summary: '단어·문장 표현과 권한 영향 시뮬레이션 개선',
      reason: '초등 학습자 패널 기준으로 짧은 문장과 한 가지 행동 안내를 다듬고, 예상하기·조건 하나 바꾸기·관찰·설명·처음 조건으로 돌아가기 흐름을 추가함; 실제 권한·마이크·위치를 사용하지 않으며 실제 학생 세션과 VoiceOver·TalkBack 수동 실행은 포함하지 않음',
    })
    expect(UPDATE_HISTORY[0].summary).not.toContain('스크린 리더 검증 완료')
    expect(UPDATE_HISTORY[0].reason).not.toContain('스크린 리더 검증 완료')
    expect(UPDATE_HISTORY[1]).toEqual({
      date: '2026-08-30',
      category: '개선',
      summary: '초등 학습자 첫 행동과 키보드 순서 개선',
      reason: '헤더 중복 상세를 줄이고 사례를 고른 뒤 다음 버튼으로 포커스를 옮겼으며, 320px·375px 모바일 시작 화면의 세로 간격을 다듬음; 자동 키보드·모바일·모션 감소 흐름은 확인했지만 실제 학생 세션과 VoiceOver·TalkBack 수동 실행은 포함하지 않음',
    })
    expect(UPDATE_HISTORY[1].summary).not.toContain('스크린 리더 검증 완료')
    expect(UPDATE_HISTORY[1].reason).not.toContain('스크린 리더 검증 완료')
    expect(UPDATE_HISTORY[2]).toEqual({
      date: '2026-08-29',
      category: '개선',
      summary: '첫 행동·단계 안내·결과 다음 행동 정리',
      reason: '사례 선택을 앞에 배치하고 단계 제목 포커스·스크롤, 조건 안내, 결과 다음 행동을 보강함; 자동 키보드·모바일 구조 검증을 기록하고 VoiceOver·TalkBack 수동 실행은 포함하지 않음',
    })
    expect(UPDATE_HISTORY[2].summary).not.toContain('스크린 리더 검증 완료')
    expect(UPDATE_HISTORY[2].reason).not.toContain('스크린 리더 검증 완료')
  })

  it('records the Task16 completion-summary improvement entry', () => {
    expect(UPDATE_HISTORY).toContainEqual({
      date: '2026-08-27',
      category: '개선',
      summary: '네 사례 완료 요약과 판단 변화 증거 표시',
      reason: '학생이 최초안과 수정안의 차이를 한눈에 확인하도록 함',
    })
  })

  it('exposes entries as readonly data', () => {
    const entry: UpdateHistoryEntry = UPDATE_HISTORY[0]
    expect(entry).toBeDefined()
  })
})
