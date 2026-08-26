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
      reason: '실제 권한 요청과 개인정보 저장이 없음을 학습자에게 더 분명히 알림: 이는 가상 별명과 실제 개인정보를 수집·저장하지 않는다는 뜻이며, 이 기기에 저장 동의 시 권한 판단과 근거 원문은 로컬 학습 기록에 보관될 수 있음을 함께 명시함',
    })
    expect(UPDATE_HISTORY).toContainEqual({
      date: '2026-08-26',
      category: '콘텐츠 검수',
      summary: '저장 동의 범위 안내 보강',
      reason: '가상 별명과 실제 개인정보는 수집·저장하지 않지만 저장 동의 시 권한 판단과 근거 원문은 로컬 학습 기록에 보관될 수 있음을 구분함',
    })
  })

  it('exposes entries as readonly data', () => {
    const entry: UpdateHistoryEntry = UPDATE_HISTORY[0]
    expect(entry).toBeDefined()
  })
})
