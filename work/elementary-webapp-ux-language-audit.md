# Elementary Learner Language Audit — Scoped Follow-up

## Audit boundary

- Date: 2026-08-30
- Mode: `full`
- Project: `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab`
- Scope: 학습자에게 보이는 단어·문장·버튼·힌트·근거 작성 표현과 기능 영향 시뮬레이션 화면의 문구
- Target grade: 초등 5–6학년, 보조 기준 초등 3–4학년
- Method: source reading, local MCP Playwright rendered-state observation, simulated learner comprehension probes
- Evidence boundary: 실제 아동·교사 표본, VoiceOver/TalkBack 실행, 공개 맞춤법 검사기 호출은 포함하지 않음
- Candidate inventory: `work/elementary-webapp-ux-language-candidates.md` (triage-only, 1602 candidates including test code)
- Korean language skill status: `korean-spell-check`와 `korean-humanize` 지침을 읽고 적용 원칙을 반영했으며, 외부 검사기는 저빈도·개인정보 비전송 원칙에 따라 호출하지 않아 `not run`으로 기록함

## Baseline learner panel

관찰 URL은 `http://127.0.0.1:44176/`이며 브라우저 request/console 오류는 없었습니다. `교실 지도 안내`를 선택해 `기능 영향 시뮬레이션`까지 이동한 뒤 화면에 나타난 문구와 컨트롤을 기록했습니다.

| persona / state | learner says or does | observed evidence | interpretation |
|---|---|---|---|
| 서윤 / 영향 화면 제목 | “무엇이 바뀌는 화면인지 읽어 보려고 해요.” | `기능 영향 시뮬레이션`, `선택한 권한이 기능에 미치는 영향을 살펴봅니다.` | `영향`과 `미치는`이 추상적이고 첫 행동이 한 문장에 없음 |
| 준호 / 조건 카드 | “조건부가 무슨 뜻인지 다시 읽어야 해요.” | `조건부 기능 비교`, 긴 `changedContract` 문장 | 핵심 교과어를 처음 풀어 주지 않아 3–4학년에게 부담 |
| 서윤 / 진행 힌트 | “비교 확인을 누르면 끝나는 건가요?” | `조건부 비교 0/1 — 기능 스위치를 켠 뒤 비교 확인을 눌러 주세요.` | `조건부 비교`가 결과인지 행동인지 모호함 |
| 서윤 / 근거 작성 | “근거는 정답을 맞히는 글인가요?” | `내 판단 근거`, `이 문장은 AI나 키워드로 채점하지 않으며...` | 학습 의도는 좋지만 한 문장에 개인정보·저장·채점 조건이 겹침 |

## Issue ledger

| issue-id | screen/state | surface | source/evidence | target grade | before | difficulty signals | after | learning intent preserved | curriculum terms and facts preserved | comprehension probe | visual readability link | verification state | status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `EDU-LANG-001` | `/impact` 영향 화면 진입 | heading + instruction | `src/features/impact/ImpactScreen.tsx:76-78`, MCP body text | 5–6 / 3–4 보조 | `기능 영향 시뮬레이션` / `선택한 권한이 기능에 미치는 영향을 살펴봅니다.` | abstract-or-formal, missing-action | `권한 영향 시뮬레이션` / `고른 권한이 켜져 있을 때 어떤 기능이 되는지 확인해 봅니다.` | yes | yes; permission-to-function relationship unchanged | 제목만 읽고 “권한을 바꿔 기능 변화를 확인한다”고 말하는지 확인 | `e2e/elementary-language-simulation.spec.ts` 1280px·375px | confirmed — MCP 1280px and 375px copy probe |
| `EDU-LANG-002` | `/impact` 모델 경계 | instruction | `src/features/impact/ImpactScreen.tsx:78` | 5–6 | `이 화면은 실제 권한을 요청하지 않는 가상 학습 모델 비교입니다.` | long-or-dense, technical-or-internal | `이곳에서만 쓰는 가상 실험입니다. 실제 권한은 바뀌지 않습니다.` | yes | yes; no real permission claim remains | “실제 기기 설정이 바뀌지 않는다”고 다시 말하고 다음 checkbox를 찾는지 확인 | `e2e/elementary-language-simulation.spec.ts` boundary assertion | confirmed — MCP copy and no-external-request probe |
| `EDU-LANG-003` | `/impact` 조건 카드 | section heading + contract | `src/features/impact/ImpactScreen.tsx:83`, `src/content/conditionalScenarios.ts:26-45` | 5–6 / 3–4 보조 | `조건부 기능 비교` / `기본 저장 지도는 권한 없이 사용할 수 있고, 학습자가 현재 위치 보기 스위치를 직접 켠 경우에만 위치가 조건부로 바뀝니다.` | missing-term-explanation, multiple-conditions, long-or-dense | `조건을 바꿔 보세요` / `저장된 지도는 그대로 두고, 현재 위치 보기만 켜 보며 무엇이 달라지는지 확인합니다.` | yes | yes; map opt-in contract remains | “한 가지를 바꾼다”고 말하고 switch를 prediction 뒤에 조작하는지 확인 | `output/elementary-simulation-final-375.png`, MCP map flow | confirmed — prediction precedes one switch and observation is visible |
| `EDU-LANG-004` | `/impact` 진행 힌트 | hint | `src/features/impact/impactProgress.ts:13-17` | 5–6 / 3–4 보조 | `조건부 비교 0/1 — 기능 스위치를 켠 뒤 비교 확인을 눌러 주세요.` | technical-or-internal, ambiguous-reference | `비교 0/1 — 먼저 조건을 바꾼 뒤, 보이는 결과를 확인해 주세요.` | yes | yes; existing acknowledgement gate unchanged | “먼저 바꾼다, 다음 결과를 확인한다” 순서를 말하는지 확인 | MCP disabled CTA before manipulation | confirmed — concrete next action shown |
| `EDU-LANG-005` | `/impact` 기능 영향 카드 | headings + feedback labels | `src/features/impact/FunctionImpactList.tsx:40-50` | 5–6 | `사용 가능한 기능`, `제한되는 기능`, `판정 피드백`, `판정 근거`, `대안` | abstract-or-formal, inconsistent-label | `계속 할 수 있는 일`, `제한되는 일`, `이 선택의 설명`, `왜 이렇게 판단했을까요?`, `다른 방법` | yes | yes; verdict and contract evidence unchanged | 각 heading을 읽고 허용·제한·이유·다른 방법을 구분하는지 확인 | MCP map impact snapshot | confirmed — all five learner headings present without verdict change |
| `EDU-LANG-006` | `/revision-review` 근거 작성 | heading + privacy help + sentence frame | `src/features/review/RationaleComposer.tsx:31-46`, `src/features/review/reviewProgress.ts:19-24` | 5–6 | `왜 그렇게 골랐는지 적기`; 한 문단 개인정보·저장·자동 채점 안내; `문장틀: 나는 [기능]...` | multiple-actions, long-or-dense, technical-or-internal | `고른 이유를 써 보세요`; 개인정보·저장·채점 안내를 두 문장으로 분리; `문장 도움말: “나는 [기능]을 위해...”` | yes | yes; 240자, opt-in 저장, no automated grading remain | “개인정보는 쓰지 않고, 고른 이유를 한 문장으로 쓰는 칸”이라고 말하는지 확인 | MCP 1280px rationale path | confirmed — heading, label, privacy boundary and sentence frame visible |

## Pass cases intentionally unchanged

- `권한`, `카메라`, `마이크`, `위치`, `연락처`, `대안`, `철회`는 교육 내용의 정확한 용어이므로 처음 등장한 설명과 함께 유지합니다.
- 사진·음성·지도·알림판의 기능 계약 사실, 사용 시점, 보관 약속, 실제 권한 없음 경계는 단순화로 삭제하지 않습니다.
- `실제 개인정보를 입력하지 마세요`와 저장 동의 시 근거 원문이 남을 수 있다는 경계는 의미 충돌을 피하기 위해 보존합니다.

## Verification record

- Baseline: `partial`; rendered state 확인 완료. Final same-scenario status is recorded below as `confirmed`.
- Spell checker: `not run`; 공개 검사기에 소스 전체나 개인정보 입력을 전송하지 않음
- Humanizer: `not run`; 코드·표·JSON에는 적용하지 않고, 화면 문장에는 의미 보존 원칙만 적용
- Real learner research: `not run`; simulated panel only
- VoiceOver/TalkBack: `not run` by project boundary

## Scoped final verification — language and simulation only

- Validation date: 2026-08-30
- Same-scenario MCP Playwright runs used a fresh localStorage state and the same learner order: choose case → choose four permission decisions → open impact → predict → change one condition → observe → explain → compare.
- `http://127.0.0.1:44176/` was tested at 320×800, 375×812, and 1280×900. The 320px and 375px map runs had no horizontal overflow (`clientWidth=305/360`, `scrollWidth=305/360`), no controls below 44px, and reduced-motion animation count `0`. The 1280px map and voice runs completed the same comparison loop.
- Map result: the checkbox stayed disabled until prediction, reset returned it to unchecked and hid observation, and the comparison completion button became disabled only after explanation and acknowledgement.
- Voice result: retention checkbox began unchecked, changing it showed the longer-retention observation, the comparison completed without recording/playback controls, and the boundary text explicitly said no real voice, microphone, or playback was used.
- Language result: the shortened impact sentence, one-action instruction, learner headings, privacy split, and sentence frame were visible in the same path; the simulated learner panel could identify the next control without a technical term-only hint.
- Visual evidence: the rationale wording is captured in `output/elementary-language-final-rationale-1280.png`; the simulation state is captured in `output/elementary-simulation-final-375.png` and `output/elementary-simulation-final-1280.png`.
- Runtime evidence: request listeners were installed before navigation; external request list `[]` and console error list `[]` in the final MCP runs. CLI Playwright was attempted once but is blocked because local Chromium/WebKit executables are absent; no browser was installed.
- Status: all six scoped language issues fixed/confirmed. Real learner research, teacher observation, VoiceOver/TalkBack, and formal accessibility certification remain outside this evidence set.
