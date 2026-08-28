# 접근성·모바일·모션 감소 검증 체크리스트

검증일: 2026-08-28

## 자동화 검증 범위

- 브라우저: Playwright Chromium
- 프로젝트: `desktop-chromium`, `mobile-375` (375×812)
- 키보드: 포인터 API 없이 `Tab`, `Shift+Tab`, `Space`, `Enter`, `Escape` 중심의 학습 흐름
- 자동 접근성: 모든 학습 단계에서 axe serious/critical 위반 0, h1 1개, 논리적 제목 순서, 중복 없는 landmark, 표시되는 포커스, 레이블이 있는 입력, live region 확인
- 모션 감소: `reducedMotion: 'reduce'`, 애니메이션 0초, 고정 윤곽선과 보이는 단계 번호 확인
- 모바일: 수평 넘침 없음, primary action 가림 없음, 44px 터치 대상, 375px 비교 카드에서 네 권한의 최초·수정·변경 값 확인

## 수동 스크린 리더 확인 (이번 개선 범위에서 실행하지 않음)

- [ ] macOS VoiceOver에서 실제 실행함
- 보류: 이 작업에서는 GUI VoiceOver/TalkBack을 실행하지 않았습니다. 다음 수동 순서는 별도 승인된 검증에서 확인할 항목입니다.
  - 앱 제목과 가상 학습 모델 안내
  - 사례 이름과 완료 상태
  - 각 라디오 레이블과 선택 상태
  - 영향 변경 live-region 알림
  - 펼친 근거 제목
  - 업데이트 내역 제목과 닫은 뒤 트리거 포커스 복귀
  - 보고서 면책 문구와 표 열 제목

## 결과 기록

- 2026-08-27 자동화 결과: 정책 19개와 Vitest 20개 파일 205 passed, `npm run test:coverage` Statements 89.25% / Branches 87.07% / Functions 90.27% / Lines 95.19%, `npm run lint` passed, `npm run build` passed.
- Playwright Chromium 직렬 실행: `npm run test:e2e -- --workers=1` 15 passed + 1 intentional skip. `desktop-chromium`과 `mobile-375`(375×812, reduced-motion emulate)을 모두 포함했습니다.
- axe는 start, specification, initial-review, impact, revision-review, revocation, report 단계에서 serious/critical 위반 0건이었습니다. 키보드 전용 helper로 네 사례, 조건 비교 2건, 철회, 업데이트 내역 Escape 복귀, 보고서를 완료했습니다.
- 모바일 검증은 document 수평 overflow 0, primary action 가림 없음, 대상 44px 이상, 표의 contained horizontal scroll을 확인했습니다. reduced-motion은 animated element 0초, 고정 3px outline, 보이는 단계 번호를 확인했습니다.
- `npx playwright test e2e/privacy-safety.spec.ts --project=desktop-chromium --workers=1`: 2 passed. 병렬 전체 privacy 실행의 2건은 제품 assertion 전에 macOS Chromium MachPort 권한 거부/WebKit Abort trap으로 종료되어 환경 오류로 분리했습니다.
- 실제 권한 요청, 외부 네트워크 요청, 개인정보 저장 경계는 기존 privacy-safety 검증으로 회귀 확인했습니다.
- 사례 완료 표시는 `completed` 플래그만 사용하지 않고 영향 확인·조건부 비교·네 권한 선택·근거·통제 행동을 확인하는 공통 의미 predicate를 사용합니다. 이 검증은 자동화된 상태 위조 차단 증거이며, VoiceOver/TalkBack 수동 검증 대기 상태는 그대로입니다.
- Task16 전체 학습 흐름은 전용 `127.0.0.1:44173`에서 기본 저장 분기와 저장 동의·복원·UI 초기화 분기를 포함해 desktop-chromium·mobile-375 모두 통과했습니다.
- 2026-08-28 개선 회귀: 전용 `127.0.0.1:44173`의 desktop-chromium에서 accessibility·full-flow·reduced-motion·privacy를 직렬 실행해 9 passed + 1 intentional skip을 확인했습니다. 현재 환경의 `mobile-375` 프로젝트는 WebKit `webkit-2336` 실행 파일이 없어 브라우저 시작 전에 9개가 환경 실패했으며, 데스크톱 프로젝트의 320px·375px viewport 검사는 통과했습니다.
- 이번 개선의 모바일 보고서는 640px 이하에서 표 대신 네 권한 비교 카드로 바뀌고, 각 카드에 최초 선택·수정 선택·변경 여부를 모두 노출합니다. 데스크톱 표는 640px 이상에서 유지하며 키보드로 포커스할 수 있습니다.
