import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { APP_CASES } from '../../content/cases'
import { getPermissionDefinition } from '../../content/permissions'
import FeatureSpecScreen from './FeatureSpecScreen'

afterEach(cleanup)

describe('FeatureSpecScreen', () => {
  it('shows the feature contract, ordered data flow, permissions and guiding questions', () => {
    render(<FeatureSpecScreen appCase={APP_CASES['photo-scan']} onBeginReview={vi.fn()} />)
    expect(screen.getByRole('heading', { level: 2, name: '사진 스캔 과제함' })).toBeVisible()
    expect(screen.getByText(APP_CASES['photo-scan'].coreFunction)).toBeVisible()
    expect(screen.getByText(APP_CASES['photo-scan'].retentionPromise)).toBeVisible()
    const items = within(screen.getByRole('heading', { name: '정보 흐름' }).parentElement!).getAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual([...APP_CASES['photo-scan'].dataFlow])
    for (const permissionId of APP_CASES['photo-scan'].requestedPermissions) expect(screen.getByText(getPermissionDefinition(permissionId).label)).toBeVisible()
    const questions = [
      '이 기능에 어떤 정보가 필요한가요?',
      '앱을 사용하는 동안만 필요한가요, 항상 필요한가요?',
      '권한을 주지 않으면 어떤 기능만 제한되나요?',
      '더 적은 정보로 같은 목적을 이룰 방법이 있나요?',
    ]
    for (const question of questions) expect(screen.getAllByRole('heading', { name: question })).toHaveLength(4)
  })

  it('starts the review with a highlighted primary action', async () => {
    const user = userEvent.setup()
    const onBeginReview = vi.fn()
    render(<FeatureSpecScreen appCase={APP_CASES['photo-scan']} onBeginReview={onBeginReview} />)
    await user.click(screen.getByRole('button', { name: /권한 심사 시작/ }))
    expect(onBeginReview).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: /권한 심사 시작/ })).toHaveClass('gi-pulse')
  })

  it('offers private temporary alias practice only for group board', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<FeatureSpecScreen appCase={APP_CASES['group-board']} onBeginReview={vi.fn()} />)
    const input = screen.getByRole('textbox', { name: '가상 별명 연습' })
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveAttribute('autocomplete', 'off')
    expect(input).toHaveAttribute('maxlength', '12')
    for (const example of ['햇살', '새싹', '푸른별']) expect(screen.getByText(example)).toBeVisible()
    expect(screen.getByText(/실제 이름·전화번호·주소 등 개인정보를 입력하지 말 것/)).toBeVisible()
    await user.type(input, '햇살')
    expect(screen.getByText('미리보기: 햇살')).toBeVisible()
    unmount()
    render(<FeatureSpecScreen appCase={APP_CASES['group-board']} onBeginReview={vi.fn()} />)
    expect(screen.getByRole('textbox', { name: '가상 별명 연습' })).toHaveValue('')
  })

  it('does not show alias input in other cases', () => {
    render(<FeatureSpecScreen appCase={APP_CASES['class-map']} onBeginReview={vi.fn()} />)
    expect(screen.queryByRole('textbox', { name: '가상 별명 연습' })).not.toBeInTheDocument()
  })

  it('keeps ids unique when two alias practices are rendered', () => {
    render(
      <>
        <FeatureSpecScreen appCase={APP_CASES['group-board']} onBeginReview={vi.fn()} />
        <FeatureSpecScreen appCase={APP_CASES['group-board']} onBeginReview={vi.fn()} />
      </>,
    )
    const inputs = screen.getAllByRole('textbox', { name: '가상 별명 연습' }) as HTMLInputElement[]
    expect(new Set(inputs.map((input) => input.id)).size).toBe(2)
    expect(new Set(inputs.map((input) => input.getAttribute('aria-describedby'))).size).toBe(2)
    expect(new Set(screen.getAllByRole('heading', { name: '가상 별명 연습' }).map((heading) => heading.id)).size).toBe(2)
    for (const input of inputs) {
      expect(input.labels?.[0]).toHaveAttribute('for', input.id)
      expect(document.getElementById(input.getAttribute('aria-describedby')!)).toBeInTheDocument()
    }
  })
})
