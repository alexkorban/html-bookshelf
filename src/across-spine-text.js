import * as R from 'ramda'

const wordSegmenter = new Intl.Segmenter(undefined, { granularity: 'word' })
const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

/** @param {string} text */
const wordUnits = (text) => {
  const segments = Array.from(wordSegmenter.segment(text))
  return R.map(R.prop('segment'), R.filter(R.prop('isWordLike'), segments))
}

/** @param {string} word */
const graphemeLength = (word) => R.length(Array.from(graphemeSegmenter.segment(word)))

/** @param {string} text */
const textGraphemeLength = (text) => graphemeLength(text)

/** @param {string} text @param {number} maximum @param {number} lengthBudget */
const fittedTextSize = (text, maximum, lengthBudget) => Math.max(0.55, Math.min(maximum, lengthBudget / Math.max(1, textGraphemeLength(text))))

/**
 * Return rem sizes that keep long Along Spine Text on one line.
 *
 * @param {string} title
 * @param {string} author
 */
export const alongSpineTextSizes = (title, author) => ({
  title: fittedTextSize(title, 0.8, 14),
  author: fittedTextSize(author, 0.7, 12)
})

/**
 * Return the minimum width class for Across Spine Text, if the complete
 * Book Text can fit across the capped upright spine.
 *
 * @param {string} title
 * @param {string} author
 * @returns {'compact' | 'regular' | 'wide' | undefined}
 */
export const acrossSpineTextWidth = (title, author) => {
  if (!R.all((word) => graphemeLength(word) <= 8, [...wordUnits(title), ...wordUnits(author)])) return undefined
  const longestText = Math.max(textGraphemeLength(title), textGraphemeLength(author))
  if (longestText > 20) return undefined
  if (longestText <= 12) return 'compact'
  if (longestText <= 16) return 'regular'
  return 'wide'
}

/**
 * Determine whether Book Text is safe to lay Across a Spine when it is wide enough.
 *
 * @param {string} title
 * @param {string} author
 */
export const acrossSpineTextEligibility = (title, author) => acrossSpineTextWidth(title, author) !== undefined
