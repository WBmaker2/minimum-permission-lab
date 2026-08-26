/**
 * Provenance values used by the source-policy data-flow pass.
 *
 * A string is a known path or a shadowed/local path. A Map is an object/array
 * property table whose values use the same representation. null is unknown.
 * Keeping the shape explicit prevents Map values from reaching string-only
 * operations such as startsWith().
 */

export const PERMISSION_PROPERTIES = new Set(['permissions', 'geolocation', 'contacts', 'mediaDevices', 'sendBeacon', 'serviceWorker'])
export const NETWORK_GLOBALS = new Set(['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource'])
export const ANALYTICS_INITIALIZERS = new Set(['firebase.initializeApp', 'firebase.analytics', 'analytics.init', 'segment.load', 'gtag'])
export const ALIASABLE_VALUES = new Set(['navigator', 'mediaDevices', 'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'firebase', 'analytics', 'segment', 'gtag'])
export const GLOBAL_WRAPPERS = new Set(['window', 'globalThis', 'self'])
export const DYNAMIC_PATTERN = 'dynamic-policy-access'
export const SHADOW_PREFIX = '__shadow__:'
export const CONSTANT_PREFIX = '__constant__:'
export const CANONICAL_PATTERN_ORDER = ['navigator.permissions', 'navigator.geolocation', 'navigator.contacts', 'navigator.mediaDevices', 'mediaDevices.getUserMedia', 'navigator.sendBeacon', 'navigator.serviceWorker', 'fetch(', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'firebase.initializeApp', 'firebase.analytics', 'analytics.init', 'segment.load', 'gtag(', DYNAMIC_PATTERN, 'parse-error']

/** @param {unknown} value */
export function isProvenanceMap(value) {
  return value instanceof Map
}

/** @param {unknown} value */
export function isProvenanceString(value) {
  return typeof value === 'string'
}

/** @param {unknown} value */
export function containsExternalProvenance(value) {
  if (isProvenanceMap(value)) return [...value.values()].some(containsExternalProvenance)
  if (!isProvenanceString(value)) return false
  return !value.startsWith(SHADOW_PREFIX)
    && !value.startsWith(CONSTANT_PREFIX)
    && (GLOBAL_WRAPPERS.has(value)
      || ALIASABLE_VALUES.has(value)
      || value.startsWith('navigator.')
      || value.startsWith('mediaDevices.')
      || [...GLOBAL_WRAPPERS].some((wrapper) => value.startsWith(`${wrapper}.`)))
}

/**
 * Resolve a known property from a provenance value. Unknown and non-string
 * values are deliberately returned as null so callers can fail closed with a
 * dynamic-policy-access violation instead of throwing.
 *
 * @param {unknown} base
 * @param {string} property
 */
export function resolveProvenanceProperty(base, property) {
  if (isProvenanceMap(base)) return base.get(property) ?? null
  if (!isProvenanceString(base)) return null
  if (base.startsWith(SHADOW_PREFIX)) return `${base}.${property}`
  if (GLOBAL_WRAPPERS.has(base) && ALIASABLE_VALUES.has(property)) return property
  if (base === 'navigator') return `navigator.${property}`
  if (base === 'navigator.mediaDevices' && property === 'getUserMedia') return 'mediaDevices.getUserMedia'
  return `${base}.${property}`
}
