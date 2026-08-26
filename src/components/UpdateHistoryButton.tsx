import { forwardRef, type ReactElement } from 'react'

export interface UpdateHistoryButtonProps {
  onOpen: () => void
}

const UpdateHistoryButton = forwardRef<HTMLButtonElement, UpdateHistoryButtonProps>(function UpdateHistoryButton({ onOpen }, ref): ReactElement {
  return (
    <div
      className="update-history-trigger-area"
      data-testid="update-history-trigger-area"
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        boxSizing: 'border-box',
        padding: '0.75rem 1rem',
        position: 'static',
      }}
    >
      <button ref={ref} className="update-history-trigger" style={{ maxWidth: '100%' }} type="button" onClick={onOpen}>
        업데이트 내역
      </button>
    </div>
  )
})

export default UpdateHistoryButton
