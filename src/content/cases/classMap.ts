import type { AppCase, PermissionId, PermissionRule } from '../../domain/model'

const requestedPermissions = Object.freeze([
  'camera',
  'microphone',
  'location',
  'contacts',
] as const)

const dataFlow = Object.freeze([
  '저장된 지도 불러오기',
  '학습자가 교실 이름 선택',
  '경로 보여 주기',
])

const rules = Object.freeze({
  camera: Object.freeze({
    permissionId: 'camera',
    verdict: 'unnecessary',
    neededInformation: '미리 저장된 교실 지도를 보여 주는 데 카메라 정보는 필요하지 않습니다.',
    timing: '지도를 불러오거나 교실 이름을 고를 때 카메라를 사용하지 않습니다.',
    denialImpact: '카메라를 거절해도 저장된 지도와 경로를 볼 수 있습니다.',
    alternative: '카메라 없이 저장된 지도에서 교실 이름을 직접 고릅니다.',
    contractEvidence: '“앱에 미리 저장된 교실 지도를 보여 준다”는 계약에는 카메라가 없습니다.',
  }),
  microphone: Object.freeze({
    permissionId: 'microphone',
    verdict: 'unnecessary',
    neededInformation: '교실 지도 안내에는 음성 정보가 필요하지 않습니다.',
    timing: '지도를 불러오고 경로를 보여 줄 때 마이크를 사용하지 않습니다.',
    denialImpact: '마이크를 거절해도 저장된 지도와 경로를 볼 수 있습니다.',
    alternative: '음성 없이 교실 이름을 직접 선택하여 경로를 확인합니다.',
    contractEvidence: '저장된 교실 지도를 불러와 이름을 선택한다는 계약에는 음성이 없습니다.',
  }),
  location: Object.freeze({
    permissionId: 'location',
    verdict: 'unnecessary',
    conditionId: 'map-current-position-opt-in',
    neededInformation: '기본 계약의 저장된 교실 지도에는 현재 위치 정보가 필요하지 않습니다.',
    timing: '기본 지도에서 교실 이름을 고를 때는 위치를 사용하지 않습니다.',
    denialImpact: '위치를 거절해도 저장된 지도와 선택한 교실 경로를 그대로 볼 수 있습니다.',
    alternative: '현재 위치 대신 저장된 지도에서 교실 이름을 직접 고릅니다.',
    contractEvidence: '“앱에 미리 저장된 교실 지도를 보여 준다”는 기본 계약에는 현재 위치 수집·저장이 없습니다.',
  }),
  contacts: Object.freeze({
    permissionId: 'contacts',
    verdict: 'unnecessary',
    neededInformation: '교실 지도 안내에는 연락처 목록이 필요하지 않습니다.',
    timing: '지도를 보거나 경로를 고를 때 연락처 목록을 읽지 않습니다.',
    denialImpact: '연락처를 거절해도 저장된 지도와 경로를 볼 수 있습니다.',
    alternative: '연락처 목록 없이 교실 이름을 직접 선택합니다.',
    contractEvidence: '저장된 지도를 보여 주고 교실 이름을 선택하는 계약에는 연락처가 없습니다.',
  }),
}) satisfies Readonly<Record<PermissionId, PermissionRule>>

export const CLASS_MAP_CASE: AppCase = Object.freeze({
  id: 'class-map',
  title: '교실 지도 안내',
  coreFunction: '앱에 미리 저장된 교실 지도를 보여 준다.',
  dataFlow,
  retentionPromise: '현재 위치를 수집하거나 저장하지 않습니다. 미리 저장된 지도만 보여 줍니다.',
  requestedPermissions,
  rules,
})

export default CLASS_MAP_CASE
