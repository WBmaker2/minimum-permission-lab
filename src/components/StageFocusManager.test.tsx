import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import StageFocusManager from './StageFocusManager'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('StageFocusManager', () => {
  it('focuses the new stage heading and scrolls it to the start of the viewport', () => {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
    const scrollIntoView = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')
    const view = render(
      <StageFocusManager stage="start">
        <main><h2 data-stage-heading tabIndex={-1}>학습 시작</h2></main>
      </StageFocusManager>,
    )

    view.rerender(
      <StageFocusManager stage="specification">
        <main><h2 data-stage-heading tabIndex={-1}>기능 살펴보기</h2></main>
      </StageFocusManager>,
    )

    expect(screen.getByRole('heading', { name: '기능 살펴보기' })).toHaveFocus()
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start', inline: 'nearest', behavior: 'auto' })
  })
})
