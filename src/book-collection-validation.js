// @ts-nocheck
import * as R from 'ramda'

const themes = ['modern', 'academic', 'old-school', 'mixed']
const layouts = ['auto', 'shelf', 'stack']
const shelfStyles = ['abstract', 'wood', 'metal', 'none']
const styleModes = ['embedded', 'none']
const optionNames = ['theme', 'layout', 'shelfStyle', 'seed', 'fonts', 'minSpineWidth', 'stackThreshold', 'spineHeight', 'style', 'animation', 'label']
const cssLengthOptionNames = ['minSpineWidth', 'stackThreshold', 'spineHeight']
const cssLength = /^(?:0|(?:\d+(?:\.\d+)?|\.\d+)(?:cap|ch|cm|em|ex|ic|in|lh|lvh|lvmax|lvmin|lvw|mm|pc|pt|px|q|rem|rlh|svh|svmax|svmin|svw|vh|vmax|vmin|vw|%))$/i
const reduceIndexed = R.addIndex(R.reduce)

const issue = (path, message) => ({ path, message })
const stringValue = (value) => typeof value === 'string' && R.length(R.trim(value)) > 0
const plainObject = (value) => R.type(value) === 'Object' && Object.getPrototypeOf(value) === Object.prototype
const cssLengthValue = (value) => typeof value === 'string' && cssLength.test(R.trim(value))

const bookIssues = (path, book) => R.reduce((issues, [name, message, invalid]) => invalid
  ? R.append(issue(`${path}.${name}`, message), issues)
  : issues, [], [
  ['title', 'must be a non-empty string', !stringValue(book.title)],
  ['author', 'must be a non-empty string', !stringValue(book.author)],
  ['pages', 'must be a finite positive integer', book.pages !== undefined && (!Number.isFinite(book.pages) || !Number.isInteger(book.pages) || book.pages <= 0)],
  ['url', 'must be a non-empty string', book.url !== undefined && !stringValue(book.url)]
])

const optionIssues = (options) => {
  if (options === undefined) return []
  if (!plainObject(options)) return [issue('options', 'must be a plain object')]

  const unknownOptionIssues = R.map((name) => issue(`options.${name}`, 'is not supported'), R.difference(R.keys(options), optionNames))
  const valueIssues = R.reduce((issues, [name, message, invalid]) => invalid
    ? R.append(issue(`options.${name}`, message), issues)
    : issues, unknownOptionIssues, [
    ['theme', 'must be one of modern, academic, old-school, mixed', options.theme !== undefined && !R.includes(options.theme, themes)],
    ['layout', 'must be one of auto, shelf, stack', options.layout !== undefined && !R.includes(options.layout, layouts)],
    ['shelfStyle', 'must be one of abstract, wood, metal, none', options.shelfStyle !== undefined && !R.includes(options.shelfStyle, shelfStyles)],
    ['style', 'must be one of embedded, none', options.style !== undefined && !R.includes(options.style, styleModes)],
    ['animation', 'must be a boolean', options.animation !== undefined && typeof options.animation !== 'boolean'],
    ['label', 'must be a string', options.label !== undefined && typeof options.label !== 'string'],
    ['fonts', 'must be a non-empty array of font family names', options.fonts !== undefined && (!R.is(Array, options.fonts) || R.isEmpty(options.fonts) || !R.all(stringValue, options.fonts))]
  ])
  return R.reduce((issues, name) => options[name] !== undefined && !cssLengthValue(options[name])
    ? R.append(issue(`options.${name}`, 'must be a CSS length'), issues)
    : issues, valueIssues, cssLengthOptionNames)
}

/**
 * Validate Book Collection data and rendering options without throwing.
 *
 * @param {unknown} bookCollection
 * @param {unknown} options
 * @returns {[true, null] | [false, { type: 'validation-error', issues: { path: string, message: string }[] }]}
 */
export const bookCollectionValidation = (bookCollection, options) => {
  const collectionIssues = !R.is(Array, bookCollection) || R.isEmpty(bookCollection)
    ? [issue('[0]', 'must contain at least one Book Entry')]
    : reduceIndexed((issues, book, index) => {
      const path = `[${index}]`
      return !plainObject(book)
        ? R.append(issue(path, 'must be a Book Entry object'), issues)
        : R.concat(issues, bookIssues(path, book))
    }, [], bookCollection)
  const issues = R.concat(collectionIssues, optionIssues(options))
  return R.isEmpty(issues) ? [true, null] : [false, { type: 'validation-error', issues }]
}
