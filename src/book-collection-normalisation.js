import * as R from 'ramda'

export const defaultOptions = {
  theme: 'modern',
  layout: 'auto',
  shelfStyle: 'abstract',
  seed: undefined,
  fonts: undefined,
  minSpineWidth: '2.5rem',
  stackThreshold: '20rem',
  spineHeight: '13rem',
  style: 'embedded',
  animation: false,
  label: 'Bookshelf'
}

/**
 * Return trimmed Book Entries and the complete option set as new plain data.
 *
 * @param {{ title: string, author: string, pages?: number, url?: string }[]} bookCollection
 * @param {object | undefined} options
 * @returns {{ books: { title: string, author: string, pages: number, url?: string }[], options: typeof defaultOptions }}
 */
export const bookCollectionNormalisation = (bookCollection, options) => ({
  books: R.map((book) => ({
    ...book,
    title: R.trim(book.title),
    author: R.trim(book.author),
    pages: book.pages === undefined ? 200 : book.pages,
    ...(book.url === undefined ? {} : { url: R.trim(book.url) })
  }), bookCollection),
  options: R.mergeRight(defaultOptions, options || {})
})
