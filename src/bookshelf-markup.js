// @ts-nocheck
import * as R from 'ramda'

const mapIndexed = R.addIndex(R.map)

/** @param {string} instance @param {number} offset */
const woodKnotPosition = (instance, offset) => `${12 + (Number.parseInt(R.slice(offset, offset + 4, instance), 16) % 73)}%`

/** @param {string} value */
export const htmlText = (value) => R.replace(/'/g, '&#39;', R.replace(/"/g, '&quot;', R.replace(/>/g, '&gt;', R.replace(/</g, '&lt;', R.replace(/&/g, '&amp;', value)))))

/** @param {string} value */
export const htmlAttribute = htmlText

/** @param {{ title: string, author: string, url?: string, relativeThickness: number, theme: string, font?: string, acrossSpine: boolean, acrossSpineWidth?: string, titleSize: number, authorSize: number, visualVariant: number, modernVariant: number, heightVariation: number, lean: number, stackYaw: number, stackShift: number, entranceDelay: number }} book @param {boolean} leaning */
const bookMarkup = (book, leaning) => {
  const content = `<span class="hbs-book-content hbs-title-zone"><span class="hbs-title">${htmlText(book.title)}</span><span class="hbs-author">${htmlText(book.author)}</span></span>`
  const artwork = '<span class="hbs-book-art" aria-hidden="true"></span>'
  const visibleBook = book.url === undefined
    ? `${artwork}${content}`
    : `${artwork}<a class="hbs-book-link" href="${htmlAttribute(book.url)}">${content}</a>`
  const font = book.font === undefined ? 'var(--hbs-theme-font)' : `"${R.replace(/"/g, '\\"', book.font)}", var(--hbs-theme-font)`
  const style = `--hbs-thickness:${book.relativeThickness};--hbs-height-variation:${book.heightVariation};--hbs-lean:${book.lean};--hbs-lean-angle:${book.lean}deg;--hbs-stack-yaw:${book.stackYaw};--hbs-stack-shift:${book.stackShift};--hbs-title-size:${book.titleSize}rem;--hbs-author-size:${book.authorSize}rem;--hbs-entrance-delay:${book.entranceDelay}ms;--hbs-font:${font}`
  return `<li class="hbs-book hbs-theme-${book.theme} hbs-variant-${book.visualVariant} hbs-modern-${book.modernVariant}${book.acrossSpine ? ` hbs-text-eligible hbs-text-${book.acrossSpineWidth}` : ''}${leaning ? ' hbs-book--leaning' : ''}" style="${style}">${visibleBook}</li>`
}

/**
 * Render accessible ordered Book Entry markup.
 *
 * @param {{ title: string, author: string, url?: string, relativeThickness: number, theme: string, font?: string, acrossSpine: boolean, acrossSpineWidth?: string, titleSize: number, authorSize: number, visualVariant: number, modernVariant: number, heightVariation: number, lean: number, stackYaw: number, stackShift: number, entranceDelay: number }[]} books
 * @param {{ label: string, layout: string, shelfStyle: string, minSpineWidth: string, spineHeight: string, animation: boolean }} options
 * @param {string} instance
 */
export const bookshelfMarkup = (books, options, instance) => {
  const rootStyle = `container-name:hbs-${instance};--hbs-min-spine-width:${htmlAttribute(options.minSpineWidth)};--hbs-spine-height:${htmlAttribute(options.spineHeight)};--hbs-wood-knot-one:${woodKnotPosition(instance, 0)};--hbs-wood-knot-two:${woodKnotPosition(instance, 4)}`
  const bookItems = R.join('', mapIndexed((book, index) => bookMarkup(book, R.length(books) > 1 && index === R.length(books) - 1), books))
  return `<section data-html-bookshelf data-hbs-instance="${instance}" data-hbs-layout="${options.layout}" data-hbs-animation="${options.animation}" class="hbs-root hbs-shelf-${options.shelfStyle}" style="${rootStyle}" aria-label="${htmlAttribute(options.label)}"><ol class="hbs-list">${bookItems}</ol></section>`
}
