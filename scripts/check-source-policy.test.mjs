import fs from 'node:fs'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

import { findForbiddenRuntimeReferences, scanRuntimeSourceFiles } from './check-source-policy.mjs'

test('findForbiddenRuntimeReferences reports executable capabilities while ignoring prose', () => {
  const source = [
    "const safeNotice = 'navigator.permissions and fetch( are not used here'",
    '/* navigator.geolocation and XMLHttpRequest are examples, not calls */',
    'navigator.permissions.query({ name: \'camera\' })',
    "fetch('/outside')",
  ].join('\n')

  const violations = findForbiddenRuntimeReferences([{ filePath: 'fixture.ts', source }])

  assert.deepEqual(violations, [
    { filePath: 'fixture.ts', line: 3, pattern: 'navigator.permissions' },
    { filePath: 'fixture.ts', line: 4, pattern: 'fetch(' },
  ])
})

test('findForbiddenRuntimeReferences handles computed, optional, global, and alias variants', () => {
  const source = [
    'fetch (url)',
    'window.fetch(url)',
    "globalThis['fetch']?.(url)",
    'navigator?.permissions.query({})',
    "navigator['geolocation']",
    'window.navigator.contacts',
    'globalThis.navigator.mediaDevices.getUserMedia({})',
    "navigator['sendBeacon'](url)",
    'navigator.serviceWorker',
    'const n = navigator; n.geolocation.getCurrentPosition(() => {})',
    "const f = window['fetch']; f(url)",
    'const X = XMLHttpRequest; new X()',
    'const Socket = WebSocket; new Socket(url)',
    'const Stream = EventSource; new Stream(url)',
    'const safeRegex = /WebSocket/;',
    "const safeString = 'fetch( navigator.permissions WebSocket'",
    '// navigator.contacts fetch( WebSocket',
    'const safeTemplate = `navigator.geolocation fetch(`',
    'const interpolation = `${fetch(url)}`',
    "window.gtag('event')",
    "globalThis['gtag']?.('event')",
    "const g = window.gtag; g('event')",
    'self.fetch(url)',
    'self.navigator.permissions.query({})',
    'window.firebase.initializeApp(config)',
    "globalThis['analytics'].init()",
    "self.segment.load('key')",
    'const wrappedSafeTemplate = `window.gtag fetch(`',
    'const wrappedSafeRegex = /self.fetch/;',
  ].join('\n')

  const violations = findForbiddenRuntimeReferences([{ filePath: 'variants.ts', source }])

  assert.deepEqual(violations, [
    { filePath: 'variants.ts', line: 1, pattern: 'fetch(' },
    { filePath: 'variants.ts', line: 2, pattern: 'fetch(' },
    { filePath: 'variants.ts', line: 3, pattern: 'fetch(' },
    { filePath: 'variants.ts', line: 4, pattern: 'navigator.permissions' },
    { filePath: 'variants.ts', line: 5, pattern: 'navigator.geolocation' },
    { filePath: 'variants.ts', line: 6, pattern: 'navigator.contacts' },
    { filePath: 'variants.ts', line: 7, pattern: 'navigator.mediaDevices' },
    { filePath: 'variants.ts', line: 7, pattern: 'mediaDevices.getUserMedia' },
    { filePath: 'variants.ts', line: 8, pattern: 'navigator.sendBeacon' },
    { filePath: 'variants.ts', line: 9, pattern: 'navigator.serviceWorker' },
    { filePath: 'variants.ts', line: 10, pattern: 'navigator' },
    { filePath: 'variants.ts', line: 10, pattern: 'navigator.geolocation' },
    { filePath: 'variants.ts', line: 11, pattern: 'fetch(' },
    { filePath: 'variants.ts', line: 11, pattern: 'fetch(' },
    { filePath: 'variants.ts', line: 12, pattern: 'XMLHttpRequest' },
    { filePath: 'variants.ts', line: 12, pattern: 'XMLHttpRequest' },
    { filePath: 'variants.ts', line: 13, pattern: 'WebSocket' },
    { filePath: 'variants.ts', line: 13, pattern: 'WebSocket' },
    { filePath: 'variants.ts', line: 14, pattern: 'EventSource' },
    { filePath: 'variants.ts', line: 14, pattern: 'EventSource' },
    { filePath: 'variants.ts', line: 19, pattern: 'fetch(' },
    { filePath: 'variants.ts', line: 20, pattern: 'gtag(' },
    { filePath: 'variants.ts', line: 21, pattern: 'gtag(' },
    { filePath: 'variants.ts', line: 22, pattern: 'gtag(' },
    { filePath: 'variants.ts', line: 22, pattern: 'gtag(' },
    { filePath: 'variants.ts', line: 23, pattern: 'fetch(' },
    { filePath: 'variants.ts', line: 24, pattern: 'navigator.permissions' },
    { filePath: 'variants.ts', line: 25, pattern: 'firebase.initializeApp' },
    { filePath: 'variants.ts', line: 26, pattern: 'analytics.init' },
    { filePath: 'variants.ts', line: 27, pattern: 'segment.load' },
  ])
})

test('scanRuntimeSourceFiles excludes tests and declaration files and keeps file order', () => {
  const rootDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'minimum-permission-policy-'))
  try {
    fs.mkdirSync(path.join(rootDirectory, 'src'))
    fs.writeFileSync(path.join(rootDirectory, 'src', 'runtime.ts'), 'fetch(url)')
    fs.writeFileSync(path.join(rootDirectory, 'src', 'runtime.test.ts'), 'navigator.geolocation')
    fs.writeFileSync(path.join(rootDirectory, 'src', 'runtime.spec.ts'), 'navigator.contacts')
    fs.writeFileSync(path.join(rootDirectory, 'src', 'runtime.d.ts'), 'declare const fetch: unknown')
    assert.deepEqual(scanRuntimeSourceFiles(rootDirectory), [
      { filePath: 'src/runtime.ts', line: 1, pattern: 'fetch(' },
    ])
  } finally {
    fs.rmSync(rootDirectory, { recursive: true, force: true })
  }
})

test('findForbiddenRuntimeReferences fails closed on runtime parse diagnostics', () => {
  const violations = findForbiddenRuntimeReferences([{ filePath: 'broken.ts', source: 'const = fetch(url)' }])
  assert.ok(violations.some(({ pattern }) => pattern === 'parse-error'))
  assert.equal(violations.every(({ filePath }) => filePath === 'broken.ts'), true)
})

test('findForbiddenRuntimeReferences follows wrapper, computed, destructured, and object aliases', () => {
  const source = [
    'const w = window; w.fetch(url)',
    'const root = globalThis; root.navigator.permissions',
    'const s = self; new s.WebSocket(url)',
    "const p = 'fetch'; window[p](url)",
    "const q = 'gtag'; globalThis[q]('event')",
    'const {fetch: call} = window; call(url)',
    'const {navigator: n} = globalThis; n.geolocation',
    "const {'gtag': track} = self; track()",
    'const api = {fetch}; api.fetch(url)',
    'const tools = {track: window.gtag}; tools.track()',
    'const local = () => {}; const widget = {fetch: local}; widget.fetch()',
  ].join('\n')

  assert.deepEqual(findForbiddenRuntimeReferences([{ filePath: 'data-flow.ts', source }]), [
    { filePath: 'data-flow.ts', line: 1, pattern: 'fetch(' },
    { filePath: 'data-flow.ts', line: 2, pattern: 'navigator.permissions' },
    { filePath: 'data-flow.ts', line: 3, pattern: 'WebSocket' },
    { filePath: 'data-flow.ts', line: 4, pattern: 'fetch(' },
    { filePath: 'data-flow.ts', line: 5, pattern: 'gtag(' },
    { filePath: 'data-flow.ts', line: 6, pattern: 'fetch(' },
    { filePath: 'data-flow.ts', line: 7, pattern: 'navigator.geolocation' },
    { filePath: 'data-flow.ts', line: 8, pattern: 'gtag(' },
    { filePath: 'data-flow.ts', line: 9, pattern: 'fetch(' },
    { filePath: 'data-flow.ts', line: 9, pattern: 'fetch(' },
    { filePath: 'data-flow.ts', line: 10, pattern: 'gtag(' },
    { filePath: 'data-flow.ts', line: 10, pattern: 'gtag(' },
  ])
})

test('findForbiddenRuntimeReferences fails closed on dynamic external-root access without local false positives', () => {
  const source = [
    'const p = getRuntimeKey(); window[p](url)',
    'const q = getRuntimeKey(); navigator[q]',
    'const root = self; root[getRuntimeKey()]()',
    'const safeKey = getRuntimeKey(); const widget = {}; widget[safeKey]()',
    'const safeRegex = /WebSocket/;',
    "const safeString = 'fetch( navigator.permissions WebSocket'",
    '// navigator.contacts fetch( WebSocket',
    'const safeTemplate = `navigator.geolocation fetch(`',
    'widget.init(); widget.load(); widget.fetch(); widget.analytics; view.navigator',
    'const local = () => {}; const safeWidget = {fetch: local}; safeWidget.fetch()',
  ].join('\n')

  assert.deepEqual(findForbiddenRuntimeReferences([{ filePath: 'safe-and-dynamic.ts', source }]), [
    { filePath: 'safe-and-dynamic.ts', line: 1, pattern: 'dynamic-policy-access' },
    { filePath: 'safe-and-dynamic.ts', line: 2, pattern: 'dynamic-policy-access' },
    { filePath: 'safe-and-dynamic.ts', line: 3, pattern: 'dynamic-policy-access' },
  ])
})

test('findForbiddenRuntimeReferences respects lexical shadowing for aliases and SDK names', () => {
  const source = [
    'const n = navigator; n.geolocation',
    'function safe(n) { return n.geolocation }',
    'function safeFetch(fetch) { fetch(url) }',
    'function safeSocket(WebSocket) { new WebSocket(url) }',
    'function safeTag(gtag) { gtag() }',
    'const analytics = { init() {} }; analytics.init()',
    'const firebase = { initializeApp() {} }; firebase.initializeApp()',
    'const segment = { load() {} }; segment.load()',
    '{ const n = {}; n.geolocation }',
    'function nested() { return n.geolocation }',
  ].join('\n')

  assert.deepEqual(findForbiddenRuntimeReferences([{ filePath: 'scope.ts', source }]), [
    { filePath: 'scope.ts', line: 1, pattern: 'navigator' },
    { filePath: 'scope.ts', line: 1, pattern: 'navigator.geolocation' },
    { filePath: 'scope.ts', line: 10, pattern: 'navigator.geolocation' },
  ])
})

test('findForbiddenRuntimeReferences accounts for hoisting and simple forbidden assignments', () => {
  const source = [
    'function run() { return n.geolocation }',
    'var n = navigator; run()',
    'let f; f = fetch; f(url)',
    'let root; root = window; root.gtag(\'event\')',
    'let nav; nav = globalThis.navigator; nav.contacts',
    'function safe() { return analytics.init() }',
    'const analytics = { init() { return 1 } }; safe()',
    'call(); function call() { return 1 }',
  ].join('\n')

  assert.deepEqual(findForbiddenRuntimeReferences([{ filePath: 'hoisting.ts', source }]), [
    { filePath: 'hoisting.ts', line: 1, pattern: 'navigator.geolocation' },
    { filePath: 'hoisting.ts', line: 2, pattern: 'navigator' },
    { filePath: 'hoisting.ts', line: 3, pattern: 'fetch(' },
    { filePath: 'hoisting.ts', line: 3, pattern: 'fetch(' },
    { filePath: 'hoisting.ts', line: 4, pattern: 'gtag(' },
    { filePath: 'hoisting.ts', line: 5, pattern: 'navigator' },
    { filePath: 'hoisting.ts', line: 5, pattern: 'navigator.contacts' },
  ])
})

test('findForbiddenRuntimeReferences treats local module imports as safe bindings', () => {
  const source = [
    "import fetch from './fetch'; fetch(url)",
    "import {analytics} from './mock'; analytics.init()",
    "import {navigator as localNavigator} from './mock'; localNavigator.geolocation",
    "import * as firebase from './mock'; firebase.initializeApp()",
    "import localAnalytics from './analytics'; localAnalytics.init()",
    "import localFirebase from './firebase'; localFirebase.initializeApp()",
    "import localSegment from '../segment'; localSegment.load()",
    "import * as rootAnalytics from '/src/analytics'; rootAnalytics.init()",
    "import {fetch as externalFetch} from 'analytics-sdk'; externalFetch(url)",
  ].join('\n')

  assert.deepEqual(findForbiddenRuntimeReferences([{ filePath: 'imports.ts', source }]), [
    { filePath: 'imports.ts', line: 9, pattern: 'analytics' },
  ])
})

test('findForbiddenRuntimeReferences preserves external provenance through dynamic member chains', () => {
  const source = [
    'window.runtime[getRuntimeKey()](url)',
    'const w = window; w.runtime[getRuntimeKey()]',
    'globalThis.api[getRuntimeKey()]()',
    '{ const window = { runtime: {} }; window.runtime[getRuntimeKey()]() }',
    '{ const widget = { runtime: {} }; widget.runtime[key]() }',
  ].join('\n')

  assert.deepEqual(findForbiddenRuntimeReferences([{ filePath: 'dynamic-chain.ts', source }]), [
    { filePath: 'dynamic-chain.ts', line: 1, pattern: 'dynamic-policy-access' },
    { filePath: 'dynamic-chain.ts', line: 2, pattern: 'dynamic-policy-access' },
    { filePath: 'dynamic-chain.ts', line: 3, pattern: 'dynamic-policy-access' },
  ])
})

test('findForbiddenRuntimeReferences scopes catch bindings and default parameter aliases', () => {
  const source = [
    'const f = fetch; f(url)',
    'try {} catch (f) { f(url) }',
    'try {} catch ({f}) { f(url) }',
    'function run(fn = fetch) { fn(url) }',
    'function safe(fn = local) { fn() }',
    'const local = () => {}',
  ].join('\n')

  assert.deepEqual(findForbiddenRuntimeReferences([{ filePath: 'catch-default.ts', source }]), [
    { filePath: 'catch-default.ts', line: 1, pattern: 'fetch(' },
    { filePath: 'catch-default.ts', line: 1, pattern: 'fetch(' },
    { filePath: 'catch-default.ts', line: 4, pattern: 'fetch(' },
    { filePath: 'catch-default.ts', line: 4, pattern: 'fetch(' },
  ])
})

test('findForbiddenRuntimeReferences follows static property, destructuring, and array assignments', () => {
  const source = [
    'const api = {}; api.fetch = window.fetch; api.fetch(url)',
    'const local = () => {}; const safeApi = {}; safeApi.fetch = local; safeApi.fetch()',
    'let f; ({fetch: f} = window); f(url)',
    'let nav; ({navigator: nav} = globalThis); nav.contacts',
    "let track; ({'gtag': track} = self); track()",
    'const a = [fetch]; a[0](url)',
    'const b = [window.gtag]; b[0]()',
    'const c = [local]; c[0]()',
  ].join('\n')

  assert.deepEqual(findForbiddenRuntimeReferences([{ filePath: 'assignment-flow.ts', source }]), [
    { filePath: 'assignment-flow.ts', line: 1, pattern: 'fetch(' },
    { filePath: 'assignment-flow.ts', line: 1, pattern: 'fetch(' },
    { filePath: 'assignment-flow.ts', line: 1, pattern: 'fetch(' },
    { filePath: 'assignment-flow.ts', line: 3, pattern: 'fetch(' },
    { filePath: 'assignment-flow.ts', line: 3, pattern: 'fetch(' },
    { filePath: 'assignment-flow.ts', line: 4, pattern: 'navigator' },
    { filePath: 'assignment-flow.ts', line: 4, pattern: 'navigator.contacts' },
    { filePath: 'assignment-flow.ts', line: 5, pattern: 'gtag(' },
    { filePath: 'assignment-flow.ts', line: 5, pattern: 'gtag(' },
    { filePath: 'assignment-flow.ts', line: 6, pattern: 'fetch(' },
    { filePath: 'assignment-flow.ts', line: 6, pattern: 'fetch(' },
    { filePath: 'assignment-flow.ts', line: 7, pattern: 'gtag(' },
    { filePath: 'assignment-flow.ts', line: 7, pattern: 'gtag(' },
  ])
})

test('findForbiddenRuntimeReferences blocks capability acquisition and simple intra-file flow', () => {
  const cases = [
    ['const w = window; const f = w.fetch; void f', 'fetch('],
    ['const w = self; const g = w.gtag; void g', 'gtag('],
    ['const w = window; w.fetch.call(w, url)', 'fetch('],
    ['const w = window; w.fetch.apply(w, [url])', 'fetch('],
    ['const w = window; w.fetch.bind(w)', 'fetch('],
    ['const w = window; w.navigator', 'navigator'],
    ['const api = {}; api.fetch = window.fetch; api.fetch(url)', 'fetch('],
    ["const api = {}; api.gtag = window.gtag; api.gtag('event')", 'gtag('],
    ['const local = () => {}; const api = {}; api.fetch = local; api.fetch()', null],
    ['let f; ({fetch: f} = window); f(url)', 'fetch('],
    ['let n; ({navigator: n} = globalThis); n.geolocation', 'navigator.geolocation'],
    ["let g; ({'gtag': g} = self); g()", 'gtag('],
    ['const a = [fetch]; a[0](url)', 'fetch('],
    ['const a = [local]; a[0]()', null],
    ['const root = window; const {[getKey()]: call} = root; call(url)', 'dynamic-policy-access'],
    ['const root = window; const a = [root.fetch]; const i = getKey(); a[i](url)', 'dynamic-policy-access'],
    ['const root = window; const api = {run: root.fetch}; const key = getKey(); api[key](url)', 'dynamic-policy-access'],
    ["let key = 'safe'; key = getRuntimeKey(); const w = window; w[key](url)", 'dynamic-policy-access'],
    ['const w = window; let api = {fetch: local}; api = {fetch: w.fetch}; api.fetch(url)', 'fetch('],
    ['const w = window; let a = [local]; a = [w.fetch]; a[0](url)', 'fetch('],
    ['await import(\'firebase/app\')', 'firebase'],
    ["require('analytics-sdk')", 'analytics'],
    ["export * from 'firebase/app'", 'firebase'],
    ["import './analytics'; import '../firebase'; import '/src/segment'", null],
    ['function run({fetch} = window) { fetch(url) }', 'fetch('],
    ['function run({navigator: n} = globalThis) { n.geolocation }', 'navigator.geolocation'],
    ['function safe(fn = local) { fn() }', null],
    ['function safe(fetch) { fetch(url) }', null],
    ['try {} catch (f) { f(url) }', null],
    ['for (const fetch of values) { void fetch } fetch(url)', 'fetch('],
    ['switch (x) { case 1: const fetch = local; void fetch } fetch(url)', 'fetch('],
    ['const analytics = {init(){}}; analytics.init()', null],
    ['const firebase = {initializeApp(){}}; firebase.initializeApp()', null],
    ['const segment = {load(){}}; segment.load()', null],
    ["import type { fetch } from './mock'; fetch(url)", 'fetch('],
    ["import type fetch from './mock'; fetch(url)", 'fetch('],
    ["import type * as window from './mock'; window.fetch(url)", 'fetch('],
    ['const x = {run: fetch}; void x', 'fetch('],
    ["const require = local; require('analytics-sdk')", null],
    ["import fetch from './mock'; fetch(url)", null],
  ]
  for (const [source, expectedPattern] of cases) {
    const violations = findForbiddenRuntimeReferences([{ filePath: 'acquisition.ts', source }])
    if (expectedPattern) assert.ok(violations.some(({ pattern }) => pattern === expectedPattern), source)
    else assert.deepEqual(violations, [], source)
  }
})

test('findForbiddenRuntimeReferences preserves nested external provenance and computed defaults', () => {
  const nested = findForbiddenRuntimeReferences([{
    filePath: 'nested.ts',
    source: [
      'const root = window; const api = {tools: {fetch: root.fetch}}; const key = getKey(); api.tools[key](url)',
      'const local = () => {}; const safe = {tools: {fetch: local}}; safe.tools[key]()',
      'function run({[getKey()]: call} = window) { call(url) }',
      'function safe({[getKey()]: call} = local) { call() }',
    ].join('\n'),
  }])
  assert.deepEqual(nested, [
    { filePath: 'nested.ts', line: 1, pattern: 'fetch(' },
    { filePath: 'nested.ts', line: 1, pattern: 'dynamic-policy-access' },
    { filePath: 'nested.ts', line: 3, pattern: 'dynamic-policy-access' },
  ])
})

test('findForbiddenRuntimeReferences ignores non-runtime property names but keeps shorthand values', () => {
  const violations = findForbiddenRuntimeReferences([{
    filePath: 'names.ts',
    source: [
      'const obj = {navigator(){}}; obj.navigator()',
      'class X { navigator() {} }',
      'interface X { navigator: string }',
      'const value = {navigator}; void value',
    ].join('\n'),
  }])
  assert.deepEqual(violations, [{ filePath: 'names.ts', line: 4, pattern: 'navigator' }])
})

test('ESLint policy boundary distinguishes runtime capability from type-only and local shadow', () => {
  const eslint = fileURLToPath(new URL('../node_modules/.bin/eslint', import.meta.url))
  const run = (source) => spawnSync(eslint, ['--stdin', '--stdin-filename', 'src/policy-fixture.ts'], { input: source, encoding: 'utf8' }).status
  for (const source of ['fetch(url)', 'window.fetch(url)', "import type {fetch} from './mock'; fetch(url)"]) assert.notEqual(run(source), 0, source)
  for (const source of [
    "import fetch from './mock'; fetch(url)",
    "import type {fetch} from './mock'; type X = fetch; const readType = (value: X) => value; readType(undefined as never)",
    "import type * as window from './mock'; type WindowMock = typeof window; function safe(window: WindowMock){ window.fetch(url) } safe(local)",
    'const obj = {navigator(){}}; obj.navigator()',
  ]) assert.equal(run(source), 0, source)
})
