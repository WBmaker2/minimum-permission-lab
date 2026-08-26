import { createContext, useContext, type Dispatch } from 'react'
import type { LabState } from '../domain/model'
import type { LabAction } from './labReducer'

export interface LabContextValue {
  state: LabState
  dispatch: Dispatch<LabAction>
}

export const LabContext = createContext<LabContextValue | null>(null)

export function useLab(): LabContextValue {
  const value = useContext(LabContext)
  if (!value) throw new Error('useLab must be used inside LabProvider')
  return value
}
