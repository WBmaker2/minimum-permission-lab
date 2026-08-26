import ts from 'typescript'

import { isProvenanceMap, resolveProvenanceProperty } from './provenance.mjs'

function unwrap(node) {
  let current = node
  while (ts.isParenthesizedExpression(current) || ts.isAsExpression(current) || ts.isTypeAssertionExpression(current) || ts.isNonNullExpression(current) || ts.isSatisfiesExpression(current)) current = current.expression
  return current
}

/**
 * Detect destructuring paths that cannot be resolved to a known property.
 * External roots must fail closed; local/known object maps are resolved
 * recursively by the caller's property classifier.
 */
export function hasUnresolvedExternalDestructure(pattern, base, isKnownExternalProperty) {
  const current = unwrap(pattern)
  if (!base) return true
  if (ts.isObjectBindingPattern(current)) {
    for (const element of current.elements) {
      if (!ts.isBindingElement(element) || element.dotDotDotToken) return true
      const propertyName = element.propertyName && (ts.isIdentifier(element.propertyName) || ts.isStringLiteralLike(element.propertyName) || ts.isNumericLiteral(element.propertyName))
        ? element.propertyName.text
        : element.name && ts.isIdentifier(element.name) ? element.name.text : null
      if (!propertyName) return true
      const resolved = resolveProvenanceProperty(base, propertyName)
      const known = isProvenanceMap(base)
        ? base.has(propertyName) && base.get(propertyName) !== null
        : isKnownExternalProperty(base, propertyName, resolved)
      if (!known) return true
      if ((ts.isObjectBindingPattern(element.name) || ts.isArrayBindingPattern(element.name)) && hasUnresolvedExternalDestructure(element.name, resolved, isKnownExternalProperty)) return true
    }
    return false
  }
  if (ts.isArrayBindingPattern(current)) {
    if (!isProvenanceMap(base)) return true
    for (const [index, element] of current.elements.entries()) {
      if (!element || ts.isOmittedExpression(element) || !ts.isBindingElement(element)) continue
      if (element.dotDotDotToken) return true
      const propertyName = String(index)
      if (!base.has(propertyName) || base.get(propertyName) === null) return true
      const resolved = base.get(propertyName)
      if ((ts.isObjectBindingPattern(element.name) || ts.isArrayBindingPattern(element.name)) && hasUnresolvedExternalDestructure(element.name, resolved, isKnownExternalProperty)) return true
    }
  }
  return false
}
