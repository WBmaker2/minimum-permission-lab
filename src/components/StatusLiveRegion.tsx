import type { ReactElement } from 'react'

export interface StatusLiveRegionProps {
  message: string
}

export default function StatusLiveRegion({ message }: StatusLiveRegionProps): ReactElement {
  return (
    <p role="status" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  )
}
