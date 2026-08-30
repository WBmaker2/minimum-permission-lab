# Learner Text Inventory

- Root: `/Volumes/ External Drive 256G/Dev2/codex/minimum-permission-lab`
- Files scanned: `98`
- Candidates: `1602`
- Status: `triage only`; not a grade-level certification or automatic rewrite.

## Candidate strings

| Source | Surface | Text | Role hints | Review signals |
| --- | --- | --- | --- | --- |
| e2e/accessibility.spec.ts:13:33 | text | h2[data-stage-heading] | heading | repeated-text |
| e2e/accessibility.spec.ts:16:51 | text | { const box = element.getBoundingClientRect() return { top: box.top, bottom: box.bottom, viewportHeight: window.innerHeight } }) expect(rect.top).toBeGreaterThanOrEqual(0) expect(rect.bottom).toBeLessThanOrEqual(rect.viewportHeight) await expect(page.locator('header').getByRole('status')).toContainText(progress) } async function assertStageSemantics(page: Page): Promise | heading | long-or-dense |
| e2e/accessibility.spec.ts:28:40 | text | h1, h2, h3, h4, h5, h6 | heading | — |
| e2e/accessibility.spec.ts:28:116 | text | Number(element.tagName.slice(1)))) expect(headings[0]).toBe(1) for (let index = 1; index | heading | long-or-dense |
| e2e/accessibility.spec.ts:31:41 | text | header, main, nav, aside, footer | learner-text-candidate | missing-term-explanation, technical-or-internal |
| e2e/accessibility.spec.ts:31:127 | text | `${element.tagName}:${element.getAttribute('aria-label') ?? element.getAttribute('aria-labelledby') ?? ''}`)) expect(new Set(landmarks).size).toBe(landmarks.length) const controls = page.locator('button, input, textarea, select, summary') for (let index = 0; index | button-or-action, input | long-or-dense, technical-or-internal |
| e2e/accessibility.spec.ts:31:129 | text | ${element.tagName}:${element.getAttribute('aria-label') ?? element.getAttribute('aria-labelledby') ?? ''} | learner-text-candidate | long-or-dense, technical-or-internal |
| e2e/accessibility.spec.ts:33:34 | text | button, input, textarea, select, summary | button-or-action, input | — |
| e2e/accessibility.spec.ts:44:7 | text | checks every learner stage, live status, focus, labels, and history dialog | learner-text-candidate | long-or-dense |
| e2e/accessibility.spec.ts:46:33 | text | 1/7 · 시작 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:48:32 | text | 가상 학습 모델 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:49:32 | text | 실제 권한 없음 · 개인정보 입력 금지 · 저장은 직접 선택합니다. | input | abstract-or-formal, multiple-actions, repeated-text |
| e2e/accessibility.spec.ts:50:41 | text | 학습 범위와 안전 더 보기 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:51:42 | text | 저장 범위와 삭제 방법 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:54:67 | text | { const caseSection = main.querySelector('.case-selector') const safety = main.querySelector('.start-safety') const storage = main.querySelector('.start-storage') return { caseBeforeSafety: Boolean(caseSection && safety && (caseSection.compareDocumentPosition(safety) & Node.DOCUMENT_POSITION_FOLLOWING)), caseBeforeStorage: Boolean(caseSection && storage && (caseSection.compareDocumentPosition(storage) & Node.DOCUMENT_POSITION_FOLLOWING)), } }) expect(startOrder.caseBeforeSafety).toBe(true) expect(startOrder.caseBeforeStorage).toBe(true) await page.getByRole('button', { name: '사진 스캔 과제함', exact: true }).press('Space') await page.getByRole('button', { name: '기능 명세 보기', exact: true }).press('Enter') await assertStageFocus(page, '2/7 · 기능 살펴보기') await assertStageSemantics(page) await page.getByRole('button', { name: '권한 심사 시작', exact: true }).press('Enter') await assertStageFocus(page, '3/7 · 권한 고르기') await assertStageSemantics(page) for (let index = 0; index | button-or-action | long-or-dense, multiple-actions |
| e2e/accessibility.spec.ts:66:25 | text | button | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:66:43 | text | 사진 스캔 과제함 | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:66:77 | text | Space | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:67:25 | text | button | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:67:43 | text | 기능 명세 보기 | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:67:76 | text | Enter | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:68:33 | text | 2/7 · 기능 살펴보기 | learner-text-candidate | — |
| e2e/accessibility.spec.ts:70:25 | text | button | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:70:43 | text | 권한 심사 시작 | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:70:76 | text | Enter | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:71:33 | text | 3/7 · 권한 고르기 | learner-text-candidate | — |
| e2e/accessibility.spec.ts:73:85 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:74:79 | text | 권한 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:75:25 | text | button | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:75:43 | text | 선택 검토 | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:75:73 | text | Enter | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:76:33 | text | 4/7 · 영향 비교하기 | learner-text-candidate | — |
| e2e/accessibility.spec.ts:78:42 | text | 대안 사용 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:79:25 | text | button | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:79:43 | text | 최소 권한안 수정 | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:79:77 | text | Enter | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:80:33 | text | 5/7 · 다시 고르기 | learner-text-candidate | — |
| e2e/accessibility.spec.ts:83:85 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:84:44 | text | 내 판단 근거 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:84:75 | text | 필요한 정보만 사용합니다. | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:85:45 | text | 정보 최소화 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:86:25 | text | button | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:86:43 | text | 선택 검토 | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:86:73 | text | Enter | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:87:33 | text | 1/7 · 시작 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:89:32 | text | heading | heading | repeated-text |
| e2e/accessibility.spec.ts:89:51 | text | 학습 시작 | heading | repeated-text |
| e2e/accessibility.spec.ts:91:25 | text | button | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:91:43 | text | 업데이트 내역 | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:91:75 | text | Enter | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:92:50 | text | 업데이트 내역 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:94:32 | text | button | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:94:50 | text | 업데이트 내역 | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:97:60 | text | { await assertStageFocus(page, stage === 'revocation' ? '6/7 · 철회 연습' : '7/7 · 학습 보고서') await assertStageSemantics(page) if (stage === 'revocation') await expect(page.getByRole('heading', { name: '권한 철회 미니 활동' })).toBeVisible() if (stage === 'report') await expect(page.getByRole('heading', { name: '최소 권한 학습 보고서' })).toBeVisible() }) if ((page.viewportSize()?.width ?? 0) | heading | long-or-dense, technical-or-internal |
| e2e/accessibility.spec.ts:98:60 | text | 6/7 · 철회 연습 | learner-text-candidate | — |
| e2e/accessibility.spec.ts:98:76 | text | 7/7 · 학습 보고서 | learner-text-candidate | — |
| e2e/accessibility.spec.ts:100:20 | text | revocation | heading | — |
| e2e/accessibility.spec.ts:100:62 | text | heading | heading | repeated-text |
| e2e/accessibility.spec.ts:100:81 | text | 권한 철회 미니 활동 | heading | repeated-text |
| e2e/accessibility.spec.ts:101:20 | text | report | heading | — |
| e2e/accessibility.spec.ts:101:58 | text | heading | heading | repeated-text |
| e2e/accessibility.spec.ts:101:77 | text | 최소 권한 학습 보고서 | heading | repeated-text |
| e2e/accessibility.spec.ts:108:58 | text | 권한 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:110:57 | text | 다음 학습 행동 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:112:44 | text | 인쇄해 수업에서 함께 돌아보기 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:113:44 | text | 다시 시작해 다른 사례를 연습하기 | learner-text-candidate | repeated-text |
| e2e/accessibility.spec.ts:118:33 | text | h2[data-stage-heading] | heading | repeated-text |
| e2e/accessibility.spec.ts:121:32 | text | button | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:121:50 | text | 사진 스캔 과제함 | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:126:25 | text | button | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:126:43 | text | 업데이트 내역 | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:126:75 | text | Enter | button-or-action | repeated-text |
| e2e/accessibility.spec.ts:129:32 | text | heading | heading | repeated-text |
| e2e/accessibility.spec.ts:129:51 | text | 최소 권한 학습 보고서 | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:7:73 | text | = { 'photo-scan': '사진 스캔 과제함', 'voice-reading': '음성 읽기 연습', 'class-map': '교실 지도 안내', 'group-board': '모둠 알림판', } /** Completes the four cases in order and inspects the resulting report. */ async function completeAllCases(page: Page): Promise | instruction | long-or-dense |
| e2e/full-learning-flow.spec.ts:8:18 | text | 사진 스캔 과제함 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:9:21 | text | 음성 읽기 연습 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:10:17 | text | 교실 지도 안내 | instruction | repeated-text |
| e2e/full-learning-flow.spec.ts:11:19 | text | 모둠 알림판 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:17:41 | text | heading | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:19:36 | text | heading | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:19:55 | text | 학습 시작 | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:20:29 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:21:29 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:21:47 | text | 기능 명세 보기 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:21:80 | text | Enter | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:25:61 | text | 가상 별명 연습 | input | repeated-text |
| e2e/full-learning-flow.spec.ts:27:50 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:27:68 | text | 권한 심사 시작 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:30:29 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:30:47 | text | 예시 사용: 햇살 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:31:45 | text | 햇살 | input | repeated-text |
| e2e/full-learning-flow.spec.ts:33:41 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:33:59 | text | 권한 심사 시작 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:34:36 | text | 0) await reviewStart.press('Enter') const initialChoices = page.getByRole('radio', { name: '허용하지 않음', exact: true }) await expect(initialChoices).toHaveCount(4) for (let permissionIndex = 0; permissionIndex | learner-text-candidate | long-or-dense |
| e2e/full-learning-flow.spec.ts:36:61 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:39:27 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:39:45 | text | 선택 검토 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:39:75 | text | Enter | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:43:46 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:43:64 | text | 비교 확인 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:47:36 | text | heading | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:57:68 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:57:86 | text | 비교 확인 완료 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:58:62 | text | 대안 사용 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:58:72 | text | 권한 철회 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:59:27 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:59:45 | text | 최소 권한안 수정 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:59:79 | text | Enter | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:61:34 | text | heading | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:61:53 | text | 최초 선택 비교 | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:62:61 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:65:61 | text | 이번 기능에만 허용 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:66:27 | text | textbox | learner-text-candidate | — |
| e2e/full-learning-flow.spec.ts:66:46 | text | 내 판단 근거 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:66:64 | text | ${CASE_TITLES[caseId]}에서 필요한 정보만 사용하고 통제 방법을 기록했습니다. | learner-text-candidate | long-or-dense, missing-term-explanation, technical-or-internal |
| e2e/full-learning-flow.spec.ts:67:47 | text | 정보 최소화 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:68:27 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:68:45 | text | 선택 검토 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:68:75 | text | Enter | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:71:25 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:71:43 | text | 권한 철회 연습 시작 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:71:79 | text | Enter | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:72:56 | text | 현재 기능에 유지 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:73:58 | text | 지금 철회 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:78:25 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:78:43 | text | 철회 판단 완료 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:78:76 | text | Enter | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:79:25 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:79:43 | text | 학습 보고서 보기 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:79:77 | text | Enter | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:81:32 | text | heading | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:81:51 | text | 최소 권한 학습 보고서 | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:82:32 | text | heading | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:82:51 | text | 네 사례 완료 요약 | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:83:32 | text | 판단이 바뀐 것은 배움의 증거예요 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:99:66 | text | 최초 선택 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:100:66 | text | 수정 선택 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:102:40 | text | 근거 차원 확인 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:103:31 | text | 기능 연결 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:103:40 | text | 정보 최소화 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:103:50 | text | 사용자 통제 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:103:60 | text | 다른 사람 존중 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:109:61 | text | ◆ 판단 변경 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:110:23 | text | ◆ 판단 변경 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:112:32 | text | 통제 후 허용 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:113:32 | text | 허용하지 않기 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:114:32 | text | 가상 학습 모델이며 실제 앱 판정이 아님 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:116:57 | text | 다음 학습 행동 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:117:44 | text | 인쇄해 수업에서 함께 돌아보기 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:118:44 | text | 다시 시작해 다른 사례를 연습하기 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:123:32 | text | heading | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:123:51 | text | 학습 시작 | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:124:52 | text | 이 기기에 저장 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:127:25 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:127:55 | text | photo-scan | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:128:25 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:128:43 | text | 기능 명세 보기 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:128:76 | text | Enter | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:130:32 | text | heading | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:130:51 | text | 학습 시작 | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:131:52 | text | 이 기기에 저장 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:139:25 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:139:55 | text | photo-scan | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:140:41 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:140:59 | text | 기능 명세 보기 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:154:45 | text | 이 기기에 저장 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:155:25 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:155:55 | text | photo-scan | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:156:25 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:156:43 | text | 기능 명세 보기 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:156:76 | text | Enter | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:157:32 | text | heading | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:157:63 | text | photo-scan | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:161:32 | text | heading | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:161:51 | text | 학습 시작 | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:162:25 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:162:43 | text | 이 기기에 저장한 기록 불러오기 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:163:32 | text | heading | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:163:63 | text | photo-scan | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:167:41 | text | 처음부터 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:170:25 | text | button | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:170:43 | text | 처음부터 다시 하기 | button-or-action | repeated-text |
| e2e/full-learning-flow.spec.ts:172:32 | text | heading | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:172:51 | text | 학습 시작 | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:173:52 | text | 이 기기에 저장 | learner-text-candidate | repeated-text |
| e2e/full-learning-flow.spec.ts:176:32 | text | heading | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:176:51 | text | 학습 시작 | heading | repeated-text |
| e2e/full-learning-flow.spec.ts:177:52 | text | 이 기기에 저장 | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:7:55 | text | [caseId, appCase.title]), ) as Record | learner-text-candidate | missing-term-explanation, technical-or-internal |
| e2e/helpers/keyboardFlow.ts:10:23 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:12:46 | text | Promise | button-or-action | — |
| e2e/helpers/keyboardFlow.ts:12:60 | text | export interface PrimaryActionRect { x: number y: number width: number height: number } /** Samples the pulsing CTA before and during normal motion without activating it. */ export async function recordPrimaryActionRects(button: Locator): Promise | button-or-action | long-or-dense, technical-or-internal |
| e2e/helpers/keyboardFlow.ts:24:38 | text | new Promise | button-or-action | — |
| e2e/helpers/keyboardFlow.ts:42:127 | text | { await expect(page.getByRole('heading', { name: '학습 시작' })).toBeVisible() await page.getByRole('button', { name: CASE_TITLES[caseId], exact: true }).press('Space') const specificationButton = page.getByRole('button', { name: '기능 명세 보기', exact: true }) await onPrimaryAction?.(specificationButton) await specificationButton.press('Enter') await expect(page.getByRole('heading', { name: CASE_TITLES[caseId], exact: true })).toBeVisible() if (caseId === 'group-board') { const aliasInput = page.getByRole('textbox', { name: '가상 별명 연습' }) await expect(aliasInput).toHaveValue('') const blockedReviewStart = page.getByRole('button', { name: '권한 심사 시작', exact: true }) await expect(blockedReviewStart).toBeDisabled() await page.getByRole('button', { name: '예시 사용: 햇살', exact: true }).press('Space') await expect(aliasInput).toHaveValue('햇살') } const reviewButton = page.getByRole('button', { name: '권한 심사 시작', exact: true }) await onPrimaryAction?.(reviewButton) await reviewButton.press('Enter') const initialChoices = page.getByRole('radio', { name: CHOICE_LABEL, exact: true }) await expect(initialChoices).toHaveCount(4) for (let index = 0; index | heading, button-or-action, input | long-or-dense, technical-or-internal |
| e2e/helpers/keyboardFlow.ts:43:32 | text | heading | heading | repeated-text |
| e2e/helpers/keyboardFlow.ts:43:51 | text | 학습 시작 | heading | repeated-text |
| e2e/helpers/keyboardFlow.ts:44:25 | text | button | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:44:85 | text | Space | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:45:47 | text | button | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:45:65 | text | 기능 명세 보기 | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:47:36 | text | Enter | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:48:32 | text | heading | heading | repeated-text |
| e2e/helpers/keyboardFlow.ts:50:59 | text | 가상 별명 연습 | input | repeated-text |
| e2e/helpers/keyboardFlow.ts:52:48 | text | button | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:52:66 | text | 권한 심사 시작 | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:54:27 | text | button | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:54:45 | text | 예시 사용: 햇살 | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:54:79 | text | Space | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:55:43 | text | 햇살 | input | repeated-text |
| e2e/helpers/keyboardFlow.ts:57:40 | text | button | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:57:58 | text | 권한 심사 시작 | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:59:29 | text | Enter | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:61:42 | text | radio | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:64:40 | text | button | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:64:58 | text | 선택 검토 | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:66:29 | text | Enter | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:70:43 | text | button | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:70:61 | text | 비교 확인 | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:71:38 | text | 0) { for (let index = 0; index | learner-text-candidate | — |
| e2e/helpers/keyboardFlow.ts:74:57 | text | Space | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:77:42 | text | 대안 사용 | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:78:49 | text | 대안 사용 | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:79:42 | text | button | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:79:60 | text | 최소 권한안 수정 | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:82:31 | text | Enter | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:83:32 | text | heading | heading | repeated-text |
| e2e/helpers/keyboardFlow.ts:83:51 | text | 수정 권한 심사 | heading | repeated-text |
| e2e/helpers/keyboardFlow.ts:85:42 | text | radio | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:88:56 | text | 내 판단 근거 | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:89:38 | text | 필요한 정보만 사용하고 필요하지 않으면 철회하겠습니다. | learner-text-candidate | — |
| e2e/helpers/keyboardFlow.ts:90:45 | text | 정보 최소화 | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:91:42 | text | button | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:91:60 | text | 선택 검토 | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:94:31 | text | Enter | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:98:136 | text | { for (const caseId of ['photo-scan', 'voice-reading', 'class-map', 'group-board'] as const) { await completeCaseWithKeyboard(page, caseId, onPrimaryAction) } const revocationStartButton = page.getByRole('button', { name: '권한 철회 연습 시작', exact: true }) await onPrimaryAction?.(revocationStartButton) await revocationStartButton.press('Enter') await onStage?.('revocation') const keepChoices = page.getByRole('radio', { name: '현재 기능에 유지', exact: true }) const revokeChoices = page.getByRole('radio', { name: '지금 철회', exact: true }) await expect(keepChoices).toHaveCount(4) await expect(revokeChoices).toHaveCount(4) for (let index = 0; index | button-or-action | long-or-dense, technical-or-internal |
| e2e/helpers/keyboardFlow.ts:103:49 | text | button | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:103:67 | text | 권한 철회 연습 시작 | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:105:38 | text | Enter | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:107:56 | text | 현재 기능에 유지 | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:108:58 | text | 지금 철회 | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:113:52 | text | button | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:113:70 | text | 철회 판단 완료 | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:115:41 | text | Enter | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:116:40 | text | button | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:116:58 | text | 학습 보고서 보기 | button-or-action | repeated-text |
| e2e/helpers/keyboardFlow.ts:118:29 | text | Enter | learner-text-candidate | repeated-text |
| e2e/helpers/keyboardFlow.ts:120:32 | text | heading | heading | repeated-text |
| e2e/helpers/keyboardFlow.ts:120:51 | text | 최소 권한 학습 보고서 | heading | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:5:57 | text | { test.use({ reducedMotion: 'reduce' }) const assertPrimaryActionInViewport = async (button: Locator): Promise | button-or-action | long-or-dense |
| e2e/mobile-reduced-motion.spec.ts:22:49 | text | button | button-or-action | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:22:67 | text | 기능 명세 보기 | button-or-action | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:23:27 | text | button | button-or-action | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:23:45 | text | 사진 스캔 과제함 | button-or-action | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:23:79 | text | Space | button-or-action | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:38:42 | text | button | button-or-action | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:38:60 | text | 사진 스캔 과제함 | button-or-action | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:53:34 | text | heading | heading | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:53:53 | text | 최소 권한 학습 보고서 | heading | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:54:43 | text | button | button-or-action | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:54:61 | text | 처음부터 다시 하기 | button-or-action | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:64:55 | text | getComputedStyle(element).animationName !== 'none') const targets = Array.from(document.querySelectorAll | button-or-action, input | long-or-dense |
| e2e/mobile-reduced-motion.spec.ts:65:74 | text | button, input, textarea, select, summary, label | button-or-action, input | — |
| e2e/mobile-reduced-motion.spec.ts:91:32 | text | 카메라 | learner-text-candidate | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:91:39 | text | 마이크 | learner-text-candidate | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:91:46 | text | 위치 | learner-text-candidate | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:91:52 | text | 연락처 | learner-text-candidate | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:92:45 | text | heading | heading | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:99:36 | text | button | button-or-action | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:99:54 | text | 기능 명세 보기 | button-or-action | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:100:27 | text | button | button-or-action | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:100:45 | text | 사진 스캔 과제함 | button-or-action | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:100:79 | text | Space | button-or-action | repeated-text |
| e2e/mobile-reduced-motion.spec.ts:102:34 | text | .gi-pulse__step | button-or-action | — |
| e2e/mobile-reduced-motion.spec.ts:102:65 | text | 단계 1 | button-or-action | repeated-text |
| e2e/privacy-safety.spec.ts:29:23 | text | ${caseId}에서 필요한 권한만 골랐습니다. | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| e2e/privacy-safety.spec.ts:63:48 | text | 앱 권한 최소허용 연구소 | learner-text-candidate | repeated-text |
| e2e/privacy-safety.spec.ts:66:32 | text | heading | heading | repeated-text |
| e2e/privacy-safety.spec.ts:66:51 | text | 학습 시작 | heading | repeated-text |
| e2e/privacy-safety.spec.ts:67:45 | text | 이 기기에 저장 | learner-text-candidate | repeated-text |
| e2e/privacy-safety.spec.ts:68:25 | text | button | button-or-action | repeated-text |
| e2e/privacy-safety.spec.ts:68:43 | text | 모둠 알림판 | button-or-action | repeated-text |
| e2e/privacy-safety.spec.ts:69:47 | text | button | button-or-action | repeated-text |
| e2e/privacy-safety.spec.ts:69:65 | text | 기능 명세 보기 | button-or-action | repeated-text |
| e2e/privacy-safety.spec.ts:73:57 | text | 가상 별명 연습 | input | repeated-text |
| e2e/privacy-safety.spec.ts:75:26 | text | 햇살 탐험대 | input | repeated-text |
| e2e/privacy-safety.spec.ts:76:32 | text | 미리보기: 햇살 탐험대 | learner-text-candidate | — |
| e2e/privacy-safety.spec.ts:90:60 | text | 햇살 탐험대 | learner-text-candidate | repeated-text |
| e2e/privacy-safety.spec.ts:90:88 | text | 햇살 탐험대 | learner-text-candidate | repeated-text |
| e2e/privacy-safety.spec.ts:143:50 | text | 햇살 탐험대 | learner-text-candidate | repeated-text |
| e2e/privacy-safety.spec.ts:153:13 | text | 햇살 탐험대 | learner-text-candidate | repeated-text |
| e2e/privacy-safety.spec.ts:156:15 | text | 햇살 탐험대 | learner-text-candidate | repeated-text |
| e2e/privacy-safety.spec.ts:161:49 | text | 햇살 탐험대 | learner-text-candidate | repeated-text |
| eslint.config.js:66:42 | text | type-only import '${node.name}'는 실행 시 외부 capability를 가리지 못합니다. 실제 권한·네트워크 API 참조를 제거하세요. | learner-text-candidate | long-or-dense, missing-term-explanation, technical-or-internal |
| eslint.config.js:74:44 | text | 실제 브라우저 경계(${node.object.name}.${property})를 사용하지 마세요. 가상 학습 모델은 권한·외부 네트워크·분석을 사용하지 않습니다. | learner-text-candidate | abstract-or-formal, long-or-dense |
| eslint.config.js:76:44 | text | 동적 브라우저 경계(${node.object.name}[...])를 사용하지 마세요. 외부 권한·네트워크 접근은 정책 검사에서 차단됩니다. | learner-text-candidate | long-or-dense |
| eslint.config.js:113:10 | text | error | feedback-or-error | repeated-text |
| eslint.config.js:114:40 | text | 실제 브라우저 권한·기기 API를 사용하지 마세요. 이 앱은 가상 학습 모델이며 개인정보를 수집하지 않습니다. | learner-text-candidate | long-or-dense, missing-term-explanation, technical-or-internal |
| eslint.config.js:115:43 | text | 실제 카메라·마이크 API를 사용하지 마세요. 학습 중 기기 정보를 접근하지 않습니다. | learner-text-candidate | missing-term-explanation, technical-or-internal |
| eslint.config.js:116:36 | text | 외부 네트워크(fetch)를 사용하지 마세요. 학습 데이터를 앱 밖으로 전송하지 않습니다. | learner-text-candidate | — |
| eslint.config.js:117:45 | text | 외부 네트워크(XMLHttpRequest)를 사용하지 마세요. 학습 데이터 전송을 차단합니다. | learner-text-candidate | long-or-dense, technical-or-internal |
| eslint.config.js:118:40 | text | 외부 네트워크(WebSocket)를 사용하지 마세요. 실시간 외부 전송을 차단합니다. | learner-text-candidate | — |
| eslint.config.js:119:42 | text | 외부 네트워크(EventSource)를 사용하지 마세요. 외부 스트림 연결을 차단합니다. | learner-text-candidate | — |
| eslint.config.js:120:39 | text | 외부 Firebase 초기화를 사용하지 마세요. 계정·클라우드·분석 연동은 MVP 범위 밖입니다. | learner-text-candidate | abstract-or-formal, long-or-dense, technical-or-internal |
| eslint.config.js:121:40 | text | 외부 analytics 초기화를 사용하지 마세요. 학습자 행동을 추적하지 않습니다. | learner-text-candidate | — |
| eslint.config.js:122:38 | text | 외부 Segment 초기화를 사용하지 마세요. 학습자 행동을 전송하지 않습니다. | learner-text-candidate | — |
| eslint.config.js:123:35 | text | 외부 분석 초기화(gtag)를 사용하지 마세요. 학습자 행동을 추적하지 않습니다. | learner-text-candidate | abstract-or-formal |
| eslint.config.js:127:8 | text | permission-boundary/no-browser-boundary | feedback-or-error | — |
| eslint.config.js:127:51 | text | error | feedback-or-error | repeated-text |
| index.html:8:16 | text | 초등학생을 위한 가상 앱 권한 학습 모델 | learner-text-candidate | — |
| index.html:11:12 | text | 앱 권한 최소허용 연구소 | learner-text-candidate | repeated-text |
| scripts/check-source-policy.mjs:402:105 | text | parse-error | feedback-or-error | repeated-text |
| scripts/check-source-policy.mjs:481:20 | text | source policy: 0 forbidden runtime references | feedback-or-error | technical-or-internal |
| scripts/check-source-policy.mjs:484:54 | text | ${violation.filePath}:${violation.line} ${violation.pattern} | feedback-or-error | long-or-dense |
| scripts/check-source-policy.test.mjs:27:7 | text | findForbiddenRuntimeReferences handles computed, optional, global, and alias variants | learner-text-candidate | long-or-dense, missing-term-explanation, technical-or-internal |
| scripts/check-source-policy.test.mjs:60:67 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:63:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:63:51 | text | fetch( | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:64:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:64:51 | text | fetch( | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:65:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:65:51 | text | fetch( | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:66:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:66:51 | text | navigator.permissions | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:67:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:67:51 | text | navigator.geolocation | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:68:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:68:51 | text | navigator.contacts | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:69:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:69:51 | text | navigator.mediaDevices | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:70:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:70:51 | text | mediaDevices.getUserMedia | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:71:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:71:51 | text | navigator.sendBeacon | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:72:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:72:51 | text | navigator.serviceWorker | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:73:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:74:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:74:52 | text | navigator.geolocation | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:75:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:75:52 | text | fetch( | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:76:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:76:52 | text | fetch( | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:77:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:78:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:79:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:80:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:81:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:82:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:83:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:83:52 | text | fetch( | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:84:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:84:52 | text | gtag( | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:85:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:85:52 | text | gtag( | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:86:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:86:52 | text | gtag( | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:87:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:87:52 | text | gtag( | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:88:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:88:52 | text | fetch( | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:89:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:89:52 | text | navigator.permissions | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:90:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:90:52 | text | firebase.initializeApp | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:91:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:91:52 | text | analytics.init | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:92:18 | text | variants.ts | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| scripts/check-source-policy.test.mjs:92:52 | text | segment.load | learner-text-candidate | repeated-text |
| scripts/check-source-policy.test.mjs:114:59 | text | parse-error | feedback-or-error | repeated-text |
| scripts/source-policy/provenance.mjs:18:42 | text | navigator.permissions | feedback-or-error | repeated-text |
| scripts/source-policy/provenance.mjs:18:67 | text | navigator.geolocation | feedback-or-error | repeated-text |
| scripts/source-policy/provenance.mjs:18:92 | text | navigator.contacts | feedback-or-error | repeated-text |
| scripts/source-policy/provenance.mjs:18:114 | text | navigator.mediaDevices | feedback-or-error | repeated-text |
| scripts/source-policy/provenance.mjs:18:140 | text | mediaDevices.getUserMedia | feedback-or-error | repeated-text |
| scripts/source-policy/provenance.mjs:18:169 | text | navigator.sendBeacon | feedback-or-error | repeated-text |
| scripts/source-policy/provenance.mjs:18:193 | text | navigator.serviceWorker | feedback-or-error | repeated-text |
| scripts/source-policy/provenance.mjs:18:220 | text | fetch( | feedback-or-error | repeated-text |
| scripts/source-policy/provenance.mjs:18:230 | text | XMLHttpRequest | feedback-or-error | missing-term-explanation, technical-or-internal |
| scripts/source-policy/provenance.mjs:18:248 | text | WebSocket | feedback-or-error | — |
| scripts/source-policy/provenance.mjs:18:261 | text | EventSource | feedback-or-error | — |
| scripts/source-policy/provenance.mjs:18:276 | text | firebase.initializeApp | feedback-or-error | repeated-text |
| scripts/source-policy/provenance.mjs:18:302 | text | firebase.analytics | feedback-or-error | — |
| scripts/source-policy/provenance.mjs:18:324 | text | analytics.init | feedback-or-error | repeated-text |
| scripts/source-policy/provenance.mjs:18:342 | text | segment.load | feedback-or-error | repeated-text |
| scripts/source-policy/provenance.mjs:18:358 | text | gtag( | feedback-or-error | repeated-text |
| scripts/source-policy/provenance.mjs:18:384 | text | parse-error | feedback-or-error | repeated-text |
| src/app/App.test.tsx:15:7 | text | shows the learning lab title and virtual-model notice | learner-text-candidate | long-or-dense |
| src/app/App.test.tsx:15:68 | text | { render( | learner-text-candidate | repeated-text |
| src/app/App.test.tsx:19:25 | text | heading | heading | repeated-text |
| src/app/App.test.tsx:21:16 | text | 앱 권한 최소허용 연구소 | learner-text-candidate | repeated-text |
| src/app/App.test.tsx:24:30 | text | 가상 학습 모델 | learner-text-candidate | repeated-text |
| src/app/App.test.tsx:33:37 | text | .learning-model-notice__title | learner-text-candidate | — |
| src/app/App.test.tsx:41:40 | text | button | button-or-action | repeated-text |
| src/app/App.test.tsx:42:40 | text | button | button-or-action | repeated-text |
| src/app/App.test.tsx:43:52 | text | heading | heading | repeated-text |
| src/app/App.test.tsx:43:81 | text | 사진 스캔 과제함 | heading | repeated-text |
| src/app/App.test.tsx:45:51 | text | data-stage-heading | heading | — |
| src/app/App.test.tsx:46:51 | text | tabindex | heading | — |
| src/app/App.test.tsx:47:40 | text | button | button-or-action | repeated-text |
| src/app/App.test.tsx:48:30 | text | heading | heading | repeated-text |
| src/app/App.test.tsx:48:59 | text | 최초 권한 심사 | heading | repeated-text |
| src/app/App.test.tsx:69:30 | text | heading | heading | repeated-text |
| src/app/App.test.tsx:69:59 | text | 앱 권한 최소허용 연구소 | heading | repeated-text |
| src/app/App.test.tsx:70:60 | text | 이 기기에 저장 | learner-text-candidate | repeated-text |
| src/app/App.test.tsx:71:50 | text | 이 기기에 저장 | learner-text-candidate | repeated-text |
| src/app/App.test.tsx:73:40 | text | button | button-or-action | repeated-text |
| src/app/App.test.tsx:73:58 | text | 이 기기에 저장한 기록 불러오기 | button-or-action | repeated-text |
| src/app/App.test.tsx:77:30 | text | heading | heading | repeated-text |
| src/app/App.test.tsx:77:59 | text | 사진 스캔 과제함 | heading | repeated-text |
| src/app/App.test.tsx:84:30 | text | heading | heading | repeated-text |
| src/app/App.test.tsx:84:59 | text | 사례를 다시 선택해 주세요 | heading | repeated-text |
| src/app/App.test.tsx:85:40 | text | button | button-or-action | repeated-text |
| src/app/App.test.tsx:85:58 | text | 사례 선택으로 돌아가기 | button-or-action | repeated-text |
| src/app/App.test.tsx:86:30 | text | heading | heading | repeated-text |
| src/app/App.test.tsx:86:59 | text | 학습 시작 | heading | repeated-text |
| src/app/App.test.tsx:93:30 | text | heading | heading | repeated-text |
| src/app/App.test.tsx:93:59 | text | 사례를 다시 선택해 주세요 | heading | repeated-text |
| src/app/App.test.tsx:94:32 | text | heading | heading | repeated-text |
| src/app/App.test.tsx:94:61 | text | 학습 보고서 | heading | repeated-text |
| src/app/App.test.tsx:95:40 | text | button | button-or-action | repeated-text |
| src/app/App.test.tsx:95:58 | text | 사례 선택으로 돌아가기 | button-or-action | repeated-text |
| src/app/App.test.tsx:96:30 | text | heading | heading | repeated-text |
| src/app/App.test.tsx:96:59 | text | 학습 시작 | heading | repeated-text |
| src/app/App.tsx:21:55 | text | } export function LabApplication(): ReactElement { const { state, dispatch, setSaveOnDevice, loadSavedProgressOnRequest, clearSavedProgressOnRequest } = useLab() const [isUpdateHistoryOpen, setIsUpdateHistoryOpen] = useState(false) const updateHistoryTriggerRef = useRef | learner-text-candidate | long-or-dense, technical-or-internal |
| src/app/App.tsx:64:85 | text | {isUpdateHistoryOpen ? | learner-text-candidate | — |
| src/app/App.tsx:146:44 | text | 네 사례를 모두 완료했습니다 | heading | — |
| src/app/App.tsx:147:10 | text | 이제 가상 사용 기록을 살펴보고, 필요하지 않은 권한을 철회하는 연습을 시작할 수 있습니다. | learner-text-candidate | multiple-actions |
| src/app/App.tsx:148:76 | text | 권한 철회 연습 시작 | learner-text-candidate | repeated-text |
| src/app/App.tsx:161:20 | text | 처리되지 않은 학습 단계: ${String(value)} | feedback-or-error | — |
| src/app/App.tsx:164:62 | text | void }): ReactElement { return | heading, button-or-action | technical-or-internal |
| src/app/App.tsx:165:53 | text | 사례를 다시 선택해 주세요 | heading, button-or-action | repeated-text |
| src/app/App.tsx:165:75 | text | 선택한 사례를 확인할 수 없습니다. 시작 화면으로 돌아가 사례를 다시 선택하세요. | heading, button-or-action | multiple-actions |
| src/app/App.tsx:165:166 | text | 사례 선택으로 돌아가기 | heading, button-or-action | repeated-text |
| src/app/App.tsx:169:30 | text | { if (window.confirm('학습 기록이 완전하지 않습니다. 지금 기록을 지우고 처음부터 다시 시작하시겠습니까?')) onRecover() } return | heading, button-or-action | long-or-dense, multiple-actions |
| src/app/App.tsx:170:25 | text | 학습 기록이 완전하지 않습니다. 지금 기록을 지우고 처음부터 다시 시작하시겠습니까? | learner-text-candidate | multiple-actions |
| src/app/App.tsx:172:53 | text | 보고서를 만들 수 없습니다 | heading, button-or-action | repeated-text |
| src/app/App.tsx:172:75 | text | 학습 기록이 완전하지 않아 보고서를 표시할 수 없습니다. 기록을 지우고 처음부터 다시 시작해 주세요. | heading, button-or-action | multiple-actions |
| src/app/App.tsx:172:181 | text | 처음부터 다시 하기 | heading, button-or-action | repeated-text |
| src/app/LabContext.ts:17:32 | text | useLab must be used inside LabProvider | feedback-or-error | missing-term-explanation, technical-or-internal |
| src/app/LabProvider.test.tsx:49:54 | text | 이 기기에 저장하지 않음 | learner-text-candidate | repeated-text |
| src/app/LabProvider.test.tsx:59:54 | text | 저장 기록을 지웠습니다. | learner-text-candidate | repeated-text |
| src/app/LabProvider.test.tsx:104:54 | text | 저장된 학습 기록을 불러왔습니다. | learner-text-candidate | repeated-text |
| src/app/LabProvider.test.tsx:113:54 | text | 저장된 학습 기록이 없습니다. | learner-text-candidate | repeated-text |
| src/app/LabProvider.test.tsx:123:54 | text | 저장된 학습 기록이 없습니다. | learner-text-candidate | repeated-text |
| src/app/LabProvider.test.tsx:127:7 | text | contains storage API errors during user actions | feedback-or-error | missing-term-explanation, technical-or-internal |
| src/app/LabProvider.test.tsx:129:47 | text | blocked | feedback-or-error | repeated-text |
| src/app/LabProvider.test.tsx:130:47 | text | blocked | feedback-or-error | repeated-text |
| src/app/LabProvider.test.tsx:131:50 | text | blocked | feedback-or-error | repeated-text |
| src/app/LabProvider.tsx:7:35 | text | 이 기기에 저장하지 않음 | learner-text-candidate | repeated-text |
| src/app/LabProvider.tsx:8:32 | text | 권한 선택과 근거 문장만 이 기기에 저장 중입니다. 별명과 실제 개인정보는 저장하지 않습니다. | learner-text-candidate | repeated-text |
| src/app/LabProvider.tsx:9:33 | text | 저장된 학습 기록이 없습니다. | learner-text-candidate | repeated-text |
| src/app/LabProvider.tsx:10:32 | text | 저장된 학습 기록을 불러왔습니다. | learner-text-candidate | repeated-text |
| src/app/LabProvider.tsx:11:33 | text | 저장 기록을 지웠습니다. | learner-text-candidate | repeated-text |
| src/app/labReducer.test.ts:44:57 | text | 이 앱은 실제 권한을 요청하지 않으며, 개인정보를 입력하지 않습니다. 저장은 직접 선택합니다. | input | abstract-or-formal, multiple-actions, repeated-text |
| src/app/labReducer.test.ts:53:44 | text | 개인정보 | learner-text-candidate | — |
| src/app/labReducer.test.ts:109:73 | text | 저장 기록을 지웠습니다. | learner-text-candidate | repeated-text |
| src/app/labReducer.test.ts:110:41 | text | 저장 기록을 지웠습니다. | learner-text-candidate | repeated-text |
| src/app/labReducer.test.ts:189:99 | text | 최소 권한으로 충분한 이유 | learner-text-candidate | repeated-text |
| src/app/labReducer.test.ts:193:69 | text | 최소 권한으로 충분한 이유 | learner-text-candidate | repeated-text |
| src/app/labReducer.test.ts:212:99 | text | 근거 | learner-text-candidate | repeated-text |
| src/app/labReducer.test.ts:345:80 | text | 학습 진행을 불러왔습니다. | learner-text-candidate | — |
| src/app/labReducer.ts:121:21 | text | 이 앱은 실제 권한을 요청하지 않으며, 개인정보를 입력하지 않습니다. 저장은 직접 선택합니다. | input | abstract-or-formal, multiple-actions, repeated-text |
| src/components/AppHeader.tsx:16:13 | text | 앱 권한 최소허용 연구소 | heading | repeated-text |
| src/components/LearningModelNotice.tsx:7:51 | text | 가상 학습 모델 | learner-text-candidate | repeated-text |
| src/components/PermissionGlyph.tsx:40:12 | text | ) default: { const exhaustiveIcon: never = iconName throw new Error(`Unknown permission glyph: ${exhaustiveIcon}`) } } } export default function PermissionGlyph({ permissionId, }: PermissionGlyphProps) { const definition = getPermissionDefinition(permissionId) return ( | feedback-or-error | long-or-dense, technical-or-internal |
| src/components/PermissionGlyph.tsx:45:26 | text | Unknown permission glyph: ${exhaustiveIcon} | feedback-or-error | — |
| src/components/PrimaryActionButton.test.tsx:9:11 | text | PrimaryActionButton | learner-text-candidate | — |
| src/components/PrimaryActionButton.test.tsx:10:7 | text | forwards a native button ref while preserving the step and pulse contract | button-or-action | long-or-dense |
| src/components/PrimaryActionButton.test.tsx:10:88 | text | { const ref = createRef | button-or-action | — |
| src/components/PrimaryActionButton.test.tsx:11:45 | text | () render( | learner-text-candidate | — |
| src/components/PrimaryActionButton.test.tsx:12:64 | text | 다음 단계 | learner-text-candidate | repeated-text |
| src/components/PrimaryActionButton.test.tsx:14:38 | text | button | button-or-action | repeated-text |
| src/components/PrimaryActionButton.test.tsx:14:56 | text | 다음 단계 | button-or-action | repeated-text |
| src/components/PrimaryActionButton.test.tsx:16:37 | text | data-step | button-or-action | — |
| src/components/PrimaryActionButton.test.tsx:17:33 | text | gi-pulse | button-or-action | repeated-text |
| src/components/PrimaryActionButton.tsx:1:75 | text | react | learner-text-candidate | — |
| src/components/PrimaryActionButton.tsx:4:50 | text | { pulse: boolean stepNumber: number } const PrimaryActionButton = forwardRef | learner-text-candidate | long-or-dense |
| src/components/PrimaryActionButton.tsx:9:84 | text | (function PrimaryActionButton({ pulse, stepNumber, className = '', children, ...props }, ref): ReactElement { const classes = [className, pulse ? 'gi-pulse' : ''].filter(Boolean).join(' ') return ( | button-or-action | long-or-dense |
| src/components/PrimaryActionButton.tsx:18:98 | text | button | button-or-action | repeated-text |
| src/components/PrimaryActionButton.tsx:19:59 | text | 단계 {stepNumber} | learner-text-candidate | — |
| src/components/ProgressIndicator.test.tsx:11:39 | text | 현재 단계: 2/7 · 기능 살펴보기 | learner-text-candidate | — |
| src/components/ProgressIndicator.test.tsx:12:39 | text | 완료한 사례: 1/4 | learner-text-candidate | — |
| src/components/ProgressIndicator.tsx:4:55 | text | = { start: '시작', specification: '기능 살펴보기', 'initial-review': '권한 고르기', impact: '영향 비교하기', 'revision-review': '다시 고르기', revocation: '철회 연습', report: '학습 보고서', } export interface ProgressIndicatorProps { stage: LabStage completedCaseCount: number totalCaseCount: number } const STAGE_NUMBERS: Readonly | learner-text-candidate | long-or-dense, multiple-actions |
| src/components/ProgressIndicator.tsx:5:11 | text | 시작 | learner-text-candidate | — |
| src/components/ProgressIndicator.tsx:6:19 | text | 기능 살펴보기 | learner-text-candidate | repeated-text |
| src/components/ProgressIndicator.tsx:7:22 | text | 권한 고르기 | learner-text-candidate | — |
| src/components/ProgressIndicator.tsx:8:12 | text | 영향 비교하기 | learner-text-candidate | — |
| src/components/ProgressIndicator.tsx:9:23 | text | 다시 고르기 | learner-text-candidate | — |
| src/components/ProgressIndicator.tsx:10:16 | text | 철회 연습 | learner-text-candidate | — |
| src/components/ProgressIndicator.tsx:11:12 | text | 학습 보고서 | learner-text-candidate | repeated-text |
| src/components/ProgressIndicator.tsx:20:56 | text | = { start: 1, specification: 2, 'initial-review': 3, impact: 4, 'revision-review': 5, revocation: 6, report: 7, } export default function ProgressIndicator({ stage, completedCaseCount, totalCaseCount }: ProgressIndicatorProps): ReactElement { return ( | learner-text-candidate | long-or-dense |
| src/components/ProgressIndicator.tsx:32:91 | text | 현재 단계: {STAGE_NUMBERS[stage]}/7 · {STAGE_LABELS[stage]} · 완료한 사례: {completedCaseCount}/{totalCaseCount} | learner-text-candidate | long-or-dense |
| src/components/StageFocusManager.test.tsx:12:7 | text | focuses the new stage heading and scrolls it to the start of the viewport | heading | long-or-dense |
| src/components/StageFocusManager.test.tsx:12:88 | text | { Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() }) const scrollIntoView = vi.spyOn(HTMLElement.prototype, 'scrollIntoView') const view = render( | heading | long-or-dense |
| src/components/StageFocusManager.test.tsx:17:52 | text | 학습 시작 | heading | repeated-text |
| src/components/StageFocusManager.test.tsx:23:52 | text | 기능 살펴보기 | heading | repeated-text |
| src/components/StageFocusManager.test.tsx:27:30 | text | heading | heading | repeated-text |
| src/components/StageFocusManager.test.tsx:27:49 | text | 기능 살펴보기 | heading | repeated-text |
| src/components/StageFocusManager.tsx:13:18 | text | { const heading = containerRef.current?.querySelector | heading | long-or-dense |
| src/components/StageFocusManager.tsx:14:69 | text | ('[data-stage-heading]') if (heading) focusStageHeading(heading) }, [stage]) return | heading | long-or-dense |
| src/components/StageFocusManager.tsx:14:71 | text | [data-stage-heading] | heading | — |
| src/components/UpdateHistoryButton.tsx:4:16 | text | void } const UpdateHistoryButton = forwardRef | learner-text-candidate | technical-or-internal |
| src/components/UpdateHistoryButton.tsx:7:84 | text | (function UpdateHistoryButton({ onOpen }, ref): ReactElement { return ( | learner-text-candidate | long-or-dense |
| src/components/UpdateHistoryButton.tsx:21:120 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:16:16 | text | { cleanup() Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth }) }) function ControlledHistory() { const [open, setOpen] = React.useState(false) const triggerRef = React.useRef | learner-text-candidate | long-or-dense, technical-or-internal |
| src/components/UpdateHistoryDialog.test.tsx:23:53 | text | (null) return ( | learner-text-candidate | technical-or-internal |
| src/components/UpdateHistoryDialog.test.tsx:26:76 | text | {open ? | learner-text-candidate | — |
| src/components/UpdateHistoryDialog.test.tsx:37:39 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:37:57 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:42:56 | text | 업데이트 내역 | learner-text-candidate | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:44:30 | text | 4개 사례 MVP 학습 흐름 구현 | learner-text-candidate | repeated-text, technical-or-internal |
| src/components/UpdateHistoryDialog.test.tsx:45:30 | text | 실제 앱이나 운영체제에 그대로 일반화하지 않도록 경계를 명시함 | learner-text-candidate | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:46:59 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:46:77 | text | 업데이트 내역 닫기 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:49:75 | text | { Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 }) render( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/components/UpdateHistoryDialog.test.tsx:54:39 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:54:57 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:67:40 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:67:58 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:68:37 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:68:55 | text | 업데이트 내역 닫기 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:70:39 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:70:57 | text | 확인 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:73:39 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:82:39 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:82:57 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:92:40 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:92:58 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:93:37 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:93:55 | text | 업데이트 내역 닫기 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:94:36 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:94:54 | text | 확인 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:108:40 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:108:58 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:109:40 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:109:58 | text | 업데이트 내역 닫기 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:116:30 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:116:48 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:117:40 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:118:30 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:118:48 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:132:30 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:132:48 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:135:66 | text | { const user = userEvent.setup() const onOpen = vi.fn() render( | learner-text-candidate | long-or-dense |
| src/components/UpdateHistoryDialog.test.tsx:139:40 | text | button | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.test.tsx:139:58 | text | 업데이트 내역 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.tsx:6:17 | text | void returnFocusRef?: RefObject | learner-text-candidate | technical-or-internal |
| src/components/UpdateHistoryDialog.tsx:7:55 | text | } const FOCUSABLE_SELECTOR = 'button:not([disabled])' export default function UpdateHistoryDialog({ entries, onClose, returnFocusRef }: UpdateHistoryDialogProps): ReactElement { const dialogRef = useRef | button-or-action | long-or-dense |
| src/components/UpdateHistoryDialog.tsx:10:29 | text | button:not([disabled]) | button-or-action | — |
| src/components/UpdateHistoryDialog.tsx:69:28 | text | 업데이트 내역 | heading | repeated-text |
| src/components/UpdateHistoryDialog.tsx:70:63 | aria-label | 업데이트 내역 닫기 | aria-label, button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.tsx:70:75 | text | 닫기 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.tsx:72:31 | text | 앱을 개선한 날짜와 이유를 확인합니다. | learner-text-candidate | — |
| src/components/UpdateHistoryDialog.tsx:82:49 | text | 확인 | button-or-action | repeated-text |
| src/components/UpdateHistoryDialog.tsx:84:11 | text | ) } function getFocusableElements(dialog: HTMLDivElement): HTMLButtonElement[] { return Array.from(dialog.querySelectorAll | learner-text-candidate | long-or-dense |
| src/components/focusStageHeading.ts:3:38 | text | start | heading | — |
| src/components/focusStageHeading.ts:3:55 | text | nearest | heading | — |
| src/components/focusStageHeading.ts:3:76 | text | auto | heading | — |
| src/content/cases/cases.test.ts:69:56 | text | 학습자가 교실 이름을 선택 | learner-text-candidate | repeated-text |
| src/content/cases/cases.test.ts:73:50 | text | 햇살 | learner-text-candidate | repeated-text |
| src/content/cases/cases.test.ts:73:56 | text | 새싹 | learner-text-candidate | repeated-text |
| src/content/cases/cases.test.ts:73:62 | text | 푸른별 | learner-text-candidate | repeated-text |
| src/content/cases/classMap.ts:11:4 | text | 저장된 지도 불러오기 | learner-text-candidate | — |
| src/content/cases/classMap.ts:12:4 | text | 학습자가 교실 이름을 선택 | learner-text-candidate | repeated-text |
| src/content/cases/classMap.ts:13:4 | text | 경로 보여 주기 | learner-text-candidate | — |
| src/content/cases/classMap.ts:20:25 | text | 미리 저장된 교실 지도를 보여 주는 데 카메라 정보는 필요하지 않습니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:21:14 | text | 지도를 불러오거나 교실 이름을 고를 때 카메라를 사용하지 않습니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:22:20 | text | 카메라를 거절해도 저장된 지도와 경로를 볼 수 있습니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:23:19 | text | 카메라 없이 저장된 지도에서 교실 이름을 직접 고릅니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:24:24 | text | “앱에 미리 저장된 교실 지도를 보여 준다”는 계약에는 카메라가 없습니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:29:25 | text | 교실 지도 안내에는 음성 정보가 필요하지 않습니다. | instruction | — |
| src/content/cases/classMap.ts:30:14 | text | 지도를 불러오고 경로를 보여 줄 때 마이크를 사용하지 않습니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:31:20 | text | 마이크를 거절해도 저장된 지도와 경로를 볼 수 있습니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:32:19 | text | 음성 없이 교실 이름을 직접 선택하여 경로를 확인합니다. | learner-text-candidate | multiple-actions |
| src/content/cases/classMap.ts:33:24 | text | 저장된 교실 지도를 불러와 이름을 선택한다는 계약에는 음성이 없습니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:39:25 | text | 기본 계약의 저장된 교실 지도에는 현재 위치 정보가 필요하지 않습니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:40:14 | text | 기본 지도에서 교실 이름을 고를 때는 위치를 사용하지 않습니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:41:20 | text | 위치를 거절해도 저장된 지도와 선택한 교실 경로를 그대로 볼 수 있습니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:42:19 | text | 현재 위치 대신 저장된 지도에서 교실 이름을 직접 고릅니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:43:24 | text | “앱에 미리 저장된 교실 지도를 보여 준다”는 기본 계약에는 현재 위치 수집·저장이 없습니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:48:25 | text | 교실 지도 안내에는 연락처 목록이 필요하지 않습니다. | instruction | — |
| src/content/cases/classMap.ts:49:14 | text | 지도를 보거나 경로를 고를 때 연락처 목록을 읽지 않습니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:50:20 | text | 연락처를 거절해도 저장된 지도와 경로를 볼 수 있습니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:51:19 | text | 연락처 목록 없이 교실 이름을 직접 선택합니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:52:24 | text | 저장된 지도를 보여 주고 교실 이름을 선택하는 계약에는 연락처가 없습니다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:58:11 | text | 교실 지도 안내 | instruction | repeated-text |
| src/content/cases/classMap.ts:59:18 | text | 앱에 미리 저장된 교실 지도를 보여 준다. | learner-text-candidate | — |
| src/content/cases/classMap.ts:61:22 | text | 현재 위치를 수집하거나 저장하지 않습니다. 미리 저장된 지도만 보여 줍니다. | learner-text-candidate | — |
| src/content/cases/groupBoard.ts:4:4 | text | 햇살 | learner-text-candidate | repeated-text |
| src/content/cases/groupBoard.ts:5:4 | text | 새싹 | learner-text-candidate | repeated-text |
| src/content/cases/groupBoard.ts:6:4 | text | 푸른별 | learner-text-candidate | repeated-text |
| src/content/cases/groupBoard.ts:17:4 | text | 가상 별명 연습 | learner-text-candidate | repeated-text |
| src/content/cases/groupBoard.ts:18:4 | text | 기기 안 미리보기 | learner-text-candidate | — |
| src/content/cases/groupBoard.ts:19:4 | text | 기기 안 알림 카드 작성 시뮬레이션 | learner-text-candidate | — |
| src/content/cases/groupBoard.ts:26:25 | text | 기기 안에서 알림 카드를 미리 보는 데 카메라 정보는 필요하지 않습니다. | learner-text-candidate | — |
| src/content/cases/groupBoard.ts:27:14 | text | 별명을 입력하거나 카드를 미리 볼 때 카메라를 사용하지 않습니다. | input | abstract-or-formal, multiple-conditions |
| src/content/cases/groupBoard.ts:28:20 | text | 카메라를 거절해도 가상 별명으로 알림 카드를 작성할 수 있습니다. | learner-text-candidate | — |
| src/content/cases/groupBoard.ts:29:19 | text | 카메라 없이 가상 별명을 직접 입력하고 기기 안에서 미리 봅니다. | input | abstract-or-formal |
| src/content/cases/groupBoard.ts:30:24 | text | 가상 별명 입력과 기기 안 미리보기 계약에는 카메라가 없습니다. | input | abstract-or-formal |
| src/content/cases/groupBoard.ts:35:25 | text | 알림 카드 시뮬레이션에는 음성 정보가 필요하지 않습니다. | learner-text-candidate | — |
| src/content/cases/groupBoard.ts:36:14 | text | 가상 별명을 입력하고 카드를 작성할 때 마이크를 사용하지 않습니다. | input | abstract-or-formal, multiple-actions, multiple-conditions |
| src/content/cases/groupBoard.ts:37:20 | text | 마이크를 거절해도 가상 알림 카드를 작성할 수 있습니다. | learner-text-candidate | — |
| src/content/cases/groupBoard.ts:38:19 | text | 음성 없이 가상 별명을 직접 입력해 알림 카드를 미리 봅니다. | input | abstract-or-formal |
| src/content/cases/groupBoard.ts:39:24 | text | 직접 입력한 가상 별명과 기기 안 카드 미리보기만 처리하는 계약입니다. | input | abstract-or-formal |
| src/content/cases/groupBoard.ts:44:25 | text | 모둠 알림판 시뮬레이션에는 현재 위치 정보가 필요하지 않습니다. | learner-text-candidate | — |
| src/content/cases/groupBoard.ts:45:14 | text | 카드를 작성하거나 미리 볼 때 현재 위치를 확인하지 않습니다. | learner-text-candidate | multiple-actions, multiple-conditions |
| src/content/cases/groupBoard.ts:46:20 | text | 위치를 거절해도 가상 알림 카드를 작성할 수 있습니다. | learner-text-candidate | — |
| src/content/cases/groupBoard.ts:47:19 | text | 현재 위치 없이 기기 안에서 가상 별명과 알림 카드를 연습합니다. | learner-text-candidate | — |
| src/content/cases/groupBoard.ts:48:24 | text | 기기 안 미리보기와 알림 카드 작성 시뮬레이션에는 위치가 없습니다. | learner-text-candidate | — |
| src/content/cases/groupBoard.ts:53:25 | text | 연락처 목록 대신 직접 입력한 가상 별명만 필요합니다. | input | abstract-or-formal |
| src/content/cases/groupBoard.ts:54:14 | text | 가상 별명을 직접 입력할 때 연락처 목록을 불러오지 않습니다. | input | abstract-or-formal, multiple-conditions |
| src/content/cases/groupBoard.ts:55:20 | text | 연락처를 거절해도 가상 별명으로 알림 카드를 작성할 수 있습니다. | learner-text-candidate | — |
| src/content/cases/groupBoard.ts:56:19 | text | 전체 연락처 가져오기 없이 가상 별명을 직접 입력해 카드를 미리 봅니다. | input | abstract-or-formal |
| src/content/cases/groupBoard.ts:57:24 | text | 직접 입력한 가상 별명으로 기기 안 알림 카드를 시뮬레이션하며 연락처를 가져오지 않는 계약입니다. | input | abstract-or-formal |
| src/content/cases/groupBoard.ts:63:11 | text | 모둠 알림판 | learner-text-candidate | repeated-text |
| src/content/cases/groupBoard.ts:64:18 | text | 실제 이름이 아닌 가상 별명을 직접 입력해 기기 안의 알림 카드 작성을 시뮬레이션한다. | input | abstract-or-formal, multiple-actions |
| src/content/cases/groupBoard.ts:66:22 | text | 가상 별명 미리보기만 처리합니다. 이 콘텐츠 모델은 별명을 사례·실험 상태·저장 보고서에 넣지 않습니다. | learner-text-candidate | long-or-dense |
| src/content/cases/photoScan.ts:11:4 | text | 촬영 버튼 선택 | learner-text-candidate | — |
| src/content/cases/photoScan.ts:12:4 | text | 종이 과제 모습 확인 | learner-text-candidate | — |
| src/content/cases/photoScan.ts:13:4 | text | 제출 화면에 표시 | learner-text-candidate | abstract-or-formal |
| src/content/cases/photoScan.ts:14:4 | text | 활동 종료 뒤 처리 끝 | learner-text-candidate | — |
| src/content/cases/photoScan.ts:21:25 | text | 종이 과제 이미지가 필요합니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:22:14 | text | 촬영 버튼을 누른 현재 기능에서만 사용합니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:23:20 | text | 촬영 기능만 사용할 수 없습니다. 다른 학습 설명은 계속 볼 수 있습니다. | learner-text-candidate | repeated-text |
| src/content/cases/photoScan.ts:24:19 | text | 종이 과제를 직접 제출하거나 교사가 안내한 제출 방법을 이용할 수 있습니다. | instruction | abstract-or-formal, multiple-actions, repeated-text |
| src/content/cases/photoScan.ts:25:24 | text | 핵심 계약인 “사용자가 촬영 버튼을 누를 때 종이 과제를 가상으로 촬영한다”와 연결됩니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:30:25 | text | 이 과제 촬영에는 음성 정보가 필요하지 않습니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:31:14 | text | 촬영 버튼을 눌러도 음성은 사용하지 않습니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:32:20 | text | 마이크를 거절해도 종이 과제 촬영 기능은 달라지지 않습니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:33:19 | text | 음성 없이 촬영 버튼으로 종이 과제 모습을 확인할 수 있습니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:34:24 | text | 버튼을 눌렀을 때 종이 과제만 가상으로 촬영하는 계약에는 음성이 없습니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:39:25 | text | 이 과제 촬영에는 현재 위치 정보가 필요하지 않습니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:40:14 | text | 촬영할 때도 현재 위치를 확인하지 않습니다. | learner-text-candidate | multiple-conditions |
| src/content/cases/photoScan.ts:41:20 | text | 위치를 거절해도 종이 과제 촬영 기능은 달라지지 않습니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:42:19 | text | 현재 위치 없이 종이 과제의 모습을 촬영하고 제출 화면에서 확인할 수 있습니다. | learner-text-candidate | abstract-or-formal, multiple-actions |
| src/content/cases/photoScan.ts:43:24 | text | 버튼으로 종이 과제를 가상 촬영한다는 계약은 현재 위치와 관계가 없습니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:48:25 | text | 이 과제 촬영에는 연락처 목록이 필요하지 않습니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:49:14 | text | 촬영 전후에 연락처 목록을 읽지 않습니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:50:20 | text | 연락처를 거절해도 종이 과제 촬영 기능은 달라지지 않습니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:51:19 | text | 연락처 목록 없이 종이 과제를 직접 제출하거나 교사가 안내한 제출 방법을 이용할 수 있습니다. | instruction | abstract-or-formal, multiple-actions |
| src/content/cases/photoScan.ts:52:24 | text | 촬영 버튼으로 종이 과제만 처리하는 계약에는 연락처 목록이 없습니다. | learner-text-candidate | — |
| src/content/cases/photoScan.ts:58:11 | text | 사진 스캔 과제함 | learner-text-candidate | repeated-text |
| src/content/cases/photoScan.ts:59:18 | text | 사용자가 촬영 버튼을 누를 때 종이 과제를 가상으로 촬영한다. | learner-text-candidate | repeated-text |
| src/content/cases/photoScan.ts:61:22 | text | 이 학습 앱은 실제로 촬영하거나 저장하지 않습니다. 가상 계약은 과제 화면에서만 처리되고 활동이 끝나면 처리가 끝납니다. | learner-text-candidate | long-or-dense |
| src/content/cases/voiceReading.ts:11:4 | text | 녹음 버튼 누르기 | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:12:4 | text | 누르는 동안 음성 처리 | learner-text-candidate | multiple-conditions |
| src/content/cases/voiceReading.ts:13:4 | text | 바로 재생 | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:14:4 | text | 즉시 삭제 | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:21:25 | text | 읽기 연습에는 화면을 보는 데 필요한 정보만 있으면 됩니다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:22:14 | text | 읽는 동안 카메라는 사용하지 않습니다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:23:20 | text | 카메라를 거절해도 음성 읽기 연습을 할 수 있습니다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:24:19 | text | 카메라 없이 글을 보고 녹음 버튼을 눌러 연습할 수 있습니다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:25:24 | text | 녹음 버튼을 누르는 동안 음성을 처리하고 바로 재생·삭제하는 계약에는 카메라가 없습니다. | learner-text-candidate | multiple-conditions |
| src/content/cases/voiceReading.ts:31:25 | text | 녹음 버튼을 누르고 있는 동안의 음성이 필요합니다. | learner-text-candidate | multiple-conditions |
| src/content/cases/voiceReading.ts:32:14 | text | 녹음 버튼을 누른 동안에만 음성을 처리하고, 재생 직후 바로 삭제합니다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:33:20 | text | 마이크를 거절하면 음성 녹음과 바로 재생 연습만 제한됩니다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:34:19 | text | 음성을 녹음하지 않고 직접 읽어 교사에게 들려주는 방법으로 연습할 수 있습니다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:35:24 | text | “녹음 버튼을 누른 동안 음성을 가상으로 녹음하고 바로 재생한 뒤 삭제한다”는 조건부 계약에만 연결됩니다. | learner-text-candidate | long-or-dense |
| src/content/cases/voiceReading.ts:40:25 | text | 음성 읽기 연습에는 현재 위치 정보가 필요하지 않습니다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:41:14 | text | 녹음 버튼을 누르거나 재생할 때도 위치를 확인하지 않습니다. | learner-text-candidate | multiple-actions, multiple-conditions |
| src/content/cases/voiceReading.ts:42:20 | text | 위치를 거절해도 음성 읽기 연습과 삭제 흐름은 달라지지 않습니다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:43:19 | text | 현재 위치 없이 글을 읽고 음성 연습을 진행할 수 있습니다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:44:24 | text | 이 연습의 계약은 누르는 동안 음성, 바로 재생, 즉시 삭제만 다룹니다. | learner-text-candidate | multiple-conditions |
| src/content/cases/voiceReading.ts:49:25 | text | 음성 읽기 연습에는 연락처 목록이 필요하지 않습니다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:50:14 | text | 연습 중 연락처 목록을 읽거나 고르지 않습니다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:51:20 | text | 연락처를 거절해도 음성 읽기 연습과 재생을 할 수 있습니다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:52:19 | text | 연락처 목록 없이 혼자 읽거나 교사에게 직접 읽어 줄 수 있습니다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:53:24 | text | 누르는 동안의 음성을 처리하고 즉시 삭제하는 계약에는 연락처가 없습니다. | learner-text-candidate | multiple-conditions |
| src/content/cases/voiceReading.ts:59:11 | text | 음성 읽기 연습 | learner-text-candidate | repeated-text |
| src/content/cases/voiceReading.ts:60:18 | text | 녹음 버튼을 누른 동안 음성을 가상으로 녹음하고 바로 재생한 뒤 삭제한다. | learner-text-candidate | — |
| src/content/cases/voiceReading.ts:62:22 | text | 실제 녹음은 하지 않습니다. 가상 계약은 재생 직후 음성을 즉시 삭제합니다. | learner-text-candidate | — |
| src/content/conditionalScenarios.ts:30:23 | text | 마이크는 녹음 버튼을 누르고 있는 동안에만 음성을 처리하고, 바로 재생한 뒤 즉시 삭제하는 경우에만 조건부입니다. | learner-text-candidate | long-or-dense, multiple-conditions |
| src/content/conditionalScenarios.ts:32:8 | text | 녹음 버튼을 누르고 있는 동안에만 음성을 처리합니다. | learner-text-candidate | multiple-conditions |
| src/content/conditionalScenarios.ts:33:8 | text | 손을 떼면 음성을 바로 재생합니다. | learner-text-candidate | — |
| src/content/conditionalScenarios.ts:34:8 | text | 재생이 끝나면 음성을 즉시 삭제합니다. | learner-text-candidate | — |
| src/content/conditionalScenarios.ts:36:24 | text | 버튼을 누르는 동안만 사용하고 바로 삭제하는 경우와 오래 저장하는 경우는 사용 시점과 저장 기간이 어떻게 다른가요? | learner-text-candidate | long-or-dense, multiple-conditions |
| src/content/conditionalScenarios.ts:43:23 | text | 기본 저장 지도는 권한 없이 사용할 수 있고, 학습자가 현재 위치 보기 스위치를 직접 켠 경우에만 위치가 조건부로 바뀝니다. | learner-text-candidate | long-or-dense |
| src/content/conditionalScenarios.ts:45:8 | text | 기본 저장 지도는 스위치를 끈 상태에서 위치 권한 없이 사용할 수 있습니다. | learner-text-candidate | — |
| src/content/conditionalScenarios.ts:46:8 | text | 현재 위치 보기는 학습자가 명시적으로 스위치를 켠 때만 사용합니다. | learner-text-candidate | — |
| src/content/conditionalScenarios.ts:47:8 | text | 현재 위치 사용은 켜진 학습 기능에 필요한 동안으로 제한합니다. | learner-text-candidate | — |
| src/content/conditionalScenarios.ts:49:24 | text | 현재 위치 보기 스위치를 껐을 때와 켰을 때, 저장된 지도와 현재 위치 권한의 조건은 어떻게 달라지나요? | learner-text-candidate | multiple-conditions |
| src/content/learningNotices.test.ts:25:42 | text | 실제 권한을 묻지 않는 가상 학습 모델입니다. 개인정보를 입력하지 마세요. 저장은 직접 선택합니다. | input | abstract-or-formal, multiple-actions, repeated-text |
| src/content/learningNotices.test.ts:27:47 | text | 저장 동의 | learner-text-candidate | — |
| src/content/learningNotices.test.ts:28:47 | text | 근거 원문 | learner-text-candidate | — |
| src/content/learningNotices.test.ts:29:47 | text | 이 기기 | learner-text-candidate | — |
| src/content/learningNotices.test.ts:30:47 | text | 가상 별명과 실제 개인정보는 수집하지 않습니다 | learner-text-candidate | — |
| src/content/learningNotices.test.ts:43:46 | text | 가상 학습 모델이며 실제 앱 판정이 아님 | learner-text-candidate | repeated-text |
| src/content/learningNotices.test.ts:47:46 | text | 실제 기기 권한을 요청하지 않는 가상 실습 | learner-text-candidate | — |
| src/content/learningNotices.test.ts:48:46 | text | 입력한 별명은 임시 | input | abstract-or-formal |
| src/content/learningNotices.test.ts:49:46 | text | 저장하거나 전송하지 않습니다 | learner-text-candidate | — |
| src/content/learningNotices.test.ts:51:46 | text | 필요한 순간에 최소한으로 허용 | learner-text-candidate | — |
| src/content/learningNotices.test.ts:52:46 | text | 나중에 철회할 수 있습니다 | learner-text-candidate | — |
| src/content/learningNotices.test.ts:53:46 | text | 이 기기에 저장을 선택하면 권한 판단과 근거 원문은 로컬 학습 기록에 보관될 수 있지만 | learner-text-candidate | multiple-actions |
| src/content/learningNotices.test.ts:54:46 | text | 가상 별명과 실제 개인정보는 수집·저장하지 않습니다 | learner-text-candidate | — |
| src/content/learningNotices.test.ts:58:55 | text | 햇살 | learner-text-candidate | repeated-text |
| src/content/learningNotices.test.ts:58:61 | text | 새싹 | learner-text-candidate | repeated-text |
| src/content/learningNotices.test.ts:58:67 | text | 푸른별 | learner-text-candidate | repeated-text |
| src/content/learningNotices.test.ts:64:7 | text | explains platform variation and points to official guidance | learner-text-candidate | long-or-dense, missing-term-explanation, technical-or-internal |
| src/content/learningNotices.test.ts:65:45 | text | 기기와 운영체제에 따라 다를 수 있음 | learner-text-candidate | repeated-text |
| src/content/learningNotices.test.ts:67:45 | text | 실제 앱의 안전성을 판정하는 보안 도구가 아님 | learner-text-candidate | repeated-text |
| src/content/learningNotices.test.ts:72:44 | text | 교사나 보호자에게 도움을 요청 | hint | repeated-text |
| src/content/learningNotices.test.ts:78:8 | text | 데이터 정제 | learner-text-candidate | — |
| src/content/learningNotices.test.ts:79:8 | text | 미디어 사용 시간 진단 | learner-text-candidate | — |
| src/content/learningNotices.test.ts:80:8 | text | 실제 보안 검사 | learner-text-candidate | — |
| src/content/learningNotices.test.ts:81:8 | text | 실제 앱 추천 | learner-text-candidate | — |
| src/content/learningNotices.test.ts:82:8 | text | 실제 앱 차단 | learner-text-candidate | — |
| src/content/learningNotices.test.ts:117:40 | text | heading | heading | repeated-text |
| src/content/learningNotices.test.ts:117:59 | text | 학습 범위와 안전 | heading | repeated-text |
| src/content/learningNotices.test.ts:119:30 | text | 실제 권한 없음 · 개인정보 입력 금지 · 저장은 직접 선택합니다. | input | abstract-or-formal, multiple-actions, repeated-text |
| src/content/learningNotices.test.ts:121:61 | text | 가상 학습 모델이며 실제 앱 판정이 아님 | learner-text-candidate | repeated-text |
| src/content/learningNotices.test.ts:124:45 | text | 학습 범위와 안전 더 보기 | learner-text-candidate | repeated-text |
| src/content/learningNotices.test.ts:130:46 | text | 교사용 안내 | instruction | repeated-text |
| src/content/learningNotices.test.ts:137:36 | text | 교사나 보호자에게 도움을 요청 | hint | repeated-text |
| src/content/learningNotices.test.ts:138:36 | text | 기기와 운영체제에 따라 다를 수 있음 | learner-text-candidate | repeated-text |
| src/content/learningNotices.test.ts:139:36 | text | 공식 안내 | instruction | — |
| src/content/learningNotices.test.ts:140:36 | text | 실제 앱의 안전성을 판정하는 보안 도구가 아님 | learner-text-candidate | repeated-text |
| src/content/learningNotices.ts:2:4 | text | 실제 기기 권한을 요청하지 않는 가상 실습입니다. 입력한 별명은 임시로만 사용하며 저장하거나 전송하지 않습니다. 이름·전화번호·주소 등 개인정보 입력 금지 원칙을 지키며 개인정보는 입력하지 않습니다. 권한은 필요한 순간에 최소한으로 허용하고 나중에 철회할 수 있습니다. | input | abstract-or-formal, long-or-dense, multiple-actions |
| src/content/learningNotices.ts:5:4 | text | 실제 권한을 묻지 않는 가상 학습 모델입니다. 개인정보를 입력하지 마세요. 저장은 직접 선택합니다. | input | abstract-or-formal, multiple-actions, repeated-text |
| src/content/learningNotices.ts:8:4 | text | 저장 동의를 켜면 권한 선택과 근거 원문이 이 기기에 남을 수 있습니다. 가상 별명과 실제 개인정보는 수집하지 않습니다. 이 연습은 실제 앱의 안전성을 판정하지 않습니다. | learner-text-candidate | long-or-dense |
| src/content/learningNotices.ts:11:4 | text | 이 활동은 가상 학습 모델이며 실제 앱 판정이 아님을 알려 드립니다. ${COMMON_LEARNING_SAFETY_CONTRACT} 이 기기에 저장을 선택하면 권한 판단과 근거 원문은 로컬 학습 기록에 보관될 수 있지만, 가상 별명과 실제 개인정보는 수집·저장하지 않습니다. 사례의 계약을 읽고 이유를 비교해 보세요. | learner-text-candidate | long-or-dense, multiple-actions |
| src/content/learningNotices.ts:14:4 | text | 권한 화면과 표현은 기기와 운영체제에 따라 다를 수 있음에 유의하세요. 실제 사용 전에는 해당 기기의 공식 안내를 확인해 주세요. 이 활동은 실제 앱의 안전성을 판정하는 보안 도구가 아님을 기억하세요. | instruction | ambiguous-reference, long-or-dense |
| src/content/learningNotices.ts:17:4 | text | 권한 선택이 어렵거나 궁금한 점이 있으면 교사나 보호자에게 도움을 요청하세요. 함께 계약을 다시 읽어 보면 됩니다. | hint | long-or-dense |
| src/content/learningNotices.ts:20:4 | text | 이 활동은 데이터 정제, 미디어 사용 시간 진단, 실제 보안 검사, 실제 앱 추천, 실제 앱 차단을 다루지 않습니다. 실제 앱의 안전성을 판정하는 보안 도구가 아님을 기억하며 학습용 계약 비교만 연습합니다. | learner-text-candidate | long-or-dense |
| src/content/permissions.test.ts:26:7 | text | provides elementary Korean labels and non-empty descriptions | learner-text-candidate | long-or-dense, missing-term-explanation, technical-or-internal |
| src/content/permissions.test.ts:27:30 | text | 카메라 | learner-text-candidate | repeated-text |
| src/content/permissions.test.ts:27:37 | text | 마이크 | learner-text-candidate | repeated-text |
| src/content/permissions.test.ts:27:44 | text | 위치 | learner-text-candidate | repeated-text |
| src/content/permissions.test.ts:27:50 | text | 연락처 | learner-text-candidate | repeated-text |
| src/content/permissions.test.ts:40:74 | text | 목소리를 녹음하는 기능입니다. | learner-text-candidate | repeated-text |
| src/content/permissions.test.ts:43:7 | text | uses a unique shape label and the exact glyph mapping for every permission | learner-text-candidate | long-or-dense |
| src/content/permissions.test.ts:67:21 | text | Unknown permission: not-a-permission | feedback-or-error | — |
| src/content/permissions.test.ts:74:60 | text | 변경된 이름 | learner-text-candidate | — |
| src/content/permissions.test.ts:83:32 | text | 카메라 | learner-text-candidate | repeated-text |
| src/content/permissions.test.ts:84:37 | text | camera | learner-text-candidate | — |
| src/content/permissions.test.ts:84:59 | text | 카메라 | learner-text-candidate | repeated-text |
| src/content/permissions.ts:9:13 | text | 카메라 | learner-text-candidate | repeated-text |
| src/content/permissions.ts:10:24 | text | 사진을 찍는 기능입니다. | learner-text-candidate | — |
| src/content/permissions.ts:11:25 | text | 사진을 찍어 앱 안에서 살펴볼 때 카메라를 사용합니다. | learner-text-candidate | multiple-conditions |
| src/content/permissions.ts:12:18 | text | 카메라 테두리 | learner-text-candidate | — |
| src/content/permissions.ts:17:13 | text | 마이크 | learner-text-candidate | repeated-text |
| src/content/permissions.ts:18:24 | text | 목소리를 녹음하는 기능입니다. | learner-text-candidate | repeated-text |
| src/content/permissions.ts:19:25 | text | 목소리를 녹음하거나 소리를 들려줄 때 마이크를 사용합니다. | learner-text-candidate | — |
| src/content/permissions.ts:20:18 | text | 소리 물결 | learner-text-candidate | — |
| src/content/permissions.ts:25:13 | text | 위치 | learner-text-candidate | repeated-text |
| src/content/permissions.ts:26:24 | text | 내가 있는 곳을 알려주는 기능입니다. | learner-text-candidate | — |
| src/content/permissions.ts:27:25 | text | 지도에서 현재 있는 곳을 표시할 때 위치를 사용합니다. | learner-text-candidate | — |
| src/content/permissions.ts:28:18 | text | 지도 위치표시 | learner-text-candidate | — |
| src/content/permissions.ts:33:13 | text | 연락처 | learner-text-candidate | repeated-text |
| src/content/permissions.ts:34:24 | text | 친구와 가족의 연락처를 보는 기능입니다. | learner-text-candidate | — |
| src/content/permissions.ts:35:25 | text | 사람을 초대하거나 연락처를 고를 때 연락처를 사용합니다. | learner-text-candidate | — |
| src/content/permissions.ts:36:18 | text | 사람 카드 | learner-text-candidate | — |
| src/content/permissions.ts:47:22 | text | Unknown permission: ${id} | feedback-or-error | technical-or-internal |
| src/content/updateHistory.test.ts:10:38 | text | { expect(entry.date).toMatch(ISO_DATE) expect(Number.isNaN(Date.parse(entry.date))).toBe(false) expect(['설계', '개발', '개선', '콘텐츠 검수']).toContain(entry.category) expect(entry.summary.trim()).not.toBe('') expect(entry.reason.trim()).not.toBe('') }) for (let index = 1; index | learner-text-candidate | long-or-dense |
| src/content/updateHistory.test.ts:13:16 | text | 설계 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:13:22 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:13:28 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:13:34 | text | 콘텐츠 검수 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:25:63 | text | 설계 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:25:69 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:25:75 | text | 콘텐츠 검수 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:25:85 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:25:91 | text | 콘텐츠 검수 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:25:101 | text | 콘텐츠 검수 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:31:18 | text | 설계 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:32:17 | text | 최초 설계 문서 작성 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:36:18 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:37:17 | text | 4개 사례 MVP 학습 흐름 구현 | learner-text-candidate | repeated-text, technical-or-internal |
| src/content/updateHistory.test.ts:41:18 | text | 콘텐츠 검수 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:42:17 | text | 가상 권한 모델과 사례 표현 검토 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:43:16 | text | 실제 앱이나 운영체제에 그대로 일반화하지 않도록 경계를 명시함 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:47:18 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:48:17 | text | 핵심 버튼 강조와 모션 감소 대체 추가 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:49:16 | text | 중요한 다음 행동을 분명히 하면서 모션 감소 사용자는 고정 강조로 확인하도록 함 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:53:18 | text | 콘텐츠 검수 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:54:17 | text | 개인정보 및 가상 모델 안내 검증 | instruction | abstract-or-formal, repeated-text |
| src/content/updateHistory.test.ts:55:16 | text | 실제 개인정보를 수집하지 않도록 입력 금지 원칙을 안내하고, 저장 동의 시 권한 판단과 근거 원문이 이 기기에 보관될 수 있음을 구분함 | input, instruction | abstract-or-formal, long-or-dense, repeated-text |
| src/content/updateHistory.test.ts:59:18 | text | 콘텐츠 검수 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:60:17 | text | 저장 동의 범위 안내 보강 | instruction | repeated-text |
| src/content/updateHistory.test.ts:61:16 | text | 가상 별명과 실제 개인정보는 수집·저장하지 않지만 저장 동의 시 권한 판단과 근거 원문은 로컬 학습 기록에 보관될 수 있음을 구분함 | learner-text-candidate | long-or-dense, repeated-text |
| src/content/updateHistory.test.ts:68:18 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:69:17 | text | 모바일·키보드·구조적 보조기술 대응 보강 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:70:16 | text | 375px와 키보드 흐름, 자동 접근성 구조를 보강함; VoiceOver·TalkBack 수동 검증은 실행하지 않음 | learner-text-candidate | abstract-or-formal, long-or-dense, repeated-text |
| src/content/updateHistory.test.ts:77:18 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:78:17 | text | 초등 학습자 첫 행동과 키보드 순서 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:79:16 | text | 헤더 중복 상세를 줄이고 사례를 고른 뒤 다음 버튼으로 포커스를 옮겼으며, 320px·375px 모바일 시작 화면의 세로 간격을 다듬음; 자동 키보드·모바일·모션 감소 흐름은 확인했지만 실제 학생 세션과 VoiceOver·TalkBack 수동 실행은 포함하지 않음 | learner-text-candidate | long-or-dense, repeated-text |
| src/content/updateHistory.test.ts:81:54 | text | 스크린 리더 검증 완료 | learner-text-candidate | abstract-or-formal, repeated-text |
| src/content/updateHistory.test.ts:82:53 | text | 스크린 리더 검증 완료 | learner-text-candidate | abstract-or-formal, repeated-text |
| src/content/updateHistory.test.ts:85:18 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:86:17 | text | 첫 행동·단계 안내·결과 다음 행동 정리 | instruction | repeated-text |
| src/content/updateHistory.test.ts:87:16 | text | 사례 선택을 앞에 배치하고 단계 제목 포커스·스크롤, 조건 안내, 결과 다음 행동을 보강함; 자동 키보드·모바일 구조 검증을 기록하고 VoiceOver·TalkBack 수동 실행은 포함하지 않음 | instruction | abstract-or-formal, long-or-dense, multiple-actions, repeated-text |
| src/content/updateHistory.test.ts:89:54 | text | 스크린 리더 검증 완료 | learner-text-candidate | abstract-or-formal, repeated-text |
| src/content/updateHistory.test.ts:90:53 | text | 스크린 리더 검증 완료 | learner-text-candidate | abstract-or-formal, repeated-text |
| src/content/updateHistory.test.ts:96:18 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:97:17 | text | 네 사례 완료 요약과 판단 변화 증거 표시 | learner-text-candidate | repeated-text |
| src/content/updateHistory.test.ts:98:16 | text | 학생이 최초안과 수정안의 차이를 한눈에 확인하도록 함 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:1:38 | text | 설계 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:1:45 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:1:52 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:1:59 | text | 콘텐츠 검수 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:13:16 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:14:15 | text | 초등 학습자 첫 행동과 키보드 순서 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:15:14 | text | 헤더 중복 상세를 줄이고 사례를 고른 뒤 다음 버튼으로 포커스를 옮겼으며, 320px·375px 모바일 시작 화면의 세로 간격을 다듬음; 자동 키보드·모바일·모션 감소 흐름은 확인했지만 실제 학생 세션과 VoiceOver·TalkBack 수동 실행은 포함하지 않음 | learner-text-candidate | long-or-dense, repeated-text |
| src/content/updateHistory.ts:19:16 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:20:15 | text | 첫 행동·단계 안내·결과 다음 행동 정리 | instruction | repeated-text |
| src/content/updateHistory.ts:21:14 | text | 사례 선택을 앞에 배치하고 단계 제목 포커스·스크롤, 조건 안내, 결과 다음 행동을 보강함; 자동 키보드·모바일 구조 검증을 기록하고 VoiceOver·TalkBack 수동 실행은 포함하지 않음 | instruction | abstract-or-formal, long-or-dense, multiple-actions, repeated-text |
| src/content/updateHistory.ts:25:16 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:26:15 | text | 모바일·키보드·보조기술 대응 구조와 저장 경계 보강 | learner-text-candidate | — |
| src/content/updateHistory.ts:27:14 | text | 320px·375px 모바일 카드, 키보드 단계 포커스, 모션 감소 대체와 저장 동의(opt-in) 경계를 보강하고 자동 의미 구조를 확인함; VoiceOver·TalkBack 수동 실행 결과는 포함하지 않음 | learner-text-candidate | long-or-dense |
| src/content/updateHistory.ts:31:16 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:32:15 | text | 조건부 기능 스위치 재확인 흐름 보강 | learner-text-candidate | — |
| src/content/updateHistory.ts:33:14 | text | 스위치를 끄면 조건 확인을 다시 하도록 하여 수정 권한안이 실제 비교 결과와 일치하게 함 | learner-text-candidate | multiple-actions |
| src/content/updateHistory.ts:37:16 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:38:15 | text | 사례 완료 기록의 의미적 검증 보강 | learner-text-candidate | abstract-or-formal |
| src/content/updateHistory.ts:39:14 | text | 완료 표시만 위조한 저장 기록이 영향 확인과 조건 비교를 건너뛰지 못하게 함 | learner-text-candidate | multiple-actions |
| src/content/updateHistory.ts:43:16 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:44:15 | text | 네 사례 완료 요약과 판단 변화 증거 표시 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:45:14 | text | 학생이 최초안과 수정안의 차이를 한눈에 확인하도록 함 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:49:16 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:50:15 | text | 모바일·키보드·구조적 보조기술 대응 보강 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:51:14 | text | 375px와 키보드 흐름, 자동 접근성 구조를 보강함; VoiceOver·TalkBack 수동 검증은 실행하지 않음 | learner-text-candidate | abstract-or-formal, long-or-dense, repeated-text |
| src/content/updateHistory.ts:55:16 | text | 설계 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:56:15 | text | 최초 설계 문서 작성 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:57:14 | text | 가상 권한 모델과 초등 학습 흐름의 범위를 정의함 | learner-text-candidate | — |
| src/content/updateHistory.ts:61:16 | text | 개발 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:62:15 | text | 4개 사례 MVP 학습 흐름 구현 | learner-text-candidate | repeated-text, technical-or-internal |
| src/content/updateHistory.ts:63:14 | text | 네 가지 가상 사례에서 권한 선택, 영향 확인, 근거 작성과 철회 연습을 연결함 | learner-text-candidate | multiple-actions |
| src/content/updateHistory.ts:67:16 | text | 콘텐츠 검수 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:68:15 | text | 가상 권한 모델과 사례 표현 검토 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:69:14 | text | 실제 앱이나 운영체제에 그대로 일반화하지 않도록 경계를 명시함 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:73:16 | text | 개선 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:74:15 | text | 핵심 버튼 강조와 모션 감소 대체 추가 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:75:14 | text | 중요한 다음 행동을 분명히 하면서 모션 감소 사용자는 고정 강조로 확인하도록 함 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:79:16 | text | 콘텐츠 검수 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:80:15 | text | 개인정보 및 가상 모델 안내 검증 | instruction | abstract-or-formal, repeated-text |
| src/content/updateHistory.ts:81:14 | text | 실제 개인정보를 수집하지 않도록 입력 금지 원칙을 안내하고, 저장 동의 시 권한 판단과 근거 원문이 이 기기에 보관될 수 있음을 구분함 | input, instruction | abstract-or-formal, long-or-dense, repeated-text |
| src/content/updateHistory.ts:85:16 | text | 콘텐츠 검수 | learner-text-candidate | repeated-text |
| src/content/updateHistory.ts:86:15 | text | 저장 동의 범위 안내 보강 | instruction | repeated-text |
| src/content/updateHistory.ts:87:14 | text | 가상 별명과 실제 개인정보는 수집·저장하지 않지만 저장 동의 시 권한 판단과 근거 원문은 로컬 학습 기록에 보관될 수 있음을 구분함 | learner-text-candidate | long-or-dense, repeated-text |
| src/domain/buildFunctionImpacts.test.ts:17:62 | text | 종이 과제를 직접 제출하거나 교사가 안내한 제출 방법을 이용할 수 있습니다. | instruction | abstract-or-formal, multiple-actions, repeated-text |
| src/domain/buildFunctionImpacts.test.ts:17:128 | text | 촬영 기능만 사용할 수 없습니다. 다른 학습 설명은 계속 볼 수 있습니다. | instruction | repeated-text |
| src/domain/buildFunctionImpacts.test.ts:23:60 | text | 사용자가 촬영 버튼을 누를 때 종이 과제를 가상으로 촬영한다. | learner-text-candidate | repeated-text |
| src/domain/buildFunctionImpacts.test.ts:65:66 | text | location | learner-text-candidate | repeated-text |
| src/domain/buildFunctionImpacts.test.ts:65:212 | text | conditional | learner-text-candidate | — |
| src/domain/buildFunctionImpacts.test.ts:71:61 | text | location | learner-text-candidate | repeated-text |
| src/domain/buildFunctionImpacts.ts:12:52 | text | 학습용 내 위치 표시 | learner-text-candidate | repeated-text |
| src/domain/buildReport.test.ts:29:23 | text | ${caseId}에서 필요한 권한만 골랐습니다. | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| src/domain/buildReport.test.ts:106:78 | text | 전혀 다른 설명을 적었습니다. | learner-text-candidate | repeated-text |
| src/domain/buildReport.test.ts:112:55 | text | 전혀 다른 설명을 적었습니다. | learner-text-candidate | repeated-text |
| src/domain/buildReport.test.ts:134:7 | text | fails closed for %s | learner-text-candidate | — |
| src/domain/buildReport.ts:40:21 | text | 보고서를 만들 수 없습니다 (${caseId}): ${message} | feedback-or-error | technical-or-internal |
| src/domain/buildReport.ts:45:32 | text | ${recordName} 네 권한 기록이 완전하지 않습니다. | feedback-or-error | — |
| src/domain/buildReport.ts:47:60 | text | { const raw = value[permissionId] if (!isRecord(raw) \|\| !hasExactKeys(raw, ['permissionId', 'choice']) \|\| raw.permissionId !== permissionId \|\| !isLearnerChoice(raw.choice)) { throw reportError(caseId, `${recordName} 권한 기록이 올바르지 않습니다.`) } return freezeDecision({ permissionId, choice: raw.choice }) })) } export function buildRubricEvidence(reasonTags: readonly ReasonTagId[]): Readonly | feedback-or-error | long-or-dense, technical-or-internal |
| src/domain/buildReport.ts:50:34 | text | ${recordName} 권한 기록이 올바르지 않습니다. | feedback-or-error | — |
| src/domain/buildReport.ts:63:32 | text | 판단 근거 태그는 중복 없이 하나 이상 필요합니다. | feedback-or-error | — |
| src/domain/buildReport.ts:71:24 | text | 공통 | feedback-or-error | repeated-text |
| src/domain/buildReport.ts:71:30 | text | 권한 철회 기록이 네 권한 모두에 대해 필요합니다. | feedback-or-error | — |
| src/domain/buildReport.ts:76:26 | text | 공통 | feedback-or-error | repeated-text |
| src/domain/buildReport.ts:76:32 | text | 권한 철회 기록이 올바르지 않습니다. | feedback-or-error | — |
| src/domain/buildReport.ts:84:77 | text | 의미 있는 사례 완료 기록이 필요합니다. | feedback-or-error | — |
| src/domain/buildReport.ts:85:69 | text | 최초 | learner-text-candidate | — |
| src/domain/buildReport.ts:86:69 | text | 수정 | learner-text-candidate | — |
| src/domain/buildReport.ts:87:42 | text | string | feedback-or-error | — |
| src/domain/buildReport.ts:87:124 | text | 수정 이유 기록이 없습니다. | feedback-or-error | — |
| src/domain/buildReport.ts:88:35 | text | alternative | feedback-or-error | repeated-text |
| src/domain/buildReport.ts:88:79 | text | revoke | feedback-or-error | repeated-text |
| src/domain/buildReport.ts:88:115 | text | 대안 또는 철회 행동 기록이 필요합니다. | feedback-or-error | multiple-conditions |
| src/domain/buildReport.ts:104:35 | text | object | feedback-or-error | — |
| src/domain/buildReport.ts:104:63 | text | 전체 | feedback-or-error | — |
| src/domain/buildReport.ts:104:69 | text | 학습 상태가 없습니다. | feedback-or-error | — |
| src/domain/buildReport.ts:105:62 | text | 공통 | feedback-or-error | repeated-text |
| src/domain/buildReport.ts:105:68 | text | 권한 철회 활동을 완료해야 합니다. | feedback-or-error | — |
| src/domain/buildReport.ts:108:61 | text | 공통 | feedback-or-error | repeated-text |
| src/domain/buildReport.ts:108:67 | text | 하나 이상의 권한을 철회해야 합니다. | feedback-or-error | — |
| src/domain/judgePermission.test.ts:44:7 | text | uses neutral information language and does not label a choice as an error | feedback-or-error | long-or-dense |
| src/domain/judgePermission.ts:35:20 | text | Unsupported conditional scenario: ${String(value)} | feedback-or-error | long-or-dense |
| src/domain/judgePermission.ts:65:8 | text | 기능 계약과 권한이 필요한 시점, 보관 범위를 자세히 확인해 보세요. | learner-text-candidate | — |
| src/domain/judgePermission.ts:75:10 | text | 현재 기능 계약에 필요한 권한으로, 기능을 계속 사용할 수 있습니다. | learner-text-candidate | — |
| src/domain/judgePermission.ts:83:8 | text | 권한을 거부하면 해당 기능이 제한될 수 있으므로 대안을 함께 검토합니다. | learner-text-candidate | ambiguous-reference |
| src/domain/judgePermission.ts:93:10 | text | 현재 기능에 필요하지 않은 권한을 거부했으며, 기능을 계속 사용할 수 있습니다. | learner-text-candidate | — |
| src/domain/judgePermission.ts:101:8 | text | 현재 기능 계약에 없는 정보이므로, 최소 정보로 가능한 대안을 검토합니다. | learner-text-candidate | — |
| src/domain/judgePermission.ts:109:6 | text | 조건부 권한은 사용 시점·보관·기능 켜기 계약을 비교해 확인합니다. | learner-text-candidate | multiple-actions |
| src/domain/judgePermission.ts:137:16 | text | 조건부 계약의 사용 시점과 보관 범위를 확인했습니다. 선택한 기능 계약을 계속 살펴봅니다. | feedback-or-error | multiple-actions |
| src/domain/model.ts:86:73 | text | saveOnDevice: boolean statusMessage: string } export interface JudgmentResult { permissionId: PermissionId verdict: ContractVerdict alignment: 'supported' \| 'review-contract' \| 'needs-information' feedback: string contractEvidence: string denialImpact: string alternative: string nextAction: 'continue' \| 'open-details' \| 'compare-condition' } export interface RevocationDecision { permissionId: PermissionId action: 'keep-current-feature' \| 'revoke-now' } export interface ReportCaseResult { caseId: CaseId initial: readonly PermissionDecision[] revised: readonly PermissionDecision[] changedPermissionIds: readonly PermissionId[] reasonTags: readonly ReasonTagId[] rationaleText: string rubricEvidence: Readonly | feedback-or-error | long-or-dense, technical-or-internal |
| src/features/impact/ConditionalScenarioCard.tsx:12:73 | text | void } export default function ConditionalScenarioCard({ scenario, switchEnabled, acknowledged, onSwitchChange, onAcknowledge, }: ConditionalScenarioCardProps): ReactElement { const hintId = `${useId()}-condition-hint` const hasSwitch = scenario.featureSwitchId !== undefined const switchLabel = `${MAP_CURRENT_POSITION_FEATURE_LABEL} 기능 켜기` return ( | hint | long-or-dense, technical-or-internal |
| src/features/impact/ConditionalScenarioCard.tsx:24:24 | text | ${MAP_CURRENT_POSITION_FEATURE_LABEL} 기능 켜기 | learner-text-candidate | — |
| src/features/impact/ConditionalScenarioCard.tsx:28:42 | text | {hasSwitch && scenario.featureSwitchId ? ( | heading | technical-or-internal |
| src/features/impact/ConditionalScenarioCard.tsx:39:14 | text | 마이크는 실제 녹음 없이 누르는 동안만 처리하는 가상 조건입니다. | learner-text-candidate | multiple-conditions |
| src/features/impact/ConditionalScenarioCard.tsx:49:8 | text | {acknowledged ? '비교 확인 완료' : '비교 확인'} | button-or-action | multiple-actions |
| src/features/impact/ConditionalScenarioCard.tsx:50:26 | text | 비교 확인 완료 | learner-text-candidate | repeated-text |
| src/features/impact/ConditionalScenarioCard.tsx:50:39 | text | 비교 확인 | learner-text-candidate | repeated-text |
| src/features/impact/ConditionalScenarioCard.tsx:51:16 | text | {hasSwitch && !switchEnabled && | button-or-action, hint | — |
| src/features/impact/ConditionalScenarioCard.tsx:52:66 | text | 먼저 학습용 기능 스위치를 켜면 비교할 수 있습니다. | hint | — |
| src/features/impact/FunctionImpactList.tsx:11:64 | text | = { required: '필수', unnecessary: '불필요', conditional: '조건부', } const CHOICE_LABELS: Readonly | learner-text-candidate | long-or-dense |
| src/features/impact/FunctionImpactList.tsx:12:14 | text | 필수 | learner-text-candidate | — |
| src/features/impact/FunctionImpactList.tsx:13:17 | text | 불필요 | learner-text-candidate | — |
| src/features/impact/FunctionImpactList.tsx:14:17 | text | 조건부 | learner-text-candidate | — |
| src/features/impact/FunctionImpactList.tsx:17:61 | text | = { 'allow-current-feature': '이번 기능에만 허용', deny: '허용하지 않음', 'more-info': '설명을 더 확인', } function FunctionList({ title, items }: { title: string; items: readonly string[] }): ReactElement { return ( | learner-text-candidate | long-or-dense |
| src/features/impact/FunctionImpactList.tsx:18:29 | text | 이번 기능에만 허용 | learner-text-candidate | repeated-text |
| src/features/impact/FunctionImpactList.tsx:19:10 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| src/features/impact/FunctionImpactList.tsx:20:17 | text | 설명을 더 확인 | learner-text-candidate | repeated-text |
| src/features/impact/FunctionImpactList.tsx:27:91 | text | 없음 | learner-text-candidate | — |
| src/features/impact/FunctionImpactList.tsx:28:15 | text | ) } export default function FunctionImpactList({ impacts }: FunctionImpactListProps): ReactElement { return ( | learner-text-candidate | long-or-dense |
| src/features/impact/FunctionImpactList.tsx:34:31 | text | function-impact-list-title | learner-text-candidate | — |
| src/features/impact/FunctionImpactList.tsx:35:43 | text | 권한별 기능 영향 | heading | — |
| src/features/impact/FunctionImpactList.tsx:35:57 | text | {impacts.length === 0 ? | heading | — |
| src/features/impact/FunctionImpactList.tsx:36:34 | text | 아직 확인할 권한 선택이 없습니다. | learner-text-candidate | multiple-actions |
| src/features/impact/FunctionImpactList.tsx:40:17 | text | {permission.label} · {VERDICT_LABELS[impact.judgment.verdict]} | heading | long-or-dense |
| src/features/impact/FunctionImpactList.tsx:41:16 | text | 선택: {CHOICE_LABELS[impact.choice]} | learner-text-candidate | — |
| src/features/impact/FunctionImpactList.tsx:42:34 | title | 사용 가능한 기능 | title | repeated-text |
| src/features/impact/FunctionImpactList.tsx:43:34 | title | 제한되는 기능 | title | repeated-text |
| src/features/impact/FunctionImpactList.tsx:45:19 | text | 판정 피드백 | heading | — |
| src/features/impact/FunctionImpactList.tsx:47:19 | text | 판정 근거 | heading | repeated-text |
| src/features/impact/FunctionImpactList.tsx:49:19 | text | 대안 | heading | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:80:46 | text | button | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:80:64 | text | 최소 권한안 수정 | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:84:37 | text | 조건부 비교 0/1 | hint | — |
| src/features/impact/ImpactScreen.test.tsx:85:45 | text | aria-describedby | hint | missing-term-explanation, technical-or-internal |
| src/features/impact/ImpactScreen.test.tsx:89:187 | text | 기능 스위치를 켠 뒤 | learner-text-candidate | — |
| src/features/impact/ImpactScreen.test.tsx:90:187 | text | 대안 사용 또는 권한 철회 | learner-text-candidate | — |
| src/features/impact/ImpactScreen.test.tsx:91:196 | text | 준비되었습니다 | learner-text-candidate | — |
| src/features/impact/ImpactScreen.test.tsx:94:7 | text | shows available, limited, neutral feedback, evidence, and alternatives | feedback-or-error | long-or-dense, missing-term-explanation, technical-or-internal |
| src/features/impact/ImpactScreen.test.tsx:96:30 | text | heading | heading | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:96:59 | text | 기능 영향 시뮬레이션 | heading | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:98:30 | text | 사용 가능한 기능 | learner-text-candidate | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:99:30 | text | 제한되는 기능 | learner-text-candidate | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:100:33 | text | 판정 근거 | learner-text-candidate | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:101:33 | text | 대안 | learner-text-candidate | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:109:65 | text | 학습용 내 위치 표시 기능 켜기 | learner-text-candidate | — |
| src/features/impact/ImpactScreen.test.tsx:111:30 | text | heading | heading | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:112:30 | text | button | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:112:48 | text | 비교 확인 | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:115:30 | text | heading | heading | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:116:30 | text | 학습용 내 위치 표시 | learner-text-candidate | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:117:65 | text | 스위치를 켰습니다 | learner-text-candidate | — |
| src/features/impact/ImpactScreen.test.tsx:118:39 | text | button | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:118:57 | text | 비교 확인 | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:121:30 | text | button | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:121:48 | text | 비교 확인 완료 | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:122:65 | text | 조건 비교를 확인했습니다 | learner-text-candidate | — |
| src/features/impact/ImpactScreen.test.tsx:123:46 | text | button | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:123:64 | text | 최소 권한안 수정 | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:125:45 | text | gi-pulse | learner-text-candidate | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:126:57 | text | 대안 사용 | learner-text-candidate | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:128:41 | text | gi-pulse | learner-text-candidate | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:129:33 | text | button | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:129:88 | text | gi-pulse | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:135:39 | text | button | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:135:57 | text | 비교 확인 | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:138:30 | text | button | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:138:48 | text | 비교 확인 완료 | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:156:39 | text | button | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:156:57 | text | 비교 확인 | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:159:30 | text | button | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:159:48 | text | 최소 권한안 수정 | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:160:57 | text | 대안 사용 | learner-text-candidate | repeated-text |
| src/features/impact/ImpactScreen.test.tsx:173:32 | text | button | button-or-action | repeated-text |
| src/features/impact/ImpactScreen.tsx:60:33 | text | 학습용 기능 스위치를 켰습니다. 권한 조건을 다시 비교합니다. | learner-text-candidate | — |
| src/features/impact/ImpactScreen.tsx:60:72 | text | 학습용 기능 스위치를 껐습니다. 기본 기능의 권한 조건을 확인합니다. | learner-text-candidate | — |
| src/features/impact/ImpactScreen.tsx:66:23 | text | 조건 비교를 확인했습니다. 수정 권한안을 준비할 수 있습니다. | learner-text-candidate | multiple-actions |
| src/features/impact/ImpactScreen.tsx:69:74 | text | { onControlActionChange(appCase.id, action) setStatusMessage(`${action === 'alternative' ? '대안 사용' : '권한 철회'} 방향을 골랐습니다. 조건 비교를 모두 확인하면 다음 단계로 갈 수 있습니다.`) } return ( | learner-text-candidate | long-or-dense, multiple-actions, technical-or-internal |
| src/features/impact/ImpactScreen.tsx:71:23 | text | ${action === 'alternative' ? '대안 사용' : '권한 철회'} 방향을 골랐습니다. 조건 비교를 모두 확인하면 다음 단계로 갈 수 있습니다. | learner-text-candidate | long-or-dense, multiple-actions |
| src/features/impact/ImpactScreen.tsx:76:57 | text | 기능 영향 시뮬레이션 | heading | repeated-text |
| src/features/impact/ImpactScreen.tsx:77:10 | text | {appCase.title}: 선택한 권한이 기능에 미치는 영향을 살펴봅니다. | learner-text-candidate | multiple-actions |
| src/features/impact/ImpactScreen.tsx:78:10 | text | 이 화면은 실제 권한을 요청하지 않는 가상 학습 모델 비교입니다. | learner-text-candidate | — |
| src/features/impact/ImpactScreen.tsx:82:35 | text | conditional-scenarios-title | learner-text-candidate | — |
| src/features/impact/ImpactScreen.tsx:83:48 | text | 조건부 기능 비교 | heading | — |
| src/features/impact/ImpactScreen.tsx:97:17 | text | 다음 수정 방향을 고르세요. 둘 다 가상 학습용 행동이며 실제 기기 설정을 바꾸지 않습니다. | learner-text-candidate | — |
| src/features/impact/ImpactScreen.tsx:102:20 | value | alternative | value | repeated-text |
| src/features/impact/ImpactScreen.tsx:105:13 | text | 대안 사용 | learner-text-candidate | repeated-text |
| src/features/impact/ImpactScreen.tsx:112:20 | value | revoke | value | repeated-text |
| src/features/impact/ImpactScreen.tsx:115:13 | text | 권한 철회 | learner-text-candidate | repeated-text |
| src/features/impact/ImpactScreen.tsx:118:18 | text | {!ready && | hint | — |
| src/features/impact/ImpactScreen.tsx:120:161 | text | 최소 권한안 수정 | learner-text-candidate | repeated-text |
| src/features/impact/impactProgress.ts:17:43 | text | 조건부 비교 ${acknowledgedConditionCount}/${conditionCount} — 기능 스위치를 켠 뒤 비교 확인을 눌러 주세요. | learner-text-candidate | long-or-dense, multiple-actions |
| src/features/impact/impactProgress.ts:18:13 | text | 조건부 비교 ${acknowledgedConditionCount}/${conditionCount} — 각 조건의 비교 확인을 눌러 주세요. | learner-text-candidate | long-or-dense, multiple-actions |
| src/features/impact/impactProgress.ts:20:39 | text | 대안 사용 또는 권한 철회 중 하나를 골라야 다음 단계로 갈 수 있습니다. | learner-text-candidate | — |
| src/features/impact/impactProgress.ts:21:11 | text | 모든 조건과 수정 방향이 준비되었습니다. | learner-text-candidate | — |
| src/features/report/CompletionSummary.test.tsx:20:21 | text | 필요한 정보만 사용합니다. | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.test.tsx:45:57 | text | 네 사례 완료 요약 | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.test.tsx:46:39 | text | heading | heading | repeated-text |
| src/features/report/CompletionSummary.test.tsx:46:58 | text | 네 사례 완료 요약 | heading | repeated-text |
| src/features/report/CompletionSummary.test.tsx:47:39 | text | 완료한 사례 | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.test.tsx:49:39 | text | 판단이 바뀐 사례 | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.test.tsx:51:42 | text | 2개 | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.test.tsx:52:42 | text | 2개 | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.test.tsx:53:39 | text | 대안을 사용한 사례 | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.test.tsx:54:39 | text | 3개 | learner-text-candidate | — |
| src/features/report/CompletionSummary.test.tsx:55:39 | text | 철회한 권한 | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.test.tsx:56:42 | text | 2개 | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.test.tsx:57:39 | text | 판단이 바뀐 것은 배움의 증거예요 | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.tsx:13:60 | text | result.controlAction === 'alternative').length const revocationCount = report.revokedPermissionIds.length return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/report/CompletionSummary.tsx:18:24 | text | 네 사례 완료 요약 | heading | repeated-text |
| src/features/report/CompletionSummary.tsx:20:18 | text | 완료한 사례 | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.tsx:21:18 | text | 판단이 바뀐 사례 | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.tsx:21:36 | text | {changedCaseCount}개 | learner-text-candidate | — |
| src/features/report/CompletionSummary.tsx:22:18 | text | 바뀐 권한 선택 | learner-text-candidate | — |
| src/features/report/CompletionSummary.tsx:22:35 | text | {changedPermissionCount}개 | learner-text-candidate | — |
| src/features/report/CompletionSummary.tsx:23:18 | text | 대안을 사용한 사례 | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.tsx:23:37 | text | {alternativesCount}개 | learner-text-candidate | — |
| src/features/report/CompletionSummary.tsx:24:18 | text | 철회한 권한 | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.tsx:24:33 | text | {revocationCount}개 | learner-text-candidate | — |
| src/features/report/CompletionSummary.tsx:26:10 | text | 판단이 바뀐 것은 배움의 증거예요 | learner-text-candidate | repeated-text |
| src/features/report/CompletionSummary.tsx:27:10 | text | 최초안과 수정안의 차이는 각 사례 비교표의 판단 변경 표시로 확인할 수 있습니다. | learner-text-candidate | multiple-actions |
| src/features/report/DecisionComparisonCards.tsx:17:56 | text | [decision.permissionId, decision])) return ( | learner-text-candidate | repeated-text, technical-or-internal |
| src/features/report/DecisionComparisonCards.tsx:20:60 | aria-label | 권한별 비교 카드 목록 | aria-label | — |
| src/features/report/DecisionComparisonCards.tsx:21:44 | text | { const definition = getPermissionDefinition(permissionId) const initialChoice = initialById.get(permissionId)?.choice const revisedChoice = revisedById.get(permissionId)?.choice const changed = changedPermissionIds.includes(permissionId) const headingId = `comparison-card-${permissionId}` return ( | heading | long-or-dense, technical-or-internal |
| src/features/report/DecisionComparisonCards.tsx:33:64 | text | true | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonCards.tsx:33:70 | text | 모양: {definition.shapeLabel} | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonCards.tsx:35:24 | text | 최초 선택 | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonCards.tsx:35:38 | text | {initialChoice ? CHOICE_LABELS[initialChoice] : '기록 없음'} | learner-text-candidate | long-or-dense, repeated-text |
| src/features/report/DecisionComparisonCards.tsx:35:87 | text | 기록 없음 | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonCards.tsx:36:24 | text | 수정 선택 | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonCards.tsx:36:38 | text | {revisedChoice ? CHOICE_LABELS[revisedChoice] : '기록 없음'} | learner-text-candidate | long-or-dense, repeated-text |
| src/features/report/DecisionComparisonCards.tsx:36:87 | text | 기록 없음 | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonCards.tsx:37:24 | text | 변경 여부 | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonCards.tsx:37:38 | text | {changed ? | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonCards.tsx:37:67 | aria-label | 판단 변경 | aria-label | repeated-text |
| src/features/report/DecisionComparisonCards.tsx:37:74 | text | ◆ 판단 변경 | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonCards.tsx:37:88 | text | : '변경 없음'} | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonCards.tsx:37:92 | text | 변경 없음 | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonTable.tsx:19:56 | text | [decision.permissionId, decision])) return ( | heading | repeated-text, technical-or-internal |
| src/features/report/DecisionComparisonTable.tsx:22:26 | text | 권한별 비교 | heading | repeated-text |
| src/features/report/DecisionComparisonTable.tsx:23:74 | aria-label | 최초 선택과 수정 선택 비교 표 | aria-label | multiple-actions |
| src/features/report/DecisionComparisonTable.tsx:25:20 | text | 최초 선택과 수정 선택 비교 | learner-text-candidate | multiple-actions, repeated-text |
| src/features/report/DecisionComparisonTable.tsx:27:33 | text | 권한 | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonTable.tsx:27:56 | text | 최초 선택 | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonTable.tsx:27:82 | text | 수정 선택 | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonTable.tsx:27:108 | text | 변경 여부 | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonTable.tsx:37:30 | text | row | learner-text-candidate | — |
| src/features/report/DecisionComparisonTable.tsx:37:167 | text | true | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonTable.tsx:37:173 | text | 모양: {definition.shapeLabel} | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonTable.tsx:38:23 | text | {initialChoice ? CHOICE_LABELS[initialChoice] : '기록 없음'} | learner-text-candidate | long-or-dense, repeated-text |
| src/features/report/DecisionComparisonTable.tsx:38:72 | text | 기록 없음 | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonTable.tsx:39:23 | text | {revisedChoice ? CHOICE_LABELS[revisedChoice] : '기록 없음'} | learner-text-candidate | long-or-dense, repeated-text |
| src/features/report/DecisionComparisonTable.tsx:39:72 | text | 기록 없음 | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonTable.tsx:40:23 | text | {changed ? | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonTable.tsx:40:52 | aria-label | 판단 변경 | aria-label | repeated-text |
| src/features/report/DecisionComparisonTable.tsx:40:59 | text | ◆ 판단 변경 | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonTable.tsx:40:73 | text | : '변경 없음'} | learner-text-candidate | repeated-text |
| src/features/report/DecisionComparisonTable.tsx:40:77 | text | 변경 없음 | learner-text-candidate | repeated-text |
| src/features/report/EvidenceRubric.tsx:8:59 | text | = { 'function-connection': '기능 연결', 'data-minimization': '정보 최소화', 'user-control': '사용자 통제', 'respect-others': '다른 사람 존중', } const RUBRIC_ORDER: readonly ReasonTagId[] = ['function-connection', 'data-minimization', 'user-control', 'respect-others'] export default function EvidenceRubric({ evidence }: EvidenceRubricProps): ReactElement { const titleId = `${useId()}-evidence-rubric-title` return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/report/EvidenceRubric.tsx:9:27 | text | 기능 연결 | learner-text-candidate | repeated-text |
| src/features/report/EvidenceRubric.tsx:10:25 | text | 정보 최소화 | learner-text-candidate | repeated-text |
| src/features/report/EvidenceRubric.tsx:11:20 | text | 사용자 통제 | learner-text-candidate | repeated-text |
| src/features/report/EvidenceRubric.tsx:12:22 | text | 다른 사람 존중 | learner-text-candidate | repeated-text |
| src/features/report/EvidenceRubric.tsx:21:24 | text | 근거 차원 확인 | heading | repeated-text |
| src/features/report/EvidenceRubric.tsx:23:37 | text | { const sufficient = evidence[tagId] === 'sufficient' return | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/report/EvidenceRubric.tsx:25:40 | text | {RUBRIC_LABELS[tagId]} | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/features/report/EvidenceRubric.tsx:25:76 | text | {sufficient ? '● 근거 있음' : '△ 근거 보완'} | learner-text-candidate | — |
| src/features/report/EvidenceRubric.tsx:25:91 | text | ● 근거 있음 | learner-text-candidate | repeated-text |
| src/features/report/EvidenceRubric.tsx:25:103 | text | △ 근거 보완 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:32:129 | text | ${caseId} 근거 | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/features/report/ReportScreen.test.tsx:52:30 | text | heading | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:52:59 | text | 최소 권한 학습 보고서 | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:53:30 | text | heading | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:53:59 | text | 네 사례 완료 요약 | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:54:30 | text | 판단이 바뀐 것은 배움의 증거예요 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:55:30 | text | 가상 학습 모델이며 실제 앱 판정이 아님 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:57:57 | text | 권한 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:58:57 | text | 최초 선택 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:59:33 | text | 변경 없음 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:63:33 | text | ● 근거 있음 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:64:33 | text | △ 근거 보완 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:66:33 | text | 수정 선택 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:67:33 | text | 변경 여부 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:68:33 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:69:35 | text | 설명을 더 확인 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:70:33 | text | 모양: 카메라 테두리 | learner-text-candidate | — |
| src/features/report/ReportScreen.test.tsx:71:33 | text | 모양: 소리 물결 | learner-text-candidate | — |
| src/features/report/ReportScreen.test.tsx:72:33 | text | 모양: 지도 위치표시 | learner-text-candidate | — |
| src/features/report/ReportScreen.test.tsx:73:33 | text | 모양: 사람 카드 | learner-text-candidate | — |
| src/features/report/ReportScreen.test.tsx:74:30 | text | heading | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:74:59 | text | 공통 철회 권한 | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:75:33 | text | 카메라 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:76:33 | text | 연락처 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:78:32 | text | button | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:83:61 | text | 다음 학습 행동 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:84:43 | text | heading | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:84:72 | text | 다음 학습 행동 | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:87:43 | text | button | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:87:61 | text | 보고서 인쇄 | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:88:43 | text | button | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:88:61 | text | 처음부터 다시 하기 | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:99:48 | text | ◆ 판단 변경 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:102:42 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:103:42 | text | 이번 기능에만 허용 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:104:45 | text | ◆ 판단 변경 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:113:40 | text | button | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:113:58 | text | 보고서 인쇄 | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:116:40 | text | button | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:116:58 | text | 처음부터 다시 하기 | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:118:67 | text | 처음부터 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:120:40 | text | button | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:120:58 | text | 처음부터 다시 하기 | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:129:67 | text | 최초 선택과 수정 선택 비교 | learner-text-candidate | multiple-actions, repeated-text |
| src/features/report/ReportScreen.test.tsx:135:64 | text | 권한별 비교 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:138:37 | text | heading | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:138:56 | text | 권한별 비교 | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:140:32 | text | 카메라 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:140:39 | text | 마이크 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:140:46 | text | 위치 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:140:52 | text | 연락처 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:141:45 | text | heading | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:141:86 | text | [role="group"] | heading | — |
| src/features/report/ReportScreen.test.tsx:143:39 | text | 최초 선택 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:144:39 | text | 수정 선택 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:145:39 | text | 변경 여부 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:146:42 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:150:7 | text | gives each rubric section a unique existing labelled heading | heading | long-or-dense |
| src/features/report/ReportScreen.test.tsx:150:75 | text | { render( | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:152:61 | text | 근거 차원 확인 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.test.tsx:153:65 | text | aria-labelledby | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| src/features/report/ReportScreen.test.tsx:165:40 | text | button | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:165:58 | text | 보고서 인쇄 | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:167:40 | text | button | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:167:58 | text | 처음부터 다시 하기 | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:170:30 | text | heading | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:170:59 | text | 학습 시작 | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:180:40 | text | button | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:180:58 | text | 처음부터 다시 하기 | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:182:30 | text | heading | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:182:59 | text | 학습 시작 | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:191:30 | text | heading | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:191:59 | text | 보고서를 만들 수 없습니다 | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:193:40 | text | button | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:193:58 | text | 처음부터 다시 하기 | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:194:30 | text | heading | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:194:59 | text | 보고서를 만들 수 없습니다 | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:197:40 | text | button | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:197:58 | text | 처음부터 다시 하기 | button-or-action | repeated-text |
| src/features/report/ReportScreen.test.tsx:198:30 | text | heading | heading | repeated-text |
| src/features/report/ReportScreen.test.tsx:198:59 | text | 학습 시작 | heading | repeated-text |
| src/features/report/ReportScreen.tsx:18:22 | text | { if (window.confirm('처음부터 다시 하면 지금까지의 학습 기록이 모두 지워집니다. 처음부터 시작하시겠습니까?')) onReset() } return ( | learner-text-candidate | long-or-dense |
| src/features/report/ReportScreen.tsx:19:25 | text | 처음부터 다시 하면 지금까지의 학습 기록이 모두 지워집니다. 처음부터 시작하시겠습니까? | learner-text-candidate | — |
| src/features/report/ReportScreen.tsx:23:44 | text | 최소 권한 학습 보고서 | heading | repeated-text |
| src/features/report/ReportScreen.tsx:24:22 | text | 가상 학습 모델이며 실제 앱 판정이 아님 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.tsx:25:10 | text | 네 사례에서 처음 세운 권한안과 수정한 권한안을 나란히 돌아봅니다. 이 기록은 추천 점수나 실제 안전 판정이 아닙니다. | learner-text-candidate | long-or-dense |
| src/features/report/ReportScreen.tsx:28:51 | text | item.caseId === caseId) if (!result) return null const appCase = APP_CASES[caseId] return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/report/ReportScreen.tsx:32:68 | text | ${caseId}-report-title | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/features/report/ReportScreen.tsx:35:16 | text | 다음 행동: | learner-text-candidate | — |
| src/features/report/ReportScreen.tsx:35:29 | text | {result.controlAction === 'alternative' ? '대안 사용' : '권한 철회'} | learner-text-candidate | long-or-dense |
| src/features/report/ReportScreen.tsx:35:72 | text | 대안 사용 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.tsx:35:82 | text | 권한 철회 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.tsx:35:105 | text | {result.controlAction === 'alternative' ? '통제 후 허용' : '허용하지 않기'} | learner-text-candidate | long-or-dense |
| src/features/report/ReportScreen.tsx:35:148 | text | 통제 후 허용 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.tsx:35:160 | text | 허용하지 않기 | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.tsx:37:17 | text | 내가 기록한 수정 이유 | heading | — |
| src/features/report/ReportScreen.tsx:42:33 | text | revoked-permissions-title | learner-text-candidate | — |
| src/features/report/ReportScreen.tsx:43:44 | text | 공통 철회 권한 | heading | repeated-text |
| src/features/report/ReportScreen.tsx:44:119 | text | { const definition = getPermissionDefinition(permissionId) return | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/report/ReportScreen.tsx:46:138 | text | true | learner-text-candidate | repeated-text |
| src/features/report/ReportScreen.tsx:46:144 | text | · 모양: {definition.shapeLabel} | learner-text-candidate | — |
| src/features/report/ReportScreen.tsx:46:187 | text | · 권한 철회 | learner-text-candidate | — |
| src/features/report/ReportScreen.tsx:47:23 | text | 철회한 권한 없음 | learner-text-candidate | — |
| src/features/report/ReportScreen.tsx:49:65 | text | report-next-actions-title | learner-text-candidate | — |
| src/features/report/ReportScreen.tsx:50:44 | text | 다음 학습 행동 | heading | repeated-text |
| src/features/report/ReportScreen.tsx:51:20 | text | 인쇄해 수업에서 함께 돌아보기: | learner-text-candidate | — |
| src/features/report/ReportScreen.tsx:51:46 | text | 처음 선택과 수정 선택을 비교하며 이유를 설명해 보세요. | learner-text-candidate | multiple-actions |
| src/features/report/ReportScreen.tsx:52:20 | text | 다시 시작해 다른 사례를 연습하기: | learner-text-candidate | — |
| src/features/report/ReportScreen.tsx:52:48 | text | 다른 기능에서도 필요한 권한만 남길 수 있는지 살펴보세요. | learner-text-candidate | — |
| src/features/report/ReportScreen.tsx:54:79 | text | 보고서를 인쇄하도록 요청했습니다. | button-or-action | — |
| src/features/report/ReportScreen.tsx:54:103 | text | 보고서 인쇄 | button-or-action | repeated-text |
| src/features/report/ReportScreen.tsx:55:49 | text | 처음부터 다시 하기 | button-or-action | repeated-text |
| src/features/report/decisionComparisonLabels.ts:4:29 | text | 이번 기능에만 허용 | learner-text-candidate | repeated-text |
| src/features/report/decisionComparisonLabels.ts:5:10 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| src/features/report/decisionComparisonLabels.ts:6:17 | text | 설명을 더 확인 | learner-text-candidate | repeated-text |
| src/features/review/ContractEvidencePanel.tsx:8:18 | text | void } const QUESTIONS = [ ['이 기능에 어떤 정보가 필요한가요?', 'neededInformation'], ['앱을 사용하는 동안만 필요한가요, 항상 필요한가요?', 'timing'], ['권한을 주지 않으면 어떤 기능만 제한되나요?', 'denialImpact'], ['더 적은 정보로 같은 목적을 이룰 방법이 있나요?', 'alternative'], ] as const export default function ContractEvidencePanel({ rule, expanded, onToggle, }: ContractEvidencePanelProps): ReactElement { const permissionLabel = getPermissionDefinition(rule.permissionId).label const idPrefix = useId() const panelId = `${idPrefix}-evidence-panel` const headingId = `${idPrefix}-evidence-heading` const headingRef = useRef | heading | long-or-dense, multiple-conditions, technical-or-internal |
| src/features/review/ContractEvidencePanel.tsx:12:5 | text | 이 기능에 어떤 정보가 필요한가요? | learner-text-candidate | repeated-text |
| src/features/review/ContractEvidencePanel.tsx:13:5 | text | 앱을 사용하는 동안만 필요한가요, 항상 필요한가요? | learner-text-candidate | repeated-text |
| src/features/review/ContractEvidencePanel.tsx:14:5 | text | 권한을 주지 않으면 어떤 기능만 제한되나요? | learner-text-candidate | repeated-text |
| src/features/review/ContractEvidencePanel.tsx:15:5 | text | 더 적은 정보로 같은 목적을 이룰 방법이 있나요? | learner-text-candidate | repeated-text |
| src/features/review/ContractEvidencePanel.tsx:29:18 | text | { if (expanded) headingRef.current?.focus() }, [expanded]) return ( | heading | long-or-dense |
| src/features/review/ContractEvidencePanel.tsx:40:8 | text | {permissionLabel} 기능 계약 근거 {expanded ? '닫기' : '보기'} | button-or-action | — |
| src/features/review/ContractEvidencePanel.tsx:41:49 | text | 닫기 | learner-text-candidate | repeated-text |
| src/features/review/ContractEvidencePanel.tsx:41:56 | text | 보기 | learner-text-candidate | — |
| src/features/review/ContractEvidencePanel.tsx:49:59 | text | {permissionLabel} 기능 계약 근거 | heading | — |
| src/features/review/ContractEvidencePanel.tsx:56:13 | text | 기능 계약 근거 | heading | — |
| src/features/review/PermissionCard.tsx:34:58 | text | true | learner-text-candidate | repeated-text |
| src/features/review/PermissionCard.tsx:34:64 | text | 모양: {permission.shapeLabel} | learner-text-candidate | — |
| src/features/review/PermissionCard.tsx:36:10 | text | 필요 정보: {rule.neededInformation} | learner-text-candidate | — |
| src/features/review/PermissionCard.tsx:37:10 | text | 사용 시점: {rule.timing} | learner-text-candidate | — |
| src/features/review/PermissionCard.tsx:38:10 | text | 거부하면: {rule.denialImpact} | learner-text-candidate | — |
| src/features/review/PermissionCard.tsx:39:10 | text | 덜 받는 방법: {rule.alternative} | learner-text-candidate | — |
| src/features/review/PermissionChoiceGroup.tsx:8:39 | text | void describedBy: string } const CHOICES: readonly { value: LearnerChoice; label: string }[] = [ { value: 'allow-current-feature', label: '이번 기능에만 허용' }, { value: 'deny', label: '허용하지 않음' }, { value: 'more-info', label: '설명을 더 확인' }, ] export default function PermissionChoiceGroup({ permission, value, onChange, describedBy, }: PermissionChoiceGroupProps): ReactElement { const idPrefix = useId() const definition = getPermissionDefinition(permission.id) return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/review/PermissionChoiceGroup.tsx:13:13 | text | allow-current-feature | learner-text-candidate | — |
| src/features/review/PermissionChoiceGroup.tsx:13:45 | text | 이번 기능에만 허용 | learner-text-candidate | repeated-text |
| src/features/review/PermissionChoiceGroup.tsx:14:13 | text | deny | learner-text-candidate | — |
| src/features/review/PermissionChoiceGroup.tsx:14:28 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| src/features/review/PermissionChoiceGroup.tsx:15:13 | text | more-info | learner-text-candidate | — |
| src/features/review/PermissionChoiceGroup.tsx:15:33 | text | 설명을 더 확인 | learner-text-candidate | repeated-text |
| src/features/review/PermissionChoiceGroup.tsx:28:41 | text | ${definition.label} 권한 선택 | learner-text-candidate | — |
| src/features/review/PermissionChoiceGroup.tsx:29:47 | text | 학습용 선택지 | learner-text-candidate | repeated-text |
| src/features/review/PermissionChoiceGroup.tsx:30:49 | text | { const id = `${idPrefix}-${choice}` return ( | learner-text-candidate | technical-or-internal |
| src/features/review/PermissionReviewScreen.test.tsx:59:55 | text | 모양: ${definition.shapeLabel} | learner-text-candidate | — |
| src/features/review/PermissionReviewScreen.test.tsx:61:43 | text | aria-hidden | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/features/review/PermissionReviewScreen.test.tsx:61:58 | text | true | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:62:43 | text | 학습용 선택지 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:64:60 | text | 이번 기능에만 허용 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:65:60 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:66:60 | text | 설명을 더 확인 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:73:63 | text | 이번 기능에만 허용 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:84:38 | text | button | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:84:56 | text | 선택 검토 | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:86:30 | text | 권한 0/4 선택 | learner-text-candidate | — |
| src/features/review/PermissionReviewScreen.test.tsx:90:63 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:95:33 | text | button | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:95:107 | text | gi-pulse | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:96:72 | text | 단계 3 | learner-text-candidate | — |
| src/features/review/PermissionReviewScreen.test.tsx:105:51 | text | 내 판단 근거 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:106:30 | text | 수정 선택 0/4 | learner-text-candidate | — |
| src/features/review/PermissionReviewScreen.test.tsx:107:30 | text | button | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:107:48 | text | 선택 검토 | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:108:63 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:109:60 | text | 정보 최소화 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:111:58 | text | 내 판단 근거 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:113:30 | text | button | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:113:48 | text | 선택 검토 | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:119:60 | text | 내 판단 근거 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:122:33 | text | 가 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:123:36 | text | 가 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:128:112 | text | 근거 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:129:30 | text | 문장틀: 나는 [기능]을 위해 [권한]을 [선택]하겠습니다. 그 이유는 [근거]이며, 필요하지 않을 때는 [대안 또는 철회]하겠습니다. | learner-text-candidate | long-or-dense, multiple-conditions, repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:135:63 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:136:60 | text | 기능 연결 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:137:58 | text | 내 판단 근거 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:137:72 | text | 필요한 기능에만 연결했습니다. | learner-text-candidate | — |
| src/features/review/PermissionReviewScreen.test.tsx:138:30 | text | button | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:138:48 | text | 선택 검토 | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:139:30 | text | button | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:139:48 | text | 선택 검토 | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:139:72 | text | gi-pulse | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:145:68 | text | 설명을 더 확인 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:147:39 | text | heading | heading | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:149:36 | text | [data-evidence-panel] | heading | missing-term-explanation, technical-or-internal |
| src/features/review/PermissionReviewScreen.test.tsx:150:37 | text | [role="region"] | heading | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:152:30 | text | button | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:152:86 | text | aria-expanded | button-or-action | missing-term-explanation, technical-or-internal |
| src/features/review/PermissionReviewScreen.test.tsx:152:103 | text | true | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:153:37 | text | aria-labelledby | heading | missing-term-explanation, repeated-text, technical-or-internal |
| src/features/review/PermissionReviewScreen.test.tsx:154:37 | text | 이 기능에 어떤 정보가 필요한가요? | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:156:30 | text | button | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:156:86 | text | aria-controls | button-or-action | missing-term-explanation, technical-or-internal |
| src/features/review/PermissionReviewScreen.test.tsx:156:123 | text | [role="region"] | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:162:41 | text | button | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:169:46 | text | aria-labelledby | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| src/features/review/PermissionReviewScreen.test.tsx:170:85 | text | aria-labelledby | heading | missing-term-explanation, repeated-text, technical-or-internal |
| src/features/review/PermissionReviewScreen.test.tsx:176:52 | text | aria-labelledby | heading | missing-term-explanation, repeated-text, technical-or-internal |
| src/features/review/PermissionReviewScreen.test.tsx:182:41 | text | button | button-or-action | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:185:40 | text | aria-labelledby | learner-text-candidate | missing-term-explanation, repeated-text, technical-or-internal |
| src/features/review/PermissionReviewScreen.test.tsx:190:7 | text | uses unique screen headings and card descriptions for multiple instances | heading | long-or-dense |
| src/features/review/PermissionReviewScreen.test.tsx:190:87 | text | { render( | heading | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:213:49 | text | heading | heading | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:213:78 | text | 권한 선택 | heading | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:215:67 | text | section | heading | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:215:95 | text | aria-labelledby | heading | missing-term-explanation, repeated-text, technical-or-internal |
| src/features/review/PermissionReviewScreen.test.tsx:228:97 | text | { const initialDecision = { permissionId: 'camera' as const, choice: 'allow-current-feature' as LearnerChoice } const revisedDecision = { permissionId: 'camera' as const, choice: 'deny' as LearnerChoice } const initial = { camera: initialDecision } const revised = { camera: revisedDecision } const { rerender } = renderReview({ progress: progress({ initialDecisions: initial, revisedDecisions: revised }) }) expect(screen.getAllByRole('radio', { name: '이번 기능에만 허용' })[0]).toBeChecked() rerender( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/review/PermissionReviewScreen.test.tsx:234:50 | text | 이번 기능에만 허용 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:246:50 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:250:7 | text | does not include fear-based or wrong-answer feedback | feedback-or-error | long-or-dense |
| src/features/review/PermissionReviewScreen.test.tsx:255:88 | text | { const user = userEvent.setup() const initialDecisions = { camera: { permissionId: 'camera' as const, choice: 'allow-current-feature' as const }, microphone: { permissionId: 'microphone' as const, choice: 'deny' as const }, location: { permissionId: 'location' as const, choice: 'more-info' as const }, contacts: { permissionId: 'contacts' as const, choice: 'deny' as const }, } const { rerender } = renderReview({ mode: 'revision', progress: progress({ initialDecisions, revisedDecisions: {} }) }) const comparison = screen.getByRole('heading', { level: 3, name: '최초 선택 비교' }).closest('section')! expect(within(comparison).getByText('카메라')).toBeVisible() expect(within(comparison).getByText('이번 기능에만 허용')).toBeVisible() expect(within(comparison).getAllByText('허용하지 않음')).toHaveLength(2) expect(within(comparison).getByText('설명을 더 확인')).toBeVisible() expect(within(comparison).queryAllByRole('radio')).toHaveLength(0) expect(within(comparison).queryAllByRole('checkbox')).toHaveLength(0) const initialSnapshot = structuredClone(initialDecisions) rerender( | heading | long-or-dense, multiple-actions, technical-or-internal |
| src/features/review/PermissionReviewScreen.test.tsx:264:42 | text | heading | heading | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:264:71 | text | 최초 선택 비교 | heading | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:264:93 | text | section | heading | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:265:42 | text | 카메라 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:266:42 | text | 이번 기능에만 허용 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:267:45 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:268:42 | text | 설명을 더 확인 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.test.tsx:284:60 | text | 이번 기능에만 허용 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.tsx:19:66 | text | } const CHOICE_LABELS: Readonly | learner-text-candidate | — |
| src/features/review/PermissionReviewScreen.tsx:22:61 | text | = { 'allow-current-feature': '이번 기능에만 허용', deny: '허용하지 않음', 'more-info': '설명을 더 확인', } export default function PermissionReviewScreen({ appCase, mode, progress, onDecision, onRationaleTextChange, onReasonTagToggle, onReview, }: PermissionReviewScreenProps): ReactElement { const [expandedPermissionId, setExpandedPermissionId] = useState | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/review/PermissionReviewScreen.tsx:23:29 | text | 이번 기능에만 허용 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.tsx:24:10 | text | 허용하지 않음 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.tsx:25:17 | text | 설명을 더 확인 | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.tsx:48:43 | text | initial | learner-text-candidate | repeated-text |
| src/features/review/PermissionReviewScreen.tsx:49:8 | text | 권한 ${selectedCount}/${totalCount} 선택 | learner-text-candidate | — |
| src/features/review/PermissionReviewScreen.tsx:50:8 | text | 수정 선택 ${selectedCount}/${totalCount} | learner-text-candidate | — |
| src/features/review/PermissionReviewScreen.tsx:53:80 | text | { onDecision({ permissionId, choice }) if (choice === 'more-info') setExpandedPermissionId(permissionId) else if (expandedPermissionId === permissionId) setExpandedPermissionId(null) setStatusMessage(`${permissionId === 'microphone' ? '마이크' : permissionId === 'camera' ? '카메라' : permissionId === 'location' ? '위치' : '연락처'} 권한을 ${CHOICE_LABELS[choice]}으로 선택했습니다. 학습용 판단입니다.`) } return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/review/PermissionReviewScreen.tsx:57:23 | text | ${permissionId === 'microphone' ? '마이크' : permissionId === 'camera' ? '카메라' : permissionId === 'location' ? '위치' : '연락처'} 권한을 ${CHOICE_LABELS[choice]}으로 선택했습니다. 학습용 판단입니다. | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/review/PermissionReviewScreen.tsx:62:44 | text | {mode === 'initial' ? '최초 권한 심사' : '수정 권한 심사'} | heading | — |
| src/features/review/PermissionReviewScreen.tsx:62:55 | text | initial | heading | repeated-text |
| src/features/review/PermissionReviewScreen.tsx:62:67 | text | 최초 권한 심사 | heading | repeated-text |
| src/features/review/PermissionReviewScreen.tsx:62:80 | text | 수정 권한 심사 | heading | repeated-text |
| src/features/review/PermissionReviewScreen.tsx:63:10 | text | {appCase.title}: {appCase.coreFunction} | learner-text-candidate | — |
| src/features/review/PermissionReviewScreen.tsx:64:10 | text | 각 권한은 이 기능 계약에 필요한 만큼만 판단합니다. 실제 기기 권한을 요청하지 않습니다. | learner-text-candidate | — |
| src/features/review/PermissionReviewScreen.tsx:65:21 | text | polite | learner-text-candidate | — |
| src/features/review/PermissionReviewScreen.tsx:66:51 | text | {mode === 'revision' && ( | learner-text-candidate | — |
| src/features/review/PermissionReviewScreen.tsx:68:35 | text | initial-choice-comparison-title | learner-text-candidate | — |
| src/features/review/PermissionReviewScreen.tsx:69:52 | text | 최초 선택 비교 | heading | repeated-text |
| src/features/review/PermissionReviewScreen.tsx:70:14 | text | 처음 선택한 기록은 읽기 전용으로 보존됩니다. 아래의 수정 권한 선택과 따로 비교합니다. | learner-text-candidate | multiple-actions |
| src/features/review/PermissionReviewScreen.tsx:78:23 | text | {initialChoice ? CHOICE_LABELS[initialChoice] : '선택하지 않음'} | learner-text-candidate | long-or-dense |
| src/features/review/PermissionReviewScreen.tsx:78:72 | text | 선택하지 않음 | learner-text-candidate | — |
| src/features/review/PermissionReviewScreen.tsx:86:26 | text | 권한 선택 | heading | repeated-text |
| src/features/review/PermissionReviewScreen.tsx:106:11 | text | )} {!ready && | hint | repeated-text |
| src/features/review/PermissionReviewScreen.tsx:115:8 | text | 선택 검토 | learner-text-candidate | repeated-text |
| src/features/review/RationaleComposer.tsx:9:55 | text | void } const REASON_TAGS: readonly { id: ReasonTagId; label: string }[] = [ { id: 'function-connection', label: '기능 연결' }, { id: 'data-minimization', label: '정보 최소화' }, { id: 'user-control', label: '사용자 통제' }, { id: 'respect-others', label: '다른 사람 존중' }, ] export default function RationaleComposer({ caseId, value, selectedTags, onTextChange, onTagToggle, }: RationaleComposerProps): ReactElement { const idPrefix = useId() const helpId = `${idPrefix}-help` return ( | hint | long-or-dense, technical-or-internal |
| src/features/review/RationaleComposer.tsx:13:10 | text | function-connection | learner-text-candidate | — |
| src/features/review/RationaleComposer.tsx:13:40 | text | 기능 연결 | learner-text-candidate | repeated-text |
| src/features/review/RationaleComposer.tsx:14:10 | text | data-minimization | learner-text-candidate | — |
| src/features/review/RationaleComposer.tsx:14:38 | text | 정보 최소화 | learner-text-candidate | repeated-text |
| src/features/review/RationaleComposer.tsx:15:10 | text | user-control | learner-text-candidate | — |
| src/features/review/RationaleComposer.tsx:15:33 | text | 사용자 통제 | learner-text-candidate | repeated-text |
| src/features/review/RationaleComposer.tsx:16:10 | text | respect-others | learner-text-candidate | — |
| src/features/review/RationaleComposer.tsx:16:35 | text | 다른 사람 존중 | learner-text-candidate | repeated-text |
| src/features/review/RationaleComposer.tsx:30:32 | text | ${idPrefix}-title | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/features/review/RationaleComposer.tsx:31:36 | text | 왜 그렇게 골랐는지 적기 | heading | — |
| src/features/review/RationaleComposer.tsx:32:43 | text | 내 판단 근거 | learner-text-candidate | repeated-text |
| src/features/review/RationaleComposer.tsx:41:10 | text | 남은 글자 수: {Math.max(0, 240 - value.length)}자 | learner-text-candidate | — |
| src/features/review/RationaleComposer.tsx:42:22 | text | 실제 이름·전화번호·주소 등 개인정보를 입력하지 마세요. 저장 동의가 켜져 있으면 입력한 원문이 이 기기의 학습 기록에 보관될 수 있습니다. 이 문장은 AI나 키워드로 채점하지 않으며, 입력한 원문을 바꾸지 않습니다. | hint, input | abstract-or-formal, long-or-dense, multiple-actions |
| src/features/review/RationaleComposer.tsx:45:10 | text | 문장틀: 나는 [기능]을 위해 [권한]을 [선택]하겠습니다. 그 이유는 [근거]이며, 필요하지 않을 때는 [대안 또는 철회]하겠습니다. | learner-text-candidate | long-or-dense, multiple-conditions, repeated-text |
| src/features/review/RationaleComposer.tsx:46:43 | text | ${idPrefix}-tags-title | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/features/review/RationaleComposer.tsx:47:43 | text | 판단 근거 태그 | heading | — |
| src/features/review/RationaleComposer.tsx:48:44 | text | { const checkboxId = `${idPrefix}-${id}` return ( | learner-text-candidate | technical-or-internal |
| src/features/review/reviewProgress.ts:16:48 | text | decisions[permissionId]?.permissionId === permissionId).length } export function getDecisionHint({ mode, selectedCount, totalCount, rationaleReady = false }: DecisionHintOptions): string { if (selectedCount | hint | long-or-dense, technical-or-internal |
| src/features/review/reviewProgress.ts:21:13 | text | ${mode === 'initial' ? '권한' : '수정 선택'} ${selectedCount}/${totalCount} 선택 — 모든 권한을 선택하면 다음 단계로 갈 수 있습니다. | learner-text-candidate | long-or-dense, multiple-actions |
| src/features/review/reviewProgress.ts:23:55 | text | 수정 이유 태그와 근거 문장을 기록하면 선택 검토로 갈 수 있습니다. | learner-text-candidate | multiple-actions |
| src/features/review/reviewProgress.ts:24:11 | text | 모든 선택이 준비되었습니다. | learner-text-candidate | — |
| src/features/revoke/PermissionUseLog.tsx:17:19 | text | 사진 스캔에서 촬영 순간에 사용한 권한 예시 | learner-text-candidate | — |
| src/features/revoke/PermissionUseLog.tsx:19:19 | text | 사진을 찍는 순간만 필요한 예시입니다. 현재 활동 뒤에는 최소 사용 원칙에 따라 나중에 철회할 수 있고, 카메라 없이 글로 설명하는 대안을 생각할 수 있습니다. | learner-text-candidate | long-or-dense |
| src/features/revoke/PermissionUseLog.tsx:23:19 | text | 음성 읽기에서 녹음 버튼을 누른 동안만 사용한 권한 예시 | learner-text-candidate | — |
| src/features/revoke/PermissionUseLog.tsx:25:19 | text | 녹음하는 순간에만 최소한으로 사용하는 예시입니다. 음성 기능을 계속 연습하는 동안은 유지할 수 있으며, 연습을 마치면 나중에 철회할 수 있습니다. | learner-text-candidate | long-or-dense |
| src/features/revoke/PermissionUseLog.tsx:29:19 | text | 학습용 내 위치 표시를 켠 동안 사용한 권한 예시 | learner-text-candidate | — |
| src/features/revoke/PermissionUseLog.tsx:31:19 | text | 내 위치 표시를 켠 동안에만 필요한 예시입니다. 저장된 지도만 볼 때는 불필요하므로 나중에 철회하고 장소 이름을 직접 고르는 대안을 사용할 수 있습니다. | learner-text-candidate | long-or-dense, multiple-conditions |
| src/features/revoke/PermissionUseLog.tsx:35:19 | text | 이 실습에서는 사용하지 않음 | learner-text-candidate | — |
| src/features/revoke/PermissionUseLog.tsx:37:19 | text | 이 학습 활동에는 연락처가 필요하지 않습니다. 최소 사용 원칙에 따라 지금 철회하며, 초대가 필요하다면 별명처럼 개인정보가 아닌 학습용 대안을 생각합니다. | learner-text-candidate | long-or-dense |
| src/features/revoke/PermissionUseLog.tsx:45:57 | text | void readonly disabled?: boolean } const ACTION_LABELS = Object.freeze({ 'keep-current-feature': '현재 기능에 유지', 'revoke-now': '지금 철회', } as const) export default function PermissionUseLog({ decisions, onDecision, disabled = false }: PermissionUseLogProps): ReactElement { const groupPrefix = useId() return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/revoke/PermissionUseLog.tsx:50:28 | text | 현재 기능에 유지 | learner-text-candidate | repeated-text |
| src/features/revoke/PermissionUseLog.tsx:51:18 | text | 지금 철회 | learner-text-candidate | repeated-text |
| src/features/revoke/PermissionUseLog.tsx:58:32 | text | ${groupPrefix}-title | learner-text-candidate | — |
| src/features/revoke/PermissionUseLog.tsx:59:39 | text | 가상 사용 기록 예시 | heading | repeated-text |
| src/features/revoke/PermissionUseLog.tsx:60:10 | text | 실제 기기 권한은 읽거나 바꾸지 않습니다. 아래 기록은 권한을 언제, 왜 최소한으로 사용할지 연습하는 가상 예시입니다. | learner-text-candidate | long-or-dense |
| src/features/revoke/PermissionUseLog.tsx:62:51 | text | { const permission = getPermissionDefinition(entry.permissionId) const fieldsetId = `${groupPrefix}-${entry.permissionId}` const selectedAction = decisions[entry.permissionId]?.action return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/revoke/PermissionUseLog.tsx:67:66 | text | ${fieldsetId}-label | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/features/revoke/PermissionUseLog.tsx:74:23 | text | 마지막 사용 예시 | learner-text-candidate | — |
| src/features/revoke/PermissionUseLog.tsx:78:23 | text | 현재 필요 여부 | learner-text-candidate | — |
| src/features/revoke/PermissionUseLog.tsx:79:23 | text | {entry.isStillNeeded ? '현재 기능을 연습하는 동안 조건부로 필요함' : '현재 활동 뒤에는 필요 없음'} | learner-text-candidate | long-or-dense |
| src/features/revoke/PermissionUseLog.tsx:79:47 | text | 현재 기능을 연습하는 동안 조건부로 필요함 | learner-text-candidate | — |
| src/features/revoke/PermissionUseLog.tsx:79:75 | text | 현재 활동 뒤에는 필요 없음 | learner-text-candidate | — |
| src/features/revoke/PermissionUseLog.tsx:82:41 | text | {(Object.entries(ACTION_LABELS) as Array | learner-text-candidate | — |
| src/features/revoke/PermissionUseLog.tsx:83:77 | text | action | learner-text-candidate | repeated-text |
| src/features/revoke/PermissionUseLog.tsx:83:121 | text | { const inputId = `${fieldsetId}-${action}` return ( | input | long-or-dense, technical-or-internal |
| src/features/revoke/RevokeTrainingScreen.test.tsx:36:30 | text | 네 사례를 먼저 완료해 주세요 | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:37:32 | text | 가상 사용 기록 예시 | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:39:32 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:39:50 | text | 권한 철회 연습 | button-or-action | — |
| src/features/revoke/RevokeTrainingScreen.test.tsx:40:32 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:41:32 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:41:50 | text | 학습 보고서 보기 | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:42:30 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:42:48 | text | 사례 선택으로 돌아가기 | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:43:23 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:43:41 | text | 사례 선택으로 돌아가기 | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:50:30 | text | heading | heading | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:50:59 | text | 권한 철회 미니 활동 | heading | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:51:30 | text | 가상 사용 기록 예시 | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:56:32 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:60:7 | text | explains the disabled completion action and links the hint | hint | long-or-dense |
| src/features/revoke/RevokeTrainingScreen.test.tsx:63:40 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:63:58 | text | 철회 판단 완료 | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:76:94 | text | 지금 철회 | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:81:44 | text | 카메라 | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:82:44 | text | 지금 철회 | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:83:44 | text | 가상 학습 | learner-text-candidate | — |
| src/features/revoke/RevokeTrainingScreen.test.tsx:90:42 | text | [permissionId, { permissionId, action: 'keep-current-feature' }]), ) const { props } = renderActivity({ decisions, onComplete }) const complete = screen.getByRole('button', { name: /철회 판단 완료/ }) expect(complete).toBeDisabled() expect(screen.getByText(/사용하지 않는 권한 하나 이상을 철회/)).toBeVisible() await user.click(within(screen.getAllByRole('group')[0]).getByRole('radio', { name: '지금 철회' })) const updatedDecisions = { ...decisions, camera: { permissionId: 'camera' as const, action: 'revoke-now' as const } } const completeScreen = render( | button-or-action | long-or-dense, technical-or-internal |
| src/features/revoke/RevokeTrainingScreen.test.tsx:93:40 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:97:90 | text | 지금 철회 | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:100:50 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:119:30 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:120:44 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:120:62 | text | 학습 보고서 보기 | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:122:39 | text | gi-pulse | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:129:30 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:129:48 | text | 학습 보고서 보기 | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:130:30 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:130:48 | text | 학습 보고서 보기 | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:130:80 | text | gi-pulse | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:138:32 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:138:50 | text | 철회 판단 완료 | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:139:32 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:139:50 | text | 학습 보고서 보기 | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:146:32 | text | 가상 사용 기록 예시 | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:147:30 | text | 네 사례를 먼저 완료해 주세요 | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:148:40 | text | button | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:148:58 | text | 사례 선택으로 돌아가기 | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:149:30 | text | heading | heading | repeated-text |
| src/features/revoke/RevokeTrainingScreen.test.tsx:149:59 | text | 학습 시작 | heading | repeated-text |
| src/features/revoke/RevokeTrainingScreen.tsx:37:50 | text | action | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.tsx:38:37 | text | 지금 철회 | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.tsx:38:47 | text | 현재 기능에 유지 | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.tsx:68:59 | text | { if (revocationCompleted) return onDecision(decision) const permissionLabel = getPermissionDefinition(decision.permissionId).label setStatusMessage(`${permissionLabel} 권한의 선택: ${actionLabel(decision.action)}. 실제 권한이 아닌 가상 학습 기록이며, 필요한 순간만 최소한으로 사용하고 나중에 철회할 수 있습니다.`) } return ( | learner-text-candidate | long-or-dense, multiple-actions, technical-or-internal |
| src/features/revoke/RevokeTrainingScreen.tsx:72:23 | text | ${permissionLabel} 권한의 선택: ${actionLabel(decision.action)}. 실제 권한이 아닌 가상 학습 기록이며, 필요한 순간만 최소한으로 사용하고 나중에 철회할 수 있습니다. | learner-text-candidate | long-or-dense, multiple-actions |
| src/features/revoke/RevokeTrainingScreen.tsx:77:44 | text | 권한 철회 미니 활동 | heading | repeated-text |
| src/features/revoke/RevokeTrainingScreen.tsx:78:10 | text | 사례를 마친 뒤 권한 사용 기록을 돌아보고, 계속 필요한 권한과 이제 필요 없는 권한을 구분합니다. | learner-text-candidate | — |
| src/features/revoke/RevokeTrainingScreen.tsx:79:51 | text | {!eligible ? ( | learner-text-candidate | — |
| src/features/revoke/RevokeTrainingScreen.tsx:81:35 | text | revocation-boundary-title | learner-text-candidate | — |
| src/features/revoke/RevokeTrainingScreen.tsx:82:46 | text | 네 사례를 먼저 완료해 주세요 | heading | repeated-text |
| src/features/revoke/RevokeTrainingScreen.tsx:83:14 | text | 네 사례의 권한 판단과 수정 이유를 모두 기록하면 이 가상 철회 연습을 시작할 수 있습니다. | learner-text-candidate | — |
| src/features/revoke/RevokeTrainingScreen.tsx:84:51 | text | 사례 선택으로 돌아가기 | button-or-action | repeated-text |
| src/features/revoke/RevokeTrainingScreen.tsx:90:16 | text | {!allValid ? '네 권한의 판단을 모두 선택하고, 사용하지 않는 권한 하나 이상을 철회해 보세요.' : allKeep ? '모든 권한을 유지하기로 했습니다. 현재 사용하지 않는 권한 하나 이상을 철회해 보세요.' : '네 권한의 판단이 모였습니다. 철회 판단을 완료할 수 있습니다.'} | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/revoke/RevokeTrainingScreen.tsx:92:20 | text | 네 권한의 판단을 모두 선택하고, 사용하지 않는 권한 하나 이상을 철회해 보세요. | learner-text-candidate | — |
| src/features/revoke/RevokeTrainingScreen.tsx:94:22 | text | 모든 권한을 유지하기로 했습니다. 현재 사용하지 않는 권한 하나 이상을 철회해 보세요. | learner-text-candidate | — |
| src/features/revoke/RevokeTrainingScreen.tsx:95:22 | text | 네 권한의 판단이 모였습니다. 철회 판단을 완료할 수 있습니다. | learner-text-candidate | — |
| src/features/revoke/RevokeTrainingScreen.tsx:98:38 | text | 가상 철회 판단을 기록했습니다. 실제 기기 설정이나 권한은 바뀌지 않았습니다. | learner-text-candidate | — |
| src/features/revoke/RevokeTrainingScreen.tsx:98:85 | text | } {!revocationCompleted && | hint | — |
| src/features/revoke/RevokeTrainingScreen.tsx:99:115 | text | } {revocationCompleted && !reportReady && | hint | — |
| src/features/revoke/RevokeTrainingScreen.tsx:107:12 | text | 철회 판단 완료 | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.tsx:116:12 | text | 학습 보고서 보기 | learner-text-candidate | repeated-text |
| src/features/revoke/RevokeTrainingScreen.tsx:119:14 | text | 이 활동은 실제 권한을 요청하거나 읽거나 바꾸지 않는 학습용 판단입니다. | learner-text-candidate | — |
| src/features/revoke/revocationProgress.ts:18:26 | text | 네 사례를 먼저 완료하면 철회 연습을 시작할 수 있습니다. | learner-text-candidate | — |
| src/features/revoke/revocationProgress.ts:19:51 | text | 철회 기록이 준비되었습니다. 학습 보고서를 열어 돌아보세요. | learner-text-candidate | — |
| src/features/revoke/revocationProgress.ts:20:43 | text | 권한 ${selectedCount}/${totalCount} 선택 — 네 권한의 유지 또는 철회를 모두 골라 주세요. | learner-text-candidate | long-or-dense, multiple-conditions |
| src/features/revoke/revocationProgress.ts:21:35 | text | 철회한 권한 0개 — 지금은 필요하지 않은 권한 하나를 골라 철회해 보세요. | learner-text-candidate | — |
| src/features/revoke/revocationProgress.ts:22:11 | text | 네 권한의 철회 선택이 준비되었습니다. | learner-text-candidate | — |
| src/features/specification/DataFlowSummary.tsx:9:31 | text | data-flow-title | learner-text-candidate | — |
| src/features/specification/DataFlowSummary.tsx:10:32 | text | 정보 흐름 | heading | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:14:30 | text | heading | heading | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:14:59 | text | 사진 스캔 과제함 | heading | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:17:44 | text | heading | heading | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:17:63 | text | 정보 흐름 | heading | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:17:103 | text | listitem | heading | — |
| src/features/specification/FeatureSpecScreen.test.tsx:19:43 | text | photo-scan | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:21:8 | text | 이 기능에 어떤 정보가 필요한가요? | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:22:8 | text | 앱을 사용하는 동안만 필요한가요, 항상 필요한가요? | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:23:8 | text | 권한을 주지 않으면 어떤 기능만 제한되나요? | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:24:8 | text | 더 적은 정보로 같은 목적을 이룰 방법이 있나요? | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:26:33 | text | heading | heading | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:28:35 | text | heading | heading | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:29:35 | text | heading | heading | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:29:103 | text | details | heading | — |
| src/features/specification/FeatureSpecScreen.test.tsx:31:46 | text | 자세히 보기 | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:34:33 | text | heading | heading | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:41:40 | text | button | button-or-action | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:43:30 | text | button | button-or-action | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:43:75 | text | gi-pulse | button-or-action | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:48:112 | text | ) const input = screen.getByRole('textbox', { name: '가상 별명 연습' }) const begin = screen.getByRole('button', { name: '권한 심사 시작' }) expect(begin).toBeDisabled() expect(screen.getByText(/12자 이내/)).toBeVisible() expect(input).toHaveAttribute('type', 'text') expect(input).toHaveAttribute('autocomplete', 'off') expect(input).toHaveAttribute('maxlength', '12') for (const example of ['햇살', '새싹', '푸른별']) expect(screen.getByText(example)).toBeVisible() expect(screen.getByText(/실제 이름·전화번호·주소 등 개인정보를 입력하지 말 것/)).toBeVisible() await user.type(input, '햇살') expect(screen.getByText('미리보기: 햇살')).toBeVisible() expect(begin).toBeEnabled() unmount() render( | button-or-action, input | abstract-or-formal, long-or-dense |
| src/features/specification/FeatureSpecScreen.test.tsx:49:56 | text | 가상 별명 연습 | input | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:50:37 | text | button | button-or-action | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:50:55 | text | 권한 심사 시작 | button-or-action | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:56:29 | text | 햇살 | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:56:35 | text | 새싹 | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:56:41 | text | 푸른별 | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:58:29 | text | 햇살 | input | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:59:30 | text | 미리보기: 햇살 | learner-text-candidate | — |
| src/features/specification/FeatureSpecScreen.test.tsx:63:49 | text | 가상 별명 연습 | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:70:40 | text | button | button-or-action | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:70:58 | text | 예시 사용: 햇살 | button-or-action | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:71:49 | text | 가상 별명 연습 | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:71:76 | text | 햇살 | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:72:40 | text | button | button-or-action | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:72:58 | text | 권한 심사 시작 | button-or-action | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:74:69 | text | 햇살 | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:79:51 | text | 가상 별명 연습 | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:89:60 | text | 가상 별명 연습 | input | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:92:41 | text | heading | heading | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:92:60 | text | 가상 별명 연습 | heading | repeated-text |
| src/features/specification/FeatureSpecScreen.test.tsx:94:50 | text | for | input | — |
| src/features/specification/FeatureSpecScreen.tsx:17:4 | text | 이 기능에 어떤 정보가 필요한가요? | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.tsx:18:4 | text | 앱을 사용하는 동안만 필요한가요, 항상 필요한가요? | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.tsx:19:4 | text | 권한을 주지 않으면 어떤 기능만 제한되나요? | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.tsx:20:4 | text | 더 적은 정보로 같은 목적을 이룰 방법이 있나요? | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.tsx:34:33 | text | requested-permissions-title | learner-text-candidate | — |
| src/features/specification/FeatureSpecScreen.tsx:35:46 | text | 요청된 권한 | heading | — |
| src/features/specification/FeatureSpecScreen.tsx:48:30 | text | 자세히 보기 | learner-text-candidate | repeated-text |
| src/features/specification/FeatureSpecScreen.tsx:67:11 | text | )} {!ready && | hint, input | repeated-text |
| src/features/specification/FeatureSpecScreen.tsx:69:75 | text | 가상 별명을 한 글자 이상 입력하면 권한 심사를 시작할 수 있습니다. | hint, input | abstract-or-formal |
| src/features/specification/FeatureSpecScreen.tsx:76:8 | text | 권한 심사 시작 | learner-text-candidate | repeated-text |
| src/features/specification/FictionalAliasPractice.tsx:7:37 | text | void } export default function FictionalAliasPractice({ examples, value, onChange, onUseExample }: FictionalAliasPracticeProps): ReactElement { const instanceId = useId() const titleId = `alias-practice-title-${instanceId}` const inputId = `fictional-alias-${instanceId}` const warningId = `alias-practice-warning-${instanceId}` return ( | input | long-or-dense, technical-or-internal |
| src/features/specification/FictionalAliasPractice.tsx:18:24 | text | 가상 별명 연습 | heading | repeated-text |
| src/features/specification/FictionalAliasPractice.tsx:19:32 | text | 가상 별명 연습 | input | repeated-text |
| src/features/specification/FictionalAliasPractice.tsx:29:10 | text | 12자 이내의 가상 별명을 입력하세요. 예시를 눌러도 안전한 연습용 값만 채워집니다. | input | abstract-or-formal, multiple-actions |
| src/features/specification/FictionalAliasPractice.tsx:30:24 | aria-label | 가상 별명 예시 | aria-label | — |
| src/features/specification/FictionalAliasPractice.tsx:32:85 | text | 예시 사용: | button-or-action | — |
| src/features/specification/FictionalAliasPractice.tsx:37:25 | text | 실제 이름·전화번호·주소 등 개인정보를 입력하지 말 것. 입력은 임시 미리보기이며 저장/전송 안 됨. | input | abstract-or-formal, multiple-actions |
| src/features/specification/FictionalAliasPractice.tsx:38:20 | text | 미리보기: {value} | learner-text-candidate | — |
| src/features/start/CaseSelector.test.tsx:20:44 | text | button | button-or-action | repeated-text |
| src/features/start/CaseSelector.test.tsx:20:62 | text | 사진 스캔 과제함 | button-or-action | repeated-text |
| src/features/start/CaseSelector.test.tsx:20:85 | text | [data-case-card] | button-or-action | repeated-text |
| src/features/start/CaseSelector.test.tsx:21:45 | text | button | button-or-action | repeated-text |
| src/features/start/CaseSelector.test.tsx:21:63 | text | 음성 읽기 연습 | button-or-action | repeated-text |
| src/features/start/CaseSelector.test.tsx:21:85 | text | [data-case-card] | button-or-action | repeated-text |
| src/features/start/CaseSelector.test.tsx:22:45 | text | button | button-or-action, instruction | repeated-text |
| src/features/start/CaseSelector.test.tsx:22:63 | text | 교실 지도 안내 | button-or-action, instruction | repeated-text |
| src/features/start/CaseSelector.test.tsx:22:85 | text | [data-case-card] | button-or-action, instruction | repeated-text |
| src/features/start/CaseSelector.test.tsx:25:49 | text | 지금 선택한 사례 | hint | repeated-text |
| src/features/start/CaseSelector.test.tsx:27:50 | text | 완료한 사례 | hint | repeated-text |
| src/features/start/CaseSelector.test.tsx:29:50 | text | 선택 가능 | hint | repeated-text |
| src/features/start/CaseSelector.test.tsx:30:30 | text | button | button-or-action | repeated-text |
| src/features/start/CaseSelector.test.tsx:30:48 | text | 음성 읽기 연습 | button-or-action | repeated-text |
| src/features/start/CaseSelector.tsx:8:32 | text | void } export default function CaseSelector({ completedCaseIds, selectedCaseId, onSelect, }: CaseSelectorProps): ReactElement { return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/start/CaseSelector.tsx:17:57 | text | case-selector-title | learner-text-candidate | — |
| src/features/start/CaseSelector.tsx:18:36 | text | 사례 선택 | heading | repeated-text |
| src/features/start/CaseSelector.tsx:19:44 | text | 사례를 골라 권한을 살펴봅니다. | learner-text-candidate | — |
| src/features/start/CaseSelector.tsx:40:38 | text | ${descriptionId} ${statusId} | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/features/start/CaseSelector.tsx:46:67 | text | {completed ? '완료한 사례' : selected ? '지금 선택한 사례' : '선택 가능'} | learner-text-candidate | long-or-dense, multiple-actions |
| src/features/start/CaseSelector.tsx:47:33 | text | 완료한 사례 | learner-text-candidate | repeated-text |
| src/features/start/CaseSelector.tsx:47:55 | text | 지금 선택한 사례 | learner-text-candidate | repeated-text |
| src/features/start/CaseSelector.tsx:47:69 | text | 선택 가능 | learner-text-candidate | repeated-text |
| src/features/start/LearningOverview.test.tsx:11:30 | text | heading | heading | repeated-text |
| src/features/start/LearningOverview.test.tsx:11:49 | text | 학습 목표 | heading | repeated-text |
| src/features/start/LearningOverview.test.tsx:12:30 | text | 오늘 배울 것 | learner-text-candidate | repeated-text |
| src/features/start/LearningOverview.test.tsx:14:30 | text | 사례를 골라 시작해 보세요. | learner-text-candidate | repeated-text |
| src/features/start/LearningOverview.test.tsx:15:30 | text | 사례를 골라 시작해 보세요. | learner-text-candidate | repeated-text |
| src/features/start/LearningOverview.test.tsx:16:30 | text | 완료한 사례 1/4 | learner-text-candidate | — |
| src/features/start/LearningOverview.test.tsx:21:42 | text | 아래 버튼을 눌러 기능 명세를 확인해 보세요. | learner-text-candidate | multiple-actions, repeated-text |
| src/features/start/LearningOverview.tsx:15:61 | text | learning-overview-title | learner-text-candidate | — |
| src/features/start/LearningOverview.tsx:16:47 | text | 오늘 배울 것 | learner-text-candidate | repeated-text |
| src/features/start/LearningOverview.tsx:17:40 | text | 학습 목표 | heading | repeated-text |
| src/features/start/LearningOverview.tsx:18:10 | text | 기능 설명을 읽고 필요한 권한만 최소한으로 허용할지 생각해 봅니다. | learner-text-candidate | — |
| src/features/start/LearningOverview.tsx:19:72 | text | {selectedCase ? '아래 버튼을 눌러 기능 명세를 확인해 보세요.' : '사례를 골라 시작해 보세요.'} | learner-text-candidate | long-or-dense, multiple-actions |
| src/features/start/LearningOverview.tsx:20:26 | text | 아래 버튼을 눌러 기능 명세를 확인해 보세요. | learner-text-candidate | multiple-actions, repeated-text |
| src/features/start/LearningOverview.tsx:20:56 | text | 사례를 골라 시작해 보세요. | learner-text-candidate | repeated-text |
| src/features/start/LearningOverview.tsx:22:69 | text | 완료한 사례 {completedCaseCount}/{totalCaseCount} | learner-text-candidate | — |
| src/features/start/StartScreen.test.tsx:28:30 | text | 실제 권한 없음 · 개인정보 입력 금지 · 저장은 직접 선택합니다. | input | abstract-or-formal, multiple-actions, repeated-text |
| src/features/start/StartScreen.test.tsx:29:45 | text | 학습 범위와 안전 더 보기 | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.test.tsx:32:30 | text | 교사용 안내 | instruction | repeated-text |
| src/features/start/StartScreen.test.tsx:33:40 | text | 학습 범위와 안전 더 보기 | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.test.tsx:34:30 | text | 교사용 안내 | instruction | repeated-text |
| src/features/start/StartScreen.test.tsx:35:40 | text | 교사용 안내 | instruction | repeated-text |
| src/features/start/StartScreen.test.tsx:37:63 | text | button | button-or-action, instruction | repeated-text |
| src/features/start/StartScreen.test.tsx:37:103 | text | photo-scan | button-or-action, instruction | repeated-text |
| src/features/start/StartScreen.test.tsx:37:118 | text | 사진 스캔 과제함 | button-or-action, instruction | repeated-text |
| src/features/start/StartScreen.test.tsx:37:143 | text | voice-reading | button-or-action, instruction | — |
| src/features/start/StartScreen.test.tsx:37:161 | text | 음성 읽기 연습 | button-or-action, instruction | repeated-text |
| src/features/start/StartScreen.test.tsx:37:185 | text | class-map | button-or-action, instruction | — |
| src/features/start/StartScreen.test.tsx:37:199 | text | 교실 지도 안내 | button-or-action, instruction | repeated-text |
| src/features/start/StartScreen.test.tsx:37:212 | text | 모둠 알림판 | button-or-action, instruction | repeated-text |
| src/features/start/StartScreen.test.tsx:43:43 | text | heading | heading | repeated-text |
| src/features/start/StartScreen.test.tsx:43:62 | text | 사례 선택 | heading | repeated-text |
| src/features/start/StartScreen.test.tsx:43:81 | text | section | heading | repeated-text |
| src/features/start/StartScreen.test.tsx:44:45 | text | 학습 범위와 안전 더 보기 | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.test.tsx:45:46 | text | 저장 범위와 삭제 방법 | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.test.tsx:54:30 | text | 실제 권한 없음 · 개인정보 입력 금지 · 저장은 직접 선택합니다. | input | abstract-or-formal, multiple-actions, repeated-text |
| src/features/start/StartScreen.test.tsx:61:47 | text | ) expect(screen.getByText('완료한 사례')).toBeVisible() const start = screen.getByRole('button', { name: '기능 명세 보기' }) expect(start).toBeDisabled() expect(start).not.toHaveClass('gi-pulse') expect(view.container.querySelectorAll('.gi-pulse')).toHaveLength(0) await user.click(screen.getByRole('button', { name: /음성 읽기 연습/ })) expect(p.onSelectCase).toHaveBeenCalledWith('voice-reading') view.rerender( | button-or-action | long-or-dense |
| src/features/start/StartScreen.test.tsx:62:30 | text | 완료한 사례 | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.test.tsx:63:37 | text | button | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:63:55 | text | 기능 명세 보기 | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:67:40 | text | button | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:70:45 | text | button | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:70:63 | text | 기능 명세 보기 | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:74:79 | text | 단계 1 | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.test.tsx:81:47 | text | ) const checkbox = screen.getByRole('checkbox', { name: '이 기기에 저장' }) await user.click(checkbox) expect(p.onSaveOnDeviceChange).toHaveBeenCalledWith(true) await user.click(screen.getByRole('button', { name: '이 기기에 저장한 기록 불러오기' })) expect(p.onLoadSavedProgress).toHaveBeenCalledOnce() await user.click(screen.getByRole('button', { name: '저장 기록 지우기' })) expect(p.onClearSavedProgress).toHaveBeenCalledOnce() await user.click(screen.getByRole('button', { name: /사진 스캔 과제함/ })) view.rerender( | button-or-action | long-or-dense, multiple-actions |
| src/features/start/StartScreen.test.tsx:82:60 | text | 이 기기에 저장 | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.test.tsx:85:40 | text | button | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:85:58 | text | 이 기기에 저장한 기록 불러오기 | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:87:40 | text | button | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:87:58 | text | 저장 기록 지우기 | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:89:40 | text | button | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:91:30 | text | button | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:91:80 | text | aria-pressed | button-or-action | missing-term-explanation, technical-or-internal |
| src/features/start/StartScreen.test.tsx:91:96 | text | true | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:98:30 | text | 사례를 골라 시작해 보세요. | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.test.tsx:99:30 | text | button | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:99:48 | text | 이 기기에 저장한 기록 불러오기 | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:99:84 | text | secondary-action | button-or-action | — |
| src/features/start/StartScreen.test.tsx:100:30 | text | button | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:100:48 | text | 저장 기록 지우기 | button-or-action | repeated-text |
| src/features/start/StartScreen.test.tsx:100:76 | text | destructive-action | button-or-action | — |
| src/features/start/StartScreen.test.tsx:105:47 | text | ) expect(screen.getByText('공용 기기에서는 저장하지 않고 사용 후 기록을 삭제하세요.')).toBeVisible() view.rerender( | learner-text-candidate | long-or-dense |
| src/features/start/StartScreen.test.tsx:106:30 | text | 공용 기기에서는 저장하지 않고 사용 후 기록을 삭제하세요. | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.test.tsx:114:27 | text | 권한 선택과 근거 문장만 이 기기에 저장 중입니다. 별명과 실제 개인정보는 저장하지 않습니다. | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.test.tsx:118:33 | text | 권한 선택과 근거 문장만 이 기기에 저장 중입니다. 별명과 실제 개인정보는 저장하지 않습니다. | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.test.tsx:119:59 | text | 권한 선택과 근거 문장만 이 기기에 저장 중입니다. 별명과 실제 개인정보는 저장하지 않습니다. | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.tsx:21:30 | text | void } export default function StartScreen({ state, onSelectCase, onOpenSpecification, onSaveOnDeviceChange, onLoadSavedProgress, onClearSavedProgress, }: StartScreenProps): ReactElement { const clearHintId = `${useId()}-clear-storage-hint` const primaryActionRef = useRef | hint | long-or-dense, technical-or-internal |
| src/features/start/StartScreen.tsx:44:18 | text | { if (!pendingSelectionRef.current \|\| state.activeCaseId === null) return pendingSelectionRef.current = false if (document.querySelector('[role="dialog"][aria-modal="true"]')) return primaryActionRef.current?.focus() }, [state.activeCaseId]) return ( | learner-text-candidate | long-or-dense, technical-or-internal |
| src/features/start/StartScreen.tsx:47:33 | text | [role="dialog"][aria-modal="true"] | learner-text-candidate | technical-or-internal |
| src/features/start/StartScreen.tsx:53:44 | text | 학습 시작 | heading | repeated-text |
| src/features/start/StartScreen.tsx:70:8 | text | 기능 명세 보기 | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.tsx:73:58 | text | learning-boundary-title | learner-text-candidate | — |
| src/features/start/StartScreen.tsx:74:42 | text | 학습 범위와 안전 | heading | repeated-text |
| src/features/start/StartScreen.tsx:75:45 | text | 실제 권한 없음 · 개인정보 입력 금지 · 저장은 직접 선택합니다. | input | abstract-or-formal, multiple-actions, repeated-text |
| src/features/start/StartScreen.tsx:76:12 | text | 이 활동은 가상 학습 모델이며 실제 앱 판정이 아님을 알려 드립니다. 실제 권한을 묻지 않습니다. | learner-text-candidate | — |
| src/features/start/StartScreen.tsx:78:20 | text | 학습 범위와 안전 더 보기 | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.tsx:81:22 | text | 교사용 안내 | instruction | repeated-text |
| src/features/start/StartScreen.tsx:87:59 | text | save-title | learner-text-candidate | — |
| src/features/start/StartScreen.tsx:88:29 | text | 학습 기록 | heading | — |
| src/features/start/StartScreen.tsx:95:13 | text | 이 기기에 저장 | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.tsx:97:17 | text | {state.saveOnDevice ? ( | learner-text-candidate | technical-or-internal |
| src/features/start/StartScreen.tsx:99:14 | text | 권한 선택과 근거 문장만 이 기기에 저장 중입니다. 별명과 실제 개인정보는 저장하지 않습니다. | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.tsx:101:14 | text | 공용 기기에서는 저장하지 않고 사용 후 기록을 삭제하세요. | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.tsx:104:20 | text | 저장 범위와 삭제 방법 | learner-text-candidate | repeated-text |
| src/features/start/StartScreen.tsx:105:14 | text | 저장에 동의하면 권한 선택과 근거 원문이 이 기기에 남을 수 있습니다. 별명과 실제 개인정보는 입력하지 마세요. | input | abstract-or-formal, long-or-dense, multiple-actions |
| src/features/start/StartScreen.tsx:106:14 | text | 공용 기기에서는 저장을 끄고, 아래의 저장 기록 지우기 버튼을 눌러 학습 기록을 삭제하세요. | learner-text-candidate | multiple-actions |
| src/features/start/StartScreen.tsx:108:90 | text | 이 기기에 저장한 기록 불러오기 | button-or-action | repeated-text |
| src/features/start/StartScreen.tsx:111:58 | text | 이 앱의 전용 학습 기록만 지우며 다른 저장 정보는 건드리지 않습니다. | hint | — |
| src/features/start/StartScreen.tsx:112:124 | text | 저장 기록 지우기 | button-or-action, hint | repeated-text |
| src/main.tsx:1:38 | text | import { StrictMode } from 'react' import { createRoot } from 'react-dom/client' import './styles/tokens.css' import './styles/global.css' import './styles/components.css' import './styles/responsive.css' import './styles/interactive.css' import './styles/print.css' import App from './app/App' const rootElement = document.getElementById('root') if (!rootElement) { throw new Error('앱을 표시할 root 요소를 찾을 수 없습니다.') } createRoot(rootElement).render( | feedback-or-error | long-or-dense, technical-or-internal |
| src/main.tsx:16:20 | text | 앱을 표시할 root 요소를 찾을 수 없습니다. | feedback-or-error | — |
| src/storage/progressStorage.test.ts:45:25 | text | 목소리 읽기에는 마이크만 살펴봅니다. | learner-text-candidate | — |
| src/storage/progressStorage.test.ts:55:21 | text | 학생이 입력한 문장이 섞이면 안 됩니다. | input | abstract-or-formal |
| src/storage/progressStorage.test.ts:96:73 | text | 햇살 | learner-text-candidate | repeated-text |
| src/storage/progressStorage.test.ts:97:73 | text | 햇살 | learner-text-candidate | repeated-text |
| src/storage/progressStorage.test.ts:99:7 | text | returns null for malformed %s data without throwing | learner-text-candidate | missing-term-explanation, technical-or-internal |
| src/storage/progressStorage.test.ts:134:7 | text | returns null and keeps storage errors contained | feedback-or-error | missing-term-explanation, technical-or-internal |
| src/storage/progressStorage.test.ts:136:47 | text | blocked | feedback-or-error | repeated-text |
| src/storage/progressStorage.test.ts:137:47 | text | blocked | feedback-or-error | repeated-text |
| src/storage/progressStorage.test.ts:138:50 | text | blocked | feedback-or-error | repeated-text |
| src/storage/progressStorage.ts:30:41 | text | 저장된 학습 기록을 불러왔습니다. | learner-text-candidate | repeated-text |
| src/styles/styles.test.ts:17:39 | text | @ts-expect-error | feedback-or-error | — |
| src/styles/styles.test.ts:48:36 | text | Missing CSS rule for ${selector} | feedback-or-error | technical-or-internal |
| src/styles/styles.test.ts:110:7 | text | gives stage headings and requirement hints a stable visual anchor | heading, hint | long-or-dense |
| src/styles/styles.test.ts:119:7 | text | provides responsive button feedback without moving surrounding layout | button-or-action, feedback-or-error | long-or-dense, missing-term-explanation, technical-or-internal |
| src/test/fixtures.ts:24:21 | text | ${APP_CASES[caseId].title}에 필요한 권한만 선택했습니다. | learner-text-candidate | missing-term-explanation, technical-or-internal |

## Limitations

- Candidates are triage signals, not an automatic grade-level or readability certification.
- Static scanning can miss runtime-composed text, fetched content, canvas/image text, and some template syntax.
- Every candidate requires rendered-state, target-grade, learning-intent, and curriculum-accuracy review.
- This command reads source files and writes only the optional report path; it never rewrites source files.

## Configuration

- Extensions: `.astro, .cjs, .htm, .html, .js, .jsx, .mjs, .svelte, .ts, .tsx, .vue`
- Excluded directories: `.git, .next, .nuxt, .parcel-cache, .turbo, .vite, build, coverage, dist, node_modules, out, target, vendor`
