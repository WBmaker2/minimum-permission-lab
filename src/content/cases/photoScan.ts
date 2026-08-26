import type { AppCase, PermissionId, PermissionRule } from '../../domain/model'

const requestedPermissions = Object.freeze([
  'camera',
  'microphone',
  'location',
  'contacts',
] as const)

const dataFlow = Object.freeze([
  '촬영 버튼 선택',
  '종이 과제 모습 확인',
  '제출 화면에 표시',
  '활동 종료 뒤 처리 끝',
])

const rules = Object.freeze({
  camera: Object.freeze({
    permissionId: 'camera',
    verdict: 'required',
    neededInformation: '종이 과제 이미지가 필요합니다.',
    timing: '촬영 버튼을 누른 현재 기능에서만 사용합니다.',
    denialImpact: '촬영 기능만 사용할 수 없습니다. 다른 학습 설명은 계속 볼 수 있습니다.',
    alternative: '종이 과제를 직접 제출하거나 교사가 안내한 제출 방법을 이용할 수 있습니다.',
    contractEvidence: '핵심 계약인 “사용자가 촬영 버튼을 누를 때 종이 과제를 가상으로 촬영한다”와 연결됩니다.',
  }),
  microphone: Object.freeze({
    permissionId: 'microphone',
    verdict: 'unnecessary',
    neededInformation: '이 과제 촬영에는 음성 정보가 필요하지 않습니다.',
    timing: '촬영 버튼을 눌러도 음성은 사용하지 않습니다.',
    denialImpact: '마이크를 거절해도 종이 과제 촬영 기능은 달라지지 않습니다.',
    alternative: '음성 없이 촬영 버튼으로 종이 과제 모습을 확인할 수 있습니다.',
    contractEvidence: '버튼을 눌렀을 때 종이 과제만 가상으로 촬영하는 계약에는 음성이 없습니다.',
  }),
  location: Object.freeze({
    permissionId: 'location',
    verdict: 'unnecessary',
    neededInformation: '이 과제 촬영에는 현재 위치 정보가 필요하지 않습니다.',
    timing: '촬영할 때도 현재 위치를 확인하지 않습니다.',
    denialImpact: '위치를 거절해도 종이 과제 촬영 기능은 달라지지 않습니다.',
    alternative: '현재 위치 없이 종이 과제의 모습을 촬영하고 제출 화면에서 확인할 수 있습니다.',
    contractEvidence: '버튼으로 종이 과제를 가상 촬영한다는 계약은 현재 위치와 관계가 없습니다.',
  }),
  contacts: Object.freeze({
    permissionId: 'contacts',
    verdict: 'unnecessary',
    neededInformation: '이 과제 촬영에는 연락처 목록이 필요하지 않습니다.',
    timing: '촬영 전후에 연락처 목록을 읽지 않습니다.',
    denialImpact: '연락처를 거절해도 종이 과제 촬영 기능은 달라지지 않습니다.',
    alternative: '연락처 목록 없이 종이 과제를 직접 제출하거나 교사가 안내한 제출 방법을 이용할 수 있습니다.',
    contractEvidence: '촬영 버튼으로 종이 과제만 처리하는 계약에는 연락처 목록이 없습니다.',
  }),
}) satisfies Readonly<Record<PermissionId, PermissionRule>>

export const PHOTO_SCAN_CASE: AppCase = Object.freeze({
  id: 'photo-scan',
  title: '사진 스캔 과제함',
  coreFunction: '사용자가 촬영 버튼을 누를 때 종이 과제를 가상으로 촬영한다.',
  dataFlow,
  retentionPromise: '이 학습 앱은 실제로 촬영하거나 저장하지 않습니다. 가상 계약은 과제 화면에서만 처리되고 활동이 끝나면 처리가 끝납니다.',
  requestedPermissions,
  rules,
})

export default PHOTO_SCAN_CASE
