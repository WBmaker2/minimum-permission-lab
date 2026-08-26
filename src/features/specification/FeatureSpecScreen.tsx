import type { ReactElement } from 'react'
import { GROUP_BOARD_ALIAS_EXAMPLES } from '../../content/cases'
import { getPermissionDefinition } from '../../content/permissions'
import type { AppCase } from '../../domain/model'
import PermissionGlyph from '../../components/PermissionGlyph'
import PrimaryActionButton from '../../components/PrimaryActionButton'
import DataFlowSummary from './DataFlowSummary'
import FictionalAliasPractice from './FictionalAliasPractice'

export interface FeatureSpecScreenProps {
  appCase: AppCase
  onBeginReview: () => void
}

const QUESTIONS = [
  '이 기능에 어떤 정보가 필요한가요?',
  '앱을 사용하는 동안만 필요한가요, 항상 필요한가요?',
  '권한을 주지 않으면 어떤 기능만 제한되나요?',
  '더 적은 정보로 같은 목적을 이룰 방법이 있나요?',
] as const

export default function FeatureSpecScreen({ appCase, onBeginReview }: FeatureSpecScreenProps): ReactElement {
  return (
    <main>
      <h2>{appCase.title}</h2>
      <p>{appCase.coreFunction}</p>
      <p>{appCase.retentionPromise}</p>
      <DataFlowSummary dataFlow={appCase.dataFlow} />
      <section aria-labelledby="requested-permissions-title">
        <h3 id="requested-permissions-title">요청된 권한</h3>
        <ul>
          {appCase.requestedPermissions.map((permissionId) => {
            const definition = getPermissionDefinition(permissionId)
            const rule = appCase.rules[permissionId]
            return (
              <li key={permissionId}>
                <PermissionGlyph permissionId={permissionId} />
                <span>{definition.label}</span>
                <p>{definition.shortDescription}</p>
                <div>
                  <h4>{QUESTIONS[0]}</h4><p>{rule.neededInformation}</p>
                  <h4>{QUESTIONS[1]}</h4><p>{rule.timing}</p>
                  <h4>{QUESTIONS[2]}</h4><p>{rule.denialImpact}</p>
                  <h4>{QUESTIONS[3]}</h4><p>{rule.alternative}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
      {appCase.id === 'group-board' && <FictionalAliasPractice examples={GROUP_BOARD_ALIAS_EXAMPLES} />}
      <PrimaryActionButton pulse stepNumber={2} onClick={onBeginReview}>
        권한 심사 시작
      </PrimaryActionButton>
    </main>
  )
}
