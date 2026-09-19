import { expect, test } from '@playwright/test'
import * as R from 'ramda'
import { bookshelfFragment } from '../../src/bookshelf-fragment.js'

const readSlotDimensions = async (page) => {
  const slots = page.locator('.hbs-book-slot')
  return Promise.all(R.map((index) => slots.nth(index).evaluate((slot) => {
    const { top, right, width } = slot.getBoundingClientRect()
    return { top, right, width }
  }), R.range(0, await slots.count())))
}

R.forEach((pages) => {
  test(`keeps ${pages}-page spines equal across rows and after resizing without scripts`, async ({ page }) => {
    const books = R.map((index) => ({ title: `Book ${index}`, author: 'Author', pages }), R.range(0, 11))
    const [ok, fragment] = bookshelfFragment(books, { layout: 'shelf', seed: 'shared-widths' })
    expect(ok).toBe(true)
    await page.setContent(`<div id="target" style="width: 32rem">${fragment}</div>`)

    const before = await readSlotDimensions(page)
    expect(R.length(R.uniq(R.pluck('top', before)))).toBe(2)
    R.forEach(({ width }) => expect(width).toBeCloseTo(before[0].width, 2), before)

    await page.locator('#target').evaluate((target) => { target.style.width = '24rem' })

    const after = await readSlotDimensions(page)
    const shelf = await page.locator('.hbs-list').boundingBox()
    expect(R.length(R.uniq(R.pluck('top', after)))).toBe(3)
    R.forEach(({ width }) => expect(width).toBeCloseTo(before[0].width, 2), after)
    expect(R.last(after).right).toBeLessThan(shelf.x + shelf.width - 32)
    R.forEach(({ right }) => expect(right).toBeLessThanOrEqual(shelf.x + shelf.width), after)
  })
}, [400, 1000])

test('uses page-count proportions between shared width limits', async ({ page }) => {
  const [, fragment] = bookshelfFragment([
    { title: 'Short', author: 'A', pages: 300 },
    { title: 'Long', author: 'B', pages: 450 },
    { title: 'Minimum', author: 'C', pages: 10 },
    { title: 'Maximum', author: 'D', pages: 2000 }
  ], { layout: 'shelf' })
  await page.setContent(`<div style="width: 40rem">${fragment}</div>`)

  const [short, long, minimum, maximum] = await readSlotDimensions(page)
  expect(short.width).toBeCloseTo(48, 1)
  expect(long.width / short.width).toBeCloseTo(1.5, 2)
  expect(minimum.width).toBeCloseTo(40, 1)
  expect(maximum.width).toBeCloseTo(13 * 16 * 0.92 * 0.42, 1)
})
