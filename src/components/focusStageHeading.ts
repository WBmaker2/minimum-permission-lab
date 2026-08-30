export function focusStageHeading(heading: HTMLElement): void {
  heading.focus({ preventScroll: true })
  heading.scrollIntoView?.({ block: 'start', inline: 'nearest', behavior: 'auto' })
}
