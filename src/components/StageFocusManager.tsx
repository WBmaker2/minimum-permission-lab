import { useEffect, useRef, type ReactElement, type ReactNode } from 'react'
import type { LabStage } from '../domain/model'
import { focusStageHeading } from './focusStageHeading'

export interface StageFocusManagerProps {
  stage: LabStage
  children: ReactNode
}

export default function StageFocusManager({ stage, children }: StageFocusManagerProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const heading = containerRef.current?.querySelector<HTMLElement>('[data-stage-heading]')
    if (heading) focusStageHeading(heading)
  }, [stage])

  return <div ref={containerRef}>{children}</div>
}
