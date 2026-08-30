# Elementary Learner UX Improvement Report

## 결론

초등 학습자 관점의 simulated panel에서 발견한 P2 세 건과 P3 한 건을 구현으로 해결했습니다. 기준선 82/100에서 최종 92/100으로 올라갔으며 P0/P1 이슈는 없었습니다. 사례를 고른 뒤 다음 버튼으로 포커스가 이동하고, 좁은 화면에서 첫 사례가 보이며, 헤더의 중복 상세 disclosure가 키보드 흐름을 가로채지 않습니다.

이 문서는 실제 아동 연구, 교사 관찰, VoiceOver/TalkBack 실행, 접근성 인증서가 아닙니다. 실제 브라우저 CLI는 이 환경의 Playwright 실행 파일 부재로 막혔고, 동일한 검증은 연결된 MCP Playwright 브라우저에서 수동 시나리오로 확인했습니다.

## 범위와 증거 경계

- Mode: `full`
- Target: `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab`
- Validation date: 2026-08-30
- Stage 0: `work/elementary-webapp-ux-bootstrap.md`, `Overall status: ready`
- Plan: `work/elementary-webapp-ux-plan.md`
- Baseline audit: `work/elementary-webapp-ux-audit.md`
- Primary simulated persona: 초5–6 서윤 (제목·버튼을 먼저 훑고 이유를 확인함)
- Guardrail simulated persona: 초3–4 준호 (한 단계 조건과 즉시 피드백을 기대함)
- Evidence source: local Vite app, source/test reading, simulated learner panel, MCP Playwright observation
- Excluded claims: 실제 아동 표본, 교사 사용성 연구, VoiceOver/TalkBack 결과, WebKit 통과, 접근성 법적·인증 판정

## 기준선과 최종 점수

| 영역 | 기준선 | 최종 | 개선 근거 |
|---|---:|---:|---|
| 학습 목표·과제 명료성 | 13/15 | 14/15 | 목표 다음에 짧은 사례 행동 문장을 배치 |
| 아동 언어·인지부하 | 13/15 | 14/15 | 헤더 중복 상세 제거, 다음 행동 문장 단축 |
| 화면 구조·행동 위계 | 11/15 | 14/15 | stage heading 뒤 첫 Tab과 선택 후 CTA 순서를 시각 순서에 맞춤 |
| 피드백·오류 회복 | 13/15 | 13/15 | 기존 필수/불필요·조건 비교·대안·철회 흐름 보존 |
| 시각적 가독성 | 8/10 | 9/10 | 320/375px 헤더 세로 밀도 감소, 16px 본문과 대비 유지 |
| 키보드·의미·기본 접근성 | 6/10 | 9/10 | native control, visible focus, polite live region, 논리적 Tab 순서 |
| 반응형 학습 흐름 | 8/10 | 9/10 | 첫 사례와 선택 CTA가 320/375px viewport 안에 위치 |
| 런타임 안정성 | 5/5 | 5/5 | 정책·lint·unit·coverage·build와 MCP 관찰 통과 |
| 맥락적 시각자료·자산 안전 | 5/5 | 5/5 | 사실성 이미지 없이 CSS 도형·텍스트 계약 유지 |
| **합계** | **82/100** | **92/100** | P2 세 건·P3 한 건 해결, P0/P1 없음 |

## 이슈별 결과

| ID | 심각도 | 기준선 문제 | 구현 결과 | 검증 |
|---|---|---|---|---|
| EDU-UX-001 | P2 | stage heading 뒤 Tab이 헤더 `자세히 보기`로 역행 | `LearningModelNotice`를 non-interactive note로 축소 | h2 focus 후 Tab → `사진 스캔 과제함` |
| EDU-UX-002 | P2 | 320/375px에서 첫 사례가 첫 viewport 아래에 있음 | `responsive.css`의 520px 이하 header rhythm과 시작 문장 단축 | 320px case box y=743.29~788.88, 375px y=692.40~737.99; 두 폭 no-overflow |
| EDU-UX-003 | P2 | 선택 후 `기능 명세 보기`가 y≈1116px에 남음 | `PrimaryActionButton` ref 전달과 선택 commit 후 focus effect 추가 | CTA enabled·focused·visible, Enter로 명세 단계 진입 |
| EDU-UX-004 | P3 | 헤더와 시작 화면에 안전 상세 disclosure 중복 | 상세 계약을 시작 화면 details 하나로 유지 | header details 0개, 업데이트 dialog 닫기 후 호출 버튼 focus 복귀 |

## 구현 변경 요약

- `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab/src/components/LearningModelNotice.tsx`
  - `LEARNING_MODEL_SUMMARY`만 `role="note"`로 렌더링합니다.
  - 헤더의 interactive `<details>/<summary>`를 제거해 첫 학습 control 앞의 불필요한 Tab stop을 없앴습니다.
- `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab/src/components/PrimaryActionButton.tsx`
  - `forwardRef<HTMLButtonElement, PrimaryActionButtonProps>`로 native button ref를 전달합니다.
  - `data-step`와 화면당 하나의 `gi-pulse` 계약은 유지합니다.
- `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab/src/features/start/StartScreen.tsx`
  - 사례 선택 commit 뒤 primary CTA에 한 번만 focus합니다.
  - update-history modal이 열려 있을 때는 modal focus를 빼앗지 않는 guard를 둡니다.
- `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab/src/features/start/LearningOverview.tsx`
  - 선택 전 다음 행동 문장을 `사례를 골라 시작해 보세요.`로 줄이고 `aria-live="polite"`를 부여합니다.
- `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab/src/features/start/CaseSelector.tsx`
  - 사례 prompt를 `사례를 골라 권한을 살펴봅니다.`로 줄입니다.
- `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab/src/main.tsx`
  - `responsive.css`를 component layer 다음에 로드합니다.
- `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab/src/styles/responsive.css`
  - 520px 이하 header padding, 제목 line-height, 모델 notice 간격, 시작 카드 padding을 분리합니다.
  - `components.css`는 500줄 미만으로 유지됩니다.
- `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab/src/content/updateHistory.ts`
  - 2026-08-30 `초등 학습자 첫 행동과 키보드 순서 개선` 항목과 실제 학생·수동 screen-reader 미실행 경계를 기록합니다.
- Tests and e2e:
  - `src/components/PrimaryActionButton.test.tsx`
  - `src/content/learningNotices.test.ts`
  - `src/content/updateHistory.test.ts`
  - `src/features/start/StartScreen.test.tsx`
  - `src/features/start/LearningOverview.test.tsx`
  - `src/styles/styles.test.ts`
  - `e2e/accessibility.spec.ts`
  - `e2e/mobile-reduced-motion.spec.ts`

## TDD 및 정적 검증 증거

### RED

1. `PrimaryActionButton` ref forwarding·selection focus·live-region을 먼저 기대하도록 테스트를 추가했습니다. 구현 전 focused Vitest에서 헤더 summary 잔존, live attribute 누락, CTA 미포커스 등 네 실패를 확인했습니다.
2. 좁은 화면 CSS source assertion을 먼저 추가했고 compact rule 부재로 실패했습니다.
3. update history 최신 날짜·요약·안전 경계를 먼저 요구했고 이전 항목 불일치로 실패했습니다.

### GREEN

1. ref forwarding, selection focus effect, modal focus guard, `aria-live`, compact responsive layer를 최소 변경으로 구현했습니다.
2. focused suite는 25 files/235 tests를 통과했습니다.
3. Impeccable detector는 변경 markup에서 `[]`를 반환했습니다.

### 실행 결과

| 명령 | 결과 |
|---|---|
| `npm run test:policy` | Node 정책 테스트 19/19 통과 |
| `npm run check:policy` | `source policy: 0 forbidden runtime references` |
| `npm run lint` | exit 0 |
| `npm run test:run` | 25 files, 235 tests 통과 |
| `npm run test:coverage` | Statements 90.74%, Branches 88.19%, Functions 91.13%, Lines 95.77% |
| `npm run build` | TypeScript와 Vite production bundle 성공 |
| `git diff --check` | 오류 없음 |
| 500줄 검사 | `src`, `e2e`, `scripts` 대상 출력 없음 |

## 동일 시나리오 브라우저 재검증

검증 서버는 `http://127.0.0.1:44175/`로 고정했습니다. request listener를 navigation 전에 등록하고 `http://127.0.0.1:44175/` 외 URL을 외부 요청으로 기록했습니다.

### 시작·키보드·모바일

- 320×800: 초기 localStorage key `[]`; stage h2 focus 후 Tab이 `사진 스캔 과제함`으로 이동; 첫 사례 box `{x:40,y:743.29,width:225,height:45.59}`; 선택 후 `기능 명세 보기` CTA가 focus; `scrollWidth=305`, `clientWidth=305`.
- 375×812: 초기 localStorage key `[]`; 같은 Tab 순서; 첫 사례 box `{x:40,y:692.40,width:280,height:45.59}`; CTA focus; `scrollWidth=360`, `clientWidth=360`.
- 두 폭 모두 native button의 computed `min-height`는 44px입니다.
- `prefers-reduced-motion: reduce`: `matchMedia`가 true이고 pulse 본체·aura의 animation이 `none`, aura opacity가 `1`인 고정 강조를 확인했습니다.

### 오답·4사례·철회·보고서

- 별도 오답 관찰에서 사진 사례의 카메라만 필수, 마이크·위치·연락처는 불필요로 표시되고 근거·대안이 노출되었습니다.
- 새 세션에서 네 사례를 `사진 스캔 과제함` → `음성 읽기 연습` → `교실 지도 안내` → `모둠 알림판` 순서로 선택했습니다.
- 각 사례에서 권한을 모두 거부하고 조건 비교를 확인한 뒤 `대안 사용`, 수정안의 근거 문장과 `기능 연결` 태그를 선택했습니다.
- 모둠 알림판은 기능 명세 화면에서 안전한 가상 별명 `햇살`을 입력한 뒤 심사를 진행했습니다. 실제 이름·전화번호·주소는 입력하지 않았습니다.
- 네 사례 완료 결과는 각각 `완료한 사례: 1/4`, `2/4`, `3/4`, `4/4`였습니다.
- 철회 연습에서 카메라·마이크·위치는 `현재 기능에 유지`, 연락처는 `지금 철회`로 선택했습니다.
- 최종 상태는 `현재 단계: 7/7 · 학습 보고서 · 완료한 사례: 4/4`, 제목은 `최소 권한 학습 보고서`였습니다.
- 최종 desktop 1280×900 관찰에서도 가로 overflow가 없었습니다.

### 개인정보·네트워크·업데이트 내역

- 저장 동의 전 `Object.keys(localStorage) === []`입니다.
- `이 기기에 저장`을 켠 뒤 key는 `minimum-permission-lab:v1` 하나이며 payload `version === 1`, `state`는 object, `nickname` 필드는 없습니다.
- request listener의 `externalRequests`와 console error 수집 결과는 모두 `[]`였습니다.
- 업데이트 내역 dialog가 열리고 최신 항목 `초등 학습자 첫 행동과 키보드 순서 개선`이 보이며, 닫은 뒤 호출 버튼으로 focus가 돌아왔습니다.
- header에는 `details`가 0개이며 상세 안전 문구는 시작 화면의 `학습 범위와 안전 더 보기`에 남아 있습니다.

### 브라우저 실행 파일 제한

- 실행을 시도한 명령: `./node_modules/.bin/playwright test e2e/mobile-reduced-motion.spec.ts --project=mobile-375 --workers=1`, `./node_modules/.bin/playwright test e2e/accessibility.spec.ts --project=desktop-chromium --workers=1`.
- 결과: Chromium headless shell과 WebKit 실행 파일이 `/Users/kimhongnyeon/Library/Caches/ms-playwright` 아래에 없어 테스트 전 단계에서 중단되었습니다.
- 대응: 브라우저 설치나 캐시 변경은 하지 않았고, MCP Playwright로 같은 assertions를 확인했습니다. 따라서 CLI Playwright를 통과했다고 기록하지 않습니다.

## 이미지·모션·접근성 경계

- 이번 시작 화면 개선에는 사실성·맥락 의존 이미지가 필요하지 않아 `imagegen`을 실행하지 않았습니다. 기존 CSS permission glyph와 텍스트 계약을 유지했습니다.
- 핵심 단계 버튼의 `gi-pulse` aura는 유지하고 `prefers-reduced-motion`에서 정적 outline으로 대체했습니다.
- 키보드, native radio/checkbox/textarea, focus-visible, live region, 44px target, 좁은 화면 overflow를 확인했습니다.
- VoiceOver·TalkBack은 실행하지 않았고, 새 음성 안내·TTS·녹음 기능도 추가하지 않았습니다.

## 남은 단계

구현상 남은 P0/P1/P2/P3 이슈는 없습니다. 다음은 제품 릴리스 전 별도의 증거로 남겨야 합니다.

1. 교사 동석 하에 실제 초등 학습자 세션을 보호된 절차와 동의 범위로 관찰하고, 막힘·오해 문장을 기록합니다.
2. 필요할 때 실제 보조기술 수동 점검을 별도 수행하되, 그 결과가 생기기 전까지 접근성 인증을 주장하지 않습니다.
3. Playwright 브라우저 바이너리가 제공되는 CI 또는 격리된 환경에서 `desktop-chromium`, `mobile-375`, privacy E2E를 다시 실행합니다.
4. 이번 변경은 아래 Release evidence처럼 명시적 승인 후 이미 commit·push·배포·공개 URL 검증을 완료했습니다. 다음 릴리스에서도 같은 게이트와 공개 learner path 확인을 반복합니다.

## 공개 주소 참고

현재 배포를 확인할 수 있는 주소는 [Minimum Permission Lab](https://wbmaker2.github.io/minimum-permission-lab/)입니다.

## Release evidence

- Release PR: [#3 feat: improve elementary learner flow](https://github.com/WBmaker2/minimum-permission-lab/pull/3), merged 2026-08-30.
- `main` merge commit: `24026a8e17fd0017f97ea45c24e4729b5f48c408`.
- GitHub Pages workflow: [33311957285](https://github.com/WBmaker2/minimum-permission-lab/actions/runs/33311957285), success; lint, policy/unit tests, production build, artifact upload, and Pages deploy all passed.
- Public verification: HTTP 200, title `앱 권한 최소허용 연구소`, JS/CSS assets 200, 320px·375px first-case bounds and no horizontal overflow, header details 0, latest update history present, external requests 0, console errors 0.
- The public URL now reflects the merged learner UX improvements. VoiceOver/TalkBack and real student sessions remain separate evidence states.

## Scoped follow-up report — language and simulation only (2026-08-30)

### Scope and decision

이번 실행은 사용자가 지정한 두 기능만 검토하고 개선했습니다.

1. 학습자에게 보이는 단어·문장·버튼·힌트·근거 작성 표현
2. 권한 영향 화면의 두 교육용 시뮬레이션: `map-current-position-opt-in`, `voice-press-and-delete`

시작 화면의 기존 레이아웃, 보고서, 저장 포맷, 권한 판정, 배포 설정은 변경하지 않았습니다. 실제 권한·위치·마이크·녹음·재생·외부 요청은 사용하지 않았고, 실제 아동·교사·VoiceOver·TalkBack 결과를 주장하지 않습니다.

### 구현 변경

- `src/features/impact/simulationModel.ts`에 두 시나리오의 `SimulationScenarioSpec`을 추가했습니다. 각 모델은 prediction, 한 변수, 초기값, observation, explanation, 경계 문장, pause/step 적용 이유를 고정 상수로 제공합니다.
- `src/features/impact/SimulationLearningLoop.tsx`에 native fieldset/radio/checkbox 기반 `prediction → manipulation → observation → explanation → compare` 순서를 구현했습니다. `처음 조건으로 돌아가기`는 로컬 상태와 map switch를 초기값으로 복원하며, 준비된 `비교 결과 확인`에만 `gi-pulse`를 적용해 단계 primary CTA와 동시에 깜빡이지 않게 했습니다.
- `src/features/impact/ConditionalScenarioCard.tsx`는 map reducer switch와 voice 화면 로컬 보관 조건을 분리합니다. voice retention은 꺼진 상태에서 시작하며 녹음·재생 컨트롤을 만들지 않습니다.
- `src/features/impact/ImpactScreen.tsx`, `FunctionImpactList.tsx`, `impactProgress.ts`, `src/content/conditionalScenarios.ts`, `src/features/review/RationaleComposer.tsx`, `src/features/review/reviewProgress.ts`에서 추상 표현을 한 행동씩 읽히는 문장으로 바꿨습니다. 개인정보·저장·자동 채점 경계와 기존 판정 사실은 유지했습니다.
- `src/styles/simulation.css`를 새로 두어 카드와 관찰 결과를 500줄 미만 파일로 분리하고, 44px target·좁은 화면 세로 배치·reduced-motion 정적 fallback을 제공합니다.
- `src/content/updateHistory.ts`에 `단어·문장 표현과 권한 영향 시뮬레이션 개선` 날짜 항목을 newest-first로 추가했습니다.
- `e2e/elementary-language-simulation.spec.ts`에 표현 probe, map/voice loop, reset, reduced-motion, mobile overflow, no-external-request 계약을 추가했습니다. 기존 full-flow helper도 새 비교 단계에 맞췄습니다.

### TDD와 게이트

- RED: 시뮬레이션 모듈·컴포넌트 부재와 기존 문구 기대 불일치를 먼저 확인했습니다.
- GREEN: `npm run test:run` — Node policy 19/19, Vitest 27 files/243 tests 통과.
- `npm run test:coverage` — Statements 91.09%, Branches 88.09%, Functions 91.4%, Lines 96%.
- `npm run lint` — exit 0.
- `npm run build` — TypeScript와 Vite production bundle 통과.
- CSS source test — simulation layer import, min target, mobile/reduced-motion 규칙 통과.
- `git diff --check`와 500줄 검사 — 오류·500줄 이상 파일 없음.
- `npm run test:e2e -- e2e/elementary-language-simulation.spec.ts` — 코드가 실행되기 전 로컬 Chromium/WebKit 바이너리 부재로 6개가 환경 차단되었습니다. 브라우저를 설치하지 않았으며 이 결과를 pass로 세지 않습니다.

### 동일 시나리오 MCP 브라우저 증거

- 서버 `http://127.0.0.1:44176/`에서 navigation 전에 request/console listener를 설치했습니다.
- map 320×800: Space로 prediction을 고른 뒤 위치 조건을 켜고 설명·비교를 완료했습니다. reset 후 checkbox unchecked, observation hidden을 확인했습니다. `clientWidth=305`, `scrollWidth=305`, 작은 target 0, reduced-motion animation 0.
- map 375×812: 동일 흐름과 reset/retry를 완료했습니다. `clientWidth=360`, `scrollWidth=360`, 작은 target 0, reduced-motion animation 0. 결과는 [elementary-simulation-final-375.png](../output/elementary-simulation-final-375.png)에서 확인할 수 있습니다.
- map 1280×900: prediction 전 조작 차단, changed observation, explanation 후 compare 완료를 확인했습니다. 결과는 [elementary-simulation-final-1280.png](../output/elementary-simulation-final-1280.png)입니다.
- rationale 1280×900: `고른 이유를 써 보세요`, 개인정보 저장 경계, 자동 채점 없음, 문장 도움말이 한 화면에서 분리되어 보입니다. 결과는 [elementary-language-final-rationale-1280.png](../output/elementary-language-final-rationale-1280.png)입니다.
- voice 1280×900: retention checkbox가 off로 시작하고 on 전환 뒤 긴 보관 observation을 표시했습니다. 비교 완료 후에도 녹음/재생 버튼 수 0, 경계 문장에 실제 음성·마이크·재생 미사용이 명시되었습니다.
- 모든 새 MCP 흐름에서 external requests `[]`, console errors `[]`, 가로 넘침 없음이었습니다.

### 현재 남은 증거 단계

기능 구현과 scoped QA는 완료했습니다. 실제 초등 학습자 세션, 교사 동석 관찰, VoiceOver/TalkBack, CI 브라우저 바이너리에서의 Playwright 실행은 별도 증거 단계입니다. 이번 scoped 변경은 커밋·푸시·배포까지 완료했으며, 아래 릴리스 증거와 공개 URL을 확인했습니다.

### Scoped release evidence — language and simulation (2026-08-31)

- 기능 커밋: `ee7442673b37f7ac3c689bbfa1e745bf9b7ac534` (`feat: add elementary language and simulation learning flow`), `main`에 push 완료.
- Pages workflow: [33339943038](https://github.com/WBmaker2/minimum-permission-lab/actions/runs/33339943038) 성공. lint, unit/policy tests, production build, Pages artifact upload, Pages deploy를 모두 통과했습니다.
- 공개 주소: [Minimum Permission Lab](https://wbmaker2.github.io/minimum-permission-lab/).
- 공개 확인: HTTP 200, 제목 `앱 권한 최소허용 연구소`, HTML이 참조하는 JS·CSS asset 각각 HTTP 200, 시작 화면에서 사례 선택·기능 명세·권한 심사 경로가 정상 표시되었습니다.
- 로컬 CLI Playwright는 브라우저 바이너리 부재로 실행 전 차단되었고, 이를 공개 E2E 통과로 주장하지 않습니다. VoiceOver/TalkBack과 실제 초등 학습자 세션도 별도 증거 단계입니다.
