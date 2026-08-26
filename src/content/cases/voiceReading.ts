import type { AppCase, PermissionId, PermissionRule } from '../../domain/model'

const requestedPermissions = Object.freeze([
  'camera',
  'microphone',
  'location',
  'contacts',
] as const)

const dataFlow = Object.freeze([
  '녹음 버튼 누르기',
  '누르는 동안 음성 처리',
  '바로 재생',
  '즉시 삭제',
])

const rules = Object.freeze({
  camera: Object.freeze({
    permissionId: 'camera',
    verdict: 'unnecessary',
    neededInformation: '읽기 연습에는 화면을 보는 데 필요한 정보만 있으면 됩니다.',
    timing: '읽는 동안 카메라는 사용하지 않습니다.',
    denialImpact: '카메라를 거절해도 음성 읽기 연습을 할 수 있습니다.',
    alternative: '카메라 없이 글을 보고 녹음 버튼을 눌러 연습할 수 있습니다.',
    contractEvidence: '녹음 버튼을 누르는 동안 음성을 처리하고 바로 재생·삭제하는 계약에는 카메라가 없습니다.',
  }),
  microphone: Object.freeze({
    permissionId: 'microphone',
    verdict: 'conditional',
    conditionId: 'voice-press-and-delete',
    neededInformation: '녹음 버튼을 누르고 있는 동안의 음성이 필요합니다.',
    timing: '녹음 버튼을 누른 동안에만 음성을 처리하고, 재생 직후 바로 삭제합니다.',
    denialImpact: '마이크를 거절하면 음성 녹음과 바로 재생 연습만 제한됩니다.',
    alternative: '음성을 녹음하지 않고 직접 읽어 교사에게 들려주는 방법으로 연습할 수 있습니다.',
    contractEvidence: '“녹음 버튼을 누른 동안 음성을 가상으로 녹음하고 바로 재생한 뒤 삭제한다”는 조건부 계약에만 연결됩니다.',
  }),
  location: Object.freeze({
    permissionId: 'location',
    verdict: 'unnecessary',
    neededInformation: '음성 읽기 연습에는 현재 위치 정보가 필요하지 않습니다.',
    timing: '녹음 버튼을 누르거나 재생할 때도 위치를 확인하지 않습니다.',
    denialImpact: '위치를 거절해도 음성 읽기 연습과 삭제 흐름은 달라지지 않습니다.',
    alternative: '현재 위치 없이 글을 읽고 음성 연습을 진행할 수 있습니다.',
    contractEvidence: '이 연습의 계약은 누르는 동안 음성, 바로 재생, 즉시 삭제만 다룹니다.',
  }),
  contacts: Object.freeze({
    permissionId: 'contacts',
    verdict: 'unnecessary',
    neededInformation: '음성 읽기 연습에는 연락처 목록이 필요하지 않습니다.',
    timing: '연습 중 연락처 목록을 읽거나 고르지 않습니다.',
    denialImpact: '연락처를 거절해도 음성 읽기 연습과 재생을 할 수 있습니다.',
    alternative: '연락처 목록 없이 혼자 읽거나 교사에게 직접 읽어 줄 수 있습니다.',
    contractEvidence: '누르는 동안의 음성을 처리하고 즉시 삭제하는 계약에는 연락처가 없습니다.',
  }),
}) satisfies Readonly<Record<PermissionId, PermissionRule>>

export const VOICE_READING_CASE: AppCase = Object.freeze({
  id: 'voice-reading',
  title: '음성 읽기 연습',
  coreFunction: '녹음 버튼을 누른 동안 음성을 가상으로 녹음하고 바로 재생한 뒤 삭제한다.',
  dataFlow,
  retentionPromise: '실제 녹음은 하지 않습니다. 가상 계약은 재생 직후 음성을 즉시 삭제합니다.',
  requestedPermissions,
  rules,
})

export default VOICE_READING_CASE
