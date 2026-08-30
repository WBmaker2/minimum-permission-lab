# Elementary Learner UX Baseline Audit

## Audit provenance

- Mode: `full`
- Target: `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab`
- Date: 2026-08-30
- Method: simulated elementary learner panel + local Playwright browser observation + source/test reading
- Primary persona: simulated 초5–6 서윤 (10–12세)
- Guardrail persona: simulated 초3–4 준호 (8–10세)
- Not a real child study, teacher observation, VoiceOver/TalkBack run, or accessibility certification
- Stage 0: `work/elementary-webapp-ux-bootstrap.md`, status `ready`

## Evidence set

- Local server: `http://127.0.0.1:44175/`
- Initial 320px capture: `output/playwright/elementary-baseline-320.png`
- Initial 375px capture: `output/playwright/elementary-baseline-375.png`
- Initial desktop capture: `output/playwright/elementary-baseline-1280.png`
- Source reviewed: `src/components/LearningModelNotice.tsx`, `src/components/PrimaryActionButton.tsx`, `src/features/start/StartScreen.tsx`, `src/features/start/LearningOverview.tsx`, `src/styles/components.css`, `src/styles/responsive.css`
- Browser observations: page title `앱 권한 최소허용 연구소`, initial localStorage empty, no external requests in the observed path, full four-case flow reached report in the same local session

## Simulated learner panel record

| persona / viewport | step | visible cue | action | observed result | stuck or surprise | recovery attempt | learner-facing note |
|---|---|---|---|---|---|---|---|
| 서윤 / 320×800 | 첫 화면 | `학습 목표`와 “네 가지 사례” 문장은 보임 | 제목과 카드 영역을 아래로 훑음 | 헤더가 y=0~395px, 목표 카드가 y=481~752px, 첫 사례 버튼은 y≈933px | 첫 사례가 첫 viewport에 없음 | 한 번 더 아래로 스크롤 | 배울 내용은 알지만 첫 클릭까지 길게 찾아야 함 |
| 서윤 / 375×812 | 첫 키보드 이동 | `h2 학습 시작`에 focus가 보임 | `Tab` | 헤더의 `자세히 보기` summary가 focus됨 | 화면 위의 반복 안전 설명으로 이동 | 다시 `Tab` 네 번 뒤 첫 사례 버튼 도달 | 현재 단계 다음 행동의 순서가 시각 순서와 다름 |
| 서윤 / 375×812 | 사례 선택 | 사례 버튼은 `선택 가능`으로 보임 | `사진 스캔 과제함` 클릭 | 선택 상태·문구·`gi-pulse`는 바뀌지만 `기능 명세 보기`는 문서 y≈1116px | 다음 버튼이 viewport 밖에 남음 | 아래로 스크롤해 CTA 찾기 | 선택 결과는 알지만 다음 행동 연결이 약함 |
| 준호 / 1280×900 | 오답 회복 | 기능 영향 카드에 필수/불필요와 근거가 보임 | 카메라만 허용하고 나머지는 거부 | 필수/불필요 피드백과 대안·철회 방향이 표시됨 | 비난 표현 없음 | `대안 사용` 또는 `권한 철회`를 고르고 수정안으로 이동 | 오답도 비교 학습으로 회복 가능 |
| 서윤 / 320×800 | 완료 | 보고서에 `다음 학습 행동` 영역이 있음 | 네 사례·철회까지 완료 | 인쇄·다시 시작 CTA가 목적 문장과 함께 표시됨 | 전체 보고서가 길어 마지막 CTA까지 긴 스크롤 | 화면 끝까지 스크롤 | 결과 다음 행동은 분명하지만 교사 안내가 있으면 더 빠름 |

## 100-point acceptance score

| 영역 | 점수 | 관찰 근거 |
|---|---:|---|
| 학습 목표·과제 명료성 | 13/15 | 목표와 사례 선택 문장이 첫 화면에 보임 |
| 아동 언어·인지부하 | 13/15 | 직접적인 존댓말과 근거 설명이 있으나 시작 헤더의 정보량이 큼 |
| 화면 구조·행동 위계 | 11/15 | 사례 선택 후 CTA가 먼 위치이고 header disclosure가 먼저 focus됨 |
| 피드백·오류 회복 | 13/15 | live status, 조건 힌트, 수정·철회 경로가 관찰됨 |
| 시각적 가독성 | 8/10 | 대비·본문 크기·타깃 크기는 안정적이나 320px 세로 밀도가 높음 |
| 키보드·의미·기본 접근성 | 6/10 | native control과 3px focus ring은 있으나 stage h2 뒤 Tab이 header로 역행함 |
| 반응형 학습 흐름 | 8/10 | 가로 넘침은 없지만 첫 사례 행동이 첫 viewport 밖임 |
| 런타임 안정성 | 5/5 | 관찰 중 콘솔 오류·실패 요청·깨진 자산 없음 |
| 맥락적 시각자료·자산 안전 | 5/5 | 이미지가 없어도 가상 계약 설명이 성립하고 사실성 이미지를 사용하지 않음 |
| **합계** | **82/100** | P0/P1 없음, P2 마찰 3개와 P3 중복 1개 |

## Issue ledger

### EDU-UX-001 — P2 — Stage focus 뒤 header summary로 역행하는 키보드 순서

- Path/state: `/` 및 각 stage transition 직후, `h2[data-stage-heading]` focused
- Persona/viewport: 서윤 / 375×812; 준호 / 키보드 전용
- Observed action/result: `Tab` 한 번 뒤 `LearningModelNotice`의 `자세히 보기` summary가 focus됨. 사례·현재 단계 콘텐츠보다 화면 위 중복 설명을 먼저 통과함.
- Evidence: browser run result `afterStage=H2`, `next=SUMMARY 자세히 보기`; `src/components/LearningModelNotice.tsx:8-12`
- Learner impact: 핵심 과제는 막히지 않지만 시각 순서와 Tab 순서가 달라 현재 단계의 첫 조작을 기억해야 함.
- Root-cause hypothesis: header의 상세 disclosure가 `main`보다 앞선 DOM에 있고 start screen에도 안전 상세가 반복됨.
- Proposed change: header는 요약 문단만 렌더링하고 상세 설명은 start screen의 labelled `details`에서만 제공.
- Verification: stage h2 뒤 첫 Tab이 `사진 스캔 과제함` 또는 해당 단계의 첫 학습 control에 도달하고 start safety details는 계속 열림.
- Status: fixed. Header summary is now non-interactive, and the first Tab after the stage heading reaches `사진 스캔 과제함`.

### EDU-UX-002 — P2 — 320/375px 첫 사례 행동이 첫 viewport 아래로 밀림

- Path/state: `/` initial state
- Persona/viewport: 서윤 / 320×800, 375×812
- Observed action/result: 320px에서 header 395px와 목표 카드 271px 뒤에 사례 영역이 시작됨. 375px에서도 첫 사례 버튼 상단이 y≈912px.
- Evidence: `output/playwright/elementary-baseline-320.png`, `output/playwright/elementary-baseline-375.png`, snapshot bounding boxes
- Learner impact: “무엇을 배울지”는 알지만 “무엇을 누를지”를 찾으려 긴 스크롤을 해야 함.
- Root-cause hypothesis: 모바일 header padding·title·notice가 데스크톱 간격을 유지하고, header details가 높이와 tab stop을 추가함.
- Proposed change: `src/styles/responsive.css`의 520px 이하 header rhythm을 compact하게 조정하되 본문 16px, contrast, 44px target은 유지.
- Verification: 320/375 screenshot에서 첫 사례 단서가 첫 viewport에 나타나고, document client width와 scroll width가 같음.
- Status: fixed. 320px·375px에서 첫 사례 버튼이 첫 viewport 안에 나타나고 `scrollWidth === clientWidth`입니다.

### EDU-UX-003 — P2 — 사례 선택 후 다음 CTA가 먼 위치에 남음

- Path/state: `/` → `activeCaseId !== null`
- Persona/viewport: 서윤 / 320×800, 375×812; 준호 / Space로 선택
- Observed action/result: 사례 버튼을 누르면 `기능 명세 보기`가 enabled·`gi-pulse`가 되지만 문서 y≈1116px에 남음. `LearningOverview`는 “아래 버튼”을 말하지만 viewport에는 버튼이 없음.
- Evidence: post-selection browser snapshot (`기능 명세 보기` box y≈1116), `src/features/start/LearningOverview.tsx:17-19`
- Learner impact: 선택 성공은 알지만 다음 학습 행동을 스스로 연결하지 못하고 멈출 수 있음.
- Root-cause hypothesis: selection state가 바뀌어도 primary action에 focus/scroll 안내가 없음.
- Proposed change: `PrimaryActionButton` native ref를 전달하고 selection commit 직후 CTA에 focus; next-action paragraph를 polite live region으로 알림.
- Verification: click/Space 뒤 CTA가 enabled·focused·viewport 안이며 Enter로 specification stage로 이동.
- Status: fixed. 선택 후 `기능 명세 보기`가 enabled·focused·`gi-pulse` 상태로 viewport 안에 나타나며 다음 단계로 이동합니다.

### EDU-UX-004 — P3 — header와 start safety details의 안전 설명 중복

- Path/state: 모든 stage header와 start stage safety section
- Persona/viewport: 서윤 / 320×800
- Observed action/result: header `자세히 보기`와 start `학습 범위와 안전 더 보기`가 비슷한 안전·저장 경계를 각각 제공함.
- Learner impact: 첫 행동보다 안전 설명이 두 번 보이고 시작 세로 밀도가 커짐.
- Proposed change: header를 한 문장 요약으로 제한하고 start details를 상세 원본으로 유지.
- Verification: header에 summary interactive control이 없고 start details를 열면 `LEARNING_MODEL_DETAILS`가 보임.
- Status: fixed. 헤더에는 interactive disclosure가 없고 시작 화면의 labelled safety details가 상세 원본으로 남아 있습니다.

## Post-fix validation and final score

- Validation date: 2026-08-30
- Final screenshots: `output/playwright/elementary-final-320.png`, `output/playwright/elementary-final-375.png`, `output/playwright/elementary-final-1280.png`
- MCP Playwright observations: 320px·375px first-case bounds and post-selection CTA bounds are inside the viewport; both widths have no horizontal overflow; stage-heading → Tab reaches the first case; reduced-motion sets pulse animation to `none` with an opaque static aura; the four-case path reaches revocation and the report.
- Privacy observation: before consent `Object.keys(localStorage)` is empty; after consent only `minimum-permission-lab:v1` exists with `version: 1`, a state object, and no nickname field; no external requests or console errors were observed.
- CLI browser limitation: the local Playwright Chromium headless shell and WebKit executables are absent, so CLI browser suites are environment-blocked and no browsers were installed. This is not counted as a strict browser pass.

| 영역 | 최종 점수 | 근거 |
|---|---:|---|
| 학습 목표·과제 명료성 | 14/15 | 목표와 첫 사례 행동 문장이 첫 화면에서 바로 이어짐 |
| 아동 언어·인지부하 | 14/15 | 짧은 다음 행동 문장과 중복 헤더 disclosure 제거 |
| 화면 구조·행동 위계 | 14/15 | 시각 순서와 Tab 순서가 일치하고 선택 직후 CTA로 이동 |
| 피드백·오류 회복 | 13/15 | 필수/불필요 판정, 조건 비교, 대안·철회 경로 유지 |
| 시각적 가독성 | 9/10 | 320/375px 세로 밀도와 첫 사례 노출 개선, 대비·44px target 유지 |
| 키보드·의미·기본 접근성 | 9/10 | native controls, visible focus, polite live region, logical Tab order |
| 반응형 학습 흐름 | 9/10 | 320/375px no-overflow와 CTA viewport 확인 |
| 런타임 안정성 | 5/5 | 정책·lint·unit·coverage·build 및 브라우저 관찰 오류 없음 |
| 맥락적 시각자료·자산 안전 | 5/5 | 외부·사실성 이미지 없이 CSS 도형과 텍스트 계약 유지 |
| **합계** | **92/100** | P0/P1 없음, 기준선 P2/P3 네 건 해결 |

## Existing strengths to preserve

- 권한 선택은 native radio, 조건은 checkbox, 저장은 native checkbox로 제공되어 pointer 없이 조작할 수 있음.
- `gi-pulse`는 CTA 본체보다 aura를 애니메이션하고 reduced-motion에서 정적 focus outline으로 대체하는 기존 계약이 있음.
- 오답 이후 기능 영향 카드가 선택 결과·근거·대안·철회 방향을 함께 보여 주며, report 끝에는 인쇄·다시 시작 목적이 있음.
- privacy 관찰에서 초기 localStorage가 비어 있고 외부 요청·실제 권한 팝업이 없었음.

## Audit disposition

P0/P1은 관찰되지 않았습니다. EDU-UX-001~003을 먼저 구현하면 키보드·모바일·다음 행동의 P2 마찰이 동시에 줄어듭니다. EDU-UX-004는 중복 제거로 함께 해결합니다. 기준선 이후에는 같은 시작 상태와 같은 오답·완료 순서로 다시 실행하고, 실제 아동 세션·교사 관찰·VoiceOver/TalkBack/WebKit은 별도 증거 상태로 유지합니다.

## Scoped follow-up audit — word/sentence expression and simulation only (2026-08-30)

### Scope lock

이번 재점검은 새로 추가된 두 기능만 대상으로 했습니다.

- 학습자 화면의 단어·문장·버튼·힌트·근거 작성 표현
- 권한 영향 화면의 map/voice 교육용 시뮬레이션

기존 시작 화면·보고서·저장 포맷·권한 판정·배포 설정은 이번 개선 대상에서 제외했습니다. 실제 아동이 참여한 연구가 아니라 초등 5–6학년 서윤과 초등 3–4학년 준호를 가정한 simulated learner panel입니다.

### Before → after findings

| scoped issue | before | after | learner acceptance |
|---|---|---|---|
| impact title/instruction | `기능 영향 시뮬레이션`과 추상적인 “미치는 영향” 설명 | `권한 영향 시뮬레이션`과 “어떤 기능이 되는지 확인” 문장 | 제목과 첫 문장만 읽고 권한-기능 변화를 말할 수 있음 |
| model boundary | 실제 권한 요청·가상 모델을 한 문장에 함께 설명 | “이곳에서만 쓰는 가상 실험”과 “실제 권한은 바뀌지 않음”으로 분리 | 기기 설정이 바뀌지 않는다는 사실을 먼저 확인함 |
| simulation prompt | 조건부 비교와 스위치 조작이 한 문단에 섞임 | 예측 → 한 조건 바꾸기 → 관찰 → 설명 → 비교 순서 | prediction 전 checkbox disabled, explanation 전 compare disabled |
| impact labels | 사용 가능/판정 피드백/판정 근거가 추상적으로 나열됨 | 계속 할 수 있는 일/제한되는 일/왜 판단했을까요?/다른 방법 | 허용·제한·이유·대안을 각각 찾을 수 있음 |
| rationale writing | 개인정보·저장·자동 채점 경계가 한 덩어리 | 개인정보 금지·저장 가능·자동 채점 안 함·문장 도움말 분리 | 이름/전화번호/주소를 쓰지 않고 이유 문장을 시작할 수 있음 |

### Same-scenario learner panel evidence

- 320×800 map: 키보드 Space로 prediction을 고른 뒤 `현재 위치 보기 조건 켜기`를 조작하고 관찰·설명·비교를 완료했습니다. reset 뒤 checkbox가 꺼지고 observation이 숨겨졌습니다.
- 375×812 map: reduced-motion 상태에서 동일 loop와 reset/retry를 완료했습니다. `scrollWidth=360`, `clientWidth=360`, 44px 미만 control 0개, animation 0개였습니다.
- 1280×900 map: baseline prediction과 changed observation을 읽은 뒤 explanation을 골라 비교를 완료했습니다.
- 1280×900 voice: `오래 보관하는 조건 켜기`가 꺼진 상태로 시작하고 켠 뒤 긴 보관 observation을 표시했습니다. 실제 녹음·재생 버튼은 0개였습니다.
- 모든 scoped MCP run에서 navigation 전에 request listener를 설치했고 external requests `[]`, console errors `[]`였습니다.
- 새 Playwright spec은 `e2e/elementary-language-simulation.spec.ts`에 저장했습니다. CLI 실행은 브라우저 실행 파일 부재로 환경 차단되었고 설치하지 않았습니다.

### Scoped disposition

표현 원장 `EDU-LANG-001`~`EDU-LANG-006`과 시뮬레이션 원장의 두 objective는 모두 `confirmed`/`GREEN`입니다. 실제 아동·교사 관찰, VoiceOver/TalkBack, CI 브라우저 실행은 별도 후속 증거로 남겼으며 이번 실행에서 커밋·푸시·배포는 하지 않았습니다.
