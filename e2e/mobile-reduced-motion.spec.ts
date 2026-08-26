import { expect, test, type Locator } from '@playwright/test'

import { completeAllCasesWithKeyboard } from './helpers/keyboardFlow'

test.describe('375px reduced-motion learner flow', () => {
  test.use({ reducedMotion: 'reduce' })

  const assertPrimaryActionInViewport = async (button: Locator): Promise<void> => {
    await expect(button).toHaveCount(1)
    await expect(button).toBeVisible()
    await expect(button).toBeEnabled()
    await button.scrollIntoViewIfNeeded()
    const bottom = await button.evaluate((element) => element.getBoundingClientRect().bottom)
    const viewportHeight = await button.evaluate(() => window.innerHeight)
    expect(bottom).toBeLessThanOrEqual(viewportHeight)
  }

  test('completes the full flow without overflow or covered primary controls', async ({ page }) => {
    test.skip(test.info().project.name !== 'mobile-375', '375px assertions run in the mobile-375 project')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await completeAllCasesWithKeyboard(page, undefined, assertPrimaryActionInViewport)
    await expect(page).toHaveTitle(/앱 권한 최소허용 연구소/)
    await expect(page.getByRole('heading', { name: '최소 권한 학습 보고서' })).toBeVisible()
    const reportPrimary = page.getByRole('button', { name: '처음부터 다시 하기', exact: true })
    await expect(reportPrimary).toHaveCount(1)
    await expect(reportPrimary).toBeVisible()
    await expect(reportPrimary).toBeEnabled()
    await reportPrimary.scrollIntoViewIfNeeded()
    const reportPrimaryBottom = await reportPrimary.evaluate((element) => element.getBoundingClientRect().bottom)

    const metrics = await page.evaluate(() => {
      const viewport = document.documentElement.clientWidth
      const allElements = Array.from(document.querySelectorAll<HTMLElement>('*'))
      const animated = allElements.filter((element) => getComputedStyle(element).animationName !== 'none')
      const targets = Array.from(document.querySelectorAll<HTMLElement>('button, input, textarea, select, summary, label')).map((element) => ({
        tag: element.tagName,
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
      }))
      return {
        scrollWidth: document.documentElement.scrollWidth,
        viewport,
        animated: animated.map((element) => ({ name: getComputedStyle(element).animationName, duration: getComputedStyle(element).animationDuration })),
        targets,
      }
    })
    const viewportHeight = await page.evaluate(() => window.innerHeight)
    expect(metrics.viewport).toBe(375)
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewport)
    expect(metrics.animated).toEqual([])
    expect(reportPrimaryBottom).toBeLessThanOrEqual(viewportHeight)
    expect(metrics.targets.filter(({ width, height }) => width < 44 || height < 44)).toEqual([])

    const tables = page.locator('.comparison-table-scroll')
    for (let index = 0; index < await tables.count(); index += 1) {
      const table = tables.nth(index)
      const overflow = await table.evaluate((element) => ({ scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, overflowX: getComputedStyle(element).overflowX }))
      expect(overflow.overflowX).toBe('auto')
      expect(overflow.scrollWidth).toBeGreaterThanOrEqual(overflow.clientWidth)
    }
  })

  test('keeps the fixed outline and visible step number under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const button = page.getByRole('button', { name: '기능 명세 보기', exact: true })
    await page.getByRole('button', { name: '사진 스캔 과제함', exact: true }).press('Space')
    await expect(button).toHaveClass(/gi-pulse/)
    await expect(button.locator('.gi-pulse__step')).toHaveText('단계 1')
    const styles = await button.evaluate((element) => ({
      animationDuration: getComputedStyle(element).animationDuration,
      borderWidth: getComputedStyle(element).borderWidth,
      stepVisibility: getComputedStyle(element.querySelector('.gi-pulse__step') as Element).visibility,
    }))
    expect(styles.animationDuration).toBe('0s')
    expect(styles.borderWidth).toBe('3px')
    expect(styles.stepVisibility).toBe('visible')
  })
})
