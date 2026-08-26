import type { ReactNode } from 'react'

import { getPermissionDefinition } from '../content/permissions'
import type { PermissionDefinition, PermissionId } from '../domain/model'

export interface PermissionGlyphProps {
  permissionId: PermissionId
}

function renderPermissionGlyph(iconName: PermissionDefinition['iconName']): ReactNode {
  switch (iconName) {
    case 'camera-frame':
      return (
        <>
          <rect x="8" y="13" width="32" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="24" cy="25" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M15 13l3-5h12l3 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </>
      )
    case 'sound-wave':
      return (
        <>
          <path d="M11 25h5l6-10v20l-6-10h-5z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <path d="M29 18c3 4 3 8 0 12M35 13c6 7 6 15 0 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </>
      )
    case 'map-pin':
      return (
        <>
          <path d="M24 42s12-11 12-21a12 12 0 1 0-24 0c0 10 12 21 12 21z" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="24" cy="21" r="4" fill="none" stroke="currentColor" strokeWidth="3" />
        </>
      )
    case 'people-card':
      return (
        <>
          <rect x="7" y="10" width="34" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="18" cy="21" r="4" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M12 32c1-5 11-5 12 0M29 19h7M29 25h7M29 31h5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </>
      )
    default:
      {
        const exhaustiveIcon: never = iconName
        throw new Error(`Unknown permission glyph: ${exhaustiveIcon}`)
      }
  }
}

export default function PermissionGlyph({
  permissionId,
}: PermissionGlyphProps) {
  const definition = getPermissionDefinition(permissionId)

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 48 48"
      width="48"
      height="48"
      data-permission-icon={definition.iconName}
    >
      {renderPermissionGlyph(definition.iconName)}
    </svg>
  )
}
