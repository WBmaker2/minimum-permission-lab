import type { AppCase, PermissionId, PermissionRule } from '../../domain/model'

export const GROUP_BOARD_ALIAS_EXAMPLES = Object.freeze([
  '햇살',
  '새싹',
  '푸른별',
] as const)

const requestedPermissions = Object.freeze([
  'camera',
  'microphone',
  'location',
  'contacts',
] as const)

const dataFlow = Object.freeze([
  '가상 별명 연습',
  '기기 안 미리보기',
  '기기 안 알림 카드 작성 시뮬레이션',
])

const rules = Object.freeze({
  camera: Object.freeze({
    permissionId: 'camera',
    verdict: 'unnecessary',
    neededInformation: '기기 안에서 알림 카드를 미리 보는 데 카메라 정보는 필요하지 않습니다.',
    timing: '별명을 입력하거나 카드를 미리 볼 때 카메라를 사용하지 않습니다.',
    denialImpact: '카메라를 거절해도 가상 별명으로 알림 카드를 작성할 수 있습니다.',
    alternative: '카메라 없이 가상 별명을 직접 입력하고 기기 안에서 미리 봅니다.',
    contractEvidence: '가상 별명 입력과 기기 안 미리보기 계약에는 카메라가 없습니다.',
  }),
  microphone: Object.freeze({
    permissionId: 'microphone',
    verdict: 'unnecessary',
    neededInformation: '알림 카드 시뮬레이션에는 음성 정보가 필요하지 않습니다.',
    timing: '가상 별명을 입력하고 카드를 작성할 때 마이크를 사용하지 않습니다.',
    denialImpact: '마이크를 거절해도 가상 알림 카드를 작성할 수 있습니다.',
    alternative: '음성 없이 가상 별명을 직접 입력해 알림 카드를 미리 봅니다.',
    contractEvidence: '직접 입력한 가상 별명과 기기 안 카드 미리보기만 처리하는 계약입니다.',
  }),
  location: Object.freeze({
    permissionId: 'location',
    verdict: 'unnecessary',
    neededInformation: '모둠 알림판 시뮬레이션에는 현재 위치 정보가 필요하지 않습니다.',
    timing: '카드를 작성하거나 미리 볼 때 현재 위치를 확인하지 않습니다.',
    denialImpact: '위치를 거절해도 가상 알림 카드를 작성할 수 있습니다.',
    alternative: '현재 위치 없이 기기 안에서 가상 별명과 알림 카드를 연습합니다.',
    contractEvidence: '기기 안 미리보기와 알림 카드 작성 시뮬레이션에는 위치가 없습니다.',
  }),
  contacts: Object.freeze({
    permissionId: 'contacts',
    verdict: 'unnecessary',
    neededInformation: '연락처 목록 대신 직접 입력한 가상 별명만 필요합니다.',
    timing: '가상 별명을 직접 입력할 때 연락처 목록을 불러오지 않습니다.',
    denialImpact: '연락처를 거절해도 가상 별명으로 알림 카드를 작성할 수 있습니다.',
    alternative: '전체 연락처 가져오기 없이 가상 별명을 직접 입력해 카드를 미리 봅니다.',
    contractEvidence: '직접 입력한 가상 별명으로 기기 안 알림 카드를 시뮬레이션하며 연락처를 가져오지 않는 계약입니다.',
  }),
}) satisfies Readonly<Record<PermissionId, PermissionRule>>

export const GROUP_BOARD_CASE: AppCase = Object.freeze({
  id: 'group-board',
  title: '모둠 알림판',
  coreFunction: '실제 이름이 아닌 가상 별명을 직접 입력해 기기 안의 알림 카드 작성을 시뮬레이션한다.',
  dataFlow,
  retentionPromise: '가상 별명 미리보기만 처리합니다. 이 콘텐츠 모델은 별명을 사례·실험 상태·저장 보고서에 넣지 않습니다.',
  requestedPermissions,
  rules,
})

export default GROUP_BOARD_CASE
