import { describe, expect, it } from 'vitest'
import { acrossSpineTextEligibility, alongSpineTextSizes } from '../../src/across-spine-text.js'

describe('Across Spine Text eligibility', () => {
  it('counts grapheme clusters in word-like units across title and author', () => {
    expect(acrossSpineTextEligibility('Dune Messiah', 'Frank Herbert')).toBe(true)
    expect(acrossSpineTextEligibility('Été', 'A\u0301uthor')).toBe(true)
    expect(acrossSpineTextEligibility('Unbreakable', 'Author')).toBe(false)
  })

  it('reduces Along Spine Text sizes as grapheme length increases', () => {
    expect(alongSpineTextSizes('Dune', 'Frank Herbert')).toEqual({ title: 0.8, author: 0.7 })
    expect(alongSpineTextSizes('The Left Hand of Darkness', 'Ursula K. Le Guin')).toEqual({ title: 0.56, author: 0.7 })
    expect(alongSpineTextSizes('A Very Long Title That Keeps Going', 'A Very Long Author Name')).toEqual({ title: 0.55, author: 0.55 })
  })
})
