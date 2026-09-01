import { describe, expect, it } from 'vitest'
import { bookshelfFragment } from '../../src/index.js'

describe('bookshelfFragment', () => {
  it('renders one default Book Entry as an embedded accessible Bookshelf', () => {
    const result = bookshelfFragment([{ title: 'Dune', author: 'Frank Herbert' }])

    expect(result[0]).toBe(true)
    expect(result[1]).toContain('<style data-html-bookshelf-styles>')
    expect(result[1]).toContain('<section data-html-bookshelf')
    expect(result[1]).toContain('aria-label="Bookshelf"')
    expect(result[1]).toContain('<ol class="hbs-list">')
    expect(result[1]).toContain('Dune')
    expect(result[1]).toContain('Frank Herbert')
  })
})
