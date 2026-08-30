# Educational Simulation Test Record — Scoped Follow-up

## Test setup

- Date: 2026-08-30
- App server: `http://127.0.0.1:44176/`
- Browser evidence: MCP Playwright; CLI browser binaries are not installed and were not installed for this run
- Viewports: 320×800, 375×812, 1280×900
- Initial state: fresh page, localStorage keys `[]`, stage `start`, map switch `off`, voice retention condition `off`
- Determinism: no random seed and no clock; `seed-and-time = not applicable`
- Privacy: request listener registered before navigation for the final run; external requests and console errors must both be `[]`
- Evidence boundary: simulated learner panel, not a real student study or accessibility certification

## Scenarios and expected observations

| scenario | actions | expected result | acceptance |
|---|---|---|---|
| map baseline → changed | select `교실 지도 안내`; open specification and initial review; choose decisions; enter impact; choose prediction; toggle `현재 위치 보기 조건 켜기`; read observation; choose explanation; click `비교 결과 확인`; click `처음 조건으로 돌아가기` | prediction control precedes switch; off says saved map needs no location; on says current-location feature may need location while used; reset returns off and clears prediction/explanation; acknowledge callback fires once only after all prerequisites | pass when all text is visible in DOM, callback count is exact, switch state returns off, revision CTA gate remains unchanged |
| voice baseline → changed | select `음성 읽기 연습`; open specification and initial review; choose decisions; enter impact; choose prediction; toggle `오래 보관하는 조건`; read observation; choose explanation; compare; reset | no microphone, recording, playback, or permission API is used; off says process while pressing and delete after playback; on says longer retention increases needed period; reset returns off | pass when the only new control is a labelled checkbox, no recording button exists, and comparison is gated until prediction/manipulation/explanation |

## Accessibility and responsive checks

| check | 320×800 | 375×812 | 1280×900 | acceptance |
|---|---|---|---|---|
| heading and first instruction | visible | visible | visible | title and next action are readable without horizontal overflow |
| prediction fieldset | one-column, label wraps inside card | one-column, no clipped label | readable inline/stacked layout | every radio has a visible legend and 44px target |
| manipulation checkbox | label and checked state visible | same | same | Space and touch toggle the same state |
| observation and explanation | visible after manipulation | visible after manipulation | visible | core result is DOM text, not hover-only or color-only |
| reset/compare controls | no clipping, no horizontal scroll | no clipping, no horizontal scroll | stable card position | reset is enabled after manipulation; compare is enabled only after all states |
| reduced motion | static observation and fixed focus outline | same | same | no repeated animation or auto-play; `prefers-reduced-motion: reduce` keeps learning result |

## Browser evidence fields

- `externalRequests`: `[]` in the 320px, 375px, and 1280px MCP runs
- `consoleErrors`: `[]` in the 320px, 375px, and 1280px MCP runs
- `document.documentElement.scrollWidth === clientWidth`: passed (`305=305` at 320px and `360=360` at 375px; desktop had no overflow)
- `predictionBeforeManipulation`: passed; the map checkbox was enabled only after prediction and the observation was hidden before manipulation
- `acknowledgeBeforeExplanation`: passed; compare stayed disabled until the explanation radio was selected and callback was not called early in unit coverage
- `resetState`: passed; map switch returned `false`, observation count returned `0`, and prediction/explanation controls were cleared
- `transfer`: passed by running the voice retention scenario after the map scenario with the same prediction → one variable → observation → explanation → compare sequence

## Current status

- Baseline status: `partial`; before implementation, map had a switch and static compare button, voice had only a static paragraph, and no explicit prediction/explanation/reset loop.
- GREEN status: passed; unit, lint, build, and same-scenario MCP verification completed for the scoped implementation.
- CLI Playwright status: `blocked` when local browser executables are absent; MCP browser is the accepted local observation path.
- VoiceOver/TalkBack status: `not run` by project boundary.

## Final evidence record

| viewport | scenario | learner path result | responsive and safety evidence |
|---|---|---|---|
| 320×800 | map | keyboard Space selected prediction, toggled the location condition, selected explanation, and completed comparison | `clientWidth=305`, `scrollWidth=305`, no control below 44px, reduced-motion animation count `0`, external requests `[]`, console errors `[]` |
| 375×812 | map | prediction → toggle → observation → reset → repeat → explanation → comparison completed | `clientWidth=360`, `scrollWidth=360`, no control below 44px, reduced-motion animation count `0`, primary CTA remained in viewport |
| 1280×900 | map | baseline prediction and changed observation were readable before comparison; completion disabled the compare button | no horizontal overflow, observation was DOM text, external requests `[]`, console errors `[]` |
| 1280×900 | voice | retention started off, changed condition showed longer-retention observation, explanation and comparison completed | recording/playback button count `0`, boundary states no real microphone/voice use, external requests `[]`, console errors `[]` |

The final browser evidence is a simulated learner panel, not a real child study or accessibility certification. The added Playwright spec uses a fixed project origin and installs its request listener before navigation; its CLI execution was attempted once and is blocked by absent local browser executables, with no browser installation performed.
