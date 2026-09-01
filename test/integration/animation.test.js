import { describe, expect, it } from 'vitest'
import { bookshelfFragment } from '../../src/index.js'

describe('Animated Bookshelf', () => {
  it('adds only opt-in entrance and interaction motion with a reduced-motion override', () => {
    const [, fragment] = bookshelfFragment([{ title: 'Dune', author: 'Frank Herbert', url: '/dune' }], { animation: true })

    expect(fragment).toContain('data-hbs-animation="true"')
    expect(fragment).toContain('animation: hbs-enter 180ms ease-out both')
    expect(fragment).toContain('@media (prefers-reduced-motion: reduce)')
    expect(fragment).toContain('.hbs-book:hover')
    expect(fragment).toContain('.hbs-book:focus-within')
    expect(fragment).toContain('scale: 1.06')
    expect(fragment).toContain('.hbs-book-link:hover')
    expect(fragment).toContain('.hbs-book-link:focus-visible')
  })
})
