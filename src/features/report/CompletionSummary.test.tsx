import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { LabReport, PermissionDecision, ReportCaseResult } from '../../domain/model'
import CompletionSummary from './CompletionSummary'

const permissionIds = ['camera', 'microphone', 'location', 'contacts'] as const

function decisions(choice: PermissionDecision['choice'] = 'deny'): readonly PermissionDecision[] {
  return permissionIds.map((permissionId) => ({ permissionId, choice }))
}

function caseResult(caseId: ReportCaseResult['caseId'], changedPermissionIds: ReportCaseResult['changedPermissionIds'], controlAction: ReportCaseResult['controlAction']): ReportCaseResult {
  return {
    caseId,
    initial: decisions(),
    revised: decisions(),
    changedPermissionIds,
    reasonTags: ['data-minimization'],
    rationaleText: '필요한 정보만 사용합니다.',
    rubricEvidence: {
      'function-connection': 'needs-support',
      'data-minimization': 'sufficient',
      'user-control': 'needs-support',
      'respect-others': 'needs-support',
    },
    controlAction,
  }
}

const report: LabReport = {
  cases: [
    caseResult('photo-scan', ['camera'], 'alternative'),
    caseResult('voice-reading', [], 'revoke'),
    caseResult('class-map', ['location'], 'alternative'),
    caseResult('group-board', [], 'alternative'),
  ],
  revokedPermissionIds: ['camera', 'contacts'],
}

describe('CompletionSummary', () => {
  it('shows completion, changed-decision, alternative, and revocation evidence', () => {
    render(<CompletionSummary report={report} />)

    const summary = screen.getByRole('region', { name: '네 사례 완료 요약' })
    expect(within(summary).getByRole('heading', { name: '네 사례 완료 요약' })).toBeVisible()
    expect(within(summary).getByText('완료한 사례')).toBeVisible()
    expect(within(summary).getByText('4 / 4')).toBeVisible()
    expect(within(summary).getByText('판단이 바뀐 사례')).toBeVisible()
    const values = within(summary).getAllByRole('definition')
    expect(values[1]).toHaveTextContent('2개')
    expect(values[2]).toHaveTextContent('2개')
    expect(within(summary).getByText('대안을 사용한 사례')).toBeVisible()
    expect(within(summary).getByText('3개')).toBeVisible()
    expect(within(summary).getByText('철회한 권한')).toBeVisible()
    expect(values[4]).toHaveTextContent('2개')
    expect(within(summary).getByText('판단이 바뀐 것은 배움의 증거예요')).toBeVisible()
  })
})
