# Educational Simulation Decision Ledger — Scoped Follow-up

## Decision boundary

- Date: 2026-08-30
- Mode: `full`
- Project: `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab`
- Target grade: 초등 5–6학년, 보조 기준 초등 3–4학년
- Existing surface: `src/features/impact/ImpactScreen.tsx`의 조건부 기능 비교
- Specialist routing: `game-studio:game-studio`, `build-web-data-visualization:data-visualization`, `game-studio:game-playtest`는 Stage 0 `missing-optional`; 기존 DOM/CSS 경로를 사용하고 설치·호출하지 않음
- Image decision: `not-needed`; 값·라벨·권한 계약을 텍스트와 native controls로 보여 주며 장식 이미지가 학습 증거를 대신하지 않음

## Objective decisions

| simulation-id | decision | learning objective | target grade | prediction | one variable / initial state | manipulation | observation | explanation | retry / transfer | reset / compare | pause / step | model boundary, unit, uncertainty | renderer / fallback |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `map-current-position-opt-in` | `implement` | 저장된 지도와 현재 위치 보기를 비교해 필요한 권한만 기능에 붙인다 | 5–6 (3–4 보조) | “현재 위치 보기만 켜면 지도 자체도 위치 권한을 필요로 할까요?” | `현재 위치 보기` checkbox / off; unit 없음 | prediction을 고른 뒤 checkbox를 on/off | off는 저장 지도만 보여 위치 권한이 필요 없고, on은 현재 위치 표시 기능 때문에 사용하는 동안 위치 권한이 필요할 수 있음 | `스위치를 끄면 저장 지도만`, `스위치를 켜면 현재 위치 표시가 함께 켜짐` 중 하나를 자기 설명으로 고름 | reset 후 반대 prediction으로 재실행; voice 사례의 보관 기간 비교로 최소화 원리를 전이 | `처음 조건으로 돌아가기`는 off·prediction 없음·설명 없음으로 복원; `비교 결과 확인`은 네 상태 완료 뒤 활성화 | `pause: not-needed` — 시간에 따라 자동 변화 없음; `step: not-needed` — 이산 전이가 checkbox 한 번으로 충분 | 가상 학습 모델이며 실제 위치를 읽지 않음; 단위 없음; “필요할 수 있음”으로 사실 경계를 표시 | DOM/fieldset + text observation; reduced-motion에서는 동일한 정적 문장과 고정 focus outline |
| `voice-press-and-delete` | `implement` | 사용 시점과 보관 기간이 권한 범위를 바꾸는 이유를 비교한다 | 5–6 (3–4 보조) | “누르는 동안 바로 지우는 것과 오래 보관하는 것 중 어느 쪽이 더 오래 정보를 갖고 있을까요?” | `오래 보관하는 조건` checkbox / off는 누르는 동안 처리·즉시 삭제; unit 없음 | prediction을 고른 뒤 checkbox를 on/off | off는 재생 뒤 즉시 삭제, on은 오래 보관하여 필요한 기간과 정보 범위가 늘어남 | `짧게 처리하고 바로 삭제`, `오래 보관하면 더 긴 기간 필요` 중 하나를 고름 | reset 후 보관 조건을 다시 비교; map 사례의 사용 시점 제한에 전이 | reset은 off·prediction 없음·설명 없음으로 복원; 비교 확인은 네 상태 완료 뒤 활성화 | `pause: not-needed` — 실제 녹음·재생·시간 진행 없음; `step: not-needed` — checkbox 전환이 충분 | 실제 음성·마이크·재생·저장이 없음; 보관 기간을 숫자로 측정하지 않으며 가상 계약만 비교 | DOM/fieldset + static observation; reduced-motion에서도 자동 재생 없이 동일 결과 |

## Not-needed decisions

| objective | decision | reason |
|---|---|---|
| 시간에 따른 음성 waveform 재생 | `not-needed` | 실제 녹음·재생은 학습 목표가 아니며 privacy 경계를 흐리고, “누르는 동안/즉시 삭제”는 정적 관찰 문장으로 충분함 |
| 위치·지도 공간을 Canvas/WebGL로 그리기 | `not-needed` | 현재 학습 목표는 지도 경계나 거리 측정이 아니라 권한 필요 조건의 비교이며, 텍스트와 checkbox가 더 직접적임 |
| 여러 슬라이더를 동시에 조작하기 | `not-needed` | 한 번에 하나의 의미 있는 변수 원칙을 위반하고 기존 권한 판정과 다른 다변수 모델을 만듦 |
| 실제 기기 권한 팝업·센서 측정 | `not-needed` | 개인정보·안전 계약과 MVP 범위를 위반하며 학습용 가상 모델이 아님 |

## Implementation contract

```text
simulation-id / learning-objective / target-grade
model-and-boundary / variable-and-unit / initial-state
prediction-prompt / manipulation / observable-output
explanation-prompt / deterministic-reset-comparison / pause-step-applicability-and-reason / seed-and-time
keyboard-touch-mouse-path / reduced-motion-fallback / static-fallback
performance-budget / factual-source-or-human-review / verification-scenario
```

- `seed-and-time`: `not applicable`; 랜덤·자동 시간 없음. 초기값은 map switch off, voice retention off입니다.
- `performance-budget`: DOM controls only; 60fps loop·Canvas buffer·large data 없음. 모바일에서 한 카드가 세로로 흐르고 입력 지연이 없어야 합니다.
- `factual-source-or-human-review`: facts are the existing `AppCase`/`PermissionRule` contract in `src/content/cases/*.ts`; external factual claims are not added. Ambiguous contract wording is reviewed in `work/elementary-webapp-ux-language-audit.md`.
- `keyboard-touch-mouse-path`: native radio/checkbox/button; Tab/Shift+Tab and Space/Enter, touch target min 44px; drag not required.
- `reduced-motion-fallback`: no auto animation; `@media (prefers-reduced-motion: reduce)` disables pulse transition and leaves static observation, text, and focus outline.
- `static-fallback`: if interaction is unavailable, initial contract and required conditions remain visible; comparison button remains disabled with a concrete next-action hint.

## Verification status

- Decision status: `implement` approved for exactly two existing conditional scenarios.
- Browser baseline: `partial`; current impact screen exposes a switch only for map and a static paragraph for voice, with no prediction/explanation/reset control.
- Simulation implementation test: GREEN in `src/features/impact/simulationModel.test.ts`, `src/features/impact/SimulationLearningLoop.test.tsx`, and `src/features/impact/ImpactScreen.test.tsx`; scenario evidence is recorded in `work/elementary-webapp-ux-simulation-test.md`.
- Real learner observation, teacher observation, VoiceOver/TalkBack and specialist plugin runs: `not run`.

## Final implementation and verification

- `SimulationScenarioSpec` in `src/features/impact/simulationModel.ts` now gives both scenarios a deterministic initial state, prediction choices, one-variable manipulation, observation, explanation choices, model boundary, and explicit pause/step rationale.
- `SimulationLearningLoop` in `src/features/impact/SimulationLearningLoop.tsx` uses native radios, checkbox, fieldsets, live observation text, reset, and compare acknowledgement. The compare callback cannot run before prediction, manipulation, and explanation.
- Map uses the existing `map-current-position` reducer switch. Voice uses a screen-local retention checkbox that starts off and never accesses microphone, recording, playback, or storage APIs.
- `src/styles/simulation.css` keeps the loop in a separate sub-500-line file, preserves 44px targets, stacks controls on narrow screens, and disables transitions/animation under `prefers-reduced-motion: reduce`.
- Same-scenario MCP Playwright verification passed at 320×800, 375×812, and 1280×900. No external requests or console errors were observed; map reset and voice retention comparison both completed.
- CLI Playwright test file `e2e/elementary-language-simulation.spec.ts` is present and typed, but local browser binaries are unavailable in this environment, so the CLI browser run is recorded as blocked rather than passed.
- No real learner, teacher, VoiceOver, or TalkBack evidence is claimed.
