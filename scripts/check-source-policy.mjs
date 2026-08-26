import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'

/** @typedef {{ filePath: string, source: string }} SourcePolicyInput */
/** @typedef {{ filePath: string, line: number, pattern: string }} PolicyViolation */

const PERMISSION_PROPERTIES = new Set(['permissions', 'geolocation', 'contacts', 'mediaDevices', 'sendBeacon', 'serviceWorker'])
const NETWORK_GLOBALS = new Set(['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource'])
const ANALYTICS_INITIALIZERS = new Set(['firebase.initializeApp', 'firebase.analytics', 'analytics.init', 'segment.load', 'gtag'])
const ALIASABLE_VALUES = new Set(['navigator', 'mediaDevices', 'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'firebase', 'analytics', 'segment', 'gtag'])
const GLOBAL_WRAPPERS = new Set(['window', 'globalThis', 'self'])
const DYNAMIC_PATTERN = 'dynamic-policy-access'
const SHADOW_PREFIX = '__shadow__:'
const CONSTANT_PREFIX = '__constant__:'
const CANONICAL_PATTERN_ORDER = ['navigator.permissions', 'navigator.geolocation', 'navigator.contacts', 'navigator.mediaDevices', 'mediaDevices.getUserMedia', 'navigator.sendBeacon', 'navigator.serviceWorker', 'fetch(', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'firebase.initializeApp', 'firebase.analytics', 'analytics.init', 'segment.load', 'gtag(', DYNAMIC_PATTERN, 'parse-error']

function scriptKindFor(filePath) {
  if (/\.tsx$/.test(filePath)) return ts.ScriptKind.TSX
  if (/\.jsx$/.test(filePath)) return ts.ScriptKind.JSX
  if (/\.js$/.test(filePath)) return ts.ScriptKind.JS
  return ts.ScriptKind.TS
}

function unwrap(node) {
  let current = node
  while (ts.isParenthesizedExpression(current) || ts.isAsExpression(current) || ts.isTypeAssertionExpression(current) || ts.isNonNullExpression(current) || ts.isSatisfiesExpression(current)) current = current.expression
  return current
}

function bindingNames(pattern) {
  const names = []
  const visit = (node) => {
    if (ts.isBindingElement(node)) {
      if (ts.isIdentifier(node.name)) names.push(node.name)
      else visit(node.name)
      return
    }
    if (ts.isIdentifier(node)) names.push(node)
    else ts.forEachChild(node, visit)
  }
  visit(pattern)
  return names
}

function buildAnalysis(sourceFile) {
  const root = { start: 0, end: sourceFile.end, depth: 0, parent: null, kind: 'source' }
  const bindings = []
  const declarations = []
  const assignments = []
  const parameterInitializers = []
  const parameterPatterns = []
  const addBinding = (nameNode, scope, declarationPos, initializer = null) => {
    const record = { name: nameNode.text, scope, declarationPos, alias: null, constant: null, objectProperties: null, initializer }
    bindings.push(record)
    return record
  }
  const nearestFunctionScope = (scope) => {
    let current = scope
    while (current.parent && current.kind !== 'function') current = current.parent
    return current
  }
  const visit = (node, scope) => {
    let active = scope
    if (ts.isFunctionLike(node)) {
      const body = node.body
      active = { start: node.getStart(sourceFile), end: body?.end ?? node.end, depth: scope.depth + 1, parent: scope, kind: 'function' }
      for (const parameter of node.parameters ?? []) for (const nameNode of bindingNames(parameter.name)) {
        const binding = addBinding(nameNode, active, parameter.getStart(sourceFile))
        if (parameter.initializer) {
          if (ts.isIdentifier(parameter.name)) parameterInitializers.push({ binding, initializer: parameter.initializer })
          else parameterPatterns.push({ pattern: parameter.name, initializer: parameter.initializer })
        }
      }
    } else if (ts.isCatchClause(node) && node.variableDeclaration) {
      active = { start: node.block.getStart(sourceFile), end: node.block.end, depth: scope.depth + 1, parent: scope, kind: 'catch' }
      for (const nameNode of bindingNames(node.variableDeclaration.name)) addBinding(nameNode, active, node.variableDeclaration.getStart(sourceFile))
    } else if (ts.isBlock(node)) {
      active = { start: node.getStart(sourceFile), end: node.end, depth: scope.depth + 1, parent: scope, kind: 'block' }
    } else if (ts.isForStatement(node) || ts.isForInStatement(node) || ts.isForOfStatement(node) || ts.isSwitchStatement(node)) {
      active = { start: node.getStart(sourceFile), end: node.end, depth: scope.depth + 1, parent: scope, kind: 'lexical' }
    }
    if (ts.isVariableDeclaration(node)) {
      const target = node.parent && ts.isVariableDeclarationList(node.parent) && (node.parent.flags & ts.NodeFlags.Var) ? nearestFunctionScope(active) : active
      for (const nameNode of bindingNames(node.name)) addBinding(nameNode, target, node.getStart(sourceFile), ts.isIdentifier(node.name) ? node.initializer : null)
      declarations.push({ node, scope: target })
    }
    if (ts.isImportDeclaration(node) && node.importClause && !node.importClause.isTypeOnly) {
      if (node.importClause.name) addBinding(node.importClause.name, active, node.getStart(sourceFile))
      const namedBindings = node.importClause.namedBindings
      if (namedBindings && ts.isNamespaceImport(namedBindings)) addBinding(namedBindings.name, active, node.getStart(sourceFile))
      if (namedBindings && ts.isNamedImports(namedBindings)) for (const element of namedBindings.elements) if (!element.isTypeOnly) addBinding(element.name, active, node.getStart(sourceFile))
    }
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) assignments.push(node)
    if (ts.isFunctionDeclaration(node) && node.name) addBinding(node.name, scope, node.getStart(sourceFile))
    ts.forEachChild(node, (child) => visit(child, active))
  }
  visit(sourceFile, root)
  const findBinding = (name, position) => bindings
    .filter((binding) => binding.name === name && binding.scope.start <= position && position <= binding.scope.end)
    .sort((left, right) => right.scope.depth - left.scope.depth || right.scope.start - left.scope.start || right.declarationPos - left.declarationPos)[0] ?? null
  const analysis = { sourceFile, bindings, declarations, assignments, parameterInitializers, parameterPatterns, findBinding }
  const staticPropertyName = (node) => {
    const current = unwrap(node)
    if (ts.isPropertyAccessExpression(current)) return current.name.text
    if (ts.isElementAccessExpression(current) && current.argumentExpression) {
      const argument = unwrap(current.argumentExpression)
      if (ts.isStringLiteralLike(argument) || ts.isNumericLiteral(argument)) return argument.text
      if (ts.isIdentifier(argument)) return findBinding(argument.text, argument.getStart(sourceFile))?.constant
    }
    return null
  }
  const resolveExpression = (node) => {
    const current = unwrap(node)
    if (ts.isIdentifier(current)) {
      const binding = findBinding(current.text, current.getStart(sourceFile))
      if (binding) {
        if (binding.alias) return binding.alias
        if (binding.constant !== null) return `${CONSTANT_PREFIX}${binding.constant}`
        return `${SHADOW_PREFIX}${current.text}`
      }
      return current.text
    }
    if (!ts.isPropertyAccessExpression(current) && !ts.isElementAccessExpression(current)) return null
    const property = staticPropertyName(current)
    if (!property) return null
    const expression = unwrap(current.expression)
    const base = resolveExpression(expression)
    if (!base) return null
    if (ts.isIdentifier(expression)) {
      const objectBinding = findBinding(expression.text, expression.getStart(sourceFile))
      if (objectBinding?.objectProperties?.has(property)) return objectBinding.objectProperties.get(property)
    }
    const baseProperties = base instanceof Map ? base : null
    if (baseProperties?.has(property)) return baseProperties.get(property)
    if (baseProperties) return null
    if (base.startsWith(SHADOW_PREFIX)) return `${base}.${property}`
    if (GLOBAL_WRAPPERS.has(base) && ALIASABLE_VALUES.has(property)) return property
    if (base === 'navigator') return `navigator.${property}`
    if (base === 'navigator.mediaDevices' && property === 'getUserMedia') return 'mediaDevices.getUserMedia'
    return `${base}.${property}`
  }
  const resolveFromBase = (base, property) => {
    if (!base || base.startsWith(SHADOW_PREFIX)) return base ? `${base}.${property}` : null
    if (GLOBAL_WRAPPERS.has(base) && ALIASABLE_VALUES.has(property)) return property
    if (base === 'navigator') return `navigator.${property}`
    if (base === 'navigator.mediaDevices' && property === 'getUserMedia') return 'mediaDevices.getUserMedia'
    return `${base}.${property}`
  }
  const resolveObjectProperties = (initializer) => {
    if (ts.isArrayLiteralExpression(initializer)) return new Map(initializer.elements.map((element, index) => [String(index), resolveObjectProperties(element) ?? resolveExpression(element)]))
    if (!ts.isObjectLiteralExpression(initializer)) return null
    const properties = new Map()
    for (const property of initializer.properties) {
      if (ts.isShorthandPropertyAssignment(property)) properties.set(property.name.text, resolveExpression(property.name))
      else if (ts.isPropertyAssignment(property)) {
        const name = ts.isIdentifier(property.name) || ts.isStringLiteralLike(property.name) ? property.name.text : null
        if (name) properties.set(name, resolveObjectProperties(property.initializer) ?? resolveExpression(property.initializer))
      }
    }
    return properties
  }
  const isStringConstant = (initializer) => {
    const value = unwrap(initializer)
    return ts.isStringLiteralLike(value) ? value.text : null
  }
  const resolveAssignedValue = (node) => {
    const value = unwrap(node)
    if (ts.isBinaryExpression(value) && value.operatorToken.kind === ts.SyntaxKind.EqualsToken) return resolveAssignedValue(value.right)
    return resolveExpression(value)
  }
  const assignBinding = (binding, resolved) => {
    if (!binding || !resolved) return false
    if (resolved.startsWith(CONSTANT_PREFIX)) {
      const constant = resolved.slice(CONSTANT_PREFIX.length)
      const changed = binding.constant !== constant || binding.alias !== null || binding.objectProperties !== null
      binding.constant = constant
      binding.alias = null
      binding.objectProperties = null
      return changed
    }
    if (binding.alias === resolved && binding.constant === null && binding.objectProperties === null) return false
    const changed = binding.alias !== resolved || binding.constant !== null || binding.objectProperties !== null
    binding.alias = resolved
    binding.constant = null
    binding.objectProperties = null
    return changed
  }
  const assignObjectProperty = (target, resolved) => {
    const member = unwrap(target)
    if (!ts.isPropertyAccessExpression(member) && !ts.isElementAccessExpression(member)) return false
    const property = staticPropertyName(member)
    const expression = unwrap(member.expression)
    if (!property || !ts.isIdentifier(expression)) return false
    const binding = findBinding(expression.text, expression.getStart(sourceFile))
    if (!binding) return false
    if (!binding.objectProperties) binding.objectProperties = new Map()
    if (binding.objectProperties.get(property) === resolved) return false
    binding.objectProperties.set(property, resolved)
    return true
  }
  const assignBindingValue = (binding, value) => {
    if (!binding) return false
    const objectProperties = resolveObjectProperties(value)
    if (objectProperties) {
      const changed = binding.objectProperties === null || JSON.stringify([...binding.objectProperties]) !== JSON.stringify([...objectProperties]) || binding.alias !== null || binding.constant !== null
      binding.objectProperties = objectProperties
      binding.alias = null
      binding.constant = null
      return changed
    }
    const resolved = resolveAssignedValue(value)
    if (!resolved) {
      if (binding.constant === null) return false
      binding.constant = null
      return true
    }
    return assignBinding(binding, resolved)
  }
  const assignDestructuredBindings = (target, base) => {
    if ((!ts.isObjectLiteralExpression(target) && !ts.isObjectBindingPattern(target) && !ts.isArrayBindingPattern(target)) || !base) return false
    let changed = false
    const elements = target.elements ?? target.properties
    for (const [index, element] of elements.entries()) {
      if (ts.isOmittedExpression(element)) continue
      let propertyName = String(index)
      let bindingNode = null
      if (ts.isBindingElement(element)) {
        propertyName = element.propertyName && (ts.isIdentifier(element.propertyName) || ts.isStringLiteralLike(element.propertyName)) ? element.propertyName.text : element.name.text
        bindingNode = ts.isIdentifier(element.name) ? element.name : null
      } else if (ts.isPropertyAssignment(element) && ts.isIdentifier(element.initializer)) {
        propertyName = ts.isIdentifier(element.name) || ts.isStringLiteralLike(element.name) ? element.name.text : propertyName
        bindingNode = element.initializer
      }
      if (bindingNode) changed = assignBinding(findBinding(bindingNode.text, bindingNode.getStart(sourceFile)), resolveFromBase(base, propertyName)) || changed
    }
    return changed
  }
  for (let pass = 0; pass <= bindings.length; pass += 1) {
    let changed = false
    for (const declaration of declarations) {
      if (!ts.isIdentifier(declaration.node.name)) {
        const base = declaration.node.initializer ? resolveExpression(declaration.node.initializer) : null
        if (base) for (const element of declaration.node.name.elements) {
          if (!ts.isBindingElement(element) || !ts.isIdentifier(element.name)) continue
          const property = element.propertyName && (ts.isIdentifier(element.propertyName) || ts.isStringLiteralLike(element.propertyName)) ? element.propertyName.text : element.name.text
          const binding = findBinding(element.name.text, element.name.getStart(sourceFile))
          const resolved = resolveFromBase(base, property)
          if (binding && resolved && binding.alias !== resolved) { binding.alias = resolved; changed = true }
        }
        continue
      }
      const binding = findBinding(declaration.node.name.text, declaration.node.name.getStart(sourceFile))
      const initializer = declaration.node.initializer
      if (!binding || !initializer) continue
      const constant = isStringConstant(initializer)
      if (constant !== null) {
        if (binding.constant !== constant) { binding.constant = constant; changed = true }
        continue
      }
      const objectProperties = resolveObjectProperties(initializer)
      if (objectProperties) {
        if (!binding.objectProperties || JSON.stringify([...binding.objectProperties]) !== JSON.stringify([...objectProperties])) { binding.objectProperties = objectProperties; changed = true }
        continue
      }
      const resolved = resolveExpression(initializer)
      changed = assignBinding(binding, resolved) || changed
    }
    for (const { binding, initializer } of parameterInitializers) {
      changed = assignBinding(binding, resolveExpression(initializer)) || changed
    }
    for (const { pattern, initializer } of parameterPatterns) {
      changed = assignDestructuredBindings(pattern, resolveExpression(initializer)) || changed
    }
    for (const assignment of assignments) {
      const target = unwrap(assignment.left)
      const resolved = resolveAssignedValue(assignment.right)
      if (ts.isIdentifier(target)) changed = assignBindingValue(findBinding(target.text, target.getStart(sourceFile)), assignment.right) || changed
      else if (ts.isPropertyAccessExpression(target) || ts.isElementAccessExpression(target)) changed = assignObjectProperty(target, resolved) || changed
      else changed = assignDestructuredBindings(target, resolved) || changed
    }
    if (!changed) break
  }
  analysis.resolveExpression = resolveExpression
  analysis.staticPropertyName = staticPropertyName
  analysis.hasExternalProvenance = (node) => {
    const current = unwrap(node)
    const resolved = resolveExpression(node)
    const binding = ts.isIdentifier(current) ? analysis.findBinding(current.text, current.getStart(sourceFile)) : null
    const hasExternalValue = (value) => {
      if (value instanceof Map) return [...value.values()].some(hasExternalValue)
      return Boolean(value && !value.startsWith(SHADOW_PREFIX) && !value.startsWith(CONSTANT_PREFIX) && (GLOBAL_WRAPPERS.has(value) || ALIASABLE_VALUES.has(value) || value.startsWith('navigator.') || value.startsWith('mediaDevices.') || [...GLOBAL_WRAPPERS].some((wrapper) => value.startsWith(`${wrapper}.`))))
    }
    if (binding?.objectProperties && hasExternalValue(binding.objectProperties)) return true
    if (resolved instanceof Map) return hasExternalValue(resolved)
    if (!resolved || resolved.startsWith(SHADOW_PREFIX) || resolved.startsWith(CONSTANT_PREFIX)) return false
    if (GLOBAL_WRAPPERS.has(resolved) || ALIASABLE_VALUES.has(resolved)) return true
    if ([...GLOBAL_WRAPPERS].some((wrapper) => resolved.startsWith(`${wrapper}.`))) return true
    if (resolved.startsWith('navigator.') || resolved.startsWith('mediaDevices.')) return true
    return (ts.isPropertyAccessExpression(current) || ts.isElementAccessExpression(current)) && analysis.hasExternalProvenance(current.expression)
  }
  return analysis
}

function canonicalPattern(resolved) {
  if (typeof resolved !== 'string') return null
  if (resolved === 'navigator' || resolved === 'mediaDevices') return resolved
  if (resolved === 'fetch') return 'fetch('
  if (resolved === 'mediaDevices.getUserMedia') return 'mediaDevices.getUserMedia'
  if (resolved && resolved.startsWith('navigator.') && PERMISSION_PROPERTIES.has(resolved.slice('navigator.'.length))) return resolved
  if (NETWORK_GLOBALS.has(resolved)) return resolved
  if (resolved === 'firebase' || resolved === 'analytics' || resolved === 'segment') return resolved
  if (ANALYTICS_INITIALIZERS.has(resolved)) return resolved === 'gtag' ? 'gtag(' : resolved
  return null
}

function isBindingName(node, parent) {
  return Boolean(parent && (ts.isVariableDeclaration(parent) || ts.isBindingElement(parent) || ts.isParameter(parent) || ts.isImportClause(parent) || ts.isImportSpecifier(parent) || ts.isNamespaceImport(parent) || ts.isFunctionDeclaration(parent)) && (parent.name === node || parent.propertyName === node))
}

function isMemberPart(node, parent) {
  return Boolean(parent && (ts.isPropertyAccessExpression(parent) || ts.isElementAccessExpression(parent)) && (parent.expression === node || parent.name === node))
}

function isWriteTarget(node, parent) {
  if (!parent) return false
  if (ts.isBinaryExpression(parent) && parent.operatorToken.kind === ts.SyntaxKind.EqualsToken && parent.left === node) return true
  return false
}

function isObjectPropertyName(node, parent) {
  return Boolean(parent && ts.isPropertyAssignment(parent) && parent.name === node)
}

function isNonRuntimeMemberName(node, parent) {
  return Boolean(parent && (ts.isMethodDeclaration(parent) || ts.isMethodSignature(parent) || ts.isPropertySignature(parent) || ts.isPropertyDeclaration(parent)) && parent.name === node)
}

function externalModulePattern(moduleSpecifier) {
  if (moduleSpecifier.startsWith('.') || moduleSpecifier.startsWith('/')) return null
  return moduleSpecifier.match(/(firebase|analytics|segment)/i)?.[1].toLowerCase() ?? null
}

function dynamicBindingProperty(pattern) {
  const current = unwrap(pattern)
  if (ts.isObjectBindingPattern(current) || ts.isObjectLiteralExpression(current)) {
    for (const element of current.elements ?? current.properties) {
      if (ts.isBindingElement(element) || ts.isPropertyAssignment(element)) {
        if (element.propertyName && !ts.isIdentifier(element.propertyName) && !ts.isStringLiteralLike(element.propertyName) && !ts.isNumericLiteral(element.propertyName)) return element.propertyName
        if (dynamicBindingProperty(element.name ?? element.initializer)) return dynamicBindingProperty(element.name ?? element.initializer)
      }
    }
  }
  if (ts.isArrayBindingPattern(current)) {
    for (const element of current.elements) if (element && ts.isBindingElement(element) && dynamicBindingProperty(element.name)) return dynamicBindingProperty(element.name)
  }
  return null
}

function findAstViolations(input) {
  const sourceFile = ts.createSourceFile(input.filePath, input.source, ts.ScriptTarget.Latest, true, scriptKindFor(input.filePath))
  const violations = []
  const seen = new Set()
  const analysis = buildAnalysis(sourceFile)
  const add = (node, pattern) => {
    if (!pattern) return
    const position = typeof node.getStart === 'function' ? node.getStart(sourceFile) : node.position
    const key = `${position}:${pattern}`
    if (seen.has(key)) return
    seen.add(key)
    violations.push({ filePath: input.filePath, line: sourceFile.getLineAndCharacterOfPosition(position).line + 1, pattern, _position: position })
  }
  for (const diagnostic of sourceFile.parseDiagnostics ?? []) add({ position: diagnostic.start ?? 0 }, 'parse-error')
  const visit = (node, parent = null) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteralLike(node.moduleSpecifier)) {
      const pattern = externalModulePattern(node.moduleSpecifier.text)
      if (pattern) add(node.moduleSpecifier, pattern)
    }
    if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier)) {
      const pattern = externalModulePattern(node.moduleSpecifier.text)
      if (pattern) add(node.moduleSpecifier, pattern)
    }
    if (ts.isVariableDeclaration(node) && node.initializer && dynamicBindingProperty(node.name) && analysis.hasExternalProvenance(node.initializer)) add(dynamicBindingProperty(node.name), DYNAMIC_PATTERN)
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken && dynamicBindingProperty(node.left) && analysis.hasExternalProvenance(node.right)) add(dynamicBindingProperty(node.left), DYNAMIC_PATTERN)
    if (ts.isParameter(node) && node.initializer && dynamicBindingProperty(node.name) && analysis.hasExternalProvenance(node.initializer)) add(dynamicBindingProperty(node.name), DYNAMIC_PATTERN)
    if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
      const pattern = canonicalPattern(analysis.resolveExpression(node))
      const dynamic = ts.isElementAccessExpression(node) && !analysis.staticPropertyName(node)
      if (dynamic && analysis.hasExternalProvenance(node.expression)) add(node, DYNAMIC_PATTERN)
      const nestedCapability = pattern && ['navigator', 'mediaDevices', 'firebase', 'analytics', 'segment'].includes(pattern) && parent && (ts.isPropertyAccessExpression(parent) || ts.isElementAccessExpression(parent)) && parent.expression === node
      if (pattern && !nestedCapability) add(node, pattern)
    }
    if (ts.isCallExpression(node)) {
      const argument = node.arguments[0]
      if (argument && ts.isStringLiteralLike(argument)) {
        const importPattern = node.expression.kind === ts.SyntaxKind.ImportKeyword ? externalModulePattern(argument.text) : ts.isIdentifier(node.expression) && node.expression.text === 'require' && !analysis.findBinding('require', node.expression.getStart(sourceFile)) ? externalModulePattern(argument.text) : null
        if (importPattern) add(argument, importPattern)
      }
    }
    if (ts.isIdentifier(node) && !isBindingName(node, parent) && !isMemberPart(node, parent) && !isWriteTarget(node, parent) && !isObjectPropertyName(node, parent) && !isNonRuntimeMemberName(node, parent) && !(parent && ts.isTypeNode(parent))) {
      const pattern = canonicalPattern(analysis.resolveExpression(node))
      if (pattern && !(pattern === 'navigator' && parent && (ts.isPropertyAccessExpression(parent) || ts.isElementAccessExpression(parent)))) add(node, pattern)
    }
    ts.forEachChild(node, (child) => visit(child, node))
  }
  visit(sourceFile)
  violations.sort((left, right) => left._position - right._position || CANONICAL_PATTERN_ORDER.indexOf(left.pattern) - CANONICAL_PATTERN_ORDER.indexOf(right.pattern) || left.pattern.localeCompare(right.pattern))
  return violations.map((violation) => ({ filePath: violation.filePath, line: violation.line, pattern: violation.pattern }))
}

/** @param {readonly SourcePolicyInput[]} inputs @returns {readonly PolicyViolation[]} */
export function findForbiddenRuntimeReferences(inputs) {
  return inputs.flatMap(findAstViolations)
}

function shouldScan(filePath) {
  const basename = path.basename(filePath)
  return /\.(ts|tsx|js|jsx)$/.test(basename) && !/\.test\.[^.]+$/.test(basename) && !/\.spec\.[^.]+$/.test(basename) && !/\.d\.[^.]+$/.test(basename)
}

function collectRuntimeFiles(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
    const filePath = path.join(directory, entry.name)
    if (entry.isDirectory()) collectRuntimeFiles(filePath, files)
    else if (entry.isFile() && shouldScan(filePath)) files.push(filePath)
  }
  return files
}

/** @returns {readonly PolicyViolation[]} */
export function scanRuntimeSourceFiles(rootDirectory) {
  const sourceDirectory = path.join(rootDirectory, 'src')
  if (!fs.existsSync(sourceDirectory)) return []
  return findForbiddenRuntimeReferences(collectRuntimeFiles(sourceDirectory).map((filePath) => ({
    filePath: path.relative(rootDirectory, filePath).split(path.sep).join('/'),
    source: fs.readFileSync(filePath, 'utf8'),
  })))
}

function runCli() {
  const violations = scanRuntimeSourceFiles(process.cwd())
  if (violations.length === 0) {
    console.error('source policy: 0 forbidden runtime references')
    return
  }
  for (const violation of violations) console.error(`${violation.filePath}:${violation.line} ${violation.pattern}`)
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) runCli()
