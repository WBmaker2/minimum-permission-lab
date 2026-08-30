import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

import { completeAllCasesWithKeyboard } from './helpers/keyboardFlow'

export async function assertNoSeriousAxeViolations(page: Page): Promise<void> {
  const result = await new AxeBuilder({ page }).analyze()
  const seriousOrCritical = result.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
  expect(seriousOrCritical, seriousOrCritical.map(({ id, help }) => `${id}: ${help}`).join('\n')).toEqual([])
}

async function assertStageFocus(page: Page, progress: string): Promise<void> {
  const heading = page.locator('h2[data-stage-heading]').first()
  await expect(heading).toBeVisible()
  await expect(heading).toBeFocused()
  const rect = await heading.evaluate((element) => {
    const box = element.getBoundingClientRect()
    return { top: box.top, bottom: box.bottom, viewportHeight: window.innerHeight }
  })
  expect(rect.top).toBeGreaterThanOrEqual(0)
  expect(rect.bottom).toBeLessThanOrEqual(rect.viewportHeight)
  await expect(page.locator('header').getByRole('status')).toContainText(progress)
}

async function assertStageSemantics(page: Page): Promise<void> {
  await assertNoSeriousAxeViolations(page)
  await expect(page.locator('h1')).toHaveCount(1)
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll((elements) => elements.map((element) => Number(element.tagName.slice(1))))
  expect(headings[0]).toBe(1)
  for (let index = 1; index < headings.length; index += 1) expect(headings[index] - headings[index - 1]).toBeLessThanOrEqual(1)
  const landmarks = await page.locator('header, main, nav, aside, footer').evaluateAll((elements) => elements.map((element) => `${element.tagName}:${element.getAttribute('aria-label') ?? element.getAttribute('aria-labelledby') ?? ''}`))
  expect(new Set(landmarks).size).toBe(landmarks.length)
  const controls = page.locator('button, input, textarea, select, summary')
  for (let index = 0; index < await controls.count(); index += 1) {
    const control = controls.nth(index)
    if (await control.isVisible()) await expect(control).toBeVisible()
  }
  await page.keyboard.press('Tab')
  const focused = page.locator(':focus')
  await expect(focused).toHaveCount(1)
  await expect(focused).toHaveCSS('outline-width', '3px')
}

test('checks every learner stage, live status, focus, labels, and history dialog', async ({ page }) => {
  await page.goto('/')
  await assertStageFocus(page, '1/7 · 시작')
  await assertStageSemantics(page)
  await expect(page.getByText('가상 학습 모델', { exact: true })).toBeVisible()
  await expect(page.getByText('실제 권한 없음 · 개인정보 입력 금지 · 저장은 직접 선택합니다.', { exact: true })).toBeVisible()
  const safetyDetails = page.getByText('학습 범위와 안전 더 보기', { exact: true }).locator('..')
  const storageDetails = page.getByText('저장 범위와 삭제 방법', { exact: true }).locator('..')
  await expect(safetyDetails).not.toHaveAttribute('open')
  await expect(storageDetails).not.toHaveAttribute('open')
  const startOrder = await page.locator('main').evaluate((main) => {
    const caseSection = main.querySelector('.case-selector')
    const safety = main.querySelector('.start-safety')
    const storage = main.querySelector('.start-storage')
    return {
      caseBeforeSafety: Boolean(caseSection && safety && (caseSection.compareDocumentPosition(safety) & Node.DOCUMENT_POSITION_FOLLOWING)),
      caseBeforeStorage: Boolean(caseSection && storage && (caseSection.compareDocumentPosition(storage) & Node.DOCUMENT_POSITION_FOLLOWING)),
    }
  })
  expect(startOrder.caseBeforeSafety).toBe(true)
  expect(startOrder.caseBeforeStorage).toBe(true)

  await page.getByRole('button', { name: '사진 스캔 과제함', exact: true }).press('Space')
  await page.getByRole('button', { name: '기능 명세 보기', exact: true }).press('Enter')
  await assertStageFocus(page, '2/7 · 기능 살펴보기')
  await assertStageSemantics(page)
  await page.getByRole('button', { name: '권한 심사 시작', exact: true }).press('Enter')
  await assertStageFocus(page, '3/7 · 권한 고르기')
  await assertStageSemantics(page)
  for (let index = 0; index < 4; index += 1) await page.getByRole('radio', { name: '허용하지 않음', exact: true }).nth(index).press('Space')
  await expect(page.locator('[data-live-region="status"]').filter({ hasText: '권한' })).toBeVisible()
  await page.getByRole('button', { name: '선택 검토', exact: true }).press('Enter')
  await assertStageFocus(page, '4/7 · 영향 비교하기')
  await assertStageSemantics(page)
  await page.getByRole('radio', { name: '대안 사용', exact: true }).press('Space')
  await page.getByRole('button', { name: '최소 권한안 수정', exact: true }).press('Enter')
  await assertStageFocus(page, '5/7 · 다시 고르기')
  await assertStageSemantics(page)

  for (let index = 0; index < 4; index += 1) await page.getByRole('radio', { name: '허용하지 않음', exact: true }).nth(index).press('Space')
  await page.getByRole('textbox', { name: '내 판단 근거' }).pressSequentially('필요한 정보만 사용합니다.')
  await page.getByRole('checkbox', { name: '정보 최소화', exact: true }).press('Space')
  await page.getByRole('button', { name: '선택 검토', exact: true }).press('Enter')
  await assertStageFocus(page, '1/7 · 시작')
  await assertStageSemantics(page)
  await expect(page.getByRole('heading', { name: '학습 시작' })).toBeVisible()

  await page.getByRole('button', { name: '업데이트 내역', exact: true }).press('Enter')
  await expect(page.getByRole('dialog', { name: '업데이트 내역' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: '업데이트 내역', exact: true })).toBeFocused()

  await page.goto('/')
  await completeAllCasesWithKeyboard(page, async (stage) => {
    await assertStageFocus(page, stage === 'revocation' ? '6/7 · 철회 연습' : '7/7 · 학습 보고서')
    await assertStageSemantics(page)
    if (stage === 'revocation') await expect(page.getByRole('heading', { name: '권한 철회 미니 활동' })).toBeVisible()
    if (stage === 'report') await expect(page.getByRole('heading', { name: '최소 권한 학습 보고서' })).toBeVisible()
  })
  if ((page.viewportSize()?.width ?? 0) <= 640) {
    await expect(page.locator('.decision-comparison-cards')).toHaveCount(4)
    await expect(page.locator('.decision-comparison-cards').first()).toBeVisible()
  } else {
    await expect(page.getByRole('table')).toHaveCount(4)
    await expect(page.getByRole('columnheader', { name: '권한' })).toHaveCount(4)
  }
  const nextActions = page.getByRole('region', { name: '다음 학습 행동' })
  await expect(nextActions).toBeVisible()
  await expect(nextActions).toContainText('인쇄해 수업에서 함께 돌아보기')
  await expect(nextActions).toContainText('다시 시작해 다른 사례를 연습하기')
})

test('starts keyboard progression on the first learner case action', async ({ page }) => {
  await page.goto('/')
  const heading = page.locator('h2[data-stage-heading]').first()
  await expect(heading).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: '사진 스캔 과제함', exact: true })).toBeFocused()
})

test('completes all cases, both conditional comparisons, revocation, history, and report with keyboard helper', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '업데이트 내역', exact: true }).press('Enter')
  await page.keyboard.press('Escape')
  await completeAllCasesWithKeyboard(page)
  await expect(page.getByRole('heading', { name: '최소 권한 학습 보고서' })).toBeVisible()
})
