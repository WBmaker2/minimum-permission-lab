import { expect, test, type Page } from '@playwright/test'

type CaseTitle = '교실 지도 안내' | '음성 읽기 연습'

interface RuntimeGuards {
  readonly unexpectedRequests: string[]
  readonly consoleErrors: string[]
}

function installRuntimeGuards(page: Page): RuntimeGuards {
  const configuredBaseURL = test.info().project.use.baseURL
  expect(configuredBaseURL).toBeTruthy()
  const allowedOrigin = new URL(configuredBaseURL as string).origin
  const unexpectedRequests: string[] = []
  const consoleErrors: string[] = []
  page.on('request', (request) => {
    const url = request.url()
    if (url.startsWith('data:') || url.startsWith('blob:')) return
    try {
      if (new URL(url).origin !== allowedOrigin) unexpectedRequests.push(url)
    } catch {
      unexpectedRequests.push(url)
    }
  })
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  return { unexpectedRequests, consoleErrors }
}

async function openImpact(page: Page, caseTitle: CaseTitle): Promise<void> {
  await page.goto('./')
  await page.getByRole('button', { name: caseTitle, exact: true }).click()
  await page.getByRole('button', { name: '기능 명세 보기', exact: true }).click()
  await page.getByRole('button', { name: '권한 심사 시작', exact: true }).click()
  const denyChoices = page.getByRole('radio', { name: '허용하지 않음', exact: true })
  await expect(denyChoices).toHaveCount(4)
  for (let index = 0; index < 4; index += 1) await denyChoices.nth(index).check()
  await page.getByRole('button', { name: '선택 검토', exact: true }).click()
  await expect(page.getByRole('heading', { name: '권한 영향 시뮬레이션', exact: true })).toBeVisible()
}

async function assertGuarded(guards: RuntimeGuards): Promise<void> {
  expect(guards.unexpectedRequests).toEqual([])
  expect(guards.consoleErrors).toEqual([])
}

test.describe('초등 학습자 표현·시뮬레이션 점검', () => {
  test('uses short, action-first Korean copy in the language-sensitive path', async ({ page }) => {
    const guards = installRuntimeGuards(page)
    await openImpact(page, '교실 지도 안내')

    await expect(page.getByText(/고른 권한이 켜져 있을 때 어떤 기능이 되는지 확인해 봅니다/)).toBeVisible()
    await expect(page.getByRole('heading', { name: '먼저 예상하고 한 가지 조건을 바꿔 보세요', exact: true })).toBeVisible()
    await expect(page.getByText('현재 위치 보기만 켜면 무엇이 달라질지 먼저 예상해 보세요.', { exact: true })).toBeVisible()
    await expect(page.getByText(/실제 권한은 바뀌지 않습니다/)).toBeVisible()
    await expect(page.getByText(/틀렸|정답|위험하니 반드시/)).not.toBeVisible()

    await page.getByRole('radio', { name: '현재 위치 보기 기능이 함께 켜져요.', exact: true }).check()
    const variable = page.getByRole('checkbox', { name: '현재 위치 보기 조건 켜기', exact: true })
    await variable.check()
    await page.getByRole('radio', { name: '스위치를 켜면 현재 위치 보기 기능이 함께 켜져요.', exact: true }).check()
    await page.getByRole('button', { name: '비교 결과 확인', exact: true }).click()
    await page.getByRole('radio', { name: '대안 사용', exact: true }).check()
    await page.getByRole('button', { name: '최소 권한안 수정', exact: true }).click()

    await expect(page.getByRole('heading', { name: '수정 권한 심사', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: '고른 이유를 써 보세요', exact: true })).toBeVisible()
    await expect(page.getByRole('textbox', { name: '내가 고른 이유', exact: true })).toBeVisible()
    await expect(page.getByText(/실제 이름·전화번호·주소는 쓰지 마세요/)).toBeVisible()
    await expect(page.getByText(/문장 도움말: 나는/)).toBeVisible()
    await assertGuarded(guards)
  })

  test('completes the map prediction, observation, explanation, and reset loop on a narrow screen', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) > 640, 'narrow-screen simulation assertions run in the mobile project')
    const guards = installRuntimeGuards(page)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 375, height: 812 })
    await openImpact(page, '교실 지도 안내')

    await page.getByRole('radio', { name: '현재 위치 보기 기능이 함께 켜져요.', exact: true }).check()
    const variable = page.getByRole('checkbox', { name: '현재 위치 보기 조건 켜기', exact: true })
    await expect(variable).toBeEnabled()
    await variable.check()
    await expect(page.locator('.simulation-loop__observation')).toContainText('현재 위치 표시')
    await page.getByRole('button', { name: '처음 조건으로 돌아가기', exact: true }).click()
    await expect(variable).not.toBeChecked()
    await expect(page.locator('.simulation-loop__observation')).toHaveCount(0)

    await page.getByRole('radio', { name: '현재 위치 보기 기능이 함께 켜져요.', exact: true }).check()
    await variable.check()
    await page.getByRole('radio', { name: '스위치를 켜면 현재 위치 보기 기능이 함께 켜져요.', exact: true }).check()
    await page.getByRole('button', { name: '비교 결과 확인', exact: true }).click()
    await expect(page.getByRole('button', { name: '비교 결과 확인 완료', exact: true })).toBeDisabled()
    await expect(page.getByText('조건 비교를 확인했습니다.', { exact: false })).toBeVisible()

    const metrics = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      animations: Array.from(document.querySelectorAll<HTMLElement>('*')).filter((element) => getComputedStyle(element).animationName !== 'none').length,
    }))
    expect(metrics.clientWidth).toBeGreaterThanOrEqual(320)
    expect(metrics.clientWidth).toBeLessThanOrEqual(375)
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth)
    expect(metrics.animations).toBe(0)
    await assertGuarded(guards)
  })

  test('keeps the voice simulation fictional while comparing retention language', async ({ page }) => {
    const guards = installRuntimeGuards(page)
    await openImpact(page, '음성 읽기 연습')

    await expect(page.getByRole('button', { name: /녹음|재생/ })).not.toBeVisible()
    await page.getByRole('radio', { name: '누르는 동안만 처리하고 바로 삭제해요.', exact: true }).check()
    const retention = page.getByRole('checkbox', { name: '오래 보관하는 조건 켜기', exact: true })
    await expect(retention).not.toBeChecked()
    await retention.check()
    await expect(page.locator('.simulation-loop__observation')).toContainText('오래 보관')
    await page.getByRole('radio', { name: '오래 보관하면 더 긴 기간 동안 정보가 남아요.', exact: true }).check()
    await page.getByRole('button', { name: '비교 결과 확인', exact: true }).click()
    await expect(page.getByRole('button', { name: '비교 결과 확인 완료', exact: true })).toBeDisabled()
    await expect(page.getByText(/실제 음성을 녹음하지 않습니다/)).toBeVisible()
    await assertGuarded(guards)
  })
})
