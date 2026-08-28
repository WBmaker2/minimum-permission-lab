import type { LearnerChoice } from '../../domain/model'

export const CHOICE_LABELS: Readonly<Record<LearnerChoice, string>> = {
  'allow-current-feature': '이번 기능에만 허용',
  deny: '허용하지 않음',
  'more-info': '설명을 더 확인',
}
