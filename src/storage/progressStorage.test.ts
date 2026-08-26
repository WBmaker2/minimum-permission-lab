import { describe, expect, it, vi } from 'vitest'
import { APP_CASES, CASE_ORDER } from '../content/cases'
import { createInitialLabState } from '../app/labReducer'
import type { LabState, PermissionId } from '../domain/model'
import {
  PROGRESS_STORAGE_KEY,
  clearSavedProgress,
  loadSavedProgress,
  saveProgress,
  type KeyValueStorage,
} from './progressStorage'

const permissions: readonly PermissionId[] = ['camera', 'microphone', 'location', 'contacts']

function memoryStorage(initial: Record<string, string> = {}): KeyValueStorage & { data: Record<string, string> } {
  const data = { ...initial }
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => { data[key] = value },
    removeItem: (key) => { delete data[key] },
  }
}

function progressedState(): LabState {
  const state = createInitialLabState()
  return {
    ...state,
    stage: 'revision-review',
    activeCaseId: 'voice-reading',
    caseProgress: {
      ...state.caseProgress,
      'voice-reading': {
        ...state.caseProgress['voice-reading'],
        initialDecisions: {
          camera: { permissionId: 'camera', choice: 'deny' },
          microphone: { permissionId: 'microphone', choice: 'more-info' },
        },
        revisedDecisions: {
          camera: { permissionId: 'camera', choice: 'deny' },
          microphone: { permissionId: 'microphone', choice: 'deny' },
        },
        reasonTags: ['data-minimization'],
        rationaleText: '목소리 읽기에는 마이크만 살펴봅니다.',
        acknowledgedConditionIds: ['voice-press-and-delete'],
        impactViewed: true,
        controlAction: 'alternative',
      },
    },
    revocationDecisions: {
      camera: { permissionId: 'camera', action: 'revoke-now' },
    },
    saveOnDevice: true,
    statusMessage: '학생이 입력한 문장이 섞이면 안 됩니다.',
  }
}

describe('progressStorage', () => {
  it('round trips a v1 snapshot as an equal but deeply independent state', () => {
    const storage = memoryStorage()
    const input = progressedState()
    saveProgress(storage, input)

    const loaded = loadSavedProgress(storage)
    expect(loaded).toEqual({ ...input, statusMessage: expect.any(String) })
    expect(loaded).not.toBe(input)
    expect(loaded?.caseProgress['voice-reading']).not.toBe(input.caseProgress['voice-reading'])
    expect(loaded?.caseProgress['voice-reading'].initialDecisions).not.toBe(input.caseProgress['voice-reading'].initialDecisions)
    expect(loaded?.caseProgress['voice-reading'].reasonTags).not.toBe(input.caseProgress['voice-reading'].reasonTags)
    expect(loaded?.revocationDecisions).not.toBe(input.revocationDecisions)
    expect(loaded?.statusMessage).not.toBe(input.statusMessage)
  })

  it('serializes only the allowlisted learning state and no personal metadata', () => {
    const storage = memoryStorage()
    saveProgress(storage, progressedState())
    const payload = JSON.parse(storage.data[PROGRESS_STORAGE_KEY]) as Record<string, unknown>

    expect(Object.keys(payload)).toEqual(['version', 'state'])
    expect(payload.state).not.toHaveProperty('statusMessage')
    expect(JSON.stringify(payload)).not.toMatch(/alias|studentName|timestamp|deviceId|analyticsId|networkMetadata/i)
    expect(Object.keys(payload.state as object)).toEqual([
      'stage', 'activeCaseId', 'caseProgress', 'revocationCompleted', 'revocationDecisions', 'saveOnDevice',
    ])
    expect(Object.keys((payload.state as { caseProgress: object }).caseProgress)).toEqual([...CASE_ORDER])
  })

  it.each([
    ['not-json', 'not-json'],
    ['null', 'null'],
    ['array', '[]'],
    ['unknown-version', JSON.stringify({ version: 2, state: {} })],
    ['missing-state', JSON.stringify({ version: 1 })],
    ['extra-top-level', JSON.stringify({ version: 1, state: {}, alias: '햇살' })],
    ['extra-state-field', JSON.stringify({ version: 1, state: { alias: '햇살' } })],
    ['unknown-enum', JSON.stringify({ version: 1, state: { stage: 'danger' } })],
  ])('returns null for malformed %s data without throwing', (_label, value) => {
    const storage = memoryStorage({ [PROGRESS_STORAGE_KEY]: value })
    expect(() => loadSavedProgress(storage)).not.toThrow()
    expect(loadSavedProgress(storage)).toBeNull()
  })

  it('rejects permission key mismatches, extra cases, and prototype-pollution-shaped fields', () => {
    const storage = memoryStorage()
    saveProgress(storage, progressedState())
    const payload = JSON.parse(storage.data[PROGRESS_STORAGE_KEY]) as { version: number; state: Record<string, unknown> }
    const caseProgress = payload.state.caseProgress as Record<string, unknown>
    const voiceProgress = caseProgress['voice-reading'] as Record<string, unknown>
    voiceProgress.initialDecisions = { location: { permissionId: 'camera', choice: 'deny' } }
    expect(loadSavedProgress(memoryStorage({ [PROGRESS_STORAGE_KEY]: JSON.stringify(payload) }))).toBeNull()

    caseProgress['__proto__'] = {}
    expect(loadSavedProgress(memoryStorage({ [PROGRESS_STORAGE_KEY]: JSON.stringify(payload) }))).toBeNull()

    delete caseProgress['__proto__']
    caseProgress['extra-case'] = caseProgress['photo-scan']
    expect(loadSavedProgress(memoryStorage({ [PROGRESS_STORAGE_KEY]: JSON.stringify(payload) }))).toBeNull()
  })

  it.each([
    ['voice-reading', 'map-current-position-opt-in'],
    ['class-map', 'voice-press-and-delete'],
  ] as const)('rejects condition %s when injected into the wrong case', (caseId, conditionId) => {
    const source = progressedState()
    const storage = memoryStorage()
    saveProgress(storage, source)
    const payload = JSON.parse(storage.data[PROGRESS_STORAGE_KEY]) as { state: { caseProgress: Record<string, Record<string, unknown>> } }
    payload.state.caseProgress[caseId].acknowledgedConditionIds = [conditionId]
    expect(loadSavedProgress(memoryStorage({ [PROGRESS_STORAGE_KEY]: JSON.stringify(payload) }))).toBeNull()
  })

  it('returns null and keeps storage errors contained', () => {
    const throwing = {
      getItem: vi.fn(() => { throw new Error('blocked') }),
      setItem: vi.fn(() => { throw new Error('blocked') }),
      removeItem: vi.fn(() => { throw new Error('blocked') }),
    }
    expect(loadSavedProgress(throwing)).toBeNull()
    expect(() => saveProgress(throwing, progressedState())).not.toThrow()
    expect(() => clearSavedProgress(throwing)).not.toThrow()
  })

  it('clears only the dedicated key', () => {
    const storage = memoryStorage({ [PROGRESS_STORAGE_KEY]: 'saved', unrelated: 'keep' })
    clearSavedProgress(storage)
    expect(storage.data).toEqual({ unrelated: 'keep' })
  })

  it('accepts all canonical permission definitions in a saved decision record', () => {
    const state = progressedState()
    state.caseProgress['voice-reading'] = {
      ...state.caseProgress['voice-reading'],
      initialDecisions: Object.fromEntries(permissions.map((permissionId) => [permissionId, { permissionId, choice: 'deny' }])) as LabState['caseProgress']['voice-reading']['initialDecisions'],
    }
    const storage = memoryStorage()
    saveProgress(storage, state)
    expect(loadSavedProgress(storage)?.caseProgress['voice-reading'].initialDecisions).toEqual(state.caseProgress['voice-reading'].initialDecisions)
    expect(APP_CASES['voice-reading'].requestedPermissions).toHaveLength(4)
  })
})
