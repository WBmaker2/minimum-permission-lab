import type { ReactNode } from 'react'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import type { LabState } from '../domain/model'
import { LabProvider } from '../app/LabProvider'
import type { KeyValueStorage } from '../storage/progressStorage'
import { LabApplication } from '../app/App'

export interface RenderLabOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: LabState
  storage?: KeyValueStorage
}

export function renderLab(ui: ReactNode, options: RenderLabOptions = {}): RenderResult {
  const { initialState, storage, ...renderOptions } = options
  return render(<LabProvider initialState={initialState} storage={storage}>{ui}</LabProvider>, renderOptions)
}

export function renderLabApplication(options: RenderLabOptions = {}): RenderResult {
  return renderLab(<LabApplication />, options)
}
