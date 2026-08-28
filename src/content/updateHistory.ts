export type UpdateHistoryCategory = '설계' | '개발' | '개선' | '콘텐츠 검수'

export interface UpdateHistoryEntry {
  readonly date: string
  readonly category: UpdateHistoryCategory
  readonly summary: string
  readonly reason: string
}

export const UPDATE_HISTORY: readonly UpdateHistoryEntry[] = [
  {
    date: '2026-08-28',
    category: '개선',
    summary: '모바일·키보드·보조기술 대응 구조와 저장 경계 보강',
    reason: '320px·375px 모바일 카드, 키보드 단계 포커스, 모션 감소 대체와 저장 동의(opt-in) 경계를 보강하고 자동 의미 구조를 확인함; VoiceOver·TalkBack 수동 실행 결과는 포함하지 않음',
  },
  {
    date: '2026-08-27',
    category: '개선',
    summary: '조건부 기능 스위치 재확인 흐름 보강',
    reason: '스위치를 끄면 조건 확인을 다시 하도록 하여 수정 권한안이 실제 비교 결과와 일치하게 함',
  },
  {
    date: '2026-08-27',
    category: '개발',
    summary: '사례 완료 기록의 의미적 검증 보강',
    reason: '완료 표시만 위조한 저장 기록이 영향 확인과 조건 비교를 건너뛰지 못하게 함',
  },
  {
    date: '2026-08-27',
    category: '개선',
    summary: '네 사례 완료 요약과 판단 변화 증거 표시',
    reason: '학생이 최초안과 수정안의 차이를 한눈에 확인하도록 함',
  },
  {
    date: '2026-08-27',
    category: '개선',
    summary: '모바일·키보드·구조적 보조기술 대응 보강',
    reason: '375px와 키보드 흐름, 자동 접근성 구조를 보강함; VoiceOver·TalkBack 수동 검증은 실행하지 않음',
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
    reason: '실제 개인정보를 수집하지 않도록 입력 금지 원칙을 안내하고, 저장 동의 시 권한 판단과 근거 원문이 이 기기에 보관될 수 있음을 구분함',
  },
  {
    date: '2026-08-26',
    category: '콘텐츠 검수',
    summary: '저장 동의 범위 안내 보강',
    reason: '가상 별명과 실제 개인정보는 수집·저장하지 않지만 저장 동의 시 권한 판단과 근거 원문은 로컬 학습 기록에 보관될 수 있음을 구분함',
  },
] as const
