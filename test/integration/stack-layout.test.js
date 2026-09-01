import { describe, expect, it } from 'vitest'
import { bookshelfFragment } from '../../src/index.js'

describe('Stack Layout and responsive rules', () => {
  it('keeps a literal per-instance automatic breakpoint when shared CSS is external', () => {
    const [isSuccess, fragment] = bookshelfFragment([
      { title: 'Dune', author: 'Frank Herbert' },
      { title: 'Kindred', author: 'Octavia E. Butler' }
    ], { layout: 'auto', stackThreshold: '18rem', style: 'none' })

    expect(isSuccess).toBe(true)
    expect(fragment).not.toContain('data-html-bookshelf-styles')
    expect(fragment).toMatch(/<style data-hbs-responsive>@container hbs-[0-9a-f]{8} \(inline-size < 18rem\)/)
    expect(fragment).toContain('data-hbs-layout="auto"')
  })

  it('marks a forced Stack Layout and emits bounded stack transforms', () => {
    const [, fragment] = bookshelfFragment([{ title: 'Dune', author: 'Frank Herbert' }], { layout: 'stack', seed: 'stack' })

    expect(fragment).toContain('data-hbs-layout="stack"')
    expect(fragment).toContain('--hbs-stack-yaw:')
    expect(fragment).toContain('perspective(40rem)')
    expect(fragment).toContain('rotateY(calc(2deg + var(--hbs-stack-yaw) * 1deg))')
    expect(fragment).toContain('max(30px, calc(0.75rem + (0.75rem * var(--hbs-thickness))))')
    expect(fragment).toContain('[data-html-bookshelf][data-hbs-layout="stack"] .hbs-list')
  })
})
