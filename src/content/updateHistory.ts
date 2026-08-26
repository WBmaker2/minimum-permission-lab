export type UpdateHistoryCategory = '설계' | '개발' | '개선' | '콘텐츠 검수'

export interface UpdateHistoryEntry {
  readonly date: string
  readonly category: UpdateHistoryCategory
  readonly summary: string
  readonly reason: string
}

export const UPDATE_HISTORY: readonly UpdateHistoryEntry[] = [
  {
    date: '2026-08-27',
    category: '개선',
    summary: '모바일·키보드·스크린 리더 검증 보강',
    reason: '375px와 보조기술 사용자가 전체 학습 흐름을 완료하도록 함',
  },
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
  {
    date: '2026-08-26',
    category: '콘텐츠 검수',
    summary: '개인정보 및 가상 모델 안내 검증',
    reason: '실제 권한 요청과 개인정보 저장이 없음을 학습자에게 더 분명히 알림: 이는 가상 별명과 실제 개인정보를 수집·저장하지 않는다는 뜻이며, 이 기기에 저장 동의 시 권한 판단과 근거 원문은 로컬 학습 기록에 보관될 수 있음을 함께 명시함',
  },
  {
    date: '2026-08-26',
    category: '콘텐츠 검수',
    summary: '저장 동의 범위 안내 보강',
    reason: '가상 별명과 실제 개인정보는 수집·저장하지 않지만 저장 동의 시 권한 판단과 근거 원문은 로컬 학습 기록에 보관될 수 있음을 구분함',
  },
] as const
