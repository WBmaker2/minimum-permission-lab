import { useEffect, useRef, type ReactElement, type ReactNode } from 'react'
import type { LabStage } from '../domain/model'

export interface StageFocusManagerProps {
  stage: LabStage
  children: ReactNode
}

/** Moves keyboard focus to the new stage heading without changing scroll position. */
export default function StageFocusManager({ stage, children }: StageFocusManagerProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const heading = containerRef.current?.querySelector<HTMLElement>('[data-stage-heading]')
    heading?.focus({ preventScroll: true })
  }, [stage])

  return <div ref={containerRef}>{children}</div>
}
