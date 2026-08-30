# Elementary Web App UX Improvement Plan

## Mode and scope

- Mode: `full`
- Target: `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab`
- Surface: Vite + React + TypeScript learner SPA, start screen through report
- Date: 2026-08-30
- Primary persona: simulated 초5–6 서윤 (10–12세, 제목과 버튼을 먼저 훑고 근거를 기대함)
- Guardrail persona: simulated 초3–4 준호 (8–10세, 한 단계 조건과 즉시 피드백을 기대함)
- Evidence boundary: simulated learner panel과 브라우저 관찰만 사용합니다. 실제 아동 표본, 교사 관찰, VoiceOver/TalkBack 실행 또는 승인을 주장하지 않습니다.
- Existing plan reused: `work/education-webapp-redesign-plan.md`의 A-01~A-06 해결 상태와 현재 `PRODUCT.md`, `design-system/MASTER.md`를 보존하고 이번 계획은 새 학생 패널 기준선에서 발견한 잔여 마찰만 다룹니다.

## Goal

서윤이 처음 화면에서 학습 목표와 첫 사례를 바로 찾고, 키보드로 단계 제목에서 다음 학습 조작으로 자연스럽게 이동하며, 사례를 고른 직후 `기능 명세 보기`를 놓치지 않게 합니다. 기존의 가상 권한 판정, 최초안·수정안 비교, 조건부 시나리오, 철회 연습, 개인정보 입력 금지, 선택 저장 계약은 바꾸지 않습니다.

완료 목표는 다음과 같습니다.

1. 초기 키보드 경로에서 첫 `Tab`이 헤더의 중복 안전 상세가 아니라 `사진 스캔 과제함` 사례 버튼에 도달합니다.
2. 사례 선택 후 primary CTA가 enabled·focused 상태가 되고 브라우저 viewport 안으로 자동 스크롤되어 다음 행동을 한 번에 확인할 수 있습니다.
3. 320×800, 375×812, 1280×900에서 가로 넘침이 없고 모바일 첫 viewport에 목표와 첫 사례 행동의 단서가 함께 나타납니다.
4. `prefers-reduced-motion: reduce`에서 CTA 포커스 이동과 정적 `gi-pulse` 강조가 유지되고 반복 애니메이션은 실행되지 않습니다.
5. 업데이트 내역 버튼과 `UPDATE_HISTORY`의 2026-08-30 기록을 보존하며, 보조기술 수동 실행을 완료했다고 기록하지 않습니다.

## Architecture

현재 상태 머신과 도메인 판정은 유지합니다.

- `LabProvider`와 `labReducer`는 학습 상태의 단일 진실 공급원입니다.
- `App`은 `AppHeader` → `StageFocusManager` → 현재 단계 화면 순서를 유지합니다.
- 헤더는 반복 가능한 가상 모델 요약만 제공하고, 상세 안전·교사용 설명의 상호작용 원본은 시작 화면의 `details`로 둡니다. 이로써 화면 위 중복 disclosure가 키보드 순서를 가로채지 않습니다.
- `StartScreen`은 `CaseSelector`에서 사례를 선택하면 `PrimaryActionButton`을 ref로 찾아 포커스합니다. React commit 뒤 한 번만 실행하며, 첫 렌더의 자동 포커스나 완료 사례의 disabled 버튼에는 실행하지 않습니다.
- `LearningOverview`의 다음 행동 문장은 `aria-live="polite"`로 선택 상태 변화를 알리고, 버튼의 실제 accessible name과 같은 동사를 사용합니다.
- 스타일은 기존 토큰과 라이트 모드를 유지합니다. 모바일에서만 헤더 내부 패딩·제목 크기·모델 요약 간격을 줄이고, 콘텐츠 폭·44px 터치 목표·3px focus ring은 유지합니다.

## Tech Stack

- Vite 8, React 19, TypeScript 6
- Native HTML buttons, details/summary, radio, checkbox, textarea
- Vitest + React Testing Library + user-event
- Playwright 브라우저 증거(프로젝트의 기존 `@playwright/test` 시나리오와 전용 375px Chromium 설정)
- ESLint, `npm run check:policy`, Vite production build
- CSS media query `@media (max-width: 520px)`와 `@media (prefers-reduced-motion: reduce)`
- 새 패키지, 외부 폰트, CDN, 분석 SDK, 권한 API, 외부 네트워크, 이미지 자산을 추가하지 않습니다. 현재 학습 UI는 텍스트·CSS 도형으로 충분하므로 `imagegen`은 실행하지 않습니다.

## Spec traceability

| 설계·루브릭 요구 | 구현 연결 | 확인 방법 |
|---|---|---|
| 기능 목적을 먼저 확인하고 최소 권한을 선택 | `LearningOverview` → `CaseSelector` → `FeatureSpecScreen` 순서를 보존 | start DOM 순서와 첫 viewport snapshot |
| 사례·최초안·수정안·조건부·철회·보고서 흐름 | `LabStage`, `labReducer`, 기존 단계 컴포넌트를 변경하지 않음 | 기존 full-learning-flow 4사례 완주 |
| 가상 모델·개인정보·저장 경계 | `LearningModelNotice`는 요약만, 상세 계약은 start disclosure에 유지 | privacy E2E와 localStorage 키/문구 검사 |
| 초5–6 짧은 문장·근거 설명 | `LearningOverview` 다음 행동 문장과 사례 선택 행동을 직접 표현 | 문자열 테스트와 simulated panel 기록 |
| 키보드·포커스·의미 | `PrimaryActionButton` ref 전달, 선택 후 CTA focus, h2 stage focus 유지 | `e2e/accessibility.spec.ts` Tab/Space/Enter 검증 |
| 320/375 모바일 가독성 | 모바일 header compact CSS와 CTA viewport 확인 | 320·375 screenshot, `scrollWidth <= clientWidth` |
| `gi-pulse`와 reduced motion | 기존 aura-only animation과 정적 focus outline 유지 | CSS source test와 mobile reduced-motion E2E |
| 업데이트 내역·날짜 기록 | `src/content/updateHistory.ts`에 2026-08-30 개선 항목 추가 | `updateHistory.test.ts`, 업데이트 dialog E2E |
| MVP 완료 기준·안전 | 도메인·저장·외부 요청 계약을 건드리지 않음 | policy/lint/unit/coverage/build/privacy gates |

## Global Constraints

- 실제 `navigator.permissions`, 카메라·마이크·위치·연락처 API, 외부 fetch/WebSocket/분석을 호출하지 않습니다.
- 저장은 사용자가 `이 기기에 저장`을 켠 뒤 기존 `PROGRESS_STORAGE_KEY` 하나만 사용합니다. 새 개인정보 필드나 별명 저장 경로를 만들지 않습니다.
- 학생 화면의 개인정보 금지와 opt-in 근거 원문 저장 가능성은 분리해서 설명합니다.
- 핵심 버튼은 화면당 하나만 `gi-pulse`를 사용하며, aura는 버튼 본체의 위치·크기를 바꾸지 않습니다. reduced-motion에서는 animation/transition을 끄고 고정 focus-colored outline을 제공합니다.
- 모든 interactive target은 최소 44px, visible `:focus-visible`, 논리적 DOM 순서를 유지합니다.
- 새 소스·테스트·스타일 파일은 500줄 미만입니다. 350줄에 가까워지면 책임별 모듈로 분리합니다.
- 라이트 모드만 유지하고 `prefers-color-scheme: dark`를 추가하지 않습니다.
- 실제 사용자 연구나 VoiceOver/TalkBack 기능·검증을 추가하지 않습니다.
- 이번 턴에서는 패키지 설치, Git commit, push, repository 설정, Pages 배포를 실행하지 않습니다. 계획에 적은 명령은 이후 실행할 명령입니다.

## Baseline evidence and learner panel

기준선은 로컬 Vite 서버 `http://127.0.0.1:44175/`에서 2026-08-30에 관찰했습니다. 캡처는 다음에 보관했습니다.

- `output/playwright/elementary-baseline-320.png`
- `output/playwright/elementary-baseline-375.png`
- `output/playwright/elementary-baseline-1280.png`
- Stage 0: `work/elementary-webapp-ux-bootstrap.md` (`ready`, `playwright` runtime-available)

| persona / viewport | step | visible cue | action | observed result | learner-facing note |
|---|---|---|---|---|---|
| 서윤 / 320×800 | 첫 화면 | 목표와 “네 가지 사례” 문장은 보임 | 화면을 아래로 훑음 | 헤더 395px와 목표 카드 271px 뒤에 사례 버튼이 viewport 아래로 밀림 | 무엇을 배우는지는 알지만 첫 클릭까지 긴 스크롤이 필요함 |
| 서윤 / 375×812 | 첫 키보드 이동 | 단계 제목에 focus가 있음 | `Tab` | 첫 focus가 헤더 `자세히 보기` summary로 이동하고 사례 버튼보다 앞섬 | 현재 단계에서 다음 행동으로 가는 순서가 시각 순서와 다름 |
| 서윤 / 375×812 | 사례 선택 | 사례 버튼이 선택 가능으로 보임 | `사진 스캔 과제함` 클릭 | `기능 명세 보기`가 enabled·gi-pulse가 되지만 문서 아래 y≈1116에 남음 | 선택 결과는 알지만 다음 버튼을 다시 찾아 스크롤해야 함 |
| 준호 / 1280×900 | 오답 회복 | 권한별 판정 근거와 대안이 보임 | 카메라는 허용, 나머지는 거부 | 기능 영향 화면에서 필수/불필요 근거와 `대안 사용`/`권한 철회`가 분리되어 재시도 가능 | 오답을 비난하지 않고 이유를 비교할 수 있음 |
| 서윤 / 320×800 | 완료 후 | 보고서에는 다음 학습 행동 영역이 존재함 | 완주 스크립트 실행 | `다음 학습 행동`이 문서 하단에 위치하고 두 CTA가 목적을 설명함 | 결과 다음의 행동은 명확하지만 전체 보고서가 길어 교사의 안내가 필요함 |

### Baseline acceptance score (보조 지표)

| 영역 | 점수 | 근거 |
|---|---:|---|
| 학습 목표·과제 명료성 | 13/15 | 목표와 첫 행동 문장은 첫 화면에 보임 |
| 아동 언어·인지부하 | 13/15 | 직접적인 존댓말과 근거 설명이 있으나 시작 헤더가 길음 |
| 화면 구조·행동 위계 | 11/15 | 카드 선택 뒤 CTA가 멀고 헤더 disclosure가 먼저 focus됨 |
| 피드백·오류 회복 | 13/15 | live status, 조건 힌트, 다시 시도가 동작함 |
| 시각적 가독성 | 8/10 | 대비·타깃 크기는 안정적이나 320px 세로 밀도가 높음 |
| 키보드·의미·기본 접근성 | 6/10 | native control과 focus ring은 있으나 stage h2 뒤 Tab 순서가 역행함 |
| 반응형 학습 흐름 | 8/10 | 가로 넘침은 없지만 첫 사례 행동이 첫 viewport 밖임 |
| 런타임 안정성 | 5/5 | 기준선에서 콘솔·실패 요청·깨진 자산 없음 |
| 맥락적 시각자료·자산 안전 | 5/5 | 사실성 이미지 없이 텍스트·CSS 도형으로 학습 계약을 표현함 |
| **합계** | **82/100** | P0/P1 없음, P2 마찰 3개 |

## Issue ledger and approved changes

### EDU-UX-001 — P2 — Stage focus 뒤 헤더 summary로 역행하는 키보드 순서

- Path/state: `/` 또는 모든 stage transition 직후, `h2[data-stage-heading]` focused
- Persona/viewport: 서윤 / 375×812; 준호 / 키보드 전용
- Observed action/result: `Tab` 한 번 뒤 `LearningModelNotice`의 `자세히 보기` summary가 focus됨. 사례·현재 단계 콘텐츠보다 화면 위 중복 설명을 먼저 통과합니다.
- Evidence: `output/playwright/elementary-baseline-375.png`, browser run result `afterStage=H2`, `next=SUMMARY 자세히 보기`
- Learner impact: 핵심 과제는 막히지 않지만 시각 순서와 Tab 순서가 달라 현재 단계의 첫 조작을 기억해야 합니다.
- Root-cause hypothesis: 헤더의 상세 disclosure가 `main`보다 앞선 DOM에 있고 시작 화면에도 동일한 안전 상세가 있어 interactive stop이 중복됩니다.
- Proposed change: `src/components/LearningModelNotice.tsx`에서 `<details>`를 제거하고 `LEARNING_MODEL_SUMMARY`만 note로 렌더링합니다. 상세 계약은 `StartScreen`의 기존 `학습 범위와 안전 더 보기`와 `저장 범위와 삭제 방법`에 남깁니다.
- Verification: initial/stage transition 후 `Tab` focus가 사례 버튼 또는 해당 stage의 첫 학습 control에 도달하고, header에는 interactive summary가 없으며, safety details는 start screen에서 계속 열립니다.
- Status: fixed. Header summary는 note 문단만 렌더링하고 stage heading 뒤 첫 Tab은 `사진 스캔 과제함` 사례 버튼으로 이동했습니다.

### EDU-UX-002 — P2 — 320/375px 첫 사례 행동이 첫 viewport 아래로 밀림

- Path/state: `/` 초기 상태
- Persona/viewport: 서윤 / 320×800, 375×812
- Observed action/result: 320px에서 header 395px, 목표 카드 271px 뒤에 사례 선택 영역이 시작됩니다. 375px에서도 첫 사례 버튼이 y≈912에 있어 첫 viewport에서 보이지 않습니다.
- Evidence: `output/playwright/elementary-baseline-320.png`, `output/playwright/elementary-baseline-375.png`, snapshot boxes
- Learner impact: “무엇을 배울지”는 알지만 “어떤 버튼을 누를지”를 찾기 위해 긴 스크롤을 해야 합니다.
- Root-cause hypothesis: mobile header padding·title·notice가 데스크톱 간격을 그대로 유지하고, 사례 선택 전 모델 안전 상세가 헤더 interactive control로 남아 있습니다.
- Proposed change: `src/styles/responsive.css`의 `max-width: 520px` 규칙에서 header padding, `h1` font-size/line-height, `.learning-model-notice` margin/padding를 줄여 첫 사례 영역을 위로 당깁니다. 텍스트 크기는 16px 본문과 44px target을 유지합니다.
- Verification: 320/375 screenshot에서 첫 사례 버튼의 top이 문서 첫 800/812px 안에 들어오거나, 사례 선택 후 CTA focus가 viewport 안으로 이동하며 `scrollWidth === clientWidth`입니다.
- Status: fixed. 320px·375px에서 첫 사례 버튼과 선택 후 CTA가 viewport 안에 있고 `scrollWidth === clientWidth`를 확인했습니다.

### EDU-UX-003 — P2 — 사례 선택 후 다음 CTA가 먼 위치에 남음

- Path/state: `/` → 사례 선택, `activeCaseId !== null`
- Persona/viewport: 서윤 / 320×800, 375×812; 준호 / Space로 사례 선택
- Observed action/result: 사례 버튼을 클릭하면 `기능 명세 보기`가 enabled·gi-pulse가 되지만 선택한 카드 아래 문서 y≈1116에 있어 다시 찾고 스크롤해야 합니다. `LearningOverview` 문장은 “아래 버튼”을 가리키지만 viewport 안에 버튼이 없습니다.
- Evidence: browser snapshot after selecting photo case (`기능 명세 보기` box y≈1116), `src/features/start/LearningOverview.tsx`
- Learner impact: 선택 성공 여부는 알 수 있지만 다음 학습 행동을 스스로 연결하지 못하고 멈출 수 있습니다.
- Root-cause hypothesis: primary action이 `CaseSelector` 뒤에 렌더링되지만 selection event가 focus/scroll을 안내하지 않습니다.
- Proposed change: `PrimaryActionButton`을 `forwardRef` 기반으로 바꾸고, `StartScreen`이 `pendingSelectionRef`를 통해 selection commit 직후 CTA에 focus합니다. `LearningOverview`의 next-action paragraph에 `aria-live="polite"`를 추가합니다.
- Verification: 사례 버튼 click/Space 뒤 CTA가 enabled·`gi-pulse`·focused이고 bounding box가 viewport 안이며, Enter가 즉시 specification stage로 이동합니다. 자동 포커스는 초기 렌더·완료 카드에는 발생하지 않습니다.
- Status: fixed. `PrimaryActionButton` ref와 selection effect로 CTA가 enabled·focused 상태가 되며 `aria-live="polite"`가 선택 안내를 알립니다.

### EDU-UX-004 — P3 — 헤더와 시작 화면의 안전 상세 중복

- Path/state: 모든 stage의 header와 start stage safety section
- Persona/viewport: 서윤 / 320×800
- Observed action/result: 헤더 `자세히 보기`와 시작 화면 `학습 범위와 안전 더 보기`가 같은 경계를 서로 다른 위치에서 열 수 있습니다.
- Learner impact: 중요한 첫 행동보다 시스템 경계 설명이 두 번 보이고 시작 화면 세로 밀도가 커집니다.
- Proposed change: header는 한 문장 요약만 제공하고 상세 설명은 시작 화면의 labelled details를 단일 source로 유지합니다.
- Verification: `LEARNING_MODEL_DETAILS`는 start details를 열 때 보이며, header에는 중복 disclosure가 없고 privacy 문구·저장 경계 테스트가 유지됩니다.
- Status: fixed. 헤더에는 interactive disclosure가 없고 시작 화면의 `학습 범위와 안전 더 보기`가 상세 원본으로 유지됩니다.

## Expected file structure and responsibilities

- `src/components/LearningModelNotice.tsx`: `LEARNING_MODEL_SUMMARY`만 렌더링하는 non-interactive `role="note"`.
- `src/components/PrimaryActionButton.tsx`: `forwardRef<HTMLButtonElement, PrimaryActionButtonProps>`로 native button ref를 외부에 전달하고 `data-step`, `gi-pulse` 계약을 유지.
- `src/features/start/StartScreen.tsx`: `actionRef`, `pendingSelectionRef`, selection effect, existing storage/safety sections를 담당.
- `src/features/start/LearningOverview.tsx`: 선택 전·후 next action의 visible 문장과 `aria-live="polite"`를 담당.
- `src/main.tsx`: `responsive.css`를 기존 토큰·컴포넌트 레이어와 interactive/print 레이어 사이에 로드.
- `src/styles/components.css`: 기존 cards/buttons/details/gi-pulse 토큰을 담당.
- `src/styles/responsive.css`: 520px 이하 header compact rhythm과 좁은 화면 콘텐츠 간격을 담당.
- `src/content/learningNotices.test.ts`: summary/detail content contract와 header의 non-interactive 구조를 검증.
- `src/components/PrimaryActionButton.test.tsx`: ref가 native button에 연결되는지와 `data-step`/pulse class를 검증.
- `src/features/start/StartScreen.test.tsx`: click 후 selection callback, rerender 후 focus, aria-live next action을 검증.
- `src/features/start/LearningOverview.test.tsx`: 선택 전·후 live paragraph 문구와 exact accessible attribute를 검증.
- `src/styles/styles.test.ts`: mobile compact rules, 44px target, reduced-motion static fallback source contract를 검증.
- `e2e/accessibility.spec.ts`: first Tab order, case selection focus, stage heading focus, header disclosure removal, native controls를 검증.
- `e2e/mobile-reduced-motion.spec.ts`: 320/375 client width, CTA viewport/focus, reduced-motion class/animation 상태를 검증.
- `src/content/updateHistory.ts`: 2026-08-30 student-panel 개선 날짜·요약·범위를 newest-first로 기록.
- `src/content/updateHistory.test.ts`: 최신 날짜·요약, 실제 아동/VoiceOver 승인 과장 금지 문자열을 검증.
- `work/elementary-webapp-ux-audit.md`: 이번 기준선 관찰과 점수, 이슈 ledger를 보존.
- `work/elementary-webapp-ux-report.md`: 동일 시나리오 재검증 결과와 최종 게이트를 기록.

## TDD implementation sequence

### Step 1 — Lock the baseline audit before source edits

- [x] Record Stage 0 `ready` report at `work/elementary-webapp-ux-bootstrap.md`.
- [x] Record simulated panel baseline and 82/100 score in `work/elementary-webapp-ux-audit.md`.
- [x] Record EDU-UX-001~004 with exact paths, evidence, impact, and status.
- [x] Do not modify source files until this plan and audit are saved.

### Step 2 — Fix duplicate header disclosure and keyboard order

**Files:** modify `src/components/LearningModelNotice.tsx`, `src/content/learningNotices.test.ts`, `e2e/accessibility.spec.ts`.

**Interfaces:** `LearningModelNotice` keeps its no-props function signature; `LEARNING_MODEL_SUMMARY` and `LEARNING_MODEL_DETAILS` exports remain unchanged.

- [x] RED: change `src/content/learningNotices.test.ts` to assert one visible header summary, no header `summary`, and `LEARNING_MODEL_DETAILS` visible only after the start-screen safety disclosure opens. Add an accessibility assertion that after the focused start heading, the next Tab is `사진 스캔 과제함`.
- [x] Run `npm run test:run -- src/content/learningNotices.test.ts src/features/start/StartScreen.test.tsx` and record RED: the old header `자세히 보기` summary was found and the first Tab was `SUMMARY`.
- [x] GREEN: render `<p className="learning-model-notice__title">가상 학습 모델</p>` and `<p className="learning-model-notice__summary">{LEARNING_MODEL_SUMMARY}</p>` inside the existing note. Keep detail text reachable from `StartScreen` details.
- [x] Run focused Vitest. Browser runner was attempted but its local Chromium/WebKit binaries were unavailable; equivalent mcp Playwright browser observation confirmed header has zero `summary` elements, start safety details still open/close, and first Tab reaches the first case button.
- [x] Regression: focused tests pass; full lint/build are included in Step 6.

### Step 3 — Make the primary action ref-safe and selection-directed

**Files:** create `src/components/PrimaryActionButton.test.tsx`; modify `src/components/PrimaryActionButton.tsx`, `src/features/start/StartScreen.tsx`, `src/features/start/StartScreen.test.tsx`, `src/features/start/LearningOverview.tsx`, `src/features/start/LearningOverview.test.tsx`.

**Interfaces:** export `PrimaryActionButtonProps` unchanged and implement `React.ForwardRefExoticComponent<PrimaryActionButtonProps & React.RefAttributes<HTMLButtonElement>>`; keep `StartScreenProps`, `LearningOverviewProps`, `data-step`, and all callbacks unchanged.

- [x] RED: add a ref test that expects `ref.current` to equal the rendered native button; add a StartScreen interaction test that after `사진 스캔 과제함` selection and parent state rerender expects `기능 명세 보기` to be focused; add a live-region attribute assertion for the selected next-action sentence. RED captured: ref was absent, focus stayed on the case button, and the live attribute was missing.
- [x] Run the focused Vitest command and record the four expected failures before implementation.
- [x] GREEN: wrap `PrimaryActionButton` in `forwardRef`; in `StartScreen`, set `pendingSelectionRef.current = true` before `onSelectCase`, then use an effect keyed by `state.activeCaseId` to focus `actionRef.current` once when selection is pending. Add `aria-live="polite"` to `.learning-overview__next-action`.
- [x] Run the focused tests. Expected GREEN achieved: callback receives the selected case, CTA becomes enabled, focus moves to the CTA after commit, and selected copy is announced.
- [x] Regression: focused `src/app`/`src/features/start` tests and `git diff --check` remain clean; modal focus guard prevents selection focus from stealing update-dialog focus.

### Step 4 — Compact the mobile header without weakening readability

**Files:** create `src/styles/responsive.css`; modify `src/main.tsx`, `src/styles/components.css`, `src/styles/styles.test.ts`, `e2e/mobile-reduced-motion.spec.ts`.

**Interfaces:** no TypeScript interface changes; CSS tokens remain in `src/styles/tokens.css`.

- [x] RED: add a browser assertion for 320px and 375px that records the first case button and focused CTA bounding boxes; add a source test requiring a mobile header compact rule. Source RED captured because the compact rule was absent; the browser runner was blocked by missing local binaries.
- [x] Run `npm run test:run -- src/styles/styles.test.ts`; browser CLI attempt recorded the concrete missing `chromium_headless_shell`/`webkit-2336` paths.
- [x] GREEN: in `src/styles/responsive.css` `@media (max-width: 520px)`, set `.app-header` padding to `var(--space-3) var(--space-3) var(--space-2)`, `.app-header__bar h1` to `font-size: clamp(1.75rem, 8vw, 2.25rem)` with `line-height: 1.15`, `.learning-model-notice` margin/padding to `var(--space-2)`, and preserve 1rem body text, 44px summary/button targets, border contrast, and `max-inline-size: 100%`; shorten the first-action and case prompt copy to fit 320px.
- [x] Equivalent mcp Playwright browser observation passed: no horizontal overflow, first case button is fully visible at 320/375, post-selection CTA is focused and visible, and reduced-motion behavior remains static.
- [x] Run the Impeccable detector once on changed markup. Result: `[]`.

### Step 5 — Update the dated history and audit trace

**Files:** modify `src/content/updateHistory.ts`, `src/content/updateHistory.test.ts`, `work/elementary-webapp-ux-audit.md`.

**Interfaces:** keep `UpdateHistoryEntry` fields and newest-first ordering unchanged.

- [x] RED: require the newest entry to contain ISO date `2026-08-30`, `초등 학습자 첫 행동과 키보드 순서 개선`, compact mobile header, selection CTA focus, and reduced-motion wording; reject claims of real student or manual screen-reader approval. RED captured against the previous first entry.
- [x] Run `npm run test:run -- src/content/updateHistory.test.ts` and record the previous-entry mismatch.
- [x] GREEN: append a concise dated entry describing observed simulated-panel improvements, automated keyboard/mobile checks, and the fact that real child/VoiceOver/TalkBack sessions were not run.
- [x] Focused content test passes with the new dated scope and boundary.

### Step 6 — Same-scenario revalidation and final report

**Files:** create `work/elementary-webapp-ux-report.md`; modify no source files in this step.

- [x] Run local gates in order: `npm run test:policy` (19/19), `npm run check:policy` (0 forbidden references), `npm run lint` (exit 0), `npm run test:run` (25 files/235 tests), `npm run test:coverage` (Statements 90.74%, Branches 88.19%, Functions 91.13%, Lines 95.77%), `npm run build` (Vite production bundle), `git diff --check` (clean), and the 500-line check (no output).
- [x] Keep the isolated app server at `http://127.0.0.1:44175/` during browser checks. The server was started with `npm run dev -- --host 127.0.0.1 --port 44175 --strictPort`; it remains local-only and is stopped after evidence capture.
- [x] Attempt the desktop and mobile Playwright CLI projects. They are recorded as environment-blocked because the local Chromium headless shell and WebKit executables are absent; no browser installation was performed. Equivalent MCP Playwright checks passed for focus order, full learner path, storage boundary, no external requests, mobile viewport, and reduced motion.
- [x] Re-run the simulated panel at 320×800, 375×812, and 1280×900 with the same start→select→specification→wrong permission→revised decision→revocation→report sequence. Captured `output/playwright/elementary-final-320.png`, `output/playwright/elementary-final-375.png`, and `output/playwright/elementary-final-1280.png` and visually checked the 375px result.
- [x] Write `work/elementary-webapp-ux-report.md` with mode, target, date, Stage 0 status, persona, baseline/final score, P0–P3 ledger, changed files, image decision, exact commands/results, excluded VoiceOver/TalkBack/WebKit evidence, learner takeaway, and remaining human-review stages. Final score is 92/100 with zero P0/P1.

## Future command matrix and expected results

| Purpose | Future command | Expected result |
|---|---|---|
| Focused component RED→GREEN | `npm run test:run -- src/components/PrimaryActionButton.test.tsx src/content/learningNotices.test.ts src/features/start/StartScreen.test.tsx src/features/start/LearningOverview.test.tsx` | New ref, disclosure, focus, and live-region assertions fail before implementation and pass after it |
| CSS/mobile RED→GREEN | `npm run test:run -- src/styles/styles.test.ts` plus isolated `npx playwright test e2e/mobile-reduced-motion.spec.ts --project=mobile-375 --workers=1` | Compact rule, no overflow, visible CTA, stable pulse, and reduced-motion fallback pass |
| Policy and lint | `npm run test:policy && npm run check:policy && npm run lint` | No forbidden runtime references; ESLint exit 0 |
| Unit and coverage | `npm run test:run && npm run test:coverage` | All Vitest tests pass; coverage stays at or above documented baseline or has an explicit measured explanation |
| Production build | `npm run build` | TypeScript and Vite production bundle complete successfully |
| Browser learner path | `npx playwright test e2e/accessibility.spec.ts e2e/full-learning-flow.spec.ts e2e/privacy-safety.spec.ts --project=desktop-chromium --workers=1` | Keyboard order, complete learning path, storage/privacy and no external requests pass |
| Mobile learner path | `npx playwright test e2e/mobile-reduced-motion.spec.ts --project=mobile-375 --workers=1` | 375px reduced-motion and CTA viewport assertions pass; WebKit is separately reported if unavailable |
| Size guard | `find src e2e scripts -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.mjs' \) -exec wc -l {} + | awk '$2 != "total" && $1 >= 500 {print}'` | No output |
| Impeccable detector | `node /Users/kimhongnyeon/.agents/skills/impeccable/scripts/detect.mjs --json src/components/LearningModelNotice.tsx src/components/PrimaryActionButton.tsx src/features/start/StartScreen.tsx src/features/start/LearningOverview.tsx` | Empty findings or all mechanical findings fixed and documented |

## Future commit sequence

1. `fix: keep learner focus on the next action` — remove duplicate header disclosure, forward CTA ref, focus CTA after case selection, and update focused tests.
2. `fix: shorten the mobile start path` — compact mobile header rhythm, add 320/375 browser assertions, and preserve target sizes/reduced-motion fallback.
3. `docs: record elementary learner ux review` — update dated history, baseline/final audit, and the final report after all gates pass.

These commits are future execution steps only. No commit, push, repository creation, Pages deployment, or HVC action is authorized or executed by this plan.

## Self-review checklist

- [x] Learning goal, prior differentiation, full learning flow, content/judgment model, accessibility, privacy/safety, MVP boundaries, and completion gates are linked to exact files and tests.
- [x] Primary and guardrail personas, viewport evidence, first action, wrong-choice recovery, completion behavior, keyboard order, and learner-facing notes are recorded.
- [x] `gi-pulse`, reduced-motion fallback, update history date, mobile·keyboard·screen-reader semantic checks are explicit; no VoiceOver implementation or validation is promised.
- [x] Every implementation step has exact paths, interface names, RED command, minimal GREEN change, passing command, and acceptance condition.
- [x] Placeholder scan passed: every step names a concrete path, interface, command, and acceptance condition without incomplete markers.
- [x] Type names and file responsibilities are consistent with the existing React/Vite codebase; no planned file exceeds 500 lines.
