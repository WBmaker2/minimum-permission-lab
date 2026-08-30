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
4. 릴리스가 필요하면 이 변경을 검토한 뒤 별도 승인으로 commit·push·배포·공개 URL 검증을 진행합니다. 이번 UX 점검에서는 release action을 실행하지 않았습니다.

## 공개 주소 참고

기존 배포를 확인할 때 사용할 수 있는 주소는 [Minimum Permission Lab](https://wbmaker2.github.io/minimum-permission-lab/)입니다. 이 URL은 이번 점검 턴에 새로 배포한 결과가 아니며, 현재 변경 사항의 공개 반영을 의미하지 않습니다.
