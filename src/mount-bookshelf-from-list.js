// @ts-nocheck
import * as R from 'ramda'
import { bookshelfFragment } from './bookshelf-fragment.js'
import { installBookshelfFragment } from './install-bookshelf-fragment.js'

const mapIndexed = R.addIndex(R.map)
const pageCount = (value) => R.test(/^\d+$/, R.trim(value)) ? Number(R.trim(value)) : NaN

const readBookEntry = (item, index) => {
  const titles = item.querySelectorAll('[data-hbs-title]')
  const authors = item.querySelectorAll('[data-hbs-author]')
  const link = item.querySelector('a[href]')
  const pages = item.getAttribute('data-hbs-pages')
  const issues = R.chain(([name, elements]) => elements.length === 1
    ? []
    : [{ path: `[${index}].${name}`, message: `must contain exactly one [data-hbs-${name}] element` }], [
    ['title', titles],
    ['author', authors]
  ])

  return {
    book: {
      title: titles[0]?.textContent,
      author: authors[0]?.textContent,
      ...(pages === null ? {} : { pages: pageCount(pages) }),
      ...(link === null ? {} : { url: link.getAttribute('href') })
    },
    issues: item.querySelector('ol, ul') === null
      ? issues
      : R.append({ path: `[${index}]`, message: 'must not contain nested lists' }, issues)
  }
}

/**
 * Replace an HTML list with a Bookshelf, preserving the source on failure.
 *
 * @param {unknown} listElement
 * @param {unknown} [options]
 * @returns {[true, null] | [false, { type: string, message?: string, issues?: { path: string, message: string }[] }]}
 */
export const mountBookshelfFromList = (listElement, options) => {
  const view = listElement && typeof listElement === 'object' && 'ownerDocument' in listElement
    ? listElement.ownerDocument?.defaultView
    : undefined
  if (!view || !(listElement instanceof view.HTMLElement) || !R.includes(listElement.localName, ['ol', 'ul'])) {
    return [false, { type: 'target-error', message: 'target must be an HTML ol or ul element' }]
  }
  if (listElement.parentNode === null) {
    return [false, { type: 'target-error', message: 'target must have a parent node' }]
  }

  const entries = mapIndexed(readBookEntry, R.filter((child) => child.localName === 'li', Array.from(listElement.children)))
  const issues = R.chain(R.prop('issues'), entries)
  if (!R.isEmpty(issues)) return [false, { type: 'source-error', issues }]

  const result = bookshelfFragment(R.pluck('book', entries), options)
  if (!result[0]) return result

  listElement.replaceWith(installBookshelfFragment(listElement.ownerDocument, result[1]))
  return [true, null]
}
