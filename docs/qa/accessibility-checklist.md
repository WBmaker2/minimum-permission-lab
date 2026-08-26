# 접근성·모바일·모션 감소 검증 체크리스트

검증일: 2026-08-27

## 자동화 검증 범위

- 브라우저: Playwright Chromium
- 프로젝트: `desktop-chromium`, `mobile-375` (375×812)
- 키보드: 포인터 API 없이 `Tab`, `Shift+Tab`, `Space`, `Enter`, `Escape` 중심의 학습 흐름
- 자동 접근성: 모든 학습 단계에서 axe serious/critical 위반 0, h1 1개, 논리적 제목 순서, 중복 없는 landmark, 표시되는 포커스, 레이블이 있는 입력, live region 확인
- 모션 감소: `reducedMotion: 'reduce'`, 애니메이션 0초, 고정 윤곽선과 보이는 단계 번호 확인
- 모바일: 수평 넘침 없음, primary action 가림 없음, 44px 터치 대상, 비교 표의 필요한 가로 스크롤 컨테이너 확인

## 수동 스크린 리더 확인

- [ ] macOS VoiceOver에서 실제 실행함
- 보류: 이 자동화 실행에서는 GUI VoiceOver를 실행하지 않았습니다. 다음 수동 순서로 확인해야 합니다.
  - 앱 제목과 가상 학습 모델 안내
  - 사례 이름과 완료 상태
  - 각 라디오 레이블과 선택 상태
  - 영향 변경 live-region 알림
  - 펼친 근거 제목
  - 업데이트 내역 제목과 닫은 뒤 트리거 포커스 복귀
  - 보고서 면책 문구와 표 열 제목

## 결과 기록

- 2026-08-27 자동화 결과: 정책 19개와 Vitest 20개 파일 197 passed, `npm run test:coverage` Statements 90.02% / Branches 87.53% / Functions 89.47% / Lines 95.3%, `npm run lint` passed, `npm run build` passed.
- Playwright Chromium 직렬 실행: `npm run test:e2e -- --workers=1` 15 passed + 1 intentional skip. `desktop-chromium`과 `mobile-375`(375×812, reduced-motion emulate)을 모두 포함했습니다.
- axe는 start, specification, initial-review, impact, revision-review, revocation, report 단계에서 serious/critical 위반 0건이었습니다. 키보드 전용 helper로 네 사례, 조건 비교 2건, 철회, 업데이트 내역 Escape 복귀, 보고서를 완료했습니다.
- 모바일 검증은 document 수평 overflow 0, primary action 가림 없음, 대상 44px 이상, 표의 contained horizontal scroll을 확인했습니다. reduced-motion은 animated element 0초, 고정 3px outline, 보이는 단계 번호를 확인했습니다.
- `npx playwright test e2e/privacy-safety.spec.ts --project=desktop-chromium --workers=1`: 2 passed. 병렬 전체 privacy 실행의 2건은 제품 assertion 전에 macOS Chromium MachPort 권한 거부/WebKit Abort trap으로 종료되어 환경 오류로 분리했습니다.
- 실제 권한 요청, 외부 네트워크 요청, 개인정보 저장 경계는 기존 privacy-safety 검증으로 회귀 확인했습니다.
- Task16 전체 학습 흐름은 전용 `127.0.0.1:44173`에서 기본 저장 분기와 저장 동의·복원·UI 초기화 분기를 포함해 desktop-chromium·mobile-375 모두 통과했습니다.
