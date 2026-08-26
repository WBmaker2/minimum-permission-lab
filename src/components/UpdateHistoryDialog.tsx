import { useEffect, useId, useRef, type ReactElement, type RefObject } from 'react'
import type { UpdateHistoryEntry } from '../content/updateHistory'

export interface UpdateHistoryDialogProps {
  entries: readonly UpdateHistoryEntry[]
  onClose: () => void
  returnFocusRef?: RefObject<HTMLButtonElement | null>
}

const FOCUSABLE_SELECTOR = 'button:not([disabled])'

export default function UpdateHistoryDialog({ entries, onClose, returnFocusRef }: UpdateHistoryDialogProps): ReactElement {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined
    const returnFocusElement = returnFocusRef?.current

    const focusable = getFocusableElements(dialog)
    ;(focusable[0] ?? dialog).focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const currentFocusable = getFocusableElements(dialog)
      if (currentFocusable.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const first = currentFocusable[0]
      const last = currentFocusable[currentFocusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    dialog.addEventListener('keydown', handleKeyDown)
    return () => {
      dialog.removeEventListener('keydown', handleKeyDown)
      returnFocusElement?.focus()
    }
  }, [onClose, returnFocusRef])

  return (
    <div className="update-history-dialog-backdrop">
      <div
        ref={dialogRef}
        className="update-history-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="update-history-dialog__header">
          <h2 id={titleId}>업데이트 내역</h2>
          <button type="button" onClick={onClose} aria-label="업데이트 내역 닫기">닫기</button>
        </div>
        <ol>
          {entries.map((entry, index) => (
            <li key={`${entry.date}-${entry.category}-${index}`}>
              <p><time dateTime={entry.date}>{entry.date}</time> · {entry.category}</p>
              <h3>{entry.summary}</h3>
              <p>{entry.reason}</p>
            </li>
          ))}
        </ol>
        <button type="button" onClick={onClose}>확인</button>
      </div>
    </div>
  )
}

function getFocusableElements(dialog: HTMLDivElement): HTMLButtonElement[] {
  return Array.from(dialog.querySelectorAll<HTMLButtonElement>(FOCUSABLE_SELECTOR))
}
