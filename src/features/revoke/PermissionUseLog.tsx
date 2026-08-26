/* eslint-disable react-refresh/only-export-components */
import { useId, type ReactElement } from 'react'
import { getPermissionDefinition } from '../../content/permissions'
import type { PermissionId, RevocationDecision } from '../../domain/model'
import PermissionGlyph from '../../components/PermissionGlyph'

export interface PermissionUseLogEntry {
  readonly permissionId: PermissionId
  readonly lastUsedFor: string
  readonly isStillNeeded: boolean
  readonly explanation: string
}

const entries: readonly PermissionUseLogEntry[] = [
  Object.freeze({
    permissionId: 'camera',
    lastUsedFor: '사진 스캔에서 촬영 순간에 사용한 권한 예시',
    isStillNeeded: false,
    explanation: '사진을 찍는 순간만 필요한 예시입니다. 현재 활동 뒤에는 최소 사용 원칙에 따라 나중에 철회할 수 있고, 카메라 없이 글로 설명하는 대안을 생각할 수 있습니다.',
  }),
  Object.freeze({
    permissionId: 'microphone',
    lastUsedFor: '음성 읽기에서 녹음 버튼을 누른 동안만 사용한 권한 예시',
    isStillNeeded: true,
    explanation: '녹음하는 순간에만 최소한으로 사용하는 예시입니다. 음성 기능을 계속 연습하는 동안은 유지할 수 있으며, 연습을 마치면 나중에 철회할 수 있습니다.',
  }),
  Object.freeze({
    permissionId: 'location',
    lastUsedFor: '학습용 내 위치 표시를 켠 동안 사용한 권한 예시',
    isStillNeeded: false,
    explanation: '내 위치 표시를 켠 동안에만 필요한 예시입니다. 저장된 지도만 볼 때는 불필요하므로 나중에 철회하고 장소 이름을 직접 고르는 대안을 사용할 수 있습니다.',
  }),
  Object.freeze({
    permissionId: 'contacts',
    lastUsedFor: '이 실습에서는 사용하지 않음',
    isStillNeeded: false,
    explanation: '이 학습 활동에는 연락처가 필요하지 않습니다. 최소 사용 원칙에 따라 지금 철회하며, 초대가 필요하다면 별명처럼 개인정보가 아닌 학습용 대안을 생각합니다.',
  }),
]

export const PERMISSION_USE_LOG_ENTRIES: readonly PermissionUseLogEntry[] = Object.freeze(entries)

export interface PermissionUseLogProps {
  readonly decisions: Partial<Record<PermissionId, RevocationDecision>>
  readonly onDecision: (decision: RevocationDecision) => void
  readonly disabled?: boolean
}

const ACTION_LABELS = Object.freeze({
  'keep-current-feature': '현재 기능에 유지',
  'revoke-now': '지금 철회',
} as const)

export default function PermissionUseLog({ decisions, onDecision, disabled = false }: PermissionUseLogProps): ReactElement {
  const groupPrefix = useId()

  return (
    <section aria-labelledby={`${groupPrefix}-title`}>
      <h3 id={`${groupPrefix}-title`}>가상 사용 기록 예시</h3>
      <p>실제 기기 권한은 읽거나 바꾸지 않습니다. 아래 기록은 권한을 언제, 왜 최소한으로 사용할지 연습하는 가상 예시입니다.</p>
      <div>
        {PERMISSION_USE_LOG_ENTRIES.map((entry) => {
          const permission = getPermissionDefinition(entry.permissionId)
          const fieldsetId = `${groupPrefix}-${entry.permissionId}`
          const selectedAction = decisions[entry.permissionId]?.action
          return (
            <fieldset key={entry.permissionId} aria-labelledby={`${fieldsetId}-label`}>
              <legend id={`${fieldsetId}-label`}>
                <PermissionGlyph permissionId={entry.permissionId} />
                <span>{permission.label}</span>
              </legend>
              <dl>
                <div>
                  <dt>마지막 사용 예시</dt>
                  <dd>{entry.lastUsedFor}</dd>
                </div>
                <div>
                  <dt>현재 필요 여부</dt>
                  <dd>{entry.isStillNeeded ? '현재 기능을 연습하는 동안 조건부로 필요함' : '현재 활동 뒤에는 필요 없음'}</dd>
                </div>
              </dl>
              <p>{entry.explanation}</p>
              {(Object.entries(ACTION_LABELS) as Array<[RevocationDecision['action'], string]>).map(([action, label]) => {
                const inputId = `${fieldsetId}-${action}`
                return (
                  <label key={action} htmlFor={inputId}>
                    <input
                      id={inputId}
                      type="radio"
                      name={fieldsetId}
                      value={action}
                      checked={selectedAction === action}
                      disabled={disabled}
                      onChange={() => onDecision({ permissionId: entry.permissionId, action })}
                    />
                    {label}
                  </label>
                )
              })}
            </fieldset>
          )
        })}
      </div>
    </section>
  )
}
