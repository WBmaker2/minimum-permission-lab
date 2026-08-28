# Minimum Permission Lab — 학습자 사용성 개선 QA 기록

## 판정 요약

초등학생 관점의 기존 전문가 감사에서 확인한 F-01~F-12를 구현 계획 순서대로 보완했습니다. 단계 포커스, 핵심 버튼의 안정성, 수정 선택 안내, 저장 경계 문구, 320px 레이아웃, 짧은 안전 문구, 별명 입력 계약, 진행률과 비활성 이유, 모바일 보고서 카드, 빈 저장 피드백, 업데이트 이력 범위를 코드·콘텐츠·자동화 검증에 연결했습니다.

이 문서는 실제 초등학생 참여 연구나 수동 보조기술 인증서가 아닙니다. 자동화된 키보드·의미 구조·모바일 viewport·정책·저장 경계 검증을 기록하며, VoiceOver/TalkBack 수동 실행과 실제 아동 관찰은 이 범위에 포함하지 않습니다.

## 범위와 대상

- 프로젝트: `minimum-permission-lab`
- 로컬 검증 서버: `http://127.0.0.1:44173` (`strictPort`, `reuseExistingServer: false`)
- 공개 학습자 URL: [https://wbmaker2.github.io/minimum-permission-lab/](https://wbmaker2.github.io/minimum-permission-lab/)
- HVC 검토용 저장소: [https://github.com/WBmaker2/minimum-permission-lab](https://github.com/WBmaker2/minimum-permission-lab)
- 기록 작성 시점에는 로컬 개선 상태였고, 이후 `3245c8a`를 `origin/main`에 푸시해 Pages workflow `33146277282`를 성공시켰습니다. 현재 공개 URL은 해당 개선 커밋을 포함한 Pages 배포 결과를 제공합니다.
- 입력 데이터: 가상 별명과 학습용 근거 문장만 사용했습니다. 실제 이름·전화번호·주소는 입력하지 않았습니다.

## 발견 사항별 구현 결과

| 감사 ID | 이전 문제 | 이번 구현 결과 | 검증 근거 |
|---|---|---|---|
| F-01 | 단계가 바뀌면 포커스가 `body`로 사라짐 | `StageFocusManager`가 새 단계의 `h2[data-stage-heading]`로 포커스를 복원하고, 헤더에 단계 분수와 사례 완료 수를 표시 | `e2e/accessibility.spec.ts`, `npm run test:run` |
| F-02 | `gi-pulse` 본체가 움직여 클릭이 불안정함 | 버튼 본체는 고정하고 aura의 불투명도·그림자만 움직이며, 모션 감소에서는 고정 윤곽선을 사용 | `src/styles/styles.test.ts`, normal-motion bounding-box E2E |
| F-03 | 수정 권한 선택이 빈 상태인데 이유가 없음 | 영향 단계에서 최초 선택을 수정 선택의 초기값으로 복사하고, 선택 수·남은 행동·`aria-describedby` 도움말을 제공 | `src/app/labReducer.test.ts`, review tests, full-flow E2E |
| F-04 | 저장 동의 뒤에도 저장하지 않는다고 안내함 | 저장 전·후 상태를 분리하고 권한 선택·근거 원문만 저장된다고 안내하며, `저장 기록 지우기`를 제공 | `src/app/LabProvider.test.tsx`, privacy E2E |
| F-05 | 320px에서 문서 가로 넘침 | `html`, `body`, `#root`, 콘텐츠 래퍼의 최소 폭을 0으로 정리하고 clientWidth 기준을 검증 | `e2e/mobile-reduced-motion.spec.ts` 320/375 viewport 검사 |
| F-06 | 안전 문구와 명세 질문이 길고 반복됨 | 한 번 읽는 세 줄 요약과 `자세히 보기` 상세를 분리하고, 권한 질문은 첫 질문만 기본 노출 | learning notice/specification tests, `details` 구조 |
| F-07 | 추상적인 문장과 권한명·모양명 붙임 | 마이크 설명·데이터 흐름·근거 제목을 어린 학습자 문장으로 고치고, 모양 이름을 별도 시각 문구로 분리 | permissions/cases/review/report tests |
| F-08 | 비활성 버튼의 다음 행동과 진행률이 안 보임 | `현재 단계: n/7`, `완료한 사례: n/4`, 선택 수와 조건 충족 도움말을 status/`aria-describedby`로 연결 | Progress/ActionRequirementHint tests, accessibility E2E |
| F-09 | 모둠 알림판 별명이 비어도 통과함 | 공백 별명에서는 명세 이동을 막고 `예시 사용: 햇살`을 제공하며 별명은 state·storage·report에 넣지 않음 | FeatureSpec/privacy tests and E2E |
| F-10 | 모바일 보고서의 42rem 표를 좌우로 밀어야 함 | 640px 이하에서는 네 권한 비교 카드를 표시하고, 데스크톱에서는 기존 키보드 포커스 가능 표를 유지 | `DecisionComparisonCards`, report tests, 375px DOM/viewport E2E |
| F-11 | 저장 기록이 없을 때 눌렀는지 알 수 없음 | 빈 기록·복원 성공·삭제 완료를 각각 live status로 알려 줌 | `LabProvider.test.tsx`, StartScreen tests |
| F-12 | 이력 문구가 수동 스크린 리더 완료처럼 읽힐 수 있음 | 2026-08-28 이력에 자동 구조·키보드·모바일 범위를 기록하고 VoiceOver/TalkBack 수동 실행 결과를 포함하지 않는다고 명시 | `src/content/updateHistory.test.ts` |

## 자동 검증 결과

| 영역 | 명령 | 결과 |
|---|---|---|
| 정책 단위 | `npm run test:policy` | 19/19 통과 |
| 실행 코드 정책 | `npm run check:policy` | `0 forbidden runtime references` |
| 정적 분석 | `npm run lint` | 통과 |
| 전체 단위 | `npm run test:run` | 정책 19개 + Vitest 21개 파일, 219개 테스트 통과 |
| 커버리지 | `npm run test:coverage` | Statements 90.2%, Branches 87.6%, Functions 90.77%, Lines 95.55% |
| 정적 빌드 | `npm run build` | TypeScript와 Vite production build 통과 |
| 파일 크기 | `find src e2e scripts -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.mjs' \) -exec wc -l {} + \| awk '$2 != "total" && $1 >= 500 {print}'` | 출력 없음; 500줄 이상 파일 없음 |
| 데스크톱 브라우저 | `npx playwright test e2e/accessibility.spec.ts e2e/full-learning-flow.spec.ts e2e/mobile-reduced-motion.spec.ts e2e/privacy-safety.spec.ts --project=desktop-chromium --workers=1` | 9 passed + mobile-only intentional skip |
| 모바일 폭 | 위 Playwright suite의 320px·375px viewport 검사 | `scrollWidth <= clientWidth`, 비교 카드와 핵심 버튼 검사 통과 |
| 개인정보·네트워크 | privacy E2E | 초기 `localStorage` 빈 배열, 전용 저장 키만 사용, 별명 미저장, 외부 요청 0건 |

## 공개 배포 확인

- GitHub Actions: [Build and deploy to GitHub Pages · 33146277282](https://github.com/WBmaker2/minimum-permission-lab/actions/runs/33146277282) — lint·unit/policy·production build·Pages artifact·Deploy to Pages 모두 성공했습니다.
- 공개 HTML 응답: HTTP 200, 제목 `앱 권한 최소허용 연구소`, 현재 번들 자산 200.
- 공개 375px Chromium 확인: `h1`과 `학습 시작`이 보이고, `localStorage` 키 `[]`, `document.documentElement.scrollWidth === clientWidth === 375`, 업데이트 내역에 `모바일·키보드·보조기술 대응 구조와 저장 경계 보강`이 표시됩니다.
- 공개 learner path 확인: `사진 스캔 과제함` → `기능 명세 보기` 이동 후 `h2[data-stage-heading]`가 포커스를 받고, 콘솔 오류와 외부 origin 요청이 0건입니다.

## 브라우저 환경 한계

`mobile-375` 프로젝트를 별도로 실행한 시도는 제품 assertion 전에 `/Users/kimhongnyeon/Library/Caches/ms-playwright/webkit-2336/pw_run.sh`가 없어 9개가 브라우저 시작 실패했고, 저장소 경계에 관한 브라우저 없는 테스트 1개만 통과했습니다. 따라서 이 시도는 모바일 제품 통과로 집계하지 않았습니다. 데스크톱 Chromium에서 viewport를 320px·375px로 설정한 레이아웃·키보드 검사는 별도 통과 증거로 유지합니다.

## 수동 검증과 실제 사용자 연구의 경계

- VoiceOver/TalkBack을 실행하지 않았습니다. 자동 axe·키보드·focused heading·ARIA 이름 검사는 수동 음성 출력 검증을 대신하지 않습니다.
- 실제 초등학생 또는 교사가 참여한 사용성 세션을 진행하지 않았습니다. 이 문서의 “학습자 관점”은 기존 화면 감사와 설계 요구를 기준으로 한 전문가 검토입니다.
- 공개 Pages URL은 링크를 확인할 수 있는 대상이지만, 이번 개선 변경을 공개 URL에 배포했다는 뜻이 아닙니다. 푸시·Pages workflow·공개 상호작용 재검증은 별도 릴리스 승인 후 진행합니다.

## 다음 검토 순서

1. 교사 동반 초등 학습자 세션에서 첫 행동 이해, 막힌 버튼, 긴 문장, 보고서 카드 이해를 관찰합니다.
2. 승인된 실제 기기에서 VoiceOver/TalkBack을 별도 수동 검증으로 기록합니다.
3. 다음 릴리스 변경이 생기면 GitHub push와 Pages workflow를 실행하고, 위 공개 URL에서 배포된 learner path를 다시 확인합니다.
