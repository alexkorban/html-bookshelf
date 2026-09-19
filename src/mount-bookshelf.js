// @ts-nocheck
import { bookshelfFragment } from './bookshelf-fragment.js'
import { installBookshelfFragment } from './install-bookshelf-fragment.js'

/**
 * Mount a rendered Bookshelf into an HTML element.
 *
 * @param {unknown} targetElement
 * @param {unknown} bookCollection
 * @param {unknown} options
 * @returns {[true, null] | [false, { type: string, message?: string, issues?: { path: string, message: string }[] }]}
 */
export const mountBookshelf = (targetElement, bookCollection, options) => {
  const view = targetElement && typeof targetElement === 'object' && 'ownerDocument' in targetElement
    ? targetElement.ownerDocument.defaultView
    : undefined
  if (!view || !(targetElement instanceof view.HTMLElement)) {
    return [false, { type: 'target-error', message: 'target must be an HTML element' }]
  }

  const result = bookshelfFragment(bookCollection, options)
  if (!result[0]) return result

  targetElement.replaceChildren(installBookshelfFragment(targetElement.ownerDocument, result[1]))
  return [true, null]
}
