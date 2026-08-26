import { useId, type ReactElement } from 'react'
import { getPermissionDefinition } from '../../content/permissions'
import type { LearnerChoice, PermissionDefinition } from '../../domain/model'

export interface PermissionChoiceGroupProps {
  permission: PermissionDefinition
  value: LearnerChoice | undefined
  onChange: (choice: LearnerChoice) => void
  describedBy: string
}

const CHOICES: readonly { value: LearnerChoice; label: string }[] = [
  { value: 'allow-current-feature', label: '이번 기능에만 허용' },
  { value: 'deny', label: '허용하지 않음' },
  { value: 'more-info', label: '설명을 더 확인' },
]

export default function PermissionChoiceGroup({
  permission,
  value,
  onChange,
  describedBy,
}: PermissionChoiceGroupProps): ReactElement {
  const idPrefix = useId()
  const definition = getPermissionDefinition(permission.id)

  return (
    <div role="radiogroup" aria-label={`${definition.label} 권한 선택`} aria-describedby={describedBy}>
      <span className="learning-choice-badge">학습용 선택지</span>
      {CHOICES.map(({ value: choice, label }) => {
        const id = `${idPrefix}-${choice}`
        return (
          <label key={choice} htmlFor={id}>
            <input
              id={id}
              type="radio"
              name={`${idPrefix}-${permission.id}`}
              value={choice}
              checked={value === choice}
              aria-describedby={describedBy}
              onChange={() => onChange(choice)}
            />
            {label}
          </label>
        )
      })}
      <span className="sr-only">{definition.detailDescription}</span>
    </div>
  )
}
