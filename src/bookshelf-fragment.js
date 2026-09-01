// @ts-nocheck
import * as R from 'ramda'
import { bookCollectionValidation } from './book-collection-validation.js'
import { bookCollectionNormalisation } from './book-collection-normalisation.js'
import { bookshelfModel } from './bookshelf-model.js'
import { bookshelfMarkup } from './bookshelf-markup.js'
import { responsiveStyles, sharedStyles } from './bookshelf-styles.js'
import { instanceIdentifier } from './visual-key.js'

/**
 * Render a Book Collection as a self-contained Bookshelf HTML fragment.
 *
 * @param {{ title: string, author: string }[]} bookCollection
 * @returns {[true, string]}
 */
export const bookshelfFragment = (bookCollection, options) => {
  const validation = bookCollectionValidation(bookCollection, options)
  if (!validation[0]) return validation
  const normalised = bookCollectionNormalisation(bookCollection, options)
  const model = bookshelfModel(normalised.books, normalised.options)
  const instance = instanceIdentifier(`${normalised.options.layout}|${normalised.options.stackThreshold}|${R.join('||', R.map((book) => book.visualKey, model))}`)
  const sharedStyleTag = normalised.options.style === 'embedded' ? `<style data-html-bookshelf-styles>${sharedStyles}</style>` : ''
  const perInstanceRule = normalised.options.layout === 'auto' ? `<style data-hbs-responsive>${responsiveStyles(instance, normalised.options.stackThreshold)}</style>` : ''
  return [true, `${sharedStyleTag}${perInstanceRule}${bookshelfMarkup(model, normalised.options, instance)}`]
}
