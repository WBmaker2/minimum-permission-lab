# Minimum Permission Lab Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. VoiceOver/TalkBack product implementation and manual verification are excluded by the project instruction; semantic, keyboard, and automated accessibility checks remain in scope.

**Goal:** 공개 학습자 관점 감사에서 확인한 68/100의 사용성 문제를 해결하여 초등 5~6학년 학생이 320px·375px 모바일과 키보드만으로도 각 단계의 다음 행동을 이해하고, 최소 권한 판단·수정·철회·보고서를 끝까지 완주하도록 개선한다.

**Architecture:** 현재 React 상태 머신과 순수 판정 엔진은 유지하고, 단계 전환 포커스·진행률·비활성 이유를 공통 프레젠테이션 컴포넌트로 분리한다. 콘텐츠는 짧은 요약과 `자세히 보기` 세부 문장으로 나누며, 저장 상태·별명 입력·수정 판단의 계약은 reducer와 저장 어댑터가 단일 진실 공급원이 되도록 연결한다. 모바일 보고서는 데스크톱 표와 모바일 세로 비교 목록을 같은 `PermissionDecision` 자료에서 파생해 중복 판정 로직을 만들지 않는다.

**Tech Stack:** Vite, React 18, TypeScript, Vitest + React Testing Library, Playwright, native HTML controls, CSS media queries, `prefers-reduced-motion`. 새 런타임 의존성, 외부 폰트, CDN, 분석 SDK는 추가하지 않는다.

**Spec:** `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab/2026-08-26-minimum-permission-lab-design.md`; 감사 근거 `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab/.gstack/qa-reports/qa-report-wbmaker2-github-io-2026-08-28.md`.

## Global Constraints

- 실제 `navigator.permissions`, 카메라·마이크·위치·연락처 API, 외부 네트워크, 로그인, 분석·광고·AI SDK를 호출하지 않는다.
- 기본 진행 기록은 React 메모리에만 두며, 사용자가 `이 기기에 저장`을 켠 뒤에만 `minimum-permission-lab:v1` 단일 키에 저장한다. 별명은 state·storage·report에 절대 넣지 않는다.
- 개인정보 금지와 저장 동의를 분리해 안내한다. 저장을 켜면 사용자가 입력한 근거 원문이 이 기기에 남을 수 있음을 숨기지 않으며, 앱이 이름·전화번호·주소·사진·음성·위치·연락처를 수집하지 않는다는 범위를 함께 표시한다.
- 교육용 핵심 버튼에는 기존 `gi-pulse`를 유지하되 버튼 본체의 위치·크기를 움직이지 않고 aura의 opacity/box-shadow만 애니메이션한다. `prefers-reduced-motion: reduce`에서는 고정 테두리와 단계 번호를 사용한다.
- 모든 단계의 새 `main`/`h2`는 키보드 포커스 대상이 될 수 있어야 하며, 단계·사례 진행률과 비활성 이유를 native label, `aria-describedby`, `role="status"`로 제공한다. 실제 VoiceOver/TalkBack 실행은 검증 범위에서 제외한다.
- 320×568 및 375×812에서 `document.documentElement.scrollWidth <= document.documentElement.clientWidth`를 만족한다. 버튼·입력·라디오·체크박스의 최소 터치 목표는 44px을 유지한다.
- 화면 문체는 초등 학습자가 읽을 수 있는 짧은 존댓말 문장으로 통일하고, 모양 이름은 권한명과 분리된 시각 보조 정보로만 제공한다.
- 업데이트 내역 버튼은 날짜·구분·요약·이유를 계속 제공한다. 실제로 실행하지 않은 보조기술 수동 검증을 완료했다고 기록하지 않는다.
- `src`, `e2e`, `scripts`의 단일 `.ts`, `.tsx`, `.css`, `.mjs` 파일은 500줄 미만을 유지한다. 350줄에 가까워지는 파일은 책임별 하위 파일로 분리한다.
- 기존 판정 규칙, 사례 ID, `PermissionDecision`, `CaseProgress`, 저장 payload version 1을 깨지 않는다. 변경이 필요한 문구·상태는 명시적 타입과 테스트로 계약화한다.

## Visual Thesis, Content Plan, Interaction Thesis

- **Visual thesis:** 흰 바탕 위에 한 가지 청록색 행동 강조와 얇은 선 아이콘을 사용해 “차분하게 살펴보고 한 번만 선택하는 실험실”의 분위기를 만든다. 카드 테두리와 장식보다 제목·여백·짧은 문장을 우선한다.
- **Content plan:** 첫 화면은 목표·안전 요약·사례 선택만 보여 주고, 명세 화면은 핵심 기능→대표 질문→세부 계약 순서로 보여 준다. 영향 화면은 선택 결과와 다음 행동을, 보고서는 최초안·수정안·철회 결과를 한눈에 보여 준다.
- **Interaction thesis:** 단계가 바뀌면 새 제목으로 포커스를 이동하고 `현재 단계 2/7`을 한 번 안내한다. 다음에 해야 할 버튼만 `gi-pulse`로 고정 강조하며, 세부 질문·안전 계약은 `자세히 보기`를 열 때만 펼친다. 저장·불러오기·조건부 비교·빈 입력은 즉시 짧은 상태 문장으로 피드백한다.

## Audit-to-Task Traceability

| 감사 항목 | 구현 작업 | 합격 증거 |
|---|---|---|
| F-01 단계 전환 포커스 | Task 1 | 각 stage 전환 뒤 `h2[data-stage-heading]`가 active element, 단계 status 1회 |
| F-02 움직이는 `gi-pulse` | Task 2 | 일반 motion에서 버튼 bounding box 불변, reduced-motion 고정 테두리 |
| F-03 수정 선택 공백 | Task 3 | 최초 선택 복사, 선택 수/남은 수 안내, disabled 설명 연결 |
| F-04 저장 문구 모순 | Task 3 | 저장 전·후 상태 문구와 전용 키 삭제 흐름 단위/E2E 통과 |
| F-05 320px overflow | Task 2 | 320·375 clientWidth 기준 가로 overflow 없음 |
| F-06 반복·과도한 읽기량 | Task 4 | 안전 요약 3줄, 질문 1개 기본 노출, 세부 열기 시 전체 문장 노출 |
| F-07 어린이용 문장·모양 이름 | Task 4·5 | 콘텐츠 문자열과 접근성 이름 테스트 통과 |
| F-08 진행률·비활성 이유 | Task 1·3 | 단계/사례 진행률과 `aria-describedby` 도움말 노출 |
| F-09 빈 별명 우회 | Task 3 | 빈 값에서 다음 버튼 disabled, 예시 사용 후 enabled, 저장·보고서 미포함 |
| F-10 모바일 보고서 표 | Task 5 | 375px 세로 비교 목록에서 네 권한의 최초/수정/변경 값 확인 |
| F-11 빈 불러오기 피드백 | Task 3 | 빈·유효·손상 저장소별 status 문장 확인 |
| F-12 이력 표현 정직성 | Task 6 | 자동/구조 대응과 수동 VoiceOver 완료 주장을 분리한 날짜 이력 |

## Expected File Structure and Responsibilities

- `src/components/StageFocusManager.tsx`: 단계별 children 내부의 `h2[data-stage-heading]`를 stage 변경 후 포커스하고 focus 가능한 heading 계약을 유지한다.
- `src/components/ProgressIndicator.tsx`: 어린이용 단계명, `현재 단계 n/7`, `완료한 사례 n/4`를 표시하고 한 번만 live announce한다.
- `src/components/ActionRequirementHint.tsx`: disabled CTA가 왜 잠겨 있는지 보여 주는 재사용 가능한 `<p id>` 컴포넌트다.
- `src/components/AppHeader.tsx`, `src/app/App.tsx`: completed case count를 전달하고 StageFocusManager로 화면을 감싼다.
- `src/app/labReducer.ts`, `src/app/LabProvider.tsx`, `src/app/LabContext.ts`: `SET_STATUS`, 수정 판단 초기 복사, 저장·삭제·불러오기 상태 메시지의 단일 상태 경계를 담당한다.
- `src/features/start/StartScreen.tsx`: 짧은 안전 요약, 저장·삭제·불러오기 행동과 status를 제공한다.
- `src/features/specification/FeatureSpecScreen.tsx`, `src/features/specification/FictionalAliasPractice.tsx`: 대표 질문과 접힌 세부 질문, 빈 별명 계약, 예시 사용을 담당한다.
- `src/features/review/PermissionReviewScreen.tsx`, `src/features/review/RationaleComposer.tsx`, `src/features/review/PermissionCard.tsx`: 수정 선택 복사, 선택 진행률, 근거 문장 길이·개인정보 경계, 권한명/모양명 분리를 담당한다.
- `src/features/impact/ConditionalScenarioCard.tsx`, `src/features/impact/ImpactScreen.tsx`: 조건부 비교의 disabled 이유와 짧은 다음 행동 안내를 담당한다.
- `src/features/report/DecisionComparisonCards.tsx`, `src/features/report/DecisionComparisonTable.tsx`, `src/features/report/decisionComparisonLabels.ts`, `src/features/report/ReportScreen.tsx`: 동일 결정 자료와 선택지 라벨을 데스크톱 표·모바일 세로 카드로 표시한다.
- `src/content/learningNotices.ts`, `src/content/permissions.ts`, `src/content/cases/classMap.ts`, `src/content/updateHistory.ts`: 짧은 안전 문구, 정확한 권한 설명, 문법, 정직한 날짜 이력을 보관한다.
- `src/styles/global.css`, `src/styles/components.css`: 320px 폭, fixed CTA pulse, details/모바일 비교 카드, focus ring을 담당한다.
- `src/components/*.test.tsx`, `src/app/*.test.ts`, `src/features/**/*.test.tsx`, `src/storage/progressStorage.test.ts`, `src/content/*.test.ts`, `src/styles/styles.test.ts`: 각 계약의 단위·컴포넌트 회귀를 담당한다.
- `e2e/accessibility.spec.ts`, `e2e/full-learning-flow.spec.ts`, `e2e/mobile-reduced-motion.spec.ts`, `e2e/privacy-safety.spec.ts`: 단계 포커스, 320/375 폭, 실제 CTA 클릭, 저장 경계, 모션 감소를 브라우저에서 확인한다. VoiceOver/TalkBack 실행 코드는 추가하지 않는다.
- `.gstack/qa-reports/qa-report-wbmaker2-github-io-2026-08-28.md`: 기존 진단 증거를 보존한다. 구현 완료 후 별도 날짜 보고서에 새 검증 결과를 기록하며 진단 보고서를 과거 사실과 섞지 않는다.

## Shared Interfaces

```ts
// src/components/StageFocusManager.tsx
export interface StageFocusManagerProps {
  stage: LabStage
  children: ReactNode
}

// src/components/ProgressIndicator.tsx
export interface ProgressIndicatorProps {
  stage: LabStage
  completedCaseCount: number
  totalCaseCount: number
}

// src/components/ActionRequirementHint.tsx
export interface ActionRequirementHintProps {
  id: string
  message: string
}

// src/features/specification/FictionalAliasPractice.tsx
export interface FictionalAliasPracticeProps {
  examples: readonly string[]
  value: string
  onChange: (value: string) => void
  onUseExample: (value: string) => void
}

// src/app/LabContext.ts
export interface LabContextValue {
  state: LabState
  dispatch: Dispatch<LabAction>
  setSaveOnDevice: (enabled: boolean) => void
  loadSavedProgressOnRequest: () => void
  clearSavedProgressOnRequest: () => void
}
```

## Implementation Tasks

진행 상태(2026-08-28): Task 1~5는 각각의 RED→GREEN·회귀 검증과 독립 커밋을 완료했고, Task 6의 이력·QA 문서와 전체 게이트도 완료했습니다. 아래 체크박스는 실행 순서를 보존한 상세 절차이며, 실제 증거는 각 커밋과 QA 보고서에 기록했습니다.

### Task 1: Stage orientation, focus restoration, and visible progress (완료)

**Files:**
- Create: `src/components/StageFocusManager.tsx`
- Create: `src/components/ProgressIndicator.test.tsx`
- Modify: `src/app/App.tsx`, `src/components/AppHeader.tsx`, `src/components/ProgressIndicator.tsx`
- Modify: `src/features/start/StartScreen.tsx`, `src/features/specification/FeatureSpecScreen.tsx`, `src/features/review/PermissionReviewScreen.tsx`, `src/features/impact/ImpactScreen.tsx`, `src/features/revoke/RevokeTrainingScreen.tsx`, `src/features/report/ReportScreen.tsx`
- Modify: `src/app/App.test.tsx`, `e2e/accessibility.spec.ts`

**Interfaces:** `StageFocusManagerProps`, `ProgressIndicatorProps`, `StageCallbacks` and `LabStage` remain the existing stage boundary. `App` computes `completedCaseCount` from `isCaseProgressComplete` and passes `CASE_ORDER.length` as `totalCaseCount`.

- [ ] **Step 1: Write the failing unit tests.** Add a `ProgressIndicator` test that expects `현재 단계: 2/7 · 기능 살펴보기` and `완료한 사례: 1/4`, with `aria-live="polite"`. Add an `App` test that renders a specification stage and expects the stage `h2` to have `data-stage-heading` and `tabIndex=-1`.
- [ ] **Step 2: Run the focused tests to verify failure.** Run `npm run test:run -- src/components/ProgressIndicator.test.tsx src/app/App.test.tsx`. Expected: the new assertions fail because the current indicator has only a label and stage headings have no focus contract.
- [ ] **Step 3: Write the minimal implementation.** Add `StageFocusManager` with `useEffect(() => { const heading = container.querySelector<HTMLElement>('[data-stage-heading]'); heading?.focus({ preventScroll: true }) }, [stage])`, add `data-stage-heading`/`tabIndex={-1}` to every stage `h2`, pass completed count through `AppHeader`, and render a single polite progress status with the child-friendly labels `시작`, `기능 살펴보기`, `권한 고르기`, `영향 비교하기`, `다시 고르기`, `철회 연습`, `학습 보고서`.
- [ ] **Step 4: Run focused tests to verify pass.** Run the same Vitest command. Expected: all existing App assertions and new progress/focus assertions pass.
- [ ] **Step 5: Add browser transition assertions.** In `e2e/accessibility.spec.ts`, after each Enter/Space stage transition wait for the new `h2[data-stage-heading]`, assert `document.activeElement === heading`, and assert the progress status contains the stage fraction. Keep axe checks and native labels unchanged.
- [ ] **Step 6: Run the browser test.** Run `npx playwright test e2e/accessibility.spec.ts --project=chromium`. Expected: no serious/critical axe violations, every tested stage focuses its new heading, and no VoiceOver/TalkBack command is executed.
- [ ] **Step 7: Commit the independently reviewable change.** Run `git add src/app/App.tsx src/app/App.test.tsx src/components/AppHeader.tsx src/components/ProgressIndicator.tsx src/components/ProgressIndicator.test.tsx src/components/StageFocusManager.tsx src/features/start/StartScreen.tsx src/features/specification/FeatureSpecScreen.tsx src/features/review/PermissionReviewScreen.tsx src/features/impact/ImpactScreen.tsx src/features/revoke/RevokeTrainingScreen.tsx src/features/report/ReportScreen.tsx e2e/accessibility.spec.ts && git commit -m "fix: restore learner focus between stages"`. Expected: one commit containing only stage orientation changes.

### Task 2: Stable `gi-pulse` motion and 320px layout (완료)

**Files:**
- Modify: `src/components/PrimaryActionButton.tsx`, `src/styles/components.css`, `src/styles/global.css`
- Modify: `src/styles/styles.test.ts`, `e2e/mobile-reduced-motion.spec.ts`, `e2e/full-learning-flow.spec.ts`

**Interfaces:** `PrimaryActionButtonProps` and `data-step` remain unchanged; the CSS contract changes from button-body transform to aura-only animation.

- [ ] **Step 1: Write the failing tests.** Add a style assertion that `.gi-pulse` has no `transform` animation and a Playwright helper that records `getBoundingClientRect()` before and during a normal-motion click. Add 320px and 375px checks using `clientWidth`, not `innerWidth`.
- [ ] **Step 2: Run focused tests to verify failure.** Run `npm run test:run -- src/styles/styles.test.ts` and `npx playwright test e2e/full-learning-flow.spec.ts e2e/mobile-reduced-motion.spec.ts --project=chromium`. Expected: the CSS assertion finds the current `@keyframes gi-pulse` translateY and the 320px check detects horizontal overflow; the moving CTA click can time out.
- [ ] **Step 3: Write the minimal implementation.** Remove body `transform` from `@keyframes gi-pulse`; keep `::after` opacity/box-shadow/scale animation, `position: relative`, and the reduced-motion fixed outline. Change `html` to `min-width: 0; width: 100%` and ensure `body`, `#root`, and content wrappers use `max-width: 100%; min-width: 0;`. Preserve 44px targets and the existing `.gi-pulse__step` badge.
- [ ] **Step 4: Run focused tests to verify pass.** Re-run the Vitest and Playwright commands. Expected: normal-motion CTA clicks complete, button rect values remain equal within 0.5px, reduced-motion has no animation, and 320/375 client widths have no horizontal overflow.
- [ ] **Step 5: Commit the independently reviewable change.** Run `git add src/components/PrimaryActionButton.tsx src/styles/components.css src/styles/global.css src/styles/styles.test.ts e2e/mobile-reduced-motion.spec.ts e2e/full-learning-flow.spec.ts && git commit -m "fix: keep learner actions stable on small screens"`. Expected: one commit for motion and layout only.

### Task 3: Revision choices, alias contract, and storage feedback (완료)

**Files:**
- Create: `src/components/ActionRequirementHint.tsx`
- Modify: `src/app/labReducer.ts`, `src/app/LabProvider.tsx`, `src/app/LabContext.ts`, `src/features/start/StartScreen.tsx`, `src/features/specification/FeatureSpecScreen.tsx`, `src/features/specification/FictionalAliasPractice.tsx`, `src/features/review/PermissionReviewScreen.tsx`, `src/features/review/RationaleComposer.tsx`, `src/features/impact/ConditionalScenarioCard.tsx`
- Modify: `src/app/labReducer.test.ts`, `src/app/LabProvider.test.tsx`, `src/features/start/StartScreen.test.tsx`, `src/features/specification/FeatureSpecScreen.test.tsx`, `src/features/review/PermissionReviewScreen.test.tsx`, `src/storage/progressStorage.test.ts`, `e2e/full-learning-flow.spec.ts`, `e2e/privacy-safety.spec.ts`

**Interfaces:** Add `LabAction` variants `{ type: 'SET_STATUS'; message: string }`; `LabContextValue.clearSavedProgressOnRequest`; `FictionalAliasPracticeProps`; and `ActionRequirementHintProps`. `OPEN_IMPACT` must copy `initialDecisions` into `revisedDecisions` when entering `revision-review` without mutating the initial record.

- [ ] **Step 1: Write failing reducer and component tests.** Assert that entering revision copies all four initial decisions, that a revision screen displays `수정 선택 4/4`, that an initial screen displays `권한 0/4 선택`, and that the action button carries `aria-describedby` pointing to the visible hint. Assert that a blank group-board alias disables `권한 심사 시작`, an example click fills `햇살`, and the alias never appears in serialized payload or `buildReport` output.
- [ ] **Step 2: Run focused tests to verify failure.** Run `npm run test:run -- src/app/labReducer.test.ts src/features/review/PermissionReviewScreen.test.tsx src/features/specification/FeatureSpecScreen.test.tsx src/storage/progressStorage.test.ts`. Expected: revised decisions remain empty, the button has no requirement hint, and the alias button is currently enabled.
- [ ] **Step 3: Write the minimal learning-flow implementation.** In the reducer, copy `initialDecisions` on the `impact`→`revision-review` transition. Add `countSelectedDecisions()` and `getDecisionHint()` in `src/features/review/reviewProgress.ts`; render the count and `ActionRequirementHint` in `PermissionReviewScreen`; set `aria-describedby` on the disabled CTA. Lift alias state to `FeatureSpecScreen`, pass controlled `value/onChange/onUseExample`, require one non-whitespace character for `group-board`, show `예시 사용: 햇살`, and keep alias out of callbacks, `CaseProgress`, storage, and reports. Limit rationale text to 240 characters with a visible remaining-count message.
- [ ] **Step 4: Write failing storage-status tests.** Add tests for initial status `이 기기에 저장하지 않음`, opt-in status `권한 선택과 근거 문장만 이 기기에 저장 중입니다. 별명과 실제 개인정보는 저장하지 않습니다.`, empty load status `저장된 학습 기록이 없습니다.`, successful load status `저장된 학습 기록을 불러왔습니다.`, and explicit delete status `저장 기록을 지웠습니다.`. Assert only `PROGRESS_STORAGE_KEY` is removed.
- [ ] **Step 5: Run the storage tests to verify failure.** Run `npm run test:run -- src/app/LabProvider.test.tsx src/features/start/StartScreen.test.tsx`. Expected: current generic/no-change status assertions fail and no delete callback exists.
- [ ] **Step 6: Write the minimal storage implementation.** Add `SET_STATUS` handling in `labReducer`; make `setSaveOnDevice` dispatch conditional status after saving/removing; make `loadSavedProgressOnRequest` dispatch loaded or missing status; add `clearSavedProgressOnRequest` calling `clearSavedProgress()` and dispatching delete status. Add the visible `저장 기록 지우기` button with `aria-describedby` and keep save copy conditional on `state.saveOnDevice`.
- [ ] **Step 7: Add conditional-action feedback and run tests.** Give `ConditionalScenarioCard` a stable hint id and text `먼저 학습용 기능 스위치를 켜면 비교할 수 있습니다.` when disabled; connect it to `aria-describedby`. Run `npm run test:run -- src/app src/features/start src/features/specification src/features/review src/storage`. Expected: all focused tests pass and no alias appears in storage/report fixtures.
- [ ] **Step 8: Run flow/privacy E2E.** Run `npx playwright test e2e/full-learning-flow.spec.ts e2e/privacy-safety.spec.ts --project=chromium`. Expected: empty alias cannot advance, example alias can advance, pre-consent storage is empty, opt-in stores only the dedicated payload, delete returns to empty storage, and every disabled action explains its next step.
- [ ] **Step 9: Commit the independently reviewable change.** Run `git add src/components/ActionRequirementHint.tsx src/app/labReducer.ts src/app/LabProvider.tsx src/app/LabContext.ts src/features/start/StartScreen.tsx src/features/specification/FeatureSpecScreen.tsx src/features/specification/FictionalAliasPractice.tsx src/features/review/PermissionReviewScreen.tsx src/features/review/RationaleComposer.tsx src/features/impact/ConditionalScenarioCard.tsx src/app/labReducer.test.ts src/app/LabProvider.test.tsx src/features/start/StartScreen.test.tsx src/features/specification/FeatureSpecScreen.test.tsx src/features/review/PermissionReviewScreen.test.tsx src/storage/progressStorage.test.ts e2e/full-learning-flow.spec.ts e2e/privacy-safety.spec.ts && git commit -m "fix: explain learner progress and storage choices"`. Expected: one commit covering flow contracts and privacy wording.

### Task 4: Short safety copy, progressive disclosure, and child-friendly language (완료)

**Files:**
- Modify: `src/content/learningNotices.ts`, `src/components/LearningModelNotice.tsx`, `src/components/AppHeader.tsx`, `src/features/start/StartScreen.tsx`, `src/features/specification/FeatureSpecScreen.tsx`, `src/features/impact/ImpactScreen.tsx`, `src/features/review/RationaleComposer.tsx`
- Modify: `src/content/permissions.ts`, `src/content/cases/classMap.ts`, `src/components/ProgressIndicator.tsx`
- Modify: `src/content/learningNotices.test.ts`, `src/content/permissions.test.ts`, `src/content/cases/cases.test.ts`, `src/features/specification/FeatureSpecScreen.test.tsx`, `src/features/review/PermissionReviewScreen.test.tsx`

**Interfaces:** Keep `LEARNING_MODEL_NOTICE`, `NOT_IN_SCOPE_NOTICE`, `TEACHER_GUIDE_NOTICE`, and `HELP_REQUEST_NOTICE` exported for consumers, but make `LearningModelNotice` consume `LEARNING_MODEL_SUMMARY` plus `LEARNING_MODEL_DETAILS`. `PermissionDefinition.shapeLabel` remains typed but is no longer concatenated into spoken legends.

- [ ] **Step 1: Write failing copy and disclosure tests.** Require the header to show exactly one three-line safety summary, the detail contract behind `자세히 보기`, and no duplicate `LearningModelNotice` on the impact screen. Require the specification screen to show each permission’s first question by default and all remaining questions only after its details disclosure is opened.
- [ ] **Step 2: Run focused tests to verify failure.** Run `npm run test:run -- src/content/learningNotices.test.ts src/features/specification/FeatureSpecScreen.test.tsx`. Expected: current long notice and four always-visible question headings violate the new assertions.
- [ ] **Step 3: Write the minimal content implementation.** Define `LEARNING_MODEL_SUMMARY = '실제 권한을 묻지 않는 가상 학습 모델입니다. 개인정보를 입력하지 마세요. 저장은 직접 선택합니다.'`; define detail text that explicitly says opt-in rationale text can stay on this device while aliases and real personal information are not collected; render it in `<details><summary>자세히 보기</summary>`. Remove repeated `LearningModelNotice` from `ImpactScreen`; keep one compact notice in the app header and a short screen-specific reminder where necessary.
- [ ] **Step 4: Implement progressive disclosure.** In `FeatureSpecScreen`, show `QUESTIONS[0]` with its answer and wrap questions 1–3 in a native `<details>` whose summary is `자세히 보기`; preserve all four contract answers in the opened DOM. Use one short sentence per answer and keep the existing `DataFlowSummary`.
- [ ] **Step 5: Correct child-facing strings.** Change microphone short description to `목소리를 녹음하는 기능입니다.`, class-map flow to `학습자가 교실 이름을 선택`, stage action copy to `왜 그렇게 골랐는지 적기` where appropriate, and use consistent `합니다` endings. Keep the learning distinction that allowing a contract-required permission can be a valid answer.
- [ ] **Step 6: Run focused tests to verify pass.** Run `npm run test:run -- src/content src/features/specification src/features/review`. Expected: content contracts, details behavior, and existing judgment tests pass.
- [ ] **Step 7: Commit the independently reviewable change.** Run `git add src/content/learningNotices.ts src/components/LearningModelNotice.tsx src/components/AppHeader.tsx src/features/start/StartScreen.tsx src/features/specification/FeatureSpecScreen.tsx src/features/impact/ImpactScreen.tsx src/features/review/RationaleComposer.tsx src/content/permissions.ts src/content/cases/classMap.ts src/components/ProgressIndicator.tsx src/content/learningNotices.test.ts src/content/permissions.test.ts src/content/cases/cases.test.ts src/features/specification/FeatureSpecScreen.test.tsx src/features/review/PermissionReviewScreen.test.tsx && git commit -m "fix: make safety lessons easier to scan"`. Expected: one copy/disclosure commit.

### Task 5: Permission naming and responsive comparison report (완료)

**Files:**
- Create: `src/features/report/DecisionComparisonCards.tsx`, `src/features/report/decisionComparisonLabels.ts`
- Modify: `src/features/review/PermissionCard.tsx`, `src/features/report/DecisionComparisonTable.tsx`, `src/features/report/ReportScreen.tsx`, `src/styles/components.css`, `src/styles/global.css`
- Modify: `src/features/review/PermissionReviewScreen.test.tsx`, `src/features/report/ReportScreen.test.tsx`, `src/features/report/CompletionSummary.test.tsx`, `src/styles/styles.test.ts`, `e2e/full-learning-flow.spec.ts`, `e2e/mobile-reduced-motion.spec.ts`

**Interfaces:** `DecisionComparisonCardsProps` has the same readonly `initial`, `revised`, and `changedPermissionIds` types as `DecisionComparisonTableProps`. `PermissionCard` and report rows continue to consume `PermissionDefinition` without changing domain IDs.

- [ ] **Step 1: Write failing semantics and mobile tests.** Assert that each permission fieldset legend is only `카메라`, `마이크`, `위치`, or `연락처`; shape text is rendered separately with `aria-hidden="true"` and a visual label. At 375px, assert a visible `권한별 비교` list contains all four permission names and all initial/revised/changed values without requiring horizontal scrolling.
- [ ] **Step 2: Run focused tests to verify failure.** Run `npm run test:run -- src/features/review/PermissionReviewScreen.test.tsx src/features/report/ReportScreen.test.tsx` and `npx playwright test e2e/full-learning-flow.spec.ts --project=chromium`. Expected: current spoken names include concatenated shape labels and the 42rem table overflows mobile.
- [x] **Step 3: Write the minimal component implementation.** Add `DecisionComparisonCards` using four `role="group"` cards with headings, definition lists for 최초 선택·수정 선택·변경 여부, and the same `CHOICE_LABELS`. Render both table and cards from `DecisionComparisonTable`; use CSS media queries to show the table above 640px and cards at or below it. Retain a keyboard-focusable table region for desktop.
- [x] **Step 4: Separate shape names.** In `PermissionCard` and report table/card headings, render `PermissionGlyph` plus the permission label in the accessible name and place `모양: ${shapeLabel}` in a separate `aria-hidden` visual span. Keep the domain shape labels intact while preventing them from being concatenated into spoken names.
- [x] **Step 5: Add responsive CSS and run tests.** Hide the wide comparison table at or below 640px and show wrapping cards that work at 320px; keep the desktop table region and its contained overflow behavior. Run `npm run test:run -- src/features/report src/features/review src/styles` and the full-flow Playwright test. Expected: no concatenated names, no 375px horizontal report overflow, and all decision values remain visible.
- [ ] **Step 6: Commit the independently reviewable change.** Run `git add src/features/report/DecisionComparisonCards.tsx src/features/report/DecisionComparisonTable.tsx src/features/report/ReportScreen.tsx src/features/review/PermissionCard.tsx src/styles/components.css src/styles/global.css src/features/review/PermissionReviewScreen.test.tsx src/features/report/ReportScreen.test.tsx src/features/report/CompletionSummary.test.tsx src/styles/styles.test.ts e2e/full-learning-flow.spec.ts e2e/mobile-reduced-motion.spec.ts && git commit -m "fix: make permission comparisons readable on mobile"`. Expected: one responsive-report commit.

### Task 6: Update history scope, complete regression gates, and learner-review record (완료)

**Files:**
- Modify: `src/content/updateHistory.ts`, `src/content/updateHistory.test.ts`, `docs/qa/accessibility-checklist.md`, `docs/qa/privacy-safety-checklist.md`
- Create: `.gstack/qa-reports/qa-report-wbmaker2-github-io-2026-08-28-improvement.md`
- Verify without source changes: `scripts/check-source-policy.mjs`, `eslint.config.js`, `package.json`, `playwright.config.ts`

**Interfaces:** `UpdateHistoryEntry` keeps its existing date/category/summary/reason fields. The new entry must use an ISO date and state automated keyboard/semantic/mobile coverage without claiming a manual screen-reader run.

- [ ] **Step 1: Write the failing history/document tests.** Require the newest entry to say `모바일·키보드·보조기술 대응 구조와 저장 경계 보강`, require a reason that names 320px/375px, focus, reduced motion, and opt-in storage, and reject the phrase `스크린 리더 검증 완료` because no VoiceOver/TalkBack session is in scope. Update QA checklist counts from the measured 19 policy fixtures/205 Vitest tests only when the post-change command output supplies the exact number.
- [ ] **Step 2: Run the focused content test to verify failure.** Run `npm run test:run -- src/content/updateHistory.test.ts`. Expected: the old `스크린 리더 검증 보강` summary fails the new scope assertion.
- [ ] **Step 3: Write the minimal history and QA copy.** Add a dated `2026-08-28` improvement entry with the exact summary and a reason such as `320px·375px 모바일, 키보드 단계 포커스, 모션 감소, 선택 저장 경계를 보강하고 자동 접근성 구조를 확인함`; state explicitly that manual VoiceOver/TalkBack output was not run. Keep historical dates and newest-first ordering.
- [ ] **Step 4: Run all local gates.** Run, in order: `npm run test:policy`, `npm run check:policy`, `npm run lint`, `npm run test:run`, `npm run test:coverage`, `npm run build`, and `find src e2e scripts -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.mjs' \) -exec wc -l {} + | awk '$2 != "total" && $1 >= 500 {print}'`. Expected: policy exit 0, lint exit 0, all Vitest tests pass, coverage remains at or above the existing Statements 89.25% and Branches 87.07% baselines unless a lower value is explicitly explained in the report, build exit 0, and the line-count command prints nothing.
- [ ] **Step 5: Run isolated browser QA.** Start the project on a dedicated port with `npm run preview -- --host 127.0.0.1 --port 44173`, then run `npx playwright test e2e/accessibility.spec.ts e2e/full-learning-flow.spec.ts e2e/mobile-reduced-motion.spec.ts e2e/privacy-safety.spec.ts --project=chromium`. Expected: the app’s own server is used, 320/375 keyboard and storage flows pass, no permission popup or external request appears, and any macOS browser launch error is recorded as an environment limitation rather than a product pass.
- [ ] **Step 6: Write the dated learner-review report.** Record the before/after findings F-01–F-12, exact commands and results, public learner URL `https://wbmaker2.github.io/minimum-permission-lab/`, and HVC review link target `https://github.com/WBmaker2/minimum-permission-lab`. Separate automated evidence, public deployment evidence, and the excluded manual VoiceOver/TalkBack evidence. Do not claim actual child participants unless a real session is later conducted.
- [ ] **Step 7: Commit the final quality record.** Run `git add src/content/updateHistory.ts src/content/updateHistory.test.ts docs/qa/accessibility-checklist.md docs/qa/privacy-safety-checklist.md .gstack/qa-reports/qa-report-wbmaker2-github-io-2026-08-28-improvement.md && git commit -m "docs: record learner usability improvements"`. Expected: one documentation/quality-record commit after all code gates pass.

## Future Command Summary and Expected Results

| Purpose | Command | Expected result |
|---|---|---|
| Focused unit cycle | `npm run test:run -- src/components/ProgressIndicator.test.tsx src/app/App.test.tsx` | New assertion fails before implementation, then passes after the minimal change |
| Policy gate | `npm run test:policy` and `npm run check:policy` | Node policy fixtures pass and source policy exits 0 |
| Type/lint/unit | `npm run lint` and `npm run test:run` | No lint errors; all Vitest files pass |
| Coverage | `npm run test:coverage` | Statements ≥ 89.25%, branches ≥ 87.07%, or report a justified test-shape change |
| Production build | `npm run build` | Vite emits a successful `dist` build |
| Size guard | `find src e2e scripts -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.mjs' \) -exec wc -l {} + \| awk '$2 != "total" && $1 >= 500 {print}'` | No output for files at or above 500 lines |
| Local learner browser | `npx playwright test e2e/accessibility.spec.ts e2e/full-learning-flow.spec.ts e2e/mobile-reduced-motion.spec.ts e2e/privacy-safety.spec.ts --project=desktop-chromium --workers=1` | Stage focus, CTA stability, 320/375 layout, storage boundary, and no external runtime access pass; mobile-only test is an intentional skip under the desktop project |
| Public learner check | `https://wbmaker2.github.io/minimum-permission-lab/` | Title, same-origin assets, learner flow, update history, and mobile report are reachable; HTTP 200 alone is not sufficient |

## Future Commit Sequence

1. `fix: restore learner focus between stages` — Task 1 stage focus and progress.
2. `fix: keep learner actions stable on small screens` — Task 2 pulse and 320px layout.
3. `fix: explain learner progress and storage choices` — Task 3 revision, alias, storage feedback.
4. `fix: make safety lessons easier to scan` — Task 4 content and progressive disclosure.
5. `fix: make permission comparisons readable on mobile` — Task 5 naming and report.
6. `docs: record learner usability improvements` — Task 6 update history, QA record, and final evidence.

Each commit is created only after its own focused RED→minimal GREEN→focused regression cycle. GitHub repository changes, push, Pages deployment, HVC registration, and public release verification are separate actions requiring a later explicit user instruction; this plan itself does not execute them.

## Plan Self-Review

- **Design coverage:** learning goals map to Task 3’s evidence/rationale and Task 4’s child-facing copy; differentiation and safety boundaries map to Task 3–4; the five-stage learning flow and first/revised records map to Task 1 and Task 3; permission/content/judgment model stays in existing domain files and is covered by Tasks 3–5; accessibility, mobile, keyboard, reduced motion, privacy, MVP completion, and update history each have explicit tasks and commands.
- **Placeholder scan:** 모든 단계가 실제 파일 경로·인터페이스·테스트 대상·명령·합격 조건을 갖추었고 미완성 자리표시자를 남기지 않았다.
- **Type/name consistency:** `StageFocusManagerProps`, `ProgressIndicatorProps`, `ActionRequirementHintProps`, `FictionalAliasPracticeProps`, `LabContextValue.clearSavedProgressOnRequest`, `LabAction.SET_STATUS`, `DecisionComparisonCardsProps`, and `UpdateHistoryEntry` are used with the same names in every task. Domain IDs and storage version remain unchanged.
- **Scope honesty:** the plan improves automated semantics and keyboard behavior but deliberately excludes VoiceOver/TalkBack product features and manual runs, keeps real child research as a future evidence state, and does not authorize repository release actions.
