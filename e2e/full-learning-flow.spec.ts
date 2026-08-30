import { expect, test, type Page } from '@playwright/test'

import { CASE_ORDER } from '../src/content/cases'
import { PROGRESS_STORAGE_KEY } from '../src/storage/progressStorage'
import { recordPrimaryActionRects } from './helpers/keyboardFlow'

const CASE_TITLES: Readonly<Record<(typeof CASE_ORDER)[number], string>> = {
  'photo-scan': '사진 스캔 과제함',
  'voice-reading': '음성 읽기 연습',
  'class-map': '교실 지도 안내',
  'group-board': '모둠 알림판',
}

/** Completes the four cases in order and inspects the resulting report. */
async function completeAllCases(page: Page): Promise<void> {
  for (const [index, caseId] of CASE_ORDER.entries()) {
    const caseHeading = page.getByRole('heading', { name: CASE_TITLES[caseId], exact: true })
    if (await caseHeading.count() === 0) {
      await expect(page.getByRole('heading', { name: '학습 시작' })).toBeVisible()
      await page.getByRole('button', { name: CASE_TITLES[caseId], exact: true }).click()
      await page.getByRole('button', { name: '기능 명세 보기', exact: true }).press('Enter')
      await expect(caseHeading).toBeVisible()
    }
    if (caseId === 'group-board') {
      const aliasInput = page.getByRole('textbox', { name: '가상 별명 연습' })
      await expect(aliasInput).toHaveValue('')
      const blockedReviewStart = page.getByRole('button', { name: '권한 심사 시작', exact: true })
      await expect(blockedReviewStart).toBeDisabled()
      await expect(blockedReviewStart).toHaveAttribute('aria-describedby')
      await page.getByRole('button', { name: '예시 사용: 햇살', exact: true }).click()
      await expect(aliasInput).toHaveValue('햇살')
    }
    const reviewStart = page.getByRole('button', { name: '권한 심사 시작', exact: true })
    if (await reviewStart.count() > 0) await reviewStart.press('Enter')

    const initialChoices = page.getByRole('radio', { name: '허용하지 않음', exact: true })
    await expect(initialChoices).toHaveCount(4)
    for (let permissionIndex = 0; permissionIndex < 4; permissionIndex += 1) await initialChoices.nth(permissionIndex).check()
    await page.getByRole('button', { name: '선택 검토', exact: true }).press('Enter')

    const switchControl = page.getByRole('checkbox', { name: /내 위치 표시 기능 켜기/ })
    const expectedConditionCount = caseId === 'voice-reading' || caseId === 'class-map' ? 1 : 0
    const conditionButtons = page.getByRole('button', { name: '비교 확인', exact: true })
    await expect(conditionButtons).toHaveCount(expectedConditionCount)
    if (caseId === 'voice-reading') {
      await expect(switchControl).toHaveCount(0)
      await expect(page.getByRole('heading', { name: /마이크는 녹음 버튼을 누르고 있는 동안/ })).toBeVisible()
      await conditionButtons.first().click()
    } else if (caseId === 'class-map') {
      await expect(switchControl).toHaveCount(1)
      await switchControl.check()
      await expect(page.getByText(/기본 저장 지도는 권한 없이/)).toBeVisible()
      await conditionButtons.first().click()
    } else {
      await expect(switchControl).toHaveCount(0)
    }
    if (expectedConditionCount === 1) await expect(page.getByRole('button', { name: '비교 확인 완료', exact: true })).toHaveCount(1)
    await page.getByRole('radio', { name: index % 2 === 0 ? '대안 사용' : '권한 철회', exact: true }).check()
    await page.getByRole('button', { name: '최소 권한안 수정', exact: true }).press('Enter')

    await expect(page.getByRole('heading', { name: '최초 선택 비교', exact: true })).toBeVisible()
    const revisedChoices = page.getByRole('radio', { name: '허용하지 않음', exact: true })
    await expect(revisedChoices).toHaveCount(4)
    for (let permissionIndex = 0; permissionIndex < 4; permissionIndex += 1) await revisedChoices.nth(permissionIndex).check()
    if (index === 0) await page.getByRole('radio', { name: '이번 기능에만 허용', exact: true }).first().check()
    await page.getByRole('textbox', { name: '내 판단 근거' }).fill(`${CASE_TITLES[caseId]}에서 필요한 정보만 사용하고 통제 방법을 기록했습니다.`)
    await page.getByRole('checkbox', { name: '정보 최소화', exact: true }).check()
    await page.getByRole('button', { name: '선택 검토', exact: true }).press('Enter')
  }

  await page.getByRole('button', { name: '권한 철회 연습 시작', exact: true }).press('Enter')
  const keepChoices = page.getByRole('radio', { name: '현재 기능에 유지', exact: true })
  const revokeChoices = page.getByRole('radio', { name: '지금 철회', exact: true })
  await expect(keepChoices).toHaveCount(4)
  await expect(revokeChoices).toHaveCount(4)
  for (let permissionIndex = 0; permissionIndex < 3; permissionIndex += 1) await keepChoices.nth(permissionIndex).check()
  await revokeChoices.nth(3).check()
  await page.getByRole('button', { name: '철회 판단 완료', exact: true }).press('Enter')
  await page.getByRole('button', { name: '학습 보고서 보기', exact: true }).press('Enter')

  await expect(page.getByRole('heading', { name: '최소 권한 학습 보고서' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '네 사례 완료 요약' })).toBeVisible()
  await expect(page.getByText('판단이 바뀐 것은 배움의 증거예요')).toBeVisible()
  if ((page.viewportSize()?.width ?? 0) <= 640) {
    await expect(page.locator('.decision-comparison-cards')).toHaveCount(4)
    await expect(page.locator('.decision-comparison-cards').first()).toBeVisible()
  } else {
    await expect(page.getByRole('table')).toHaveCount(4)
    await expect(page.locator('table caption')).toHaveCount(4)
  }
  const reportCases = page.locator('[data-report-case]')
  await expect(reportCases).toHaveCount(4)
  for (let index = 0; index < 4; index += 1) {
    const reportCase = reportCases.nth(index)
    if ((page.viewportSize()?.width ?? 0) <= 640) {
      await expect(reportCase.locator('.decision-comparison-cards')).toBeVisible()
      await expect(reportCase.locator('.decision-comparison-card')).toHaveCount(4)
    } else {
      await expect(reportCase.getByRole('columnheader', { name: '최초 선택' })).toBeVisible()
      await expect(reportCase.getByRole('columnheader', { name: '수정 선택' })).toBeVisible()
    }
    await expect(reportCase.getByText('근거 차원 확인')).toBeVisible()
    for (const dimension of ['기능 연결', '정보 최소화', '사용자 통제', '다른 사람 존중']) {
      await expect(reportCase.getByText(dimension, { exact: true })).toBeVisible()
    }
    await expect(reportCase.getByText(/다음 행동:/)).toBeVisible()
  }
  const changedMarker = (page.viewportSize()?.width ?? 0) <= 640
    ? page.locator('.decision-comparison-cards').getByText('◆ 판단 변경').first()
    : page.getByText('◆ 판단 변경').first()
  await expect(changedMarker).toBeVisible()
  await expect(page.getByText('통제 후 허용')).toHaveCount(2)
  await expect(page.getByText('허용하지 않기')).toHaveCount(2)
  await expect(page.getByText('가상 학습 모델이며 실제 앱 판정이 아님', { exact: true })).toBeVisible()
  await expect(page.getByText(/실제 안전 판정이 아닙니다/)).toBeVisible()
  const nextActions = page.getByRole('region', { name: '다음 학습 행동' })
  await expect(nextActions).toContainText('인쇄해 수업에서 함께 돌아보기')
  await expect(nextActions).toContainText('다시 시작해 다른 사례를 연습하기')
}

test('completes all four cases and keeps the default branch clean after reload', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '학습 시작' })).toBeVisible()
  await expect(page.getByRole('checkbox', { name: '이 기기에 저장' })).not.toBeChecked()
  await expect(page.evaluate(() => Object.keys(window.localStorage))).resolves.toEqual([])

  await page.getByRole('button', { name: CASE_TITLES['photo-scan'], exact: true }).click()
  await page.getByRole('button', { name: '기능 명세 보기', exact: true }).press('Enter')
  await page.reload()
  await expect(page.getByRole('heading', { name: '학습 시작' })).toBeVisible()
  await expect(page.getByRole('checkbox', { name: '이 기기에 저장' })).not.toBeChecked()
  await expect(page.evaluate(() => Object.keys(window.localStorage))).resolves.toEqual([])

  await completeAllCases(page)
})

test('keeps a normal-motion primary action rectangle stable while pulsing', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: CASE_TITLES['photo-scan'], exact: true }).click()
  const primaryAction = page.getByRole('button', { name: '기능 명세 보기', exact: true })
  const rects = await recordPrimaryActionRects(primaryAction)
  const first = rects[0]
  expect(first).toBeDefined()
  for (const rect of rects.slice(1)) {
    expect(Math.abs(rect.x - first.x)).toBeLessThanOrEqual(0.5)
    expect(Math.abs(rect.y - first.y)).toBeLessThanOrEqual(0.5)
    expect(Math.abs(rect.width - first.width)).toBeLessThanOrEqual(0.5)
    expect(Math.abs(rect.height - first.height)).toBeLessThanOrEqual(0.5)
  }
})

test('recovers an isolated opt-in record, then clears it before a clean reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('checkbox', { name: '이 기기에 저장' }).check()
  await page.getByRole('button', { name: CASE_TITLES['photo-scan'], exact: true }).click()
  await page.getByRole('button', { name: '기능 명세 보기', exact: true }).press('Enter')
  await expect(page.getByRole('heading', { name: CASE_TITLES['photo-scan'], exact: true })).toBeVisible()
  await expect(page.evaluate((key) => window.localStorage.getItem(key), PROGRESS_STORAGE_KEY)).resolves.not.toBeNull()

  await page.reload()
  await expect(page.getByRole('heading', { name: '학습 시작' })).toBeVisible()
  await page.getByRole('button', { name: '이 기기에 저장한 기록 불러오기', exact: true }).click()
  await expect(page.getByRole('heading', { name: CASE_TITLES['photo-scan'], exact: true })).toBeVisible()

  await completeAllCases(page)
  const dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
    expect(dialog.message()).toContain('처음부터')
    await dialog.accept()
  })
  await page.getByRole('button', { name: '처음부터 다시 하기', exact: true }).click()
  await dialogPromise
  await expect(page.getByRole('heading', { name: '학습 시작' })).toBeVisible()
  await expect(page.getByRole('checkbox', { name: '이 기기에 저장' })).not.toBeChecked()
  await expect(page.evaluate((key) => window.localStorage.getItem(key), PROGRESS_STORAGE_KEY)).resolves.toBeNull()
  await page.reload()
  await expect(page.getByRole('heading', { name: '학습 시작' })).toBeVisible()
  await expect(page.getByRole('checkbox', { name: '이 기기에 저장' })).not.toBeChecked()
  await expect(page.evaluate(() => Object.keys(window.localStorage))).resolves.toEqual([])
})
