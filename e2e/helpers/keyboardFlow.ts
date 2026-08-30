import { expect, type Locator, type Page } from '@playwright/test'

import { APP_CASES } from '../../src/content/cases'
import type { CaseId } from '../../src/domain/model'

const CASE_TITLES: Readonly<Record<CaseId, string>> = Object.fromEntries(
  Object.entries(APP_CASES).map(([caseId, appCase]) => [caseId, appCase.title]),
) as Record<CaseId, string>

const CHOICE_LABEL = '허용하지 않음'
type StageHook = (stage: 'revocation' | 'report') => Promise<void>
type PrimaryActionHook = (button: Locator) => Promise<void>

export interface PrimaryActionRect {
  x: number
  y: number
  width: number
  height: number
}

/** Samples the pulsing CTA before and during normal motion without activating it. */
export async function recordPrimaryActionRects(button: Locator): Promise<PrimaryActionRect[]> {
  await expect(button).toBeVisible()
  return button.evaluate((element) => new Promise<PrimaryActionRect[]>((resolve) => {
    const samples: PrimaryActionRect[] = []
    let sampleCount = 0
    const sample = () => {
      const rect = element.getBoundingClientRect()
      samples.push({ x: rect.x, y: rect.y, width: rect.width, height: rect.height })
      sampleCount += 1
      if (sampleCount >= 7) {
        resolve(samples)
        return
      }
      window.setTimeout(sample, 100)
    }
    sample()
  }))
}

/** Complete one case with keyboard activation only (no pointer APIs). */
export async function completeCaseWithKeyboard(page: Page, caseId: CaseId, onPrimaryAction?: PrimaryActionHook): Promise<void> {
  await expect(page.getByRole('heading', { name: '학습 시작' })).toBeVisible()
  await page.getByRole('button', { name: CASE_TITLES[caseId], exact: true }).press('Space')
  const specificationButton = page.getByRole('button', { name: '기능 명세 보기', exact: true })
  await onPrimaryAction?.(specificationButton)
  await specificationButton.press('Enter')
  await expect(page.getByRole('heading', { name: CASE_TITLES[caseId], exact: true })).toBeVisible()
  if (caseId === 'group-board') {
    const aliasInput = page.getByRole('textbox', { name: '가상 별명 연습' })
    await expect(aliasInput).toHaveValue('')
    const blockedReviewStart = page.getByRole('button', { name: '권한 심사 시작', exact: true })
    await expect(blockedReviewStart).toBeDisabled()
    await page.getByRole('button', { name: '예시 사용: 햇살', exact: true }).press('Space')
    await expect(aliasInput).toHaveValue('햇살')
  }
  const reviewButton = page.getByRole('button', { name: '권한 심사 시작', exact: true })
  await onPrimaryAction?.(reviewButton)
  await reviewButton.press('Enter')

  const initialChoices = page.getByRole('radio', { name: CHOICE_LABEL, exact: true })
  await expect(initialChoices).toHaveCount(4)
  for (let index = 0; index < 4; index += 1) await initialChoices.nth(index).press('Space')
  const impactButton = page.getByRole('button', { name: '선택 검토', exact: true })
  await onPrimaryAction?.(impactButton)
  await impactButton.press('Enter')

  const conditionButton = page.getByRole('button', { name: '비교 결과 확인', exact: true })
  if (caseId === 'voice-reading') {
    await page.getByRole('radio', { name: '누르는 동안만 처리하고 바로 삭제해요.', exact: true }).press('Space')
    const retentionControl = page.getByRole('checkbox', { name: '오래 보관하는 조건 켜기', exact: true })
    await expect(retentionControl).not.toBeChecked()
    await retentionControl.press('Space')
    await page.getByRole('radio', { name: '오래 보관하면 더 긴 기간 동안 정보가 남아요.', exact: true }).press('Space')
    await expect(conditionButton).toBeEnabled()
    await conditionButton.press('Space')
  } else if (caseId === 'class-map') {
    await page.getByRole('radio', { name: '현재 위치 보기 기능이 함께 켜져요.', exact: true }).press('Space')
    const switchControl = page.getByRole('checkbox', { name: '현재 위치 보기 조건 켜기', exact: true })
    await expect(switchControl).not.toBeChecked()
    await switchControl.press('Space')
    await page.getByRole('radio', { name: '스위치를 켜면 현재 위치 보기 기능이 함께 켜져요.', exact: true }).press('Space')
    await expect(conditionButton).toBeEnabled()
    await conditionButton.press('Space')
  }
  await page.getByRole('radio', { name: '대안 사용', exact: true }).press('Space')
  await expect(page.getByRole('radio', { name: '대안 사용', exact: true })).toBeChecked()
  const revisionButton = page.getByRole('button', { name: '최소 권한안 수정', exact: true })
  await expect(revisionButton).toBeEnabled()
  await onPrimaryAction?.(revisionButton)
  await revisionButton.press('Enter')
  await expect(page.getByRole('heading', { name: '수정 권한 심사', exact: true })).toBeVisible()

  const revisedChoices = page.getByRole('radio', { name: CHOICE_LABEL, exact: true })
  await expect(revisedChoices).toHaveCount(4)
  for (let index = 0; index < 4; index += 1) await revisedChoices.nth(index).press('Space')
  const rationale = page.getByRole('textbox', { name: '내 판단 근거' })
  await rationale.pressSequentially('필요한 정보만 사용하고 필요하지 않으면 철회하겠습니다.')
  await page.getByRole('checkbox', { name: '정보 최소화', exact: true }).press('Space')
  const completeButton = page.getByRole('button', { name: '선택 검토', exact: true })
  await expect(completeButton).toBeEnabled()
  await onPrimaryAction?.(completeButton)
  await completeButton.press('Enter')
}

/** Complete all four cases with keyboard activation only (no pointer APIs). */
export async function completeAllCasesWithKeyboard(page: Page, onStage?: StageHook, onPrimaryAction?: PrimaryActionHook): Promise<void> {
  for (const caseId of ['photo-scan', 'voice-reading', 'class-map', 'group-board'] as const) {
    await completeCaseWithKeyboard(page, caseId, onPrimaryAction)
  }

  const revocationStartButton = page.getByRole('button', { name: '권한 철회 연습 시작', exact: true })
  await onPrimaryAction?.(revocationStartButton)
  await revocationStartButton.press('Enter')
  await onStage?.('revocation')
  const keepChoices = page.getByRole('radio', { name: '현재 기능에 유지', exact: true })
  const revokeChoices = page.getByRole('radio', { name: '지금 철회', exact: true })
  await expect(keepChoices).toHaveCount(4)
  await expect(revokeChoices).toHaveCount(4)
  for (let index = 0; index < 3; index += 1) await keepChoices.nth(index).press('Space')
  await revokeChoices.nth(3).press('Space')
  const revocationCompleteButton = page.getByRole('button', { name: '철회 판단 완료', exact: true })
  await onPrimaryAction?.(revocationCompleteButton)
  await revocationCompleteButton.press('Enter')
  const reportButton = page.getByRole('button', { name: '학습 보고서 보기', exact: true })
  await onPrimaryAction?.(reportButton)
  await reportButton.press('Enter')
  await onStage?.('report')
  await expect(page.getByRole('heading', { name: '최소 권한 학습 보고서' })).toBeVisible()
}
