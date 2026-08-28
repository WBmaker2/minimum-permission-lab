import type { ReactElement } from 'react'

export interface ActionRequirementHintProps {
  id: string
  message: string
}

export default function ActionRequirementHint({ id, message }: ActionRequirementHintProps): ReactElement {
  return <p id={id} role="note" className="action-requirement-hint">{message}</p>
}
