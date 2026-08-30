# Minimum Permission Lab Redesign Audit

## 감사 범위

- 감사일: 2026-08-29
- 대상: 공개 학습 앱 [앱 권한 최소허용 연구소](https://wbmaker2.github.io/minimum-permission-lab/)
- 브라우저: Playwright MCP, 데스크톱 viewport와 375×812 viewport
- 경로: 시작 → 사진 스캔 과제함 → 기능 명세 → 최초 권한 심사 → 영향 비교 → 수정 권한 심사
- 입력: 실제 개인정보 없이 가상 권한 선택만 사용
- 제외: 실제 초등학생 참여 세션, VoiceOver/TalkBack 수동 실행, 배포·커밋·푸시

이 문서는 실제 아동의 승인이나 보조기술 인증을 의미하지 않습니다. 자동·브라우저 관찰과 설계 문서 대조를 분리하여 기록합니다.

## 설계 대조

설계 원문 `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab/2026-08-26-minimum-permission-lab-design.md`의 대상(초등 5~6학년), 교과(실과·도덕·디지털 시민성), 가상 권한 모델, 기능→정보→시점→보관 흐름, 최초·수정 비교, 대안·철회, 개인정보·외부 요청 금지, 모바일·키보드·모션 감소 완료 기준은 현재 구현에 존재합니다. 이번 감사는 그 계약을 보존하면서 첫 행동과 피드백의 가시성을 높이는 데 집중합니다.

## 발견 사항

### A-01 — 사례 선택이 모바일 첫 행동에서 멀리 떨어짐 (P1)

375px snapshot에서 헤더 약 385px, 목표 카드 약 187px, 안전 카드 약 387px가 사례 목록보다 먼저 렌더링되었습니다. 첫 사례 버튼은 문서 y=1169px 부근에 나타났고, 학습 기록까지 읽어야 다음 단계 버튼을 찾을 수 있습니다.

영향: 어린 학습자가 “무엇부터 하지?”를 다시 찾아야 하며, 긴 안전 문단이 학습 목표보다 먼저 기억될 수 있습니다.

대응: `LearningOverview`로 목표와 다음 행동을 짧게 묶고 `CaseSelector`를 바로 뒤에 배치합니다. 안전 상세와 저장 상세는 기본 접힘 패널로 이동하되, 요약·키보드 접근·실제 저장 경계는 유지합니다.

### A-02 — 포커스된 단계 제목이 화면 밖에 남음 (P1)

명세 진입 후 `document.activeElement`는 새 `h2`였지만 `scrollY=555`, heading `getBoundingClientRect().top=-224.78`이었습니다. 영향 단계에서는 `scrollY=2065`, heading top이 -1735px까지 올라갔습니다.

영향: 키보드 사용자는 포커스가 어디에 있는지 화면에서 확인할 수 없고, 단계 전환 직후 학습 맥락을 놓칠 수 있습니다.

대응: `StageFocusManager`가 heading을 `preventScroll`로 포커스한 뒤 `scrollIntoView({ block: 'start', inline: 'nearest' })`하고 CSS `scroll-margin-block-start`를 적용합니다.

### A-03 — 영향 단계 CTA의 비활성 이유가 연결되지 않음 (P1)

최초 권한 선택 후 영향 화면에서 조건부 비교와 `대안 사용`·`권한 철회` 중 하나를 고르기 전 `최소 권한안 수정`은 disabled입니다. 현재 화면에는 일반 설명만 있고 CTA의 `aria-describedby`나 조건별 짧은 도움말이 없습니다.

영향: 학생은 조건 비교를 다시 해야 하는지, 수정 방향을 골라야 하는지 추측합니다.

대응: 조건 확인 수와 수정 방향 상태를 계산해 `ActionRequirementHint`로 표시하고 disabled CTA에 연결합니다.

### A-04 — 철회 CTA의 남은 조건이 수량으로 보이지 않음 (P2)

철회 화면은 긴 문장으로 네 권한 선택과 하나 이상의 철회 조건을 설명하지만, `철회 판단 완료` 버튼에 연결된 조건별 도움말이 없습니다.

영향: 마지막 활동에서 학생이 “몇 개를 더 고르면 되는지”를 한눈에 알기 어렵습니다.

대응: `revocationProgress.ts`의 순수 함수로 선택 수·철회 수·남은 조건을 안내하고 `aria-describedby`를 연결합니다.

### A-05 — 사례 카드의 시각적 선택 단서가 약함 (P2)

현재 사례 버튼과 설명 문장이 같은 목록 안에 있지만 선택된 사례는 `aria-pressed`로만 주로 표현됩니다. 완료 상태는 텍스트가 있으나 카드 레이아웃과 다음 행동 문장이 분리되어 있습니다.

영향: 375px에서 네 사례를 비교할 때 어떤 사례를 골랐는지, 완료된 사례를 왜 다시 누를 수 없는지 즉시 파악하기 어렵습니다.

대응: `case-card`, `case-card--selected`, `case-card--completed` 클래스를 사용하고 상태 배지와 “이 사례를 골랐어요”/“완료한 사례” 텍스트를 제공하되 색상에 의존하지 않습니다.

### A-06 — 보고서 끝의 학습 다음 행동이 모호함 (P2)

결과 화면에 `보고서 인쇄`, `처음부터 다시 하기` 버튼은 있으나 두 버튼의 학습 목적을 설명하는 영역이 없습니다.

영향: 보고서를 읽은 뒤 수업에서 무엇을 돌아보거나 다음 사례를 어떻게 연습할지 연결이 약합니다.

대응: `report-next-actions` 영역에 인쇄와 다시 시작의 용도를 짧게 설명하고 기존 버튼·데이터 모델은 유지합니다.

## 우선순위 수용 기준

- A-01: 375px에서 사례 목록의 첫 버튼이 안전·저장 상세의 기본 접힘 내용보다 앞에 있고, 네 사례를 Tab으로 선택할 수 있습니다.
- A-02: 모든 stage transition 직후 `h2[data-stage-heading]`가 focused이며 viewport 안에 있습니다.
- A-03/A-04: 비활성 CTA가 visible note와 `aria-describedby`를 갖고, 조건 충족 시 note·disabled·`gi-pulse` 상태가 함께 갱신됩니다.
- A-05: selected/completed 상태가 텍스트·테두리·`aria-pressed`로 동시에 드러납니다.
- A-06: 결과 화면에 인쇄와 다시 시작의 목적이 각각 한 문장으로 보입니다.
- 모든 변경은 실제 권한·외부 요청·학생 개인정보 저장 계약을 바꾸지 않습니다.

## 지원 역할 상태

`impeccable`, `ui-ux-pro-max`, `redesign-existing-projects` 지원 Skill은 현재 환경에서 사용할 수 없어 `unavailable`입니다. 따라서 이 감사는 공개 브라우저 관찰, 소스·테스트 읽기, 설계 원문 대조로 작성했습니다. `imagegen`은 learner UI에 이미지 import·배경·`<img>`가 없어 `not run`입니다.

## 최종 감사 — 2026-08-29

### 발견 사항별 결과

- A-01 해결: `LearningOverview` 다음에 사례 카드를 두고, 안전 상세와 저장 상세를 기본 접힘 `<details>`로 이동했습니다. 375px Chromium 흐름에서 네 사례를 먼저 선택할 수 있고 가로 스크롤이 생기지 않았습니다.
- A-02 해결: `StageFocusManager`가 단계 제목을 포커스한 뒤 `scrollIntoView`하며 `scroll-margin-block-start`를 적용했습니다. 데스크톱과 375px 키보드 흐름에서 모든 전환의 제목 포커스·viewport 경계 검사가 통과했습니다.
- A-03 해결: 영향 단계의 조건 확인 수·기능 스위치·수정 방향을 `getImpactRequirementMessage`로 계산하고 비활성 CTA의 visible note와 `aria-describedby`에 연결했습니다.
- A-04 해결: 철회 단계의 선택 수·철회 수·보고서 준비 상태를 `getRevocationRequirementMessage`로 표시하고 두 CTA에 조건 안내를 연결했습니다.
- A-05 해결: 사례 카드에 `available`·`selected`·`completed` 상태 텍스트, 테두리, `aria-pressed`, 설명 ID를 함께 제공했습니다. 데스크톱 2열·640px 이하 1열 규칙과 44px 조작 목표를 유지했습니다.
- A-06 해결: 보고서 하단에 `다음 학습 행동` 영역을 추가해 인쇄는 수업에서 비교하기, 다시 시작은 다른 사례 연습하기라는 목적을 설명했습니다.
- 안전 문구 보정: 초기 상태 메시지를 “개인정보를 입력하지 않습니다. 저장은 직접 선택합니다.”로 바꿔 opt-in 로컬 저장 계약과 모순되지 않게 했습니다.

### 검증 결과

- 단위·통합: Vitest 24개 파일, 227개 테스트 통과.
- 정책·품질: `npm run test:policy`, `npm run check:policy`, `npm run lint`, `npm run build`, `git diff --check` 통과. lint 경고 없이 종료했습니다.
- 커버리지: Statements 90.61%, Branches 88.11%, Functions 91.07%, Lines 95.71%.
- 크기: `src`, `e2e`, `scripts`의 검사 대상 파일에 500줄 이상 없음. 가장 긴 파일은 `scripts/check-source-policy.mjs` 488줄입니다.
- 브라우저 데스크톱 Chromium: 9개 통과, 모바일 전용 1개 의도적 스킵. 단계 포커스·키보드·업데이트 내역·전체 사례·저장 경계·외부 요청 검사를 포함합니다.
- 브라우저 375px 모바일 Chromium: 격리 임시 설정으로 10개 통과. 사례 선택 순서, 카드 전환, reduced-motion, 320px/375px 가로폭, 모바일 비교 카드, 개인정보 경계를 확인했습니다.
- 기본 `mobile-375` WebKit 프로젝트: 이 환경에 `webkit-2336/pw_run.sh` 실행 파일이 없어 브라우저 시작 전 9개가 실행되지 않았습니다. WebKit 통과로 주장하지 않습니다.
- 네트워크·개인정보: privacy E2E에서 권한 요청·외부 요청·별명 저장이 없고, opt-in 뒤 전용 키와 원시 타입 구조만 남는 계약을 통과했습니다.

### 남은 수동 검토

- `impeccable`, `ui-ux-pro-max`, `redesign-existing-projects`: `unavailable`.
- `imagegen`: 학습 화면 이미지 자산이 없어 `not run`; `public/favicon.svg`는 정체성 자산으로 유지했습니다.
- 실제 초등학생 사용 세션, 교사 관찰, VoiceOver/TalkBack 수동 실행: `pending`. 이번 리디자인의 자동 통과나 문서만으로 사람의 접근성 승인·아동 사용성 승인을 의미하지 않습니다.

## 2026-08-30 재실행 최종 감사

### 감사 방식

- 이번 실행은 기존 공개 감사의 A-01~A-06 해결 상태를 재확인하고, 현재 작업 트리의 UI 마감 변경을 단일 컨텍스트에서 검토한 기록입니다. 별도 사용자 인터뷰나 아동 참여 세션은 실행하지 않았습니다.
- `PRODUCT.md`는 구조화 인터뷰 도구가 이 모드에서 제공되지 않아 설계 원문과 기존 계획에 근거한 추론으로 표시했습니다. 추론을 실제 사용자 승인으로 표현하지 않았습니다.
- `$impeccable`, `$ui-ux-pro-max`, `$redesign-existing-projects`, `$imagegen`은 현재 세션에서 모두 확인 가능한 지원 역할입니다. 필수 문서와 관련 참조를 읽었고, 이미지 자산이 없어 `imagegen` 호출은 하지 않았습니다.

### 초기 감사 보완 결과

- 헤더는 `AppHeader`에서 제목·진행 상태·가상 모델 안내를 각각 한 번만 읽는 `app-header__bar`와 `learning-model-notice` 구조로 정리했습니다.
- 시작 화면은 짧은 `LearningOverview` 다음에 네 사례를 놓고 안전·저장 상세를 기본 접힘 패널로 유지합니다. “먼저 네 가지 사례 중 하나를 골라 학습을 시작해 보세요.” 문장은 첫 행동을 직접 말합니다.
- 조건 안내 표면과 버튼 피드백을 토큰 기반으로 보완했습니다. 보조 저장 불러오기와 위험한 저장 삭제는 primary와 구분되는 `secondary-action`·`destructive-action` 스타일을 사용합니다.
- 핵심 단계 버튼의 `gi-pulse` aura는 주변 레이아웃을 움직이지 않고, `prefers-reduced-motion: reduce`에서 애니메이션 없이 고정 포커스 테두리로 대체됩니다.
- `components.css`가 478줄을 넘지 않도록 업데이트 내역·상호작용 규칙을 `interactive.css`(122줄)로 분리했습니다. 500줄 제한 검사에서 500줄 이상 파일은 0개입니다.
- `UPDATE_HISTORY`에 2026-08-30 개선 항목을 추가하고 자동 검증과 VoiceOver·TalkBack 미실행을 같은 이유 문장에서 구분했습니다.

### 정적·자동 검증 결과

- RED→GREEN: 새 헤더·첫 행동 문구·보조 버튼·힌트 표면·눌림 피드백 회귀 테스트를 먼저 실패시킨 뒤 최소 구현했고, 현재 전체 테스트가 통과합니다.
- `npm run test:run`: Node 정책 19개 통과, Vitest 24개 파일 232개 통과.
- `npm run test:coverage`: Statements 90.61%, Branches 88.11%, Functions 91.07%, Lines 95.71%.
- `npm run lint`: exit 0.
- `npm run check:policy`: exit 0, `source policy: 0 forbidden runtime references`.
- `npm run build`: TypeScript·Vite production build exit 0.
- `git diff --check`: exit 0.
- Impeccable `detect.mjs --json`을 최종 변경 마크업 파일에 실행한 결과 `[]`.

### 브라우저 검증 결과

- `npx playwright test --project=desktop-chromium --workers=1`: 10개 중 9개 통과, 모바일 전용 1개 의도적 스킵. 단계별 포커스·스크롤, 키보드, 사례·보고서, 업데이트 내역, 저장 경계를 확인했습니다.
- 375px Chromium 격리 설정으로 같은 e2e 묶음을 직렬 실행: 10개 모두 통과. reduced-motion, 320px·375px 가로폭, 비교 카드, 핵심 버튼 viewport 경계를 포함합니다.
- 기본 `mobile-375` WebKit 프로젝트는 `/Users/kimhongnyeon/Library/Caches/ms-playwright/webkit-2336/pw_run.sh`가 없어 브라우저 시작 전 9개가 실행되지 않았습니다. 이는 제품 assertion 실패가 아니며 WebKit 통과로 기록하지 않습니다.
- privacy E2E는 초기·상호작용 전 구간에서 권한 요청과 외부 요청이 없고, opt-in 저장 시 전용 키 경계만 남는 계약을 통과했습니다.

### 남은 단계와 판정

- 실제 초등학생·교사 관찰, VoiceOver/TalkBack 수동 검증, WebKit 실행 환경 확보는 후속 단계입니다. 이 문서는 해당 사람·환경의 승인을 대신하지 않습니다.
- 이번 실행에서는 커밋, 푸시, 릴리스, 배포, HVC 등록을 하지 않았습니다. 현재 판정은 “리디자인 구현 및 로컬/Chromium 검증 완료, 사람·WebKit 검증 보류”입니다.
