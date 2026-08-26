import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { PropsWithChildren } from 'react'
import { createInitialLabState } from './labReducer'
import { LabProvider } from './LabProvider'
import { useLab } from './LabContext'
import { PROGRESS_STORAGE_KEY, type KeyValueStorage } from '../storage/progressStorage'

function createSpyStorage(saved: string | null = null) {
  return {
    getItem: vi.fn<(key: string) => string | null>(() => saved),
    setItem: vi.fn<(key: string, value: string) => void>(),
    removeItem: vi.fn<(key: string) => void>(),
  }
}

function wrapper(storage: KeyValueStorage, initialState = createInitialLabState()) {
  return function ProviderWrapper({ children }: PropsWithChildren) {
    return <LabProvider storage={storage} initialState={initialState}>{children}</LabProvider>
  }
}

describe('LabProvider explicit local saving', () => {
  it('does no storage I/O on mount, even when initial save flag is true', () => {
    const storage = createSpyStorage()
    const initialState = { ...createInitialLabState(), saveOnDevice: true }
    renderHook(() => useLab(), { wrapper: wrapper(storage, initialState) })
    expect(storage.getItem).not.toHaveBeenCalled()
    expect(storage.setItem).not.toHaveBeenCalled()
    expect(storage.removeItem).not.toHaveBeenCalled()
  })

  it('treats an explicit true call as the opt-in even when the initial flag is true', () => {
    const storage = createSpyStorage()
    const initialState = { ...createInitialLabState(), saveOnDevice: true }
    const { result } = renderHook(() => useLab(), { wrapper: wrapper(storage, initialState) })
    act(() => result.current.setSaveOnDevice(true))
    expect(storage.setItem).toHaveBeenCalledTimes(1)
    act(() => result.current.dispatch({ type: 'SELECT_CASE', caseId: 'photo-scan' }))
    expect(storage.setItem).toHaveBeenCalledTimes(2)
  })

  it('clears the dedicated key for an explicit false call from the default state', () => {
    const storage = createSpyStorage()
    const { result } = renderHook(() => useLab(), { wrapper: wrapper(storage) })
    act(() => result.current.setSaveOnDevice(false))
    expect(storage.removeItem).toHaveBeenCalledTimes(1)
    expect(storage.removeItem).toHaveBeenCalledWith(PROGRESS_STORAGE_KEY)
  })

  it('writes exactly once on opt-in and once for each subsequent changed state', () => {
    const storage = createSpyStorage()
    const { result } = renderHook(() => useLab(), { wrapper: wrapper(storage) })
    act(() => result.current.setSaveOnDevice(true))
    expect(storage.setItem).toHaveBeenCalledTimes(1)
    expect(storage.setItem).toHaveBeenLastCalledWith(PROGRESS_STORAGE_KEY, expect.any(String))
    expect(result.current.state.saveOnDevice).toBe(true)

    act(() => result.current.dispatch({ type: 'SELECT_CASE', caseId: 'photo-scan' }))
    expect(storage.setItem).toHaveBeenCalledTimes(2)
    act(() => result.current.dispatch({ type: 'OPEN_SPECIFICATION' }))
    expect(storage.setItem).toHaveBeenCalledTimes(3)
  })

  it('removes exactly the dedicated key on opt-out and stops saving', () => {
    const storage = createSpyStorage()
    const { result } = renderHook(() => useLab(), { wrapper: wrapper(storage) })
    act(() => result.current.setSaveOnDevice(true))
    act(() => result.current.setSaveOnDevice(false))
    expect(storage.removeItem).toHaveBeenCalledTimes(1)
    expect(storage.removeItem).toHaveBeenCalledWith(PROGRESS_STORAGE_KEY)
    expect(storage.getItem).not.toHaveBeenCalled()
    expect(storage.setItem).toHaveBeenCalledTimes(1)
    act(() => result.current.dispatch({ type: 'SELECT_CASE', caseId: 'photo-scan' }))
    expect(storage.setItem).toHaveBeenCalledTimes(1)
  })

  it('loads only on explicit request and does not immediately rewrite the loaded state', () => {
    const sourceStorage = createSpyStorage()
    const source = renderHook(() => useLab(), { wrapper: wrapper(sourceStorage) })
    act(() => source.result.current.dispatch({ type: 'SELECT_CASE', caseId: 'photo-scan' }))
    const saved = { ...source.result.current.state, saveOnDevice: true }
    source.unmount()

    const loadedStorage = createSpyStorage(JSON.stringify({ version: 1, state: { ...saved, statusMessage: undefined } }))
    const { result } = renderHook(() => useLab(), { wrapper: wrapper(loadedStorage) })
    expect(loadedStorage.getItem).not.toHaveBeenCalled()
    act(() => result.current.loadSavedProgressOnRequest())
    expect(loadedStorage.getItem).toHaveBeenCalledTimes(1)
    expect(loadedStorage.getItem).toHaveBeenCalledWith(PROGRESS_STORAGE_KEY)
    expect(loadedStorage.setItem).not.toHaveBeenCalled()
    expect(result.current.state.activeCaseId).toBe('photo-scan')
  })

  it('ignores invalid saved data without replacing the current state', () => {
    const storage = createSpyStorage('{"version":99}')
    const { result } = renderHook(() => useLab(), { wrapper: wrapper(storage) })
    const before = result.current.state
    act(() => result.current.loadSavedProgressOnRequest())
    expect(storage.getItem).toHaveBeenCalledTimes(1)
    expect(result.current.state).toBe(before)
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it('contains storage API errors during user actions', () => {
    const storage = {
      getItem: vi.fn(() => { throw new Error('blocked') }),
      setItem: vi.fn(() => { throw new Error('blocked') }),
      removeItem: vi.fn(() => { throw new Error('blocked') }),
    }
    const { result } = renderHook(() => useLab(), { wrapper: wrapper(storage) })
    expect(() => act(() => result.current.setSaveOnDevice(true))).not.toThrow()
    expect(() => act(() => result.current.loadSavedProgressOnRequest())).not.toThrow()
    expect(() => act(() => result.current.setSaveOnDevice(false))).not.toThrow()
  })
})
