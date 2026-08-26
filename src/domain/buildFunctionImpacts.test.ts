import { describe, expect, it } from 'vitest'

import { APP_CASES } from '../content/cases'
import type { PermissionDecision } from './model'
import { buildFunctionImpacts, MAP_CURRENT_POSITION_FEATURE_LABEL } from './buildFunctionImpacts'

const decisions = (choice: PermissionDecision['choice']): Partial<Record<PermissionDecision['permissionId'], PermissionDecision>> =>
  Object.fromEntries(
    Object.keys(APP_CASES['photo-scan'].rules).map((permissionId) => [permissionId, { permissionId: permissionId as PermissionDecision['permissionId'], choice }]),
  )

describe('buildFunctionImpacts', () => {
  it('builds the four permissions in canonical order for required and unnecessary rules', () => {
    const impacts = buildFunctionImpacts(APP_CASES['photo-scan'], decisions('deny'), [], [])

    expect(impacts.map((impact) => impact.permissionId)).toEqual(['camera', 'microphone', 'location', 'contacts'])
    expect(impacts[0]).toMatchObject({ availableFunctions: ['종이 과제를 직접 제출하거나 교사가 안내한 제출 방법을 이용할 수 있습니다.'], limitedFunctions: ['촬영 기능만 사용할 수 없습니다. 다른 학습 설명은 계속 볼 수 있습니다.'], judgment: { verdict: 'required' } })
    expect(impacts[1]).toMatchObject({ availableFunctions: [APP_CASES['photo-scan'].coreFunction], limitedFunctions: [], judgment: { verdict: 'unnecessary' } })
  })

  it('makes allow, deny, and more-info impacts follow the learning contract', () => {
    const allow = buildFunctionImpacts(APP_CASES['photo-scan'], decisions('allow-current-feature'), [], [])
    expect(allow[0]).toMatchObject({ availableFunctions: ['사용자가 촬영 버튼을 누를 때 종이 과제를 가상으로 촬영한다.'], limitedFunctions: [] })

    const moreInfo = buildFunctionImpacts(APP_CASES['photo-scan'], decisions('more-info'), [], [])
    expect(moreInfo.every((impact) => impact.availableFunctions.length === 0 && impact.limitedFunctions.length === 0)).toBe(true)
    expect(moreInfo[0].judgment.nextAction).toBe('open-details')
  })

  it('skips missing or mismatched decisions without inventing a judgment', () => {
    const impacts = buildFunctionImpacts(APP_CASES['photo-scan'], { camera: { permissionId: 'microphone', choice: 'deny' } }, [], [])
    expect(impacts).toHaveLength(0)
  })

  it('skips a decision with an invalid runtime choice instead of treating it as denial', () => {
    const invalidDecision = { permissionId: 'camera' as const, choice: 'unexpected' as never }
    const impacts = buildFunctionImpacts(APP_CASES['photo-scan'], {
      camera: invalidDecision,
      microphone: { permissionId: 'microphone', choice: 'deny' },
    }, [], [])
    expect(impacts.map((impact) => impact.permissionId)).toEqual(['microphone'])
  })

  it('handles conditional voice processing before and after comparison acknowledgement', () => {
    const voice = APP_CASES['voice-reading']
    const before = buildFunctionImpacts(voice, { microphone: { permissionId: 'microphone', choice: 'allow-current-feature' } }, [], [])
    const beforeMic = before.find((impact) => impact.permissionId === 'microphone')!
    expect(beforeMic).toMatchObject({ availableFunctions: [], limitedFunctions: [voice.rules.microphone.denialImpact] })
    expect(beforeMic.judgment.verdict).toBe('conditional')

    const after = buildFunctionImpacts(voice, { microphone: { permissionId: 'microphone', choice: 'allow-current-feature' } }, [], ['voice-press-and-delete'])
    expect(after.find((impact) => impact.permissionId === 'microphone')).toMatchObject({ availableFunctions: [voice.coreFunction], limitedFunctions: [] })

    const denied = buildFunctionImpacts(voice, { microphone: { permissionId: 'microphone', choice: 'deny' } }, [], ['voice-press-and-delete'])
    expect(denied.find((impact) => impact.permissionId === 'microphone')).toMatchObject({ availableFunctions: [voice.rules.microphone.alternative], limitedFunctions: [voice.rules.microphone.denialImpact] })
  })

  it('keeps stored map available while the optional current-position switch changes only one function', () => {
    const map = APP_CASES['class-map']
    const location = { location: { permissionId: 'location' as const, choice: 'deny' as const } }
    const off = buildFunctionImpacts(map, location, [], [])
    expect(off.find((impact) => impact.permissionId === 'location')).toMatchObject({ availableFunctions: [map.coreFunction], limitedFunctions: [], judgment: { verdict: 'unnecessary' } })

    const onBeforeAck = buildFunctionImpacts(map, { location: { permissionId: 'location', choice: 'allow-current-feature' } }, ['map-current-position'], [])
    expect(onBeforeAck.find((impact) => impact.permissionId === 'location')).toMatchObject({ availableFunctions: [map.coreFunction], limitedFunctions: [MAP_CURRENT_POSITION_FEATURE_LABEL], judgment: { verdict: 'conditional' } })

    const onAfterAck = buildFunctionImpacts(map, { location: { permissionId: 'location', choice: 'allow-current-feature' } }, ['map-current-position'], ['map-current-position-opt-in'])
    expect(onAfterAck.find((impact) => impact.permissionId === 'location')).toMatchObject({ availableFunctions: [map.coreFunction], limitedFunctions: [], judgment: { verdict: 'conditional' } })

    const denied = buildFunctionImpacts(map, location, ['map-current-position'], [])
    expect(denied.find((impact) => impact.permissionId === 'location')).toMatchObject({ availableFunctions: [map.coreFunction], limitedFunctions: [MAP_CURRENT_POSITION_FEATURE_LABEL] })
  })

  it('returns frozen impacts and does not mutate source data', () => {
    const map = APP_CASES['class-map']
    const source = { location: { permissionId: 'location' as const, choice: 'allow-current-feature' as const } }
    const impacts = buildFunctionImpacts(map, source, ['map-current-position'], ['map-current-position-opt-in'])
    expect(Object.isFrozen(impacts)).toBe(true)
    expect(Object.isFrozen(impacts[0])).toBe(true)
    expect(Object.isFrozen(impacts[0].availableFunctions)).toBe(true)
    expect(source).toEqual({ location: { permissionId: 'location', choice: 'allow-current-feature' } })
  })
})
