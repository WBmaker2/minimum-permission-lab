import { forwardRef, type ButtonHTMLAttributes, type ReactElement } from 'react'

export interface PrimaryActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  pulse: boolean
  stepNumber: number
}

const PrimaryActionButton = forwardRef<HTMLButtonElement, PrimaryActionButtonProps>(function PrimaryActionButton({
  pulse,
  stepNumber,
  className = '',
  children,
  ...props
}, ref): ReactElement {
  const classes = [className, pulse ? 'gi-pulse' : ''].filter(Boolean).join(' ')
  return (
    <button ref={ref} {...props} className={classes} data-step={stepNumber} type={props.type ?? 'button'}>
      <span className="gi-pulse__step" aria-hidden="true">단계 {stepNumber}</span> {children}
    </button>
  )
})

export default PrimaryActionButton
