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
        position: 'static',
        padding: '0.75rem 1rem',
      }}
    >
      <button ref={ref} className="update-history-trigger" type="button" onClick={onOpen} style={{ maxWidth: '100%' }}>
        업데이트 내역
      </button>
    </div>
  )
})

export default UpdateHistoryButton
