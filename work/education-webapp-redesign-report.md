# Minimum Permission Lab Redesign Report

## 결과 요약

초등 5~6학년 학습자가 첫 화면에서 해야 할 일을 빠르게 찾고, 각 단계의 조건과 결과 다음 행동을 이해하도록 기존 React/Vite 앱을 안전하게 리디자인했습니다. 가상 권한 판정, 사례 콘텐츠, 저장 모델, 개인정보 입력 금지, 외부 요청 금지 계약은 유지했습니다.

이번 작업은 커밋·푸시·릴리스·배포 없이 로컬 구현과 검증까지만 진행했습니다.

## 감사 발견 사항과 해결

| 발견 | 구현 결과 | 근거 경로 |
|---|---|---|
| A-01 사례 선택이 모바일에서 너무 아래에 있음 | `LearningOverview` 바로 뒤에 사례 선택과 단계 1 버튼을 배치하고 안전·저장 상세를 접힘 패널로 이동 | `src/features/start/LearningOverview.tsx`, `src/features/start/StartScreen.tsx` |
| A-02 단계 제목이 포커스되어도 화면 밖에 남음 | 포커스 후 `scrollIntoView`와 `scroll-margin-block-start`를 적용 | `src/components/focusStageHeading.ts`, `src/components/StageFocusManager.tsx`, `src/styles/global.css` |
| A-03 영향 CTA의 남은 조건이 모호함 | 조건 확인 수·스위치·수정 방향을 문장으로 계산하고 disabled CTA에 `aria-describedby` 연결 | `src/features/impact/impactProgress.ts`, `src/features/impact/ImpactScreen.tsx` |
| A-04 철회 CTA의 선택 조건이 모호함 | 선택 수·철회 수·보고서 준비 상태를 표시하고 두 CTA에 안내 연결 | `src/features/revoke/revocationProgress.ts`, `src/features/revoke/RevokeTrainingScreen.tsx` |
| A-05 사례 선택·완료 상태 단서가 약함 | 2열/1열 카드, 상태 텍스트, 테두리, `aria-pressed`, 설명 ID를 제공 | `src/features/start/CaseSelector.tsx`, `src/styles/components.css` |
| A-06 보고서 이후 학습 행동이 모호함 | 인쇄와 다시 시작의 수업 목적을 설명하는 `다음 학습 행동` 영역 추가 | `src/features/report/ReportScreen.tsx` |

추가로 초기 상태 문구의 “저장하지 않습니다” 표현을 “저장은 직접 선택합니다”로 수정해 opt-in 저장 안내와 일치시켰습니다.

## 학습자 UX 변경

- 시작 화면은 `학습 목표 → 사례 선택 → 기능 명세 보기 → 학습 범위와 안전 → 학습 기록` 순서입니다.
- 안전 요약 `실제 권한 없음 · 개인정보 입력 금지 · 저장은 직접 선택합니다.`는 항상 보이며, 범위·교사용 안내와 저장 삭제 방법은 native `<details>`로 펼칩니다.
- 사례 카드는 데스크톱 2열, 640px 이하 1열이며 `지금 선택한 사례`, `완료한 사례`, `선택 가능`을 색상 없이도 읽을 수 있습니다.
- 단계 제목은 키보드 포커스와 함께 viewport로 이동합니다. 기존 `gi-pulse`는 준비된 한 개의 핵심 행동에만 유지되고 reduced-motion에서는 정적 테두리로 대체됩니다.
- 영향·철회 화면은 disabled 상태에서 남은 조건을 수량과 다음 행동으로 안내합니다.
- 보고서 하단은 `인쇄해 수업에서 함께 돌아보기`와 `다시 시작해 다른 사례를 연습하기`를 설명합니다.
- `src/content/updateHistory.ts`에 2026-08-29 개선 기록을 추가했으며 자동 검증과 VoiceOver·TalkBack 미실행을 구분해 적었습니다.

## TDD 및 자동 검증

각 변경은 실패 테스트를 먼저 확인한 뒤 최소 구현과 회귀 검증을 진행했습니다. 주요 RED→GREEN 대상은 단계 제목 스크롤, 영향·철회 조건 안내, 시작 화면 순서·카드 상태, 보고서 다음 행동, 초기 저장 경계 문구입니다.

- `npm run test:policy`: Node 정책 테스트 19개 통과.
- `npm run test:run`: Vitest 24개 파일, 228개 테스트 통과.
- `npm run test:coverage`: Statements 90.61%, Branches 88.11%, Functions 91.07%, Lines 95.71%.
- `npm run lint`: exit 0, 오류·경고 없음.
- `npm run check:policy`: `source policy: 0 forbidden runtime references`.
- `npm run build`: TypeScript와 Vite production build 통과.
- `git diff --check`: 통과.
- 500줄 검사: `src`, `e2e`, `scripts`의 대상 파일에 500줄 이상 없음. 최장 파일은 `scripts/check-source-policy.mjs` 488줄입니다.

## 브라우저 검증

- 기본 `playwright.config.ts`의 `desktop-chromium`으로 `npx playwright test --project=desktop-chromium --workers=1` 실행: 9개 통과, 모바일 전용 1개 의도적 스킵.
- 375px viewport Chromium은 project 이름을 `mobile-375`로 맞춘 일회성 격리 설정(`/private/tmp/minimum-permission-lab-mobile-chromium.config.ts`)으로 전체 10개 통과했으며, 설정 파일은 검증 후 삭제했습니다.
- 확인 범위: 시작→네 사례→영향→수정→철회→보고서, 키보드 포커스·스크롤 경계, 사례 카드 순서, 320px/375px 가로폭, reduced-motion, 모바일 비교 카드, 업데이트 내역, localStorage opt-in 경계, 외부 요청·권한 요청 부재.
- canonical `mobile-375` WebKit 프로젝트는 현재 환경에 `/Users/kimhongnyeon/Library/Caches/ms-playwright/webkit-2336/pw_run.sh`가 없어 브라우저 시작 전에 9개가 실행되지 않았습니다. WebKit 통과로 기록하지 않습니다.
- 별도 headless 시각 캡처 스크립트는 macOS Chromium MachPort 권한 오류로 페이지 시작 전에 종료되었습니다. 제품 흐름 판정은 위 Playwright 테스트 러너 결과와 기존 공개 브라우저 감사 근거로 분리했습니다.

## 자산·지원 역할

- `public/favicon.svg`만 정체성 자산으로 확인해 유지했습니다. 학습 화면에는 이미지 import, `<img>`, `srcset`, CSS 배경 URL이 없어 `imagegen`은 `not run`입니다.
- `impeccable`, `ui-ux-pro-max`, `redesign-existing-projects`는 세션에 설치되어 있지 않아 `unavailable`입니다. 감사·디자인 시스템·구현은 저장소 소스와 브라우저 증거로 직접 수행했습니다.
- 기존 미추적 QA 스크린샷·`.playwright-mcp/`·PNG·snapshot 파일은 범위 밖 변경으로 보존했으며 이번 변경에 포함하지 않았습니다.

## 남은 단계

- 실제 초등학생과의 사용 세션 및 교사 관찰을 별도 승인 후 진행해야 합니다.
- VoiceOver/TalkBack 수동 검증은 이번 실행 범위에서 제외했으며, 실제 보조공학 환경에서 별도 확인해야 합니다.
- WebKit 검증은 실행 파일을 제공하는 CI 또는 승인된 환경에서 다시 실행해야 합니다.

## 릴리스 상태

구현은 로컬 작업 트리에만 남아 있습니다. 커밋, 푸시, 릴리스, 배포, HVC 등록은 실행하지 않았습니다.

## 2026-08-30 재실행 최신 기록

앞선 2026-08-29 섹션은 당시 공개 감사와 지원 역할 상태를 보존한 역사 기록입니다. 아래 결과가 이번 리디자인 재실행의 최신 상태이며, 이전 기록의 `unavailable` 표기는 당시 세션 기준입니다.

### 이번에 구현한 개선

- `AppHeader`, `ProgressIndicator`, `LearningModelNotice`를 한 덩어리의 헤더 정보 위계로 정리해 제목·현재 단계·가상 모델 경계를 중복 없이 읽게 했습니다.
- `LearningOverview`의 첫 행동 문장을 “먼저 네 가지 사례 중 하나를 골라 학습을 시작해 보세요.”로 짧게 바꾸고, 시작 화면에서 사례 선택이 안전·저장 상세보다 먼저 오도록 유지했습니다.
- `secondary-action`·`destructive-action`, 조건 힌트 표면, 버튼 hover/pressed 피드백을 추가해 핵심 행동과 보조 행동을 구분했습니다.
- `gi-pulse` aura는 레이아웃을 이동시키지 않으며, reduced-motion에서는 애니메이션 없이 포커스 테두리로 대체됩니다.
- 500줄 제한을 지키기 위해 업데이트 내역·상호작용 CSS를 `src/styles/interactive.css`로 분리했습니다. `components.css` 478줄, `interactive.css` 122줄입니다.
- `src/content/updateHistory.ts`에 2026-08-30 개선 이력을 추가했습니다. 자동 키보드·모바일 확인과 VoiceOver·TalkBack 미실행을 구분해 기록합니다.
- Impeccable 초기화 계약을 위해 `PRODUCT.md`를 추가했습니다. 사용자 인터뷰가 아닌 설계 문서 기반 추론임을 명시했습니다.

### 검증 증거

- RED→GREEN 회귀 대상: 헤더 구조, 첫 행동 문구, 보조 버튼 클래스, 조건 힌트 스타일, 버튼 눌림 피드백.
- `npm run test:run`: Node 정책 19개 + Vitest 24개 파일, 232개 테스트 통과.
- `npm run test:coverage`: Statements 90.61%, Branches 88.11%, Functions 91.07%, Lines 95.71%.
- `npm run lint`, `npm run check:policy`, `npm run build`, `git diff --check`: 모두 exit 0. 정책은 `0 forbidden runtime references`.
- 500줄 검사: 대상 파일 500줄 이상 0개.
- Impeccable detector(`detect.mjs --json`): `[]`.
- Playwright desktop Chromium 직렬: 10개 중 9개 통과, 모바일 전용 1개 의도적 스킵.
- 375px Chromium 격리 직렬: 10개 통과. 320px/375px 가로폭, 키보드 포커스·스크롤, reduced-motion, 전체 사례 흐름, 저장·외부 요청 경계를 포함했습니다.
- canonical WebKit `mobile-375`: `/Users/kimhongnyeon/Library/Caches/ms-playwright/webkit-2336/pw_run.sh` 부재로 브라우저 시작 전 실패. WebKit 통과로 주장하지 않습니다.

### 현재 보류와 릴리스 경계

- `$impeccable`, `$ui-ux-pro-max`, `$redesign-existing-projects`, `$imagegen`은 현재 세션에서 확인 가능한 지원 역할이며 필수 문서를 읽었습니다. 이미지 자산이 없어 `$imagegen`은 호출하지 않았습니다.
- 실제 초등학생 참여 세션, 교사 관찰, VoiceOver/TalkBack 수동 검증, WebKit 실행 환경 확보는 후속 단계입니다. 자동 결과는 사람의 사용성·보조공학 승인을 의미하지 않습니다.
- 커밋, 푸시, 릴리스, 배포, HVC 등록은 이번 요청에서 실행하지 않았습니다.
