/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const stylesDirectory = resolve(process.cwd(), 'src/styles')
const readStyle = (fileName: string) => readFileSync(resolve(stylesDirectory, fileName), 'utf8')

afterEach(() => {
  document.querySelectorAll('[data-style-test]').forEach((element) => element.remove())
})

describe('learning visual system styles', () => {
  it('imports the local style layers in a predictable order', () => {
    const mainSource = readFileSync(resolve(process.cwd(), 'src/main.tsx'), 'utf8')
    expect(mainSource).toContain('/// <reference types="vite/client" />')
    expect(mainSource).not.toContain('@ts-expect-error')
    expect(mainSource.indexOf("import './styles/tokens.css'")).toBeGreaterThan(-1)
    expect(mainSource.indexOf("import './styles/global.css'")).toBeGreaterThan(mainSource.indexOf("import './styles/tokens.css'"))
    expect(mainSource.indexOf("import './styles/components.css'")).toBeGreaterThan(mainSource.indexOf("import './styles/global.css'"))
    expect(mainSource.indexOf("import './styles/print.css'")).toBeGreaterThan(mainSource.indexOf("import './styles/components.css'"))
  })

  it('defines light contrast, focus, spacing and minimum target tokens', () => {
    const css = readStyle('tokens.css')
    expect(css).toContain('--color-text:')
    expect(css).toContain('--color-surface:')
    expect(css).toContain('--color-focus-ring:')
    expect(css).toContain('--space-')
    expect(css).toContain('--radius-')
    expect(css).toContain('--shadow-')
    expect(css).toContain('--min-target-size: 44px')
  })

  it('uses only local system fonts and has no external font or URL imports', () => {
    const css = ['global.css', 'components.css', 'print.css'].map(readStyle).join('\n')
    expect(css).toContain('font-family:')
    expect(css).not.toMatch(/@import|url\(|https?:\/\//i)
  })

  it('defines distinct non-color permission shape aliases', () => {
    const css = readStyle('components.css')
    const ruleBody = (selector: string): string => {
      const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const match = css.match(new RegExp(`(?:^|})\\s*([^{}]*${escapedSelector}[^{}]*)\\{([^{}]*)\\}`))
      if (!match) throw new Error(`Missing CSS rule for ${selector}`)
      return match[2]
    }
    const camera = ruleBody('.permission-shape--camera')
    const microphone = ruleBody('.permission-shape--microphone')
    const location = ruleBody('.permission-shape--location')
    const contacts = ruleBody('.permission-shape--contacts')
    expect(camera).toMatch(/border:\s*3px\s+solid/)
    expect(camera).toMatch(/border-radius:\s*var\(--radius-sm\)/)
    expect(microphone).toMatch(/border-block-end:\s*4px\s+double/)
    expect(microphone).toMatch(/border-radius:\s*50%/)
    expect(location).toMatch(/border:\s*3px\s+dotted/)
    expect(location).toMatch(/border-radius:\s*50%\s+50%\s+50%\s+0/)
    expect(location).toMatch(/transform:\s*none/)
    expect(contacts).toMatch(/border:\s*3px\s+dashed/)
    expect(contacts).toMatch(/border-radius:\s*var\(--radius-sm\)/)
    expect(new Set([camera, microphone, location, contacts]).size).toBe(4)
    expect(css).toContain('[data-permission-icon="camera-frame"]')
    expect(css).toContain('[data-permission-icon="sound-wave"]')
    expect(css).toContain('[data-permission-icon="map-pin"]')
    expect(css).toContain('[data-permission-icon="people-card"]')
  })

  it('applies distinct computed permission shape styles to real glyph elements', () => {
    const style = document.createElement('style')
    style.dataset.styleTest = 'true'
    style.textContent = readStyle('components.css')
    document.head.append(style)

    const iconNames = ['camera-frame', 'sound-wave', 'map-pin', 'people-card'] as const
    const icons = iconNames.map((iconName) => {
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      icon.dataset.permissionIcon = iconName
      document.body.append(icon)
      return icon
    })
    expect(getComputedStyle(icons[0]).borderStyle).toBe('solid')
    expect(getComputedStyle(icons[1]).borderBottomStyle).toBe('double')
    expect(getComputedStyle(icons[1]).borderRadius).toBe('50%')
    expect(getComputedStyle(icons[2]).borderStyle).toBe('dotted')
    expect(getComputedStyle(icons[2]).transform).toBe('none')
    expect(getComputedStyle(icons[3]).borderStyle).toBe('dashed')
    icons.forEach((icon) => icon.remove())
  })

  it('overrides the update history inline width while staying in normal flow', () => {
    const css = readStyle('components.css')
    expect(css).toMatch(/\.update-history-trigger-area\s*\{[^}]*width:\s*min\(calc\(100% - 2rem\),\s*var\(--content-width\)\)\s*!important/)
    expect(css).toMatch(/\.update-history-trigger-area\s*\{[^}]*position|\.update-history-trigger-area[^{]*\{[^}]*display:\s*flex/)
  })

  it('replaces pulse motion with a fixed visible reduced-motion treatment', () => {
    const css = readStyle('components.css')
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    const reducedMotion = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
    expect(reducedMotion).toMatch(/animation\s*:\s*none/)
    expect(reducedMotion).toMatch(/border\s*:\s*3px/)
    expect(reducedMotion).toContain('.gi-pulse__step')
    expect(reducedMotion).toMatch(/transform\s*:\s*none/)
    expect(reducedMotion).toMatch(/opacity\s*:\s*1/)
  })

  it('keeps report content and hides only controls when printing', () => {
    const css = readStyle('print.css')
    expect(css).toContain('@media print')
    expect(css).toMatch(/header[^}]*display\s*:\s*none/)
    expect(css).toMatch(/update-history[^}]*display\s*:\s*none/)
    expect(css).toMatch(/button[^}]*display\s*:\s*none/)
    expect(css).toContain('blockquote')
    expect(css).toContain('table')
    expect(css).toMatch(/break-inside|page-break-inside/)
    expect(css).not.toMatch(/main[^}]*display\s*:\s*none/)
    expect(css).not.toMatch(/article[^}]*display\s*:\s*none/)
  })
})
