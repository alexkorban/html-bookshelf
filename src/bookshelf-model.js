// @ts-nocheck
import * as R from 'ramda'
import { collectionSeed, hashValue, visualKey } from './visual-key.js'
import { acrossSpineTextWidth, alongSpineTextSizes } from './across-spine-text.js'

const builtInThemes = ['modern', 'academic', 'old-school']
const reduceIndexed = R.addIndex(R.reduce)

/** @param {string} key @param {string} slot */
const variationValue = (key, slot) => hashValue(`${key}|${slot}`) / 4294967295

/** @param {unknown} seed */
const mixedThemes = (seed) => R.sortBy((theme) => hashValue(`${String(seed)}|${theme}`), builtInThemes)

/**
 * Derive plain visual data for normalised Book Entries.
 *
 * @param {{ title: string, author: string, pages: number, url?: string }[]} books
 * @param {{ theme: string, seed?: unknown, fonts?: string[] }} options
 */
export const bookshelfModel = (books, options) => {
  const seed = options.seed === undefined ? collectionSeed(books) : options.seed
  const themeCycle = options.theme === 'mixed' ? mixedThemes(seed) : [options.theme]
  const derived = reduceIndexed(({ occurrences, model }, book, index) => {
    const identity = R.join('|', [book.title, book.author, String(book.pages)])
    const occurrence = R.propOr(0, identity, occurrences) + 1
    const key = visualKey(seed, book, occurrence)
    const relativeThickness = R.clamp(0.6, 5, book.pages / 200)
    const acrossSpineWidth = acrossSpineTextWidth(book.title, book.author)
    const textSizes = alongSpineTextSizes(book.title, book.author)
    return {
      occurrences: R.assoc(identity, occurrence, occurrences),
      model: R.append({
        ...book,
        visualKey: key,
        relativeThickness,
        theme: R.nth(index % R.length(themeCycle), themeCycle),
        font: options.fonts === undefined ? undefined : R.nth(index % R.length(options.fonts), options.fonts),
        acrossSpine: acrossSpineWidth !== undefined,
        acrossSpineWidth,
        titleSize: textSizes.title,
        authorSize: textSizes.author,
        visualVariant: Math.floor(variationValue(key, 'variant') * 4),
        modernVariant: Math.floor(variationValue(key, 'modern-variant') * 16),
        heightVariation: (variationValue(key, 'height') * 0.16) - 0.08,
        lean: (variationValue(key, 'lean') * 2.5) + 1,
        stackYaw: (variationValue(key, 'yaw') * 2) - 1,
        stackShift: (variationValue(key, 'shift') * 0.4) - 0.2,
        entranceDelay: Math.min(300, Math.floor(variationValue(key, 'delay') * 13) * 25)
      }, model)
    }
  }, { occurrences: {}, model: [] }, books)
  return derived.model
}
