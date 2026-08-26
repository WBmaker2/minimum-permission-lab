import type {
  PermissionDefinition,
  PermissionId,
} from '../domain/model'

export const PERMISSION_CATALOG = Object.freeze([
  Object.freeze({
    id: 'camera',
    label: '카메라',
    shortDescription: '사진을 찍는 기능입니다.',
    detailDescription: '사진을 찍어 앱 안에서 살펴볼 때 카메라를 사용합니다.',
    shapeLabel: '카메라 테두리',
    iconName: 'camera-frame',
  }),
  Object.freeze({
    id: 'microphone',
    label: '마이크',
    shortDescription: '소리를 듣는 기능입니다.',
    detailDescription: '목소리를 녹음하거나 소리를 들려줄 때 마이크를 사용합니다.',
    shapeLabel: '소리 물결',
    iconName: 'sound-wave',
  }),
  Object.freeze({
    id: 'location',
    label: '위치',
    shortDescription: '내가 있는 곳을 알려주는 기능입니다.',
    detailDescription: '지도에서 현재 있는 곳을 표시할 때 위치를 사용합니다.',
    shapeLabel: '지도 위치표시',
    iconName: 'map-pin',
  }),
  Object.freeze({
    id: 'contacts',
    label: '연락처',
    shortDescription: '친구와 가족의 연락처를 보는 기능입니다.',
    detailDescription: '사람을 초대하거나 연락처를 고를 때 연락처를 사용합니다.',
    shapeLabel: '사람 카드',
    iconName: 'people-card',
  }),
] as const satisfies readonly PermissionDefinition[])

export function getPermissionDefinition(
  id: PermissionId,
): PermissionDefinition {
  const definition = PERMISSION_CATALOG.find((permission) => permission.id === id)

  if (!definition) {
    throw new Error(`Unknown permission: ${id}`)
  }

  return definition
}
