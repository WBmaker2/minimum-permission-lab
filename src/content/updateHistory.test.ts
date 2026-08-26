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
    expect(sameDate.map((entry) => entry.category)).toEqual(['설계', '개발', '콘텐츠 검수'])
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
  })

  it('exposes entries as readonly data', () => {
    const entry: UpdateHistoryEntry = UPDATE_HISTORY[0]
    expect(entry).toBeDefined()
  })
})
