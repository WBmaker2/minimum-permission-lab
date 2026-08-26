import eslint from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

const WRAPPERS = new Set(['window', 'globalThis', 'self'])
const RESTRICTED_PROPERTIES = new Set([
  'navigator', 'permissions', 'geolocation', 'contacts', 'mediaDevices', 'getUserMedia',
  'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'sendBeacon', 'serviceWorker',
  'firebase', 'analytics', 'segment', 'gtag',
])
const TYPE_ONLY_RUNTIME_NAMES = new Set(['window', 'globalThis', 'self', 'navigator', 'mediaDevices', 'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'firebase', 'analytics', 'segment', 'gtag'])

function isTypeOnlyImportName(sourceCode, name) {
  if (!TYPE_ONLY_RUNTIME_NAMES.has(name)) return false
  return sourceCode.ast.body.some((statement) => {
    if (statement.type !== 'ImportDeclaration') return false
    if (statement.importKind === 'type') return statement.specifiers.some((specifier) => specifier.local?.name === name)
    return statement.specifiers.some((specifier) => (specifier.importKind === 'type' || specifier.importKind === 'typeof') && specifier.local?.name === name)
  })
}

function hasLocalDefinition(sourceCode, identifier) {
  if (hasTypeOnlyBinding(sourceCode, identifier)) return false
  let scope = sourceCode.getScope(identifier)
  while (scope) {
    const variable = scope.set?.get(identifier.name)
    if (variable?.defs?.some((definition) => {
      if (definition.type !== 'ImportBinding') return true
      const imported = definition.node
      const clause = definition.parent?.importClause ?? imported?.parent?.importClause
      return !(clause?.isTypeOnly || imported?.isTypeOnly)
    })) return true
    scope = scope.upper
  }
  return false
}

function hasTypeOnlyBinding(sourceCode, identifier) {
  let scope = sourceCode.getScope(identifier)
  while (scope) {
    const variable = scope.set?.get(identifier.name)
    if (variable?.defs?.length) return variable.defs.every((definition) => definition.type === 'ImportBinding') && isTypeOnlyImportName(sourceCode, identifier.name)
    scope = scope.upper
  }
  return false
}

const permissionBoundaryRule = {
  meta: {
    type: 'problem',
    docs: { description: 'block browser permission, network, and analytics APIs on real global wrappers' },
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    return {
      Identifier(node) {
        if (!hasTypeOnlyBinding(sourceCode, node)) return
        const parent = node.parent
        if (parent?.type === 'ImportClause' || parent?.type === 'ImportSpecifier' || parent?.type === 'ImportNamespaceSpecifier' || parent?.type === 'ImportDefaultSpecifier' || parent?.type === 'ImportSpecifier') return
        if (parent?.type === 'MemberExpression' && (parent.object === node || parent.property === node)) return
        if (parent?.type === 'Property' && parent.key === node) return
        if (parent?.type?.startsWith('TS')) return
        context.report({ node, message: `type-only import '${node.name}'는 실행 시 외부 capability를 가리지 못합니다. 실제 권한·네트워크 API 참조를 제거하세요.` })
      },
      MemberExpression(node) {
        if (node.object.type !== 'Identifier' || !WRAPPERS.has(node.object.name) || hasLocalDefinition(sourceCode, node.object)) return
        const property = node.computed
          ? node.property.type === 'Literal' && typeof node.property.value === 'string' ? node.property.value : null
          : node.property.type === 'Identifier' ? node.property.name : null
        if (property && RESTRICTED_PROPERTIES.has(property)) {
          context.report({ node, message: `실제 브라우저 경계(${node.object.name}.${property})를 사용하지 마세요. 가상 학습 모델은 권한·외부 네트워크·분석을 사용하지 않습니다.` })
        } else if (node.computed && !property) {
          context.report({ node, message: `동적 브라우저 경계(${node.object.name}[...])를 사용하지 마세요. 외부 권한·네트워크 접근은 정책 검사에서 차단됩니다.` })
        }
      },
    }
  },
}

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}', 'src/**/*.d.ts'],
    plugins: {
      'permission-boundary': { rules: { 'no-browser-boundary': permissionBoundaryRule } },
    },
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'navigator', message: '실제 브라우저 권한·기기 API를 사용하지 마세요. 이 앱은 가상 학습 모델이며 개인정보를 수집하지 않습니다.' },
        { name: 'mediaDevices', message: '실제 카메라·마이크 API를 사용하지 마세요. 학습 중 기기 정보를 접근하지 않습니다.' },
        { name: 'fetch', message: '외부 네트워크(fetch)를 사용하지 마세요. 학습 데이터를 앱 밖으로 전송하지 않습니다.' },
        { name: 'XMLHttpRequest', message: '외부 네트워크(XMLHttpRequest)를 사용하지 마세요. 학습 데이터 전송을 차단합니다.' },
        { name: 'WebSocket', message: '외부 네트워크(WebSocket)를 사용하지 마세요. 실시간 외부 전송을 차단합니다.' },
        { name: 'EventSource', message: '외부 네트워크(EventSource)를 사용하지 마세요. 외부 스트림 연결을 차단합니다.' },
        { name: 'firebase', message: '외부 Firebase 초기화를 사용하지 마세요. 계정·클라우드·분석 연동은 MVP 범위 밖입니다.' },
        { name: 'analytics', message: '외부 analytics 초기화를 사용하지 마세요. 학습자 행동을 추적하지 않습니다.' },
        { name: 'segment', message: '외부 Segment 초기화를 사용하지 마세요. 학습자 행동을 전송하지 않습니다.' },
        { name: 'gtag', message: '외부 분석 초기화(gtag)를 사용하지 마세요. 학습자 행동을 추적하지 않습니다.' },
      ],
      // Direct globals and true browser wrappers are checked here. Aliases, destructuring,
      // object aliases, and unknown dynamic provenance are enforced by the AST policy gate.
      'permission-boundary/no-browser-boundary': 'error',
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
)
