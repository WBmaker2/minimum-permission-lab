# Education Web App Redesign Plan

## Goal

앱 권한 최소허용 연구소를 초등 5~6학년 학습자가 처음 화면에서 해야 할 일을 바로 이해하고, 사례 선택부터 권한 비교·영향 확인·수정·철회·보고서까지 375px 모바일과 키보드로 완주할 수 있도록 안전하게 리디자인합니다. 기존의 가상 권한 판단 모델, 네 사례, 최초 선택과 수정 선택의 비교, 선택적 로컬 저장, 개인정보 입력 금지, 외부 네트워크 차단 계약은 변경하지 않습니다.

## Scope and non-scope

포함 범위:

- 시작 화면의 학습 목표·사례 선택·안전 안내·저장 안내의 정보 위계를 재배치합니다.
- 단계 전환 때 새 `h2[data-stage-heading]`가 실제 viewport에 보이도록 포커스와 스크롤을 함께 관리합니다.
- 영향 단계와 철회 단계에서 비활성 핵심 버튼의 남은 조건을 화면 문장과 `aria-describedby`로 연결합니다.
- 사례 선택 카드를 데스크톱 2열, 좁은 화면 1열로 정리하고 선택·완료 상태를 텍스트와 테두리로 구분합니다.
- 결과 화면의 다음 행동과 업데이트 내역에 2026-08-29 리디자인 기록을 추가합니다.
- 단위 테스트, Playwright 학습자 흐름, 모바일·reduced-motion·저장 경계 검증을 보강합니다.
- 자산 사용처를 전수 확인하고, 사실·정체성·증거 자산은 자동 생성하지 않습니다.

변경하지 않는 범위:

- `src/domain/model.ts`, `src/domain/judgePermission.ts`, `src/domain/buildReport.ts`의 판단 타입과 판정 의미를 변경하지 않습니다.
- 실제 `navigator.permissions`, 카메라·마이크·위치·연락처 API, 외부 네트워크, 로그인, 분석·광고·AI SDK를 추가하지 않습니다.
- 학생 대상 TTS, 내레이션, 녹음·재생 기능을 추가하지 않습니다.
- 계정, 클라우드 저장, 교사 대시보드, 실제 앱 보안 검사, 기기 설정 안내를 추가하지 않습니다.
- 사용자가 별도로 승인하지 않는 커밋·푸시·릴리스·배포·HVC 등록을 실행하지 않습니다.

## Evidence and project rules

- 제품 설계 원문: `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab/2026-08-26-minimum-permission-lab-design.md` (대상, 교과, 가상 모델, 권한·콘텐츠·안전·MVP·완료 기준).
- 기존 개선 계획: `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab/2026-08-28-minimum-permission-lab-improvement-plan.md`.
- 기존 자동·브라우저 감사: `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab/.gstack/qa-reports/qa-report-wbmaker2-github-io-2026-08-28-improvement.md`.
- 초기 감사 시 저장소에는 별도 `AGENTS.md`, `EDUCATION_DESIGN.md`, `design-system/MASTER.md`가 없었습니다. 이번 실행에서는 기존 승인 방향을 고정하기 위해 `design-system/MASTER.md`를 생성했으며, 없는 프로젝트 규칙을 추측해 덮어쓰지 않습니다.
- 시작 시 `git status --short --branch`에서 확인한 기존 미추적 `.gstack/`, `.playwright-mcp/`, `minimum-permission-lab-source-2026-08-29.png`는 범위 밖 변경으로 보존하고 커밋 대상에 넣지 않습니다.

지원 역할 상태:

- `impeccable`: 현재 세션에 설치된 지원 Skill 목록에 없어 `unavailable`; 초기·최종 감사는 이 계획의 브라우저 근거와 수동 검토 항목으로 기록합니다.
- `ui-ux-pro-max`: `unavailable`; 디자인 토큰과 화면 규칙은 이 문서 및 `design-system/MASTER.md`에서 직접 명시합니다.
- `redesign-existing-projects`: `unavailable`; 기존 컴포넌트와 상태 계약을 보존하는 구현을 직접 수행합니다.
- `imagegen`: 사용 가능하지만 이번 소스에는 `img`, CSS 배경, 이미지 import가 없고 현재 화면은 개념 학습 UI입니다. 생성 이미지가 학습 사실처럼 오인될 이득이 없어 호출하지 않습니다.

## Initial audit findings

2026-08-29 공개 URL `https://wbmaker2.github.io/minimum-permission-lab/`에서 Playwright 브라우저로 시작→명세→최초 심사→영향 비교→수정 심사 흐름을 확인했습니다.

| ID | 관찰 근거 | 영향 | 리디자인 대응 |
|---|---|---|---|
| A-01 | 375px 시작 화면에서 사례 선택이 세로 약 1,100px 아래에 있고 안전 문단·저장 영역이 먼저 이어짐 | 어린 학습자가 첫 행동을 찾기 어렵습니다. | 사례 선택을 목표 바로 아래로 올리고 안전·저장 세부를 접을 수 있는 패널로 분리합니다. |
| A-02 | 단계 전환 뒤 `document.activeElement`는 새 `h2`이지만 `getBoundingClientRect().top`이 -225~-1,735px로 viewport 밖에 남음 | 키보드 사용자가 현재 단계를 찾기 위해 다시 스크롤해야 합니다. | `StageFocusManager`가 포커스 후 heading을 `scrollIntoView({block: 'start'})`하고 상단 여백을 둡니다. |
| A-03 | 영향 단계에서 조건·수정 방향을 선택하기 전 `최소 권한안 수정`이 disabled지만 별도 도움말·`aria-describedby`가 없음 | 다음 행동을 추측해야 합니다. | 조건 확인과 수정 방향 선택을 계산하는 `ActionRequirementHint`를 추가합니다. |
| A-04 | 철회 단계에서 네 권한 선택·철회 하나가 충족되기 전 `철회 판단 완료`가 disabled되고 조건이 긴 문단에만 섞임 | 필수 조건과 남은 수를 한눈에 알기 어렵습니다. | 철회 선택 수, 철회한 권한 수, 남은 조건을 한 문장으로 표시하고 버튼에 연결합니다. |
| A-05 | 현재 UI는 카드·테두리·문단이 모두 같은 시각적 무게이고 사례 버튼과 설명이 분리되어 있음 | 모바일에서 카드 간 비교와 선택 상태 파악이 느립니다. | `CaseSelector`에 카드형 구조·상태 배지·짧은 메타 문장을 적용합니다. |
| A-06 | 결과 화면에는 인쇄·처음부터 다시 하기 버튼이 있으나 결과를 읽은 뒤의 권장 학습 행동이 한 문장으로 드러나지 않음 | 보고서가 기록으로 끝나고 다음 수업 행동이 모호합니다. | 보고서 하단에 인쇄·다시 하기의 역할을 설명하는 `report-next-actions` 영역을 추가합니다. |

## Architecture

현재 Vite + React + TypeScript SPA의 reducer와 순수 판정 엔진을 유지합니다.

- `LabProvider`와 `labReducer`는 상태 전이·로컬 저장 경계를 계속 소유합니다.
- `StageFocusManager`는 단계 전환이라는 공통 부작용만 담당하며 화면별 콘텐츠를 알지 않습니다.
- `ActionRequirementHint`는 비활성 CTA의 조건 설명만 담당하고, 조건 계산은 각 화면의 명시적 순수 함수로 둡니다.
- `CaseSelector`는 `CaseId`, 완료 목록, 선택 ID만 받아 렌더링하며 도메인 판정을 복제하지 않습니다.
- `StartScreen`, `ImpactScreen`, `RevokeTrainingScreen`, `ReportScreen`은 같은 `PrimaryActionButton`과 상태 안내 패턴을 사용합니다.
- CSS는 토큰→전역 규칙→컴포넌트 규칙 순서를 유지하고, 라이트 모드·`prefers-reduced-motion` 대체를 보장합니다.

## Tech Stack

기존 Vite 8, React 19, TypeScript 6, Vitest + React Testing Library, Playwright, native HTML controls, CSS media queries만 사용합니다. 새 런타임 의존성·외부 폰트·CDN·이미지 서비스는 추가하지 않습니다.

## Design system

새 문서 `design-system/MASTER.md`에 다음을 고정합니다.

- 색상: `--color-primary`는 행동, `--color-focus-ring`은 포커스·핵심 CTA, `--color-success`·`--color-warning`은 상태 텍스트에만 사용합니다.
- 표면: 흰 카드와 부드러운 회색 배경, 2px 경계, 기존 `--radius-*`와 `--shadow-*`를 재사용합니다.
- 서체: 외부 폰트 없이 시스템 sans-serif, 제목 1.25 line-height, 본문 1rem 이상을 유지합니다.
- 간격: 기존 `--space-1`~`--space-6`만 사용하고 카드 내부 최소 1rem 여백을 둡니다.
- 행동: 화면당 주 CTA 하나만 `gi-pulse`; 비활성 버튼은 회색·정적이고 조건 힌트를 가집니다.
- 반응형: 640px 초과 사례 그리드 2열, 640px 이하 1열; 320px·375px에서 `scrollWidth <= clientWidth`.
- 접근성: native button/input/details, `:focus-visible` 3px 링, 최소 44px 터치 목표, 단계 제목 포커스·스크롤.

## Content and safety rules

- 첫 화면의 고정 요약은 `실제 권한 없음 / 개인정보 입력 금지 / 저장은 직접 선택` 세 문장을 유지합니다.
- 상세 안전 설명과 교사용 안내는 `<details>`로 접되, 열린 DOM과 키보드로 접근할 수 있습니다.
- `실제 앱 판정이 아님`, `가상 학습 모델`, 선택 저장 시 근거 원문이 기기에 남을 수 있다는 경계를 숨기지 않습니다.
- 권한 판정은 필수·불필요·조건부와 계약 근거를 그대로 사용하고, 정답·위험 공포 문구를 추가하지 않습니다.
- 업데이트 이력에 `2026-08-29` 리디자인 날짜, 자동 구조 검증 범위, 수동 VoiceOver/TalkBack을 실행하지 않았다는 사실을 명시합니다.

## Asset audit rule

`public`, `src`, `index.html`, CSS의 이미지 import·`<img>`·`srcset`·배경 URL을 검색합니다. 현재 검색 결과는 favicon 외 학습 화면 자산이 없습니다. favicon은 브랜드·정체성 자산이므로 유지하며 자동 교체하지 않습니다. 새 장식 이미지가 필요하다는 근거가 생기지 않는 한 생성하지 않으며, 자산 상태는 `work/education-webapp-redesign-assets.md`에 기록합니다.

## TDD implementation sequence

각 단계는 실패 테스트 작성 → 실패 확인 → 최소 구현 → 해당 테스트 통과 → 회귀 확인 순서로 진행합니다.

### Step 1 — 단계 포커스가 viewport에 보이도록 고정

Files:

- Modify `src/components/StageFocusManager.tsx`.
- Modify `src/components/StageFocusManager.test.tsx` (create if absent).
- Modify `e2e/accessibility.spec.ts`.
- Modify `src/styles/global.css` if `scroll-margin-block-start` is needed.

Interfaces:

- Keep `StageFocusManagerProps { stage: LabStage; children: ReactNode }`.
- Add a named pure helper `focusStageHeading(heading: HTMLElement): void` only if testable separation is needed; it must call `focus({ preventScroll: true })` and `scrollIntoView({ block: 'start', inline: 'nearest' })`.

Checks:

- RED: assert stage transitions leave the heading focused and `rect.top >= 0`, `rect.bottom <= innerHeight` after an intentionally scrolled transition.
- GREEN: focus the heading, scroll it into view, and add `scroll-margin-block-start` so the fixed header never covers it.
- PASS: focused unit test and keyboard E2E cover start→specification→initial review→impact→revision→start.

### Step 2 — 영향·철회 CTA의 조건 설명

Files:

- Modify `src/features/impact/ImpactScreen.tsx`.
- Modify `src/features/revoke/RevokeTrainingScreen.tsx`.
- Modify `src/features/impact/ImpactScreen.test.tsx`.
- Modify `src/features/revoke/RevokeTrainingScreen.test.tsx`.
- Modify `e2e/accessibility.spec.ts` and `e2e/full-learning-flow.spec.ts`.

Interfaces:

- Add `getImpactRequirementMessage({ ready, conditionsSatisfied, controlAction }): string` in `ImpactScreen.tsx` or `src/features/impact/impactProgress.ts`.
- Add `getRevocationRequirementMessage({ eligible, allValid, hasRevocation, revocationCompleted }): string` in `src/features/revoke/revocationProgress.ts`.
- Both return concrete Korean sentences and never return a placeholder.

Checks:

- RED: expect disabled `최소 권한안 수정` and `철회 판단 완료` to have a visible note and `aria-describedby` before requirements are met.
- GREEN: render `ActionRequirementHint` with counts and connect the ID to each disabled CTA; keep `gi-pulse` only when ready.
- PASS: tests verify condition toggles update the hint, button state, and `role="status"` without changing reducer semantics.

### Step 3 — 시작 화면 hierarchy and case cards

Files:

- Create `src/features/start/LearningOverview.tsx` for the short goal and first-action prompt.
- Modify `src/features/start/StartScreen.tsx`.
- Modify `src/features/start/CaseSelector.tsx`.
- Modify `src/features/start/StartScreen.test.tsx`.
- Modify `src/styles/components.css` and `src/styles/global.css`.
- Create or modify `src/features/start/CaseSelector.test.tsx` if the current coverage needs an isolated card contract.

Interfaces:

- `LearningOverviewProps { selectedCase: boolean; completedCaseCount: number; totalCaseCount: number }`.
- Keep `CaseSelectorProps { completedCaseIds: readonly CaseId[]; selectedCaseId: CaseId | null; onSelect: (caseId: CaseId) => void }`.
- Add `aria-label`/`aria-describedby` only through stable IDs generated inside the component; do not put aliases or personal data in props.

Checks:

- RED: at 375px assert the first case button and its short action prompt appear before expanded safety/storage details; assert selected and completed cards have distinguishable text.
- GREEN: move case selection directly below the learning overview, place safety and storage in labeled `<details>` panels after the primary action, and add responsive card classes.
- PASS: all four cases remain keyboard-selectable, disabled completed cases remain disabled, and no horizontal overflow occurs at 320px/375px.

### Step 4 — 보고서 next-action language and update history

Files:

- Modify `src/features/report/ReportScreen.tsx`.
- Modify `src/content/updateHistory.ts`.
- Modify `src/content/updateHistory.test.ts`.
- Modify `src/features/report/ReportScreen.test.tsx`.
- Modify `src/styles/components.css`.

Interfaces:

- Keep `ReportScreenProps { report: LabReport; onPrint: () => void; onReset: () => void }`.
- Add no new report data fields; the next-action copy is presentational.
- Keep `UpdateHistoryEntry` date/category/summary/reason shape.

Checks:

- RED: report test expects a labeled next-action region and newest update entry dated `2026-08-29`.
- GREEN: add a concise “인쇄해 수업에서 돌아보기 / 다시 시작해 다른 사례 연습하기” explanation and one history entry that separates automated checks from excluded manual screen-reader runs.
- PASS: report table/cards and print controls remain available; no score or real safety claim is introduced.

### Step 5 — Design system and asset records

Files:

- Create `design-system/MASTER.md`.
- Create `work/education-webapp-redesign-audit.md`.
- Create `work/education-webapp-redesign-assets.md`.

Checks:

- Record missing project-specific design docs, the initial findings A-01–A-06, source paths, and exact acceptance criteria.
- Record that `rg` found no `<img>`, `srcset`, image import, or CSS background URL in the learner UI; retain `public/favicon.svg` as a factual identity asset; `imagegen` is `not run`.

## Verification commands and expected results

Run only after the corresponding implementation step:

1. `npm run test:run -- src/components/StageFocusManager.test.tsx src/features/impact/ImpactScreen.test.tsx src/features/revoke/RevokeTrainingScreen.test.tsx src/features/start/StartScreen.test.tsx src/features/report/ReportScreen.test.tsx` → focused tests pass after their RED→GREEN cycles.
2. `npm run test:policy` → Node policy fixtures pass.
3. `npm run check:policy` → `0 forbidden runtime references`.
4. `npm run lint` → exit 0 with no ESLint errors.
5. `npm run test:run` → all existing and new Vitest tests pass.
6. `npm run test:coverage` → Statements and Branches remain at or above the pre-change measured baseline (90.2% and 87.6%) or any justified variance is written in the report.
7. `npm run build` → TypeScript and Vite production build exit 0.
8. `find src e2e scripts -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.mjs' \) -exec wc -l {} + | awk '$2 != "total" && $1 >= 500 {print}'` → no output.
9. Run `npx playwright test --project=desktop-chromium --workers=1` with the repository `playwright.config.ts` (isolated strict port 44173) → desktop learner stages, focus/scroll, storage boundary, and no external runtime access pass. Run the same suite with a project-named Chromium configuration at viewport 375×812 → mobile layout, reduced motion, 320/375 width, and primary-action viewport checks pass. Run canonical `--project=mobile-375` separately when its WebKit executable is installed; if the browser process fails before assertions, record it as an environment limitation and do not call that product flow passed.

## Acceptance criteria

- At every stage transition, the focused `h2[data-stage-heading]` is within the viewport and has a visible focus ring.
- At most one enabled next-action button has `gi-pulse`; reduced motion uses a static focus-colored outline and no animation.
- The first screen places the four case choices before expanded safety/storage details at 375px; goal and “다음 행동” remain clear.
- Impact and revocation disabled CTAs expose a visible Korean reason and matching `aria-describedby`.
- Case cards expose selected/completed state without relying on color alone and preserve all four case IDs.
- Report next actions are understandable without changing the report data model.
- `localStorage` is empty before opt-in, uses only `minimum-permission-lab:v1` after opt-in, never stores aliases or personal data, and clears through the existing explicit action.
- No browser permission prompt or external request appears in any learner path.
- Every source file under `src`, `e2e`, and `scripts` remains below 500 lines.
- Public deployment and human child-participant research are not claimed by this redesign run; manual VoiceOver/TalkBack remains outside scope.

## Rollback

Before each implementation step, record the current commit with `git rev-parse HEAD` and keep changes isolated by file group. To roll back locally, restore only the files listed in that step from the pre-step copy or revert the individual working-tree patch after user approval; do not reset unrelated untracked audit artifacts. Do not create a commit, push, or deployment as part of this request.

## Final report contents

Create `work/education-webapp-redesign-report.md` after verification with:

- changed files and the A-01–A-06 finding-to-fix map;
- focused and full command exit statuses with timestamps;
- browser path evidence at 320px, 375px, and desktop, including focus rectangles, reduced-motion, console, and network observations;
- asset audit result and `imagegen` status;
- explicit `unavailable`/`not run` support-role entries;
- pending manual VoiceOver/TalkBack and real child-participant session items;
- statement that commit, push, release, and deployment were not executed.

## Implementation status — 2026-08-29

- [x] Step 1: 단계 제목 포커스와 viewport 스크롤을 `focusStageHeading` 및 `StageFocusManager`에 구현하고 단위·접근성 흐름으로 확인했습니다.
- [x] Step 2: 영향·철회 CTA 조건 계산 함수와 visible `ActionRequirementHint`·`aria-describedby` 연결을 구현하고 조건 전환 테스트를 통과시켰습니다.
- [x] Step 3: `LearningOverview`, 사례 카드 상태 텍스트·설명 ID, 시작 화면의 안전·저장 상세 패널, 2열/1열 반응형 규칙을 구현했습니다.
- [x] Step 4: 보고서 `다음 학습 행동` 영역, 2026-08-29 업데이트 이력, 저장 경계와 일치하는 초기 상태 문구를 구현했습니다.
- [x] Step 5: 디자인 시스템·초기/최종 감사·자산 감사 문서를 남기고 이미지 생성 없이 favicon을 보존했습니다.
- [x] 단위·정책·린트·커버리지·빌드·데스크톱 Chromium·격리 375px Chromium 검증을 완료했습니다.
- [ ] 실제 초등학생 참여 세션, 교사 관찰, VoiceOver/TalkBack 수동 검증은 별도 승인과 환경이 필요한 후속 단계로 남겼습니다.

## 2026-08-30 재실행 사전 기록

이번 요청은 기존 계획의 리디자인 결과를 다시 확인하고 마감 품질을 보완하는 `full` 실행으로 해석했습니다. 사용자 인터뷰용 구조화 도구가 현재 모드에서 제공되지 않아 `PRODUCT.md`의 제품 사실은 설계 원문·기존 계획에 근거한 추론으로 표시했습니다. 현재 작업 트리의 기존 소스·테스트·QA 산출물은 수정 전 상태를 보존합니다.

### 지원 Skill 로드 상태

- `$impeccable`: `available`; `/Users/kimhongnyeon/.agents/skills/impeccable/SKILL.md`; 2026-08-30T03:45Z에 읽음. `reference/init.md`, `reference/new-work.md`, `reference/craft-floor.md`도 같은 실행에서 읽었습니다.
- `$ui-ux-pro-max`: `available`; `/Users/kimhongnyeon/.agents/skills/ui-ux-pro-max/SKILL.md`; 2026-08-30T03:44Z에 읽음. 디자인 시스템 검색과 `ux`·`react`·`react` stack 검색을 실행했습니다.
- `$redesign-existing-projects`: `available`; `/Users/kimhongnyeon/.agents/skills/redesign-existing-projects/SKILL.md`; 2026-08-30T03:44Z에 읽음.
- `$imagegen`: `available`; `/Users/kimhongnyeon/.codex/skills/imagegen/SKILL.md`; 2026-08-30T03:44Z에 읽음. 학습 화면에 이미지 import·`<img>`·CSS 배경이 없고 `OPENAI_API_KEY`가 없어 이미지 생성은 실행하지 않습니다.

### 이번 마감 보완 범위

초기 A-01~A-06 해결 상태를 유지하면서 다음 UI 품질을 추가 확인합니다.

- 헤더의 중복 안내를 줄여 첫 화면에서 제목·진행·가상 모델 경계를 한 번씩만 읽게 합니다.
- `ActionRequirementHint`를 표면·아이콘·간격으로 구분해 disabled CTA와 시각적으로 연결합니다.
- 버튼의 hover·pressed·focus 전환과 `gi-pulse` aura의 레이아웃 고정, reduced-motion 정적 대체를 토큰으로 일관되게 적용합니다.
- 시작 화면 안전 요약에서 두꺼운 색상 세로선에 의존하지 않고 텍스트·표면·경계로 같은 의미를 전달합니다.
- 375px·320px·키보드·학습 흐름·저장/권한/외부 요청 정책을 기존 테스트와 새 회귀 테스트로 확인합니다.

### Direction contract

기존 계획과 `design-system/MASTER.md`가 이미 승인한 시각 세계를 이번 실행의 고정 방향으로 사용합니다. 핵심 메커니즘은 “기능 → 필요한 정보 → 사용 시점 → 보관 여부”를 한 단계씩 비교하는 가상 권한 실험실입니다. 첫 화면은 `앱 권한 최소허용 연구소` 제목, 진행 상태, 짧은 학습 목표, 네 사례 카드, 하나의 다음 행동을 한 화면 흐름으로 보여 줍니다. 재료는 교실 체크리스트와 실험실 기록지의 차분한 라이트 표면이며, 파란 행동색과 주황 포커스색 외 장식색을 추가하지 않습니다. 단계 전환은 제목 포커스·스크롤, 단계별 CTA의 단일 `gi-pulse`, 상태 텍스트로 제품별 동작을 드러냅니다. `concept-seed.mjs`는 2026-08-30에 실행해 seed `2030741d`와 챌린저 목록을 확인했지만, 현재 계획에 이미 존재하는 방향·콘텐츠·안전 계약을 교체하지 않고 코드-led 마감 보완으로 제한합니다. 이미지가 필요한 사실·정체성 자산은 생성하지 않습니다.

## 2026-08-30 재실행 구현·검증 기록

이번 실행은 기존 A-01~A-06 구현을 유지한 채 첫 화면 정보 위계, 상호작용 피드백, 모션 대체, 파일 크기 제한을 마감한 기록입니다. 변경된 UI는 기능 판정·저장 스키마·개인정보 금지·외부 요청 금지 계약을 건드리지 않았습니다.

### 구현된 파일 묶음

- `src/components/AppHeader.tsx`, `src/components/LearningModelNotice.tsx`, `src/components/ProgressIndicator.tsx`: 제목·진행 상태·가상 모델 경계를 한 번씩 읽는 헤더 구조.
- `src/features/start/LearningOverview.tsx`, `src/features/start/StartScreen.tsx`: 초등 학습자용 첫 행동 문장, 사례 선택 우선순위, 저장·삭제 보조 행동 스타일.
- `src/styles/components.css`, `src/styles/interactive.css`, `src/styles/global.css`, `src/main.tsx`: 헤더·카드·힌트·버튼 피드백과 `gi-pulse`/reduced-motion 규칙을 기능별 파일로 분리. `components.css` 478줄, `interactive.css` 122줄로 500줄 미만.
- `src/content/updateHistory.ts`: 2026-08-30 개선 내역을 최신 항목으로 기록하고 수동 VoiceOver·TalkBack 미실행을 명시.
- `PRODUCT.md`: Impeccable 제품 스키마를 설계 원문 근거의 추론으로 채움. 실제 사용자 인터뷰 사실로 표현하지 않음.

### RED→GREEN 및 자동 게이트

- RED에서 새 헤더 클래스, 첫 행동 문구, 보조 버튼 클래스, 요구 힌트 표면, 버튼 눌림 피드백 계약이 실패하는 것을 확인한 뒤 최소 구현했습니다.
- `npm run test:run`: 정책 19개와 Vitest 24개 파일 232개 테스트 통과.
- `npm run test:coverage`: Statements 90.61%, Branches 88.11%, Functions 91.07%, Lines 95.71%.
- `npm run lint`, `npm run check:policy`, `npm run build`, `git diff --check`: 모두 exit 0. 정책 결과는 `source policy: 0 forbidden runtime references`.
- 500줄 검사: `src`, `e2e`, `scripts` 대상 파일에서 500줄 이상 0개.
- Impeccable detector: 변경 마크업 대상에 `detect.mjs --json`을 실행했고 결과 `[]`.

### 브라우저·자산·보류

- 기본 Playwright `desktop-chromium` 직렬 실행: 10개 중 9개 통과, 모바일 전용 1개 의도적 스킵.
- 375px 전용 Chromium 직렬 실행: 10개 모두 통과. 320px/375px 가로폭, 키보드 포커스·스크롤, reduced-motion, 전체 학습 흐름, 저장·외부 요청 경계를 포함.
- canonical `mobile-375` WebKit은 `/Users/kimhongnyeon/Library/Caches/ms-playwright/webkit-2336/pw_run.sh`가 없어 브라우저 시작 전 실패했으며 WebKit 통과로 주장하지 않음.
- `imagegen`은 이미지 자산이 없어 호출하지 않았고, `public/favicon.svg`만 정체성 자산으로 유지.
- 실제 초등학생 참여, 교사 관찰, VoiceOver/TalkBack 수동 실행은 별도 승인·환경이 필요해 보류. 리디자인 재실행 당시에는 릴리스를 수행하지 않았고, 이후 사용자 요청에 따라 별도 릴리스 절차에서 커밋·푸시·Pages 배포를 완료했습니다. HVC 등록은 수행하지 않음.

## 2026-08-30 배포 후 기록

- 기능·스타일·문서 커밋을 `1c83b93`, `4ebccc5`, `c0db235`로 만들고 PR `#1`을 `main`에 병합했습니다. 병합 커밋은 `016e052a159ba1ec4320bc19ee1556252021b3e8`입니다.
- GitHub Actions `Build and deploy to GitHub Pages` run `33292333226`이 lint, 정책·단위 테스트, production build, Pages deploy를 모두 성공시켰습니다.
- 공개 주소: `https://wbmaker2.github.io/minimum-permission-lab/`. HTTP 200, 제목 `앱 권한 최소허용 연구소`, 최신 JS/CSS 자산과 375px 시작→사례→기능 명세 흐름을 확인했습니다. 공개 smoke에서 외부 요청은 0건이었습니다.
- 실제 초등학생·교사 관찰, VoiceOver/TalkBack 수동 검증, WebKit 실행 파일 확보는 여전히 후속 단계이며, HVC 등록은 별도 요청 없이는 진행하지 않습니다.
