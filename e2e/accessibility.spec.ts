import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

import { completeAllCasesWithKeyboard } from './helpers/keyboardFlow'

export async function assertNoSeriousAxeViolations(page: Page): Promise<void> {
  const result = await new AxeBuilder({ page }).analyze()
  const seriousOrCritical = result.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
  expect(seriousOrCritical, seriousOrCritical.map(({ id, help }) => `${id}: ${help}`).join('\n')).toEqual([])
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
  for (let index = 0; index < await controls.count(); index += 1) await expect(controls.nth(index)).toBeVisible()
  await page.keyboard.press('Tab')
  const focused = page.locator(':focus')
  await expect(focused).toHaveCount(1)
  await expect(focused).toHaveCSS('outline-width', '3px')
}

test('checks every learner stage, live status, focus, labels, and history dialog', async ({ page }) => {
  await page.goto('/')
  await assertStageSemantics(page)
  await expect(page.getByRole('status').first()).toContainText('가상 학습 모델')

  await page.getByRole('button', { name: '사진 스캔 과제함', exact: true }).press('Space')
  await page.getByRole('button', { name: '기능 명세 보기', exact: true }).press('Enter')
  await assertStageSemantics(page)
  await page.getByRole('button', { name: '권한 심사 시작', exact: true }).press('Enter')
  await assertStageSemantics(page)
  for (let index = 0; index < 4; index += 1) await page.getByRole('radio', { name: '허용하지 않음', exact: true }).nth(index).press('Space')
  await expect(page.locator('[aria-live="polite"]').filter({ hasText: '권한' })).toBeVisible()
  await page.getByRole('button', { name: '선택 검토', exact: true }).press('Enter')
  await assertStageSemantics(page)
  await page.getByRole('radio', { name: '대안 사용', exact: true }).press('Space')
  await page.getByRole('button', { name: '최소 권한안 수정', exact: true }).press('Enter')
  await assertStageSemantics(page)

  for (let index = 0; index < 4; index += 1) await page.getByRole('radio', { name: '허용하지 않음', exact: true }).nth(index).press('Space')
  await page.getByRole('textbox', { name: '내 판단 근거' }).pressSequentially('필요한 정보만 사용합니다.')
  await page.getByRole('checkbox', { name: '정보 최소화', exact: true }).press('Space')
  await page.getByRole('button', { name: '선택 검토', exact: true }).press('Enter')
  await assertStageSemantics(page)
  await expect(page.getByRole('heading', { name: '학습 시작' })).toBeVisible()

  await page.getByRole('button', { name: '업데이트 내역', exact: true }).press('Enter')
  await expect(page.getByRole('dialog', { name: '업데이트 내역' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: '업데이트 내역', exact: true })).toBeFocused()

  await page.goto('/')
  await completeAllCasesWithKeyboard(page, async (stage) => {
    await assertStageSemantics(page)
    if (stage === 'revocation') await expect(page.getByRole('heading', { name: '권한 철회 미니 활동' })).toBeVisible()
    if (stage === 'report') await expect(page.getByRole('heading', { name: '최소 권한 학습 보고서' })).toBeVisible()
  })
  await expect(page.getByRole('table')).toHaveCount(4)
  await expect(page.getByRole('columnheader', { name: '권한' })).toHaveCount(4)
})

test('completes all cases, both conditional comparisons, revocation, history, and report with keyboard helper', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '업데이트 내역', exact: true }).press('Enter')
  await page.keyboard.press('Escape')
  await completeAllCasesWithKeyboard(page)
  await expect(page.getByRole('heading', { name: '최소 권한 학습 보고서' })).toBeVisible()
})
