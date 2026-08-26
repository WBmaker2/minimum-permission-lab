export type UpdateHistoryCategory = '설계' | '개발' | '개선' | '콘텐츠 검수'

export interface UpdateHistoryEntry {
  readonly date: string
  readonly category: UpdateHistoryCategory
  readonly summary: string
  readonly reason: string
}

export const UPDATE_HISTORY: readonly UpdateHistoryEntry[] = [
  {
    date: '2026-08-26',
    category: '설계',
    summary: '최초 설계 문서 작성',
    reason: '가상 권한 모델과 초등 학습 흐름의 범위를 정의함',
  },
  {
    date: '2026-08-26',
    category: '개발',
    summary: '4개 사례 MVP 학습 흐름 구현',
    reason: '네 가지 가상 사례에서 권한 선택, 영향 확인, 근거 작성과 철회 연습을 연결함',
  },
  {
    date: '2026-08-26',
    category: '콘텐츠 검수',
    summary: '가상 권한 모델과 사례 표현 검토',
    reason: '실제 앱이나 운영체제에 그대로 일반화하지 않도록 경계를 명시함',
  },
  {
    date: '2026-08-26',
    category: '개선',
    summary: '핵심 버튼 강조와 모션 감소 대체 추가',
    reason: '중요한 다음 행동을 분명히 하면서 모션 감소 사용자는 고정 강조로 확인하도록 함',
  },
] as const
