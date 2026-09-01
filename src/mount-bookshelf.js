// @ts-nocheck
import { bookshelfFragment } from './bookshelf-fragment.js'

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

  const document = targetElement.ownerDocument
  const template = document.createElement('template')
  template.innerHTML = result[1]
  const sharedStyle = template.content.querySelector('style[data-html-bookshelf-styles]')
  if (sharedStyle !== null) {
    if (document.head.querySelector('style[data-html-bookshelf-styles]') === null) document.head.append(sharedStyle.cloneNode(true))
    sharedStyle.remove()
  }
  targetElement.replaceChildren(template.content.cloneNode(true))
  return [true, null]
}
