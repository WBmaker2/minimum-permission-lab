import type { AppCase, CaseId } from '../../domain/model'
import CLASS_MAP_CASE from './classMap'
import GROUP_BOARD_CASE from './groupBoard'
import PHOTO_SCAN_CASE from './photoScan'
import VOICE_READING_CASE from './voiceReading'

export const CASE_ORDER = Object.freeze([
  'photo-scan',
  'voice-reading',
  'class-map',
  'group-board',
] as const)

export const APP_CASES: Readonly<Record<CaseId, AppCase>> = Object.freeze({
  'photo-scan': PHOTO_SCAN_CASE,
  'voice-reading': VOICE_READING_CASE,
  'class-map': CLASS_MAP_CASE,
  'group-board': GROUP_BOARD_CASE,
})

export { GROUP_BOARD_ALIAS_EXAMPLES } from './groupBoard'
export {
  CLASS_MAP_CASE,
  GROUP_BOARD_CASE,
  PHOTO_SCAN_CASE,
  VOICE_READING_CASE,
}
