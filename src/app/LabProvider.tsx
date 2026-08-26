import { useCallback, useEffect, useReducer, useRef, type ReactNode } from 'react'
import { createInitialLabState, labReducer } from './labReducer'
import { LabContext } from './LabContext'
import type { LabState } from '../domain/model'
import { clearSavedProgress, loadSavedProgress, saveProgress, type KeyValueStorage } from '../storage/progressStorage'

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
      skipNextPersistenceRef.current = current.saveOnDevice !== enabled
      saveProgress(storageRef.current ?? defaultStorage(), { ...current, saveOnDevice: true })
    } else {
      persistenceEnabledRef.current = false
      skipNextPersistenceRef.current = false
      clearSavedProgress(storageRef.current ?? defaultStorage())
    }
    dispatch({ type: 'SET_SAVE_ON_DEVICE', enabled })
  }, [])

  const loadSavedProgressOnRequest = useCallback(() => {
    const saved = loadSavedProgress(storageRef.current ?? defaultStorage())
    if (!saved || stateRef.current.stage !== 'start') return
    persistenceEnabledRef.current = saved.saveOnDevice
    skipNextPersistenceRef.current = true
    dispatch({ type: 'LOAD_SAVED_PROGRESS', state: saved })
  }, [])

  return <LabContext.Provider value={{ state, dispatch, setSaveOnDevice, loadSavedProgressOnRequest }}>{children}</LabContext.Provider>
}

function defaultStorage(): KeyValueStorage {
  return {
    getItem: (key) => window.localStorage.getItem(key),
    setItem: (key, value) => window.localStorage.setItem(key, value),
    removeItem: (key) => window.localStorage.removeItem(key),
  }
}
