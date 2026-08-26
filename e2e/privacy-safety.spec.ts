import { expect, test, type Page } from '@playwright/test'

import { createInitialLabState } from '../src/app/labReducer'
import { CASE_ORDER } from '../src/content/cases'
import { buildReport } from '../src/domain/buildReport'
import type { CaseId, LabState, PermissionId } from '../src/domain/model'
import { PROGRESS_STORAGE_KEY } from '../src/storage/progressStorage'

const PERMISSION_IDS: readonly PermissionId[] = ['camera', 'microphone', 'location', 'contacts']

function createReportableState(): LabState {
  const base = createInitialLabState()
  const decisions = Object.fromEntries(PERMISSION_IDS.map((permissionId) => [permissionId, { permissionId, choice: 'deny' as const }])) as LabState['caseProgress']['photo-scan']['initialDecisions']
  return {
    ...base,
    stage: 'report',
    revocationCompleted: true,
    revocationDecisions: {
      camera: { permissionId: 'camera', action: 'revoke-now' },
      microphone: { permissionId: 'microphone', action: 'keep-current-feature' },
      location: { permissionId: 'location', action: 'keep-current-feature' },
      contacts: { permissionId: 'contacts', action: 'keep-current-feature' },
    },
    caseProgress: Object.fromEntries(CASE_ORDER.map((caseId) => [caseId, {
      ...base.caseProgress[caseId],
      initialDecisions: decisions,
      revisedDecisions: { ...decisions, camera: { permissionId: 'camera', choice: 'allow-current-feature' } },
      reasonTags: ['data-minimization'],
      rationaleText: `${caseId}에서 필요한 권한만 골랐습니다.`,
      enabledFeatureSwitchIds: caseId === 'class-map' ? ['map-current-position'] : [],
      acknowledgedConditionIds: caseId === 'class-map' ? ['map-current-position-opt-in'] : caseId === 'voice-reading' ? ['voice-press-and-delete'] : [],
      impactViewed: true,
      controlAction: 'alternative',
      completed: true,
    }])) as LabState['caseProgress'],
  }
}

export function recordUnexpectedRequests(page: Page, allowedOrigin: string): string[] {
  const unexpected: string[] = []
  page.on('request', (request) => {
    const url = request.url()
    if (url.startsWith('data:') || url.startsWith('blob:')) return
    try {
      if (new URL(url).origin !== allowedOrigin) unexpected.push(url)
    } catch {
      unexpected.push(url)
    }
  })
  return unexpected
}

test('does not request permissions, send data, or retain the fictional alias', async ({ page }) => {
  const configuredBaseURL = test.info().project.use.baseURL
  expect(configuredBaseURL).toBeTruthy()
  const configuredUrl = new URL(configuredBaseURL as string)
  expect(configuredUrl.hostname).toBe('127.0.0.1')
  const allowedOrigin = configuredUrl.origin
  const unexpectedRequests = recordUnexpectedRequests(page, allowedOrigin)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  expect(new URL(page.url()).origin).toBe(allowedOrigin)
  await expect(page.locator('h1')).toHaveText('앱 권한 최소허용 연구소')

  expect(await page.evaluate(() => Object.keys(window.localStorage))).toEqual([])
  await expect(page.getByRole('heading', { name: '학습 시작' })).toBeVisible()
  await page.getByRole('checkbox', { name: '이 기기에 저장' }).check()
  await page.getByRole('button', { name: '모둠 알림판' }).click()
  const specificationButton = page.getByRole('button', { name: '기능 명세 보기' })
  await expect(specificationButton).toBeEnabled()
  await specificationButton.click()

  const aliasInput = page.getByRole('textbox', { name: '가상 별명 연습' })
  await expect(aliasInput).toHaveAttribute('autocomplete', 'off')
  await aliasInput.fill('햇살 탐험대')
  await expect(page.getByText('미리보기: 햇살 탐험대')).toBeVisible()

  const inputSemantics = await page.locator('input, textarea').evaluateAll((controls) => controls.map((control) => ({
    type: control.getAttribute('type') ?? control.tagName.toLowerCase(),
    name: control.getAttribute('name'),
    autocomplete: control.getAttribute('autocomplete'),
  })))
  expect(inputSemantics.some(({ type }) => type === 'file')).toBe(false)
  expect(inputSemantics.every(({ name, autocomplete }) => {
    const forbidden = /^(given-name|family-name|name|tel|address)/i
    return !forbidden.test(name ?? '') && !forbidden.test(autocomplete ?? '')
  })).toBe(true)

  const storedValues = await page.evaluate(() => Object.entries(window.localStorage))
  expect(storedValues.some(([key, value]) => key.includes('햇살 탐험대') || value.includes('햇살 탐험대'))).toBe(false)
  const progress = await page.evaluate((key) => window.localStorage.getItem(key), PROGRESS_STORAGE_KEY)
  expect(progress).not.toBeNull()
  const payload = JSON.parse(progress as string) as { version: number; state: Record<string, unknown> }
  expect(payload.version).toBe(1)
  expect(typeof payload.state).toBe('object')
  expect(payload.state).not.toBeNull()
  expect(Array.isArray(payload.state)).toBe(false)
  expect(typeof payload.state.stage).toBe('string')
  expect(payload.state.activeCaseId === null || typeof payload.state.activeCaseId === 'string').toBe(true)
  expect(typeof payload.state.caseProgress).toBe('object')
  expect(payload.state.caseProgress).not.toBeNull()
  expect(Array.isArray(payload.state.caseProgress)).toBe(false)
  expect(typeof payload.state.revocationCompleted).toBe('boolean')
  expect(typeof payload.state.revocationDecisions).toBe('object')
  expect(payload.state.revocationDecisions).not.toBeNull()
  expect(Array.isArray(payload.state.revocationDecisions)).toBe(false)
  expect(typeof payload.state.saveOnDevice).toBe('boolean')
  expect(Object.keys(payload.state).sort()).toEqual([
    'activeCaseId',
    'caseProgress',
    'revocationCompleted',
    'revocationDecisions',
    'saveOnDevice',
    'stage',
  ])
  for (const caseId of ['photo-scan', 'voice-reading', 'class-map', 'group-board'] as const) {
    expect(Object.keys((payload.state.caseProgress as Record<CaseId, Record<string, unknown>>)[caseId]).sort()).toEqual([
      'acknowledgedConditionIds',
      'completed',
      'controlAction',
      'enabledFeatureSwitchIds',
      'impactViewed',
      'initialDecisions',
      'rationaleText',
      'reasonTags',
      'revisedDecisions',
    ])
    for (const decisionRecord of ['initialDecisions', 'revisedDecisions'] as const) {
      const decisions = (payload.state.caseProgress as Record<CaseId, Record<string, unknown>>)[caseId][decisionRecord]
      expect(typeof decisions).toBe('object')
      expect(decisions).not.toBeNull()
      expect(Array.isArray(decisions)).toBe(false)
    }
    const caseState = (payload.state.caseProgress as Record<CaseId, Record<string, unknown>>)[caseId]
    expect(Array.isArray(caseState.reasonTags)).toBe(true)
    expect(Array.isArray(caseState.enabledFeatureSwitchIds)).toBe(true)
    expect(Array.isArray(caseState.acknowledgedConditionIds)).toBe(true)
    expect(typeof caseState.rationaleText).toBe('string')
    expect(typeof caseState.impactViewed).toBe('boolean')
    expect(typeof caseState.completed).toBe('boolean')
    expect(caseState.controlAction === null || typeof caseState.controlAction === 'string').toBe(true)
  }
  expect(JSON.stringify(payload)).not.toContain('햇살 탐험대')
  expect(JSON.stringify(payload)).not.toContain('alias')
  expect(JSON.stringify(payload.state)).not.toContain('statusMessage')
  expect(unexpectedRequests).toEqual([])
})

test('buildReport excludes runtime alias fields from state and report boundaries', () => {
  const state = createReportableState()
  const contaminated = {
    ...state,
    alias: '햇살 탐험대',
    caseProgress: Object.fromEntries(CASE_ORDER.map((caseId) => [caseId, {
      ...state.caseProgress[caseId],
      alias: '햇살 탐험대',
    }])),
  } as unknown as LabState

  const report = buildReport(contaminated)
  expect(JSON.stringify(report)).not.toContain('햇살 탐험대')
  expect(JSON.stringify(report)).not.toContain('alias')
  for (const result of report.cases) {
    expect(Object.keys(result).sort()).toEqual([
      'caseId',
      'changedPermissionIds',
      'controlAction',
      'initial',
      'rationaleText',
      'reasonTags',
      'revised',
      'rubricEvidence',
    ])
  }
})
