import type { ButtonHTMLAttributes, ReactElement } from 'react'

export interface PrimaryActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  pulse: boolean
  stepNumber: number
}

export default function PrimaryActionButton({
  pulse,
  stepNumber,
  className = '',
  children,
  ...props
}: PrimaryActionButtonProps): ReactElement {
  const classes = [className, pulse ? 'gi-pulse' : ''].filter(Boolean).join(' ')
  return (
    <button {...props} className={classes} data-step={stepNumber} type={props.type ?? 'button'}>
      <span className="gi-pulse__step" aria-hidden="true">단계 {stepNumber}</span> {children}
    </button>
  )
}
