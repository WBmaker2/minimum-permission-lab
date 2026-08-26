import { createElement } from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import PermissionGlyph from '../components/PermissionGlyph'
import type { PermissionId } from '../domain/model'
import {
  PERMISSION_CATALOG,
  getPermissionDefinition,
} from './permissions'

const expectedIds = [
  'camera',
  'microphone',
  'location',
  'contacts',
] as const satisfies readonly PermissionId[]

describe('permission catalog', () => {
  it('exports the four permissions in the contract order', () => {
    expect(PERMISSION_CATALOG.map((permission) => permission.id)).toEqual(
      expectedIds,
    )
  })

  it('provides elementary Korean labels and non-empty descriptions', () => {
    const expectedLabels = ['카메라', '마이크', '위치', '연락처']

    expect(PERMISSION_CATALOG.map((permission) => permission.label)).toEqual(
      expectedLabels,
    )
    for (const permission of PERMISSION_CATALOG) {
      expect(permission.shortDescription.trim()).not.toBe('')
      expect(permission.detailDescription.trim()).not.toBe('')
      expect(permission.shapeLabel.trim()).not.toBe('')
    }
  })

  it('uses a unique shape label and the exact glyph mapping for every permission', () => {
    expect(
      new Set(PERMISSION_CATALOG.map((permission) => permission.shapeLabel)).size,
    ).toBe(PERMISSION_CATALOG.length)
    expect(
      PERMISSION_CATALOG.map((permission) => permission.iconName),
    ).toEqual(['camera-frame', 'sound-wave', 'map-pin', 'people-card'])
  })

  it('keeps visual identity independent from color fields', () => {
    for (const permission of PERMISSION_CATALOG) {
      expect(Object.hasOwn(permission, 'color')).toBe(false)
    }
  })

  it.each(expectedIds)('gets the canonical definition for %s', (id) => {
    expect(getPermissionDefinition(id)).toBe(
      PERMISSION_CATALOG.find((permission) => permission.id === id),
    )
  })

  it('throws when a runtime value is not a known permission id', () => {
    expect(() =>
      getPermissionDefinition('not-a-permission' as PermissionId),
    ).toThrowError('Unknown permission: not-a-permission')
  })

  it('keeps canonical definitions unchanged after runtime mutation attempts', () => {
    const camera = getPermissionDefinition('camera')
    const mutate = () => {
      try {
        ;(camera as unknown as { label: string }).label = '변경된 이름'
      } catch {
        // Frozen objects can throw in strict mode; either outcome is acceptable.
      }
    }

    expect(Object.isFrozen(PERMISSION_CATALOG)).toBe(true)
    expect(Object.isFrozen(camera)).toBe(true)
    mutate()
    expect(camera.label).toBe('카메라')
    expect(getPermissionDefinition('camera').label).toBe('카메라')
  })

  it.each([
    ['camera', 'camera-frame'],
    ['microphone', 'sound-wave'],
    ['location', 'map-pin'],
    ['contacts', 'people-card'],
  ] as const)('renders graphical content for the %s glyph', (permissionId, iconName) => {
    const { container } = render(
      createElement(PermissionGlyph, { permissionId }),
    )
    const svg = container.querySelector('svg')

    expect(svg).not.toBeNull()
    expect(svg).toHaveAttribute('data-permission-icon', iconName)
    expect(svg?.querySelector('path, rect, circle')).not.toBeNull()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
    expect(svg).not.toHaveAttribute('role', 'img')
    expect(svg?.querySelector('use')).toBeNull()
    expect(svg?.querySelector('image')).toBeNull()
  })

})
