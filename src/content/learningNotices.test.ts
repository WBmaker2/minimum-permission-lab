import { describe, expect, it } from 'vitest'

import {
  HELP_REQUEST_NOTICE,
  LEARNING_MODEL_NOTICE,
  NOT_IN_SCOPE_NOTICE,
  TEACHER_GUIDE_NOTICE,
} from './learningNotices'
import { GROUP_BOARD_ALIAS_EXAMPLES } from './cases/groupBoard'

describe('learning safety notices', () => {
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
})
