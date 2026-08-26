import { useReducer, type ReactNode } from 'react'
import { createInitialLabState, labReducer } from './labReducer'
import { LabContext } from './LabContext'
import type { LabState } from '../domain/model'

// Compatibility re-export; the hook implementation remains in the non-component module.
// eslint-disable-next-line react-refresh/only-export-components
export { useLab } from './LabContext'
export type { LabContextValue } from './LabContext'

interface LabProviderProps {
  children: ReactNode
  initialState?: LabState
}

function initializeLabState(initialState: LabState | undefined): LabState {
  return initialState ?? createInitialLabState()
}

export function LabProvider({ children, initialState }: LabProviderProps) {
  const [state, dispatch] = useReducer(labReducer, initialState, initializeLabState)
  return <LabContext.Provider value={{ state, dispatch }}>{children}</LabContext.Provider>
}
