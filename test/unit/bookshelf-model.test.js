import { describe, expect, it } from 'vitest'
import { bookshelfModel } from '../../src/bookshelf-model.js'

describe('Bookshelf visual model', () => {
  it('derives bounded deterministic thickness, themes, variation, and Font Cycle', () => {
    const books = [
      { title: 'Thin', author: 'A', pages: 80 },
      { title: 'Normal', author: 'B', pages: 200 },
      { title: 'Thick', author: 'C', pages: 1200 }
    ]
    const options = { theme: 'mixed', seed: 'winter', fonts: ['Aptos', 'Merriweather'] }
    const first = bookshelfModel(books, options)
    const second = bookshelfModel(books, options)

    expect(first).toEqual(second)
    expect(first.map((book) => book.relativeThickness)).toEqual([0.6, 1, 5])
    expect(first.map((book) => book.font)).toEqual(['Aptos', 'Merriweather', 'Aptos'])
    expect(new Set(first.map((book) => book.theme))).toEqual(new Set(['modern', 'academic', 'old-school']))
    expect(first.every((book) => book.heightVariation >= -0.08 && book.heightVariation <= 0.08)).toBe(true)
    expect(first.every((book) => book.lean >= 1 && book.lean <= 3.5)).toBe(true)
    expect(first.every((book) => book.stackYaw >= -1 && book.stackYaw <= 1)).toBe(true)
    expect(first.every((book) => book.stackShift >= -0.2 && book.stackShift <= 0.2)).toBe(true)
    expect(first.map((book) => book.visualKey)).toEqual([
      'winter|Thin|A|80|1',
      'winter|Normal|B|200|1',
      'winter|Thick|C|1200|1'
    ])
  })

  it('assigns a stable visual variant for each themed Book Entry', () => {
    const books = [
      { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', pages: 304 },
      { title: 'The Odyssey', author: 'Homer', pages: 560 }
    ]

    const first = bookshelfModel(books, { theme: 'old-school', seed: 'edition-variants' })
    const second = bookshelfModel(books, { theme: 'old-school', seed: 'edition-variants' })

    expect(first.map((book) => book.visualVariant)).toEqual(second.map((book) => book.visualVariant))
    expect(first.every((book) => Number.isInteger(book.visualVariant) && book.visualVariant >= 0 && book.visualVariant <= 3)).toBe(true)
  })

  it('keeps deterministic Stack Slab variation within the forced-perspective range', () => {
    const books = Array.from({ length: 20 }, (_, index) => ({ title: `Book ${index}`, author: 'Author', pages: 200 }))
    const model = bookshelfModel(books, { theme: 'modern', seed: 'forced-perspective' })

    expect(model.every((book) => book.stackYaw >= -1 && book.stackYaw <= 1)).toBe(true)
  })

  it('provides sixteen deterministic modern artwork variants', () => {
    const books = Array.from({ length: 200 }, (_, index) => ({ title: `Book ${index}`, author: 'Author', pages: 200 }))
    const first = bookshelfModel(books, { theme: 'modern', seed: 'modern-artwork' })
    const second = bookshelfModel(books, { theme: 'modern', seed: 'modern-artwork' })

    expect(first.map((book) => book.modernVariant)).toEqual(second.map((book) => book.modernVariant))
    expect(first.every((book) => Number.isInteger(book.modernVariant) && book.modernVariant >= 0 && book.modernVariant <= 15)).toBe(true)
    expect(new Set(first.map((book) => book.modernVariant))).toEqual(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]))
  })
})
