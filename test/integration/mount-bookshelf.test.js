// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mountBookshelf } from '../../src/index.js'

describe('mountBookshelf', () => {
  it('does not change an HTML target when validation fails', () => {
    const target = document.createElement('div')
    target.innerHTML = '<p>Keep me</p>'

    expect(mountBookshelf(target, [])).toEqual([
      false,
      { type: 'validation-error', issues: [{ path: '[0]', message: 'must contain at least one Book Entry' }] }
    ])
    expect(target.innerHTML).toBe('<p>Keep me</p>')
  })

  it('replaces the target and installs embedded shared CSS only once per document', () => {
    const first = document.createElement('div')
    const second = document.createElement('div')
    document.body.append(first, second)

    expect(mountBookshelf(first, [{ title: 'Dune', author: 'Frank Herbert' }])).toEqual([true, null])
    expect(mountBookshelf(second, [{ title: 'Kindred', author: 'Octavia E. Butler' }])).toEqual([true, null])
    expect(first.querySelector('[data-html-bookshelf]')).not.toBeNull()
    expect(second.querySelector('[data-html-bookshelf]')).not.toBeNull()
    expect(document.head.querySelectorAll('style[data-html-bookshelf-styles]').length).toBe(1)
    expect(first.querySelector('style[data-hbs-responsive]')).not.toBeNull()
  })

  it('returns a plain target error for a non-element target', () => {
    expect(mountBookshelf(null, [{ title: 'Dune', author: 'Frank Herbert' }])).toEqual([
      false,
      { type: 'target-error', message: 'target must be an HTML element' }
    ])
  })
})
