import { describe, expect, it } from 'vitest'
import { bookshelfFragment } from '../../src/index.js'

describe('Shelf Layout', () => {
  it('writes scoped shelf settings, page weights, a wood support, and a final-book lean', () => {
    const [, fragment] = bookshelfFragment([
      { title: 'Short', author: 'A', pages: 120 },
      { title: 'Long', author: 'B', pages: 600 }
    ], {
      layout: 'shelf',
      shelfStyle: 'wood',
      minSpineWidth: '2.25rem',
      spineHeight: '14rem',
      seed: 'shelf-test'
    })

    expect(fragment).toContain('--hbs-min-spine-width:2.25rem')
    expect(fragment).toContain('--hbs-spine-height:14rem')
    expect(fragment).toContain('data-hbs-layout="shelf"')
    expect(fragment).toContain('hbs-shelf-wood')
    expect(fragment).toMatch(/--hbs-wood-knot-one:\d+%/)
    expect(fragment).toMatch(/--hbs-wood-knot-two:\d+%/)
    expect(fragment).toContain('--hbs-thickness:0.6')
    expect(fragment).toContain('--hbs-thickness:3')
    expect(fragment).toContain('hbs-book--leaning')
    expect(fragment).toContain('[data-html-bookshelf] .hbs-list')
  })
})
