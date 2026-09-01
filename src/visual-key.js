import * as R from 'ramda'

/** @param {string} value */
export const hashValue = (value) => R.reduce((hash, index) => Math.imul(hash ^ value.charCodeAt(index), 16777619), 2166136261, R.range(0, R.length(value))) >>> 0

/** @param {string} value */
export const instanceIdentifier = (value) => hashValue(value).toString(16).padStart(8, '0')

/**
 * Build a deterministic Visual Key for one normalised Book Entry.
 *
 * @param {unknown} seed
 * @param {{ title: string, author: string, pages: number }} book
 * @param {number} occurrence
 */
export const visualKey = (seed, book, occurrence) => `${String(seed)}|${book.title}|${book.author}|${book.pages}|${occurrence}`

/**
 * Derive an order-insensitive default Variation Seed from a Book Collection.
 *
 * @param {{ title: string, author: string, pages: number }[]} books
 */
export const collectionSeed = (books) => R.join('||', R.sort((left, right) => left.localeCompare(right), R.map((book) => `${book.title}|${book.author}|${book.pages}`, books)))
