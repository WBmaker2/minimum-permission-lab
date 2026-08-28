import { useId, useState, type ReactElement } from 'react'
import { GROUP_BOARD_ALIAS_EXAMPLES } from '../../content/cases'
import { getPermissionDefinition } from '../../content/permissions'
import type { AppCase } from '../../domain/model'
import PermissionGlyph from '../../components/PermissionGlyph'
import PrimaryActionButton from '../../components/PrimaryActionButton'
import DataFlowSummary from './DataFlowSummary'
import FictionalAliasPractice from './FictionalAliasPractice'
import ActionRequirementHint from '../../components/ActionRequirementHint'

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
  const [alias, setAlias] = useState('')
  const actionRequirementId = `${useId()}-specification-action-requirement`
  const aliasRequired = appCase.id === 'group-board'
  const ready = !aliasRequired || alias.trim().length > 0
  return (
    <main>
      <h2 data-stage-heading tabIndex={-1}>{appCase.title}</h2>
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
                  <details>
                    <summary>자세히 보기</summary>
                    <div>
                      <h4>{QUESTIONS[1]}</h4><p>{rule.timing}</p>
                      <h4>{QUESTIONS[2]}</h4><p>{rule.denialImpact}</p>
                      <h4>{QUESTIONS[3]}</h4><p>{rule.alternative}</p>
                    </div>
                  </details>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
      {appCase.id === 'group-board' && (
        <FictionalAliasPractice
          examples={GROUP_BOARD_ALIAS_EXAMPLES}
          value={alias}
          onChange={setAlias}
          onUseExample={setAlias}
        />
      )}
      {!ready && <ActionRequirementHint id={actionRequirementId} message="가상 별명을 한 글자 이상 입력하면 권한 심사를 시작할 수 있습니다." />}
      <PrimaryActionButton
        pulse={ready}
        stepNumber={2}
        disabled={!ready}
        aria-describedby={!ready ? actionRequirementId : undefined}
        onClick={() => onBeginReview()}
      >
        권한 심사 시작
      </PrimaryActionButton>
    </main>
  )
}
