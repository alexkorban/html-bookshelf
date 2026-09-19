/**
 * Prepare a Render Fragment and install shared CSS once per document.
 *
 * @param {Document} document
 * @param {string} markup
 * @returns {DocumentFragment}
 */
export const installBookshelfFragment = (document, markup) => {
  const template = document.createElement('template')
  template.innerHTML = markup
  const sharedStyle = template.content.querySelector('style[data-html-bookshelf-styles]')
  if (sharedStyle !== null) {
    if (document.head.querySelector('style[data-html-bookshelf-styles]') === null) document.head.append(sharedStyle.cloneNode(true))
    sharedStyle.remove()
  }
  return template.content
}
