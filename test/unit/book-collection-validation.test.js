import { describe, expect, it } from 'vitest'
import { bookshelfFragment } from '../../src/index.js'

describe('Book Collection validation', () => {
  it.each([
    [[], '[0]', 'must contain at least one Book Entry'],
    [[{ title: '  ', author: 'Frank Herbert' }], '[0].title', 'must be a non-empty string'],
    [[{ title: 'Dune', author: '' }], '[0].author', 'must be a non-empty string'],
    [[{ title: 'Dune', author: 'Frank Herbert', pages: 0 }], '[0].pages', 'must be a finite positive integer'],
    [[{ title: 'Dune', author: 'Frank Herbert', url: 42 }], '[0].url', 'must be a non-empty string'],
    [[{ title: 'Dune', author: 'Frank Herbert' }], 'options.theme', 'must be one of modern, academic, old-school, mixed']
  ])('returns a validation tuple for invalid input', (bookCollection, path, message) => {
    const options = path === 'options.theme' ? { theme: 'future' } : undefined

    expect(() => bookshelfFragment(bookCollection, options)).not.toThrow()
    expect(bookshelfFragment(bookCollection, options)).toEqual([
      false,
      { type: 'validation-error', issues: [{ path, message }] }
    ])
  })
})
