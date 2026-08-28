import { useCallback, useEffect, useReducer, useRef, type ReactNode } from 'react'
import { createInitialLabState, labReducer } from './labReducer'
import { LabContext } from './LabContext'
import type { LabState } from '../domain/model'
import { clearSavedProgress, loadSavedProgress, saveProgress, type KeyValueStorage } from '../storage/progressStorage'

const NOT_SAVED_STATUS_MESSAGE = '이 기기에 저장하지 않음'
const SAVING_STATUS_MESSAGE = '권한 선택과 근거 문장만 이 기기에 저장 중입니다. 별명과 실제 개인정보는 저장하지 않습니다.'
const MISSING_STATUS_MESSAGE = '저장된 학습 기록이 없습니다.'
const LOADED_STATUS_MESSAGE = '저장된 학습 기록을 불러왔습니다.'
const CLEARED_STATUS_MESSAGE = '저장 기록을 지웠습니다.'

// Compatibility re-export; the hook implementation remains in the non-component module.
// eslint-disable-next-line react-refresh/only-export-components
export { useLab } from './LabContext'
export type { LabContextValue } from './LabContext'

interface LabProviderProps {
  children: ReactNode
  initialState?: LabState
  storage?: KeyValueStorage
}

function initializeLabState(initialState: LabState | undefined): LabState {
  return initialState ?? createInitialLabState()
}

export function LabProvider({ children, initialState, storage }: LabProviderProps) {
  const [state, dispatch] = useReducer(labReducer, initialState, initializeLabState)
  const stateRef = useRef(state)
  const storageRef = useRef(storage)
  const persistenceEnabledRef = useRef(false)
  const skipNextPersistenceRef = useRef(false)

  useEffect(() => {
    stateRef.current = state
    storageRef.current = storage
  }, [state, storage])

  useEffect(() => {
    if (!persistenceEnabledRef.current) return
    if (skipNextPersistenceRef.current) {
      skipNextPersistenceRef.current = false
      return
    }
    if (state.saveOnDevice) saveProgress(storageRef.current ?? defaultStorage(), state)
  }, [state])

  const setSaveOnDevice = useCallback((enabled: boolean) => {
    const current = stateRef.current
    if (enabled) {
      if (persistenceEnabledRef.current) return
      persistenceEnabledRef.current = true
      skipNextPersistenceRef.current = true
      saveProgress(storageRef.current ?? defaultStorage(), { ...current, saveOnDevice: true })
      dispatch({ type: 'SET_STATUS', message: SAVING_STATUS_MESSAGE })
    } else {
      persistenceEnabledRef.current = false
      skipNextPersistenceRef.current = false
      clearSavedProgress(storageRef.current ?? defaultStorage())
      dispatch({ type: 'SET_STATUS', message: NOT_SAVED_STATUS_MESSAGE })
    }
    dispatch({ type: 'SET_SAVE_ON_DEVICE', enabled })
  }, [])

  const loadSavedProgressOnRequest = useCallback(() => {
    const saved = loadSavedProgress(storageRef.current ?? defaultStorage())
    if (!saved || stateRef.current.stage !== 'start') {
      if (stateRef.current.stage === 'start') dispatch({ type: 'SET_STATUS', message: MISSING_STATUS_MESSAGE })
      return
    }
    persistenceEnabledRef.current = saved.saveOnDevice
    skipNextPersistenceRef.current = true
    dispatch({ type: 'LOAD_SAVED_PROGRESS', state: saved })
    dispatch({ type: 'SET_STATUS', message: LOADED_STATUS_MESSAGE })
  }, [])

  const clearSavedProgressOnRequest = useCallback(() => {
    clearSavedProgress(storageRef.current ?? defaultStorage())
    persistenceEnabledRef.current = false
    skipNextPersistenceRef.current = false
    dispatch({ type: 'SET_SAVE_ON_DEVICE', enabled: false })
    dispatch({ type: 'SET_STATUS', message: CLEARED_STATUS_MESSAGE })
  }, [])

  return <LabContext.Provider value={{ state, dispatch, setSaveOnDevice, loadSavedProgressOnRequest, clearSavedProgressOnRequest }}>{children}</LabContext.Provider>
}

function defaultStorage(): KeyValueStorage {
  return {
    getItem: (key) => window.localStorage.getItem(key),
    setItem: (key, value) => window.localStorage.setItem(key, value),
    removeItem: (key) => window.localStorage.removeItem(key),
  }
}
