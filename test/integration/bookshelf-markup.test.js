import { describe, expect, it } from 'vitest'
import { bookshelfFragment } from '../../src/index.js'

describe('Bookshelf markup', () => {
  it('escapes Book Text and attributes while preserving a caller-provided Destination URL', () => {
    const [, fragment] = bookshelfFragment([
      { title: '<em>Dune</em>', author: 'Fran & "Herbert"', url: 'javascript:read?x=1&y="2"' },
      { title: 'Kindred', author: 'Octavia E. Butler' }
    ], { label: 'Alex & friends' })

    expect(fragment).toContain('aria-label="Alex &amp; friends"')
    expect(fragment).toContain('&lt;em&gt;Dune&lt;/em&gt;')
    expect(fragment).toContain('Fran &amp; &quot;Herbert&quot;')
    expect(fragment).toContain('<a class="hbs-book-link" href="javascript:read?x=1&amp;y=&quot;2&quot;">')
    expect(fragment).toContain('<li class="hbs-book')
    expect(fragment).toContain('<ol class="hbs-list">')
  })

  it('renders a dedicated decorative layer and ships all modern and Victorian edition variants', () => {
    const [, fragment] = bookshelfFragment([
      { title: 'The Odyssey', author: 'Homer' },
      { title: 'Dune', author: 'Frank Herbert' }
    ], { theme: 'old-school', seed: 'ornate-editions' })

    expect(fragment).toContain('<span class="hbs-book-art" aria-hidden="true"></span>')
    expect(fragment).toContain('hbs-book-content hbs-title-zone')
    for (const variant of [0, 1, 2, 3]) {
      expect(fragment).toContain(`.hbs-theme-academic.hbs-variant-${variant}`)
      expect(fragment).toContain(`.hbs-theme-old-school.hbs-variant-${variant}`)
    }
    for (const variant of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) expect(fragment).toContain(`.hbs-theme-modern.hbs-modern-${variant}`)
  })
})
