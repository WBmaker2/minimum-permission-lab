# 개인정보·안전 검증 체크리스트

검증일: 2026-08-26

이 문서는 Task14에서 실제로 실행한 자동 검증 결과만 기록합니다. 수동 스크린 리더 검증은 이 작업의 실행 증거가 없으므로 성공으로 표시하지 않습니다.

## 자동 검증 명령과 결과

| 영역 | 실행 명령 | 결과 |
|---|---|---|
| 소스 정책 RED | `node --test scripts/check-source-policy.test.mjs` (스캐너 구현 전) | 의도한 `ERR_MODULE_NOT_FOUND` 실패 확인 |
| capability flow RED | `node --test scripts/check-source-policy.test.mjs` (새 획득·property/array·dynamic fixture 직후) | 12개 통과·1개 실패로 array external provenance와 default destructuring 미구현을 확인한 뒤 최소 구현으로 보완 |
| 소스 정책 단위 | `node --test scripts/check-source-policy.test.mjs` | 통과, 16개 테스트. AST가 computed·optional·window/globalThis/self 래퍼, capability 획득·참조·전달, wrapper alias·static computed·destructuring·object alias, lexical shadow·hoisting·assignment·property/destructuring/array flow·catch/default parameter·중첩 provenance·local import와 analytics 초기화를 포함해 금지 참조를 검출하고 문자열·주석·regex·template plain text 및 로컬 객체 메서드는 제외하며 parse diagnostic도 clean으로 통과시키지 않음 |
| 실제 런타임 소스 | `npm run check:policy` | 통과, `0 forbidden runtime references` |
| Node 정책 표준 게이트 | `npm run test:policy` | 통과, 16개 정책 테스트 |
| 안전 문구·업데이트 이력 | `./node_modules/.bin/vitest run src/content/learningNotices.test.ts src/content/updateHistory.test.ts` | 통과, 2개 파일 12개 테스트 |
| 정적 분석 | `npm run lint` | 통과 |
| ESLint 우회 fixture | `printf '%s\\n' 'window.gtag("event")' 'globalThis["gtag"]("event")' 'const g = window.gtag; g("event")' 'self.fetch(url)' 'const safe = "fetch("; void safe;' \| ./node_modules/.bin/eslint --stdin --stdin-filename src/policy-fixture.ts` | 의도한 exit 1, 점·계산 gtag 및 별칭·self fetch 우회를 검출하고 안전 문자열은 차단하지 않음. fixture는 저장소에 만들지 않음 |
| ESLint 안전 fixture | `printf '%s\\n' 'void widget.init(); void widget.load(); void widget.fetch(); void widget.analytics; void view.navigator' 'const local = () => {}; const safeWidget = {fetch: local}; void safeWidget.fetch()' "import window from './mock'; void window.fetch" \| ./node_modules/.bin/eslint --stdin --stdin-filename src/safe-fixture.ts` | 통과, 로컬 `widget`/`view` 속성과 relative import wrapper는 오탐하지 않음. fixture는 저장소에 만들지 않음 |
| ESLint scope fixture | `printf '%s\\n' 'function safe(fetch){ void fetch(url); }' 'const fetch=()=>undefined; void fetch()' 'function safe(navigator){ void navigator.permissions; }' 'function safe(WebSocket){ void new WebSocket(url); }' 'void safe;' \| ./node_modules/.bin/eslint --stdin --stdin-filename src/safe-shadow-fixture.ts` | 통과, 매개변수·로컬 선언으로 shadow된 fetch/navigator/WebSocket을 오탐하지 않음. fixture는 저장소에 만들지 않음 |
| ESLint type-only fixture | `echo "import type * as window from './mock'; window.fetch(url)" \| ./node_modules/.bin/eslint --stdin --stdin-filename src/type-only.ts` | 의도한 exit 1, type-only import가 실행 전역 capability를 가리지 못하는 우회를 차단함. 일반 value import shadow는 별도 안전 fixture로 통과. fixture는 저장소에 만들지 않음 |
| ESLint 정책 자동 fixture | `node --test scripts/check-source-policy.test.mjs` 내 ESLint API 호출 | 통과, runtime `fetch`·`window.fetch`·type-only fetch는 nonzero, type-position·value import·local wrapper shadow·object method는 zero를 자동 검증 |
| 전체 unit | `npm run test:run` | 통과, 정책 16개와 Vitest 19개 파일 194개 테스트 |
| 전체 coverage | `npm run test:coverage` | 통과, Statements 89.88%, Branches 87.53%, Functions 89.3%, Lines 95.25% |
| production build | `npm run build` | 통과, TypeScript 검사와 Vite 정적 산출물 생성 |
| mobile 브라우저 준비 | `npx playwright install webkit` | 성공, WebKit 26.5 다운로드 완료. 브라우저 산출물은 프로젝트 커밋에 포함하지 않음 |
| privacy E2E · desktop-chromium | `npm run test:e2e -- e2e/privacy-safety.spec.ts --project=desktop-chromium --workers=1` (전용 `127.0.0.1:44173`) | 통과, 2개 테스트(별명 저장 경계·보고서 경계) |
| privacy E2E · mobile-375 | `npm run test:e2e -- e2e/privacy-safety.spec.ts --project=mobile-375 --workers=1` (전용 `127.0.0.1:44173`) | 통과, 2개 테스트(별명 저장 경계·보고서 경계) |
| privacy E2E · 전체 두 프로젝트 | `npm run test:e2e -- e2e/privacy-safety.spec.ts --workers=1` (전용 `127.0.0.1:44173`) | 통과, 4개 테스트(desktop-chromium·mobile-375 각 2개) |

## 증명된 경계

- `src`의 실행 코드에는 브라우저 권한 API, 외부 네트워크, 서비스 워커, 분석 초기화 참조가 없습니다. 소스 정책 스캐너가 주석·문자열을 제외하고 0건을 반환했습니다.
- desktop·mobile privacy E2E는 첫 화면에서 `Object.keys(localStorage)`가 정확히 `[]`임을 확인한 뒤에만 `이 기기에 저장`을 선택했습니다.
- `햇살 탐험대`는 `FictionalAliasPractice`의 컴포넌트 로컬 미리보기에서만 보이며, 저장된 모든 키·값과 progress JSON에는 나타나지 않았습니다. progress JSON에는 `alias` 필드도 없습니다.
- 저장 JSON의 `payload.state`는 `stage`, `activeCaseId`, `caseProgress`, `revocationCompleted`, `revocationDecisions`, `saveOnDevice`의 정확한 키 집합이며, 각 `CaseProgress`도 설계된 9개 키만 가집니다. 저장 전용 JSON에는 런타임 `statusMessage`가 없습니다.
- 오염된 런타임 상태에 `alias`를 최상위와 모든 사례 진행 상태에 추가해도 `buildReport`가 만든 `LabReport`와 모든 사례 결과의 정확한 키 집합에는 alias가 전달되지 않았습니다.
- 런타임 DOM에 `input[type=file]`이 없고, 별명 입력은 `autocomplete="off"`이며 이름·전화번호·주소용 autocomplete 의미를 사용하지 않습니다.
- request listener는 초기 navigation 전에 설치되어 별명 미리보기 확인까지 page 수명 동안 유지되었고, 허용 origin 외 요청은 0건이었습니다.
- 전용 Playwright 서버는 `http://127.0.0.1:44173`의 strict port와 `reuseExistingServer: false`로 구성되어 다른 프로젝트 서버를 재사용하지 않으며, 초기 `h1`이 `앱 권한 최소허용 연구소`임을 확인합니다.
- AST scanner는 금지 capability의 호출뿐 아니라 전역에서 획득·참조·전달되는 순간도 차단하며, wrapper alias·static computed·destructuring·중첩 object/array alias·property assignment와 단일 파일 내 단순 flow를 추적합니다. unknown dynamic external-root 접근은 `dynamic-policy-access`로 fail-closed하고 type-only import 우회도 차단합니다. ESLint의 scope-aware custom rule은 실제 global `window`/`globalThis`/`self` wrapper와 type-only capability 이름을 담당하며, 별칭·동적 경계는 Node 정책 gate가 담당합니다. `eval`, 함수 반환값을 통한 interprocedural taint, 런타임 생성 코드는 범위 밖입니다.
- local relative module import(`./fetch`, `./mock`)는 해당 binding을 안전한 로컬 이름으로 취급하고, 구현 자체는 별도 runtime source scan에서 검사합니다. 외부 SDK module specifier는 기존 import violation으로 남습니다.
- 단일 파일 내 단순 intra-file flow(hoisting, assignment, property/destructuring/array alias)까지만 추적합니다. `eval`, 함수 반환값을 통한 interprocedural taint, 런타임 생성 코드는 범위 밖이며, direct-global/wrapper ESLint와 zero-external-request E2E를 함께 gate로 사용합니다.
- 시작·교사용 안내에는 교사나 보호자에게 도움을 요청하라는 문장, 기기·운영체제별 차이와 공식 안내, 실제 앱의 안전성을 판정하는 보안 도구가 아니라는 경계가 포함됩니다.
- 근거 문장 입력 안내는 실제 이름·전화번호·주소를 쓰지 말라고 알리며, 저장 동의가 켜져 있으면 원문이 기기의 학습 기록에 보관될 수 있음을 정직하게 설명하고 AI·키워드 채점을 하지 않는다고 명시합니다.

## 미실행 또는 후속 검증

- 실제 권한 팝업 확인은 권한 API를 호출하지 않는 소스·request 게이트로 대체했으며, OS 권한 설정을 우회하는 컨텍스트 권한 변경은 하지 않았습니다.
- 스크린 리더, 키보드 전용 전체 흐름, 375×812 전체 학습 흐름은 Task15의 검증 범위이며 이 문서에서는 성공을 주장하지 않습니다.
