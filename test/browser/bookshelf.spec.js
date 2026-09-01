import { expect, test } from '@playwright/test'

test('caps upright spine width and leaves spare shelf space in a wide container', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 60rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 412 },
    { title: 'Kindred', author: 'Octavia E. Butler', pages: 288 }
  ], { layout: 'shelf' }))

  const dimensions = await page.locator('.hbs-book').evaluateAll((books) => books.map((book) => {
    const box = book.getBoundingClientRect()
    return { left: box.left, right: box.right, width: box.width }
  }))

  expect(dimensions[0].width).toBeLessThanOrEqual(112.5)
  expect(dimensions[1].right).toBeLessThan(300)
})

test('keeps a default upright spine no thicker than a plausible book proportion', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 60rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 1000 }
  ], { layout: 'shelf' }))

  const ratio = await page.locator('.hbs-book').evaluate((book) => {
    const box = book.getBoundingClientRect()
    return box.width / box.height
  })

  expect(ratio).toBeLessThanOrEqual(0.425)
})

test('puts both contact points of the final leaning book exactly on its support', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 40rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 412 },
    { title: 'Kindred', author: 'Octavia E. Butler', pages: 288 }
  ], { layout: 'shelf', shelfStyle: 'wood', seed: 'contact-points' }))

  const contacts = await page.locator('.hbs-list').evaluate((list) => {
    const [supportingBook, leaningBook] = list.querySelectorAll('.hbs-book')
    const supportingBox = supportingBook.getBoundingClientRect()
    const leaningBox = leaningBook.getBoundingClientRect()
    const leaningSlotBox = leaningBook.parentElement.getBoundingClientRect()
    return {
      supportingRight: supportingBox.right,
      leaningTopLeft: leaningBox.left,
      leaningBottom: leaningBox.bottom,
      shelfTop: leaningSlotBox.bottom
    }
  })

  expect(contacts.leaningTopLeft).toBeCloseTo(contacts.supportingRight, 0)
  expect(contacts.leaningBottom).toBeCloseTo(contacts.shelfTop, 0)
})

test('draws a full-width shelf under every wrapped row', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 16rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 412 },
    { title: 'Kindred', author: 'Octavia E. Butler', pages: 288 },
    { title: 'Piranesi', author: 'Susanna Clarke', pages: 272 },
    { title: 'Beloved', author: 'Toni Morrison', pages: 324 },
    { title: 'The Power', author: 'Naomi Alderman', pages: 384 },
    { title: 'Homegoing', author: 'Yaa Gyasi', pages: 320 },
    { title: 'The Fifth Season', author: 'N. K. Jemisin', pages: 512 },
    { title: 'Possession', author: 'A. S. Byatt', pages: 576 }
  ], { layout: 'shelf', minSpineWidth: '3rem', shelfStyle: 'wood' }))

  const shelves = await page.locator('.hbs-list').evaluate((list) => {
    const listBox = list.getBoundingClientRect()
    const listStyle = getComputedStyle(list)
    const shelfStyle = getComputedStyle(list, '::after')
    const shelfThickness = Number.parseFloat(listStyle.getPropertyValue('--hbs-shelf-thickness')) * Number.parseFloat(listStyle.fontSize)
    const rowPitch = Number.parseFloat(shelfStyle.backgroundSize.split(' ').at(-1))
    const rowBaselines = Array.from(new Set(Array.from(list.querySelectorAll('.hbs-book-slot'), (slot) => Math.round((slot.getBoundingClientRect().bottom - listBox.top) * 100) / 100)))
    const bandTops = Array.from({ length: rowBaselines.length }, (_, index) => listBox.height - shelfThickness - (index * rowPitch))
    return {
      backgroundImage: shelfStyle.backgroundImage,
      bandTops,
      repeatsVertically: shelfStyle.backgroundRepeat.split(', ').every((repeat) => repeat === 'repeat-y'),
      rowBaselines
    }
  })

  expect(shelves.rowBaselines.length).toBeGreaterThanOrEqual(2)
  expect(shelves.backgroundImage).not.toBe('none')
  expect(shelves.repeatsVertically).toBe(true)
  expect(shelves.rowBaselines.toSorted((left, right) => right - left)).toEqual(expect.arrayContaining(shelves.bandTops.map((top) => expect.closeTo(top, 1))))
})

test('uses a Y-axis yaw for Stack Slab depth without turning its text', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 18rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 412 },
    { title: 'Kindred', author: 'Octavia E. Butler', pages: 288 }
  ], { layout: 'stack', seed: 'stack-depth' }))

  await expect(page.locator('.hbs-book').first()).toHaveCSS('transform', /^matrix3d\(/)
  await expect(page.locator('.hbs-book-content').first()).toHaveCSS('writing-mode', 'horizontal-tb')
})

test('lets Stack Slabs use the available Bookshelf width', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 30rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 412 },
    { title: 'Kindred', author: 'Octavia E. Butler', pages: 288 }
  ], { layout: 'stack', seed: 'stack-width' }))

  const dimensions = await page.locator('.hbs-book').first().evaluate((book) => ({
    slab: book.getBoundingClientRect().width,
    shelf: book.parentElement.getBoundingClientRect().width
  }))

  expect(dimensions.slab).toBeGreaterThan(dimensions.shelf * 0.85)
})

test('keeps modern Book Text directly on its artwork without an opaque text panel', async ({ page }) => {
  await page.setContent('<div id="one"></div><div id="two"></div><div id="three"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => {
    const book = [{ title: 'Dune', author: 'Frank Herbert', pages: 412 }]
    window.HtmlBookshelf.mountBookshelf(document.querySelector('#one'), book, { theme: 'modern', seed: 'contrast' })
    window.HtmlBookshelf.mountBookshelf(document.querySelector('#two'), book, { theme: 'modern', seed: 'quiet-lane' })
    window.HtmlBookshelf.mountBookshelf(document.querySelector('#three'), book, { theme: 'modern', seed: 'edition-variants' })
  })

  const backgrounds = await page.locator('.hbs-theme-modern .hbs-book-content').evaluateAll((contents) => contents.map((content) => getComputedStyle(content).backgroundColor))
  expect(backgrounds).toEqual(['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'])
})

test('keeps linked old-school Book Text fixed within its growing book', async ({ page }) => {
  await page.setContent('<div id="shelf" style="width: 20rem"></div><div id="stack" style="width: 20rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => {
    const books = [{ title: 'Dune', author: 'Frank Herbert', pages: 412, url: 'https://example.com/dune' }]
    window.HtmlBookshelf.mountBookshelf(document.querySelector('#shelf'), books, { animation: true, layout: 'shelf', theme: 'old-school' })
    window.HtmlBookshelf.mountBookshelf(document.querySelector('#stack'), books, { animation: true, layout: 'stack', theme: 'old-school' })
  })

  await page.waitForTimeout(550)
  await page.locator('#shelf .hbs-book-link').hover()
  await page.waitForTimeout(180)
  await expect(page.locator('#shelf .hbs-book-link')).toHaveCSS('transform', 'none')
  await expect(page.locator('#shelf .hbs-book')).toHaveCSS('scale', '1.06')
  await page.locator('#stack .hbs-book-link').hover()
  await page.waitForTimeout(180)
  await expect(page.locator('#stack .hbs-book-link')).toHaveCSS('transform', 'none')
  await expect(page.locator('#stack .hbs-book')).toHaveCSS('scale', '1.06')
})

test('enlarges hovered books without changing Shelf or Stack Layout space', async ({ page }) => {
  await page.setContent('<div id="shelf" style="width: 20rem"></div><div id="stack" style="width: 20rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => {
    const books = [
      { title: 'Dune', author: 'Frank Herbert', pages: 412 },
      { title: 'Kindred', author: 'Octavia E. Butler', pages: 288 }
    ]
    window.HtmlBookshelf.mountBookshelf(document.querySelector('#shelf'), books, { animation: true, layout: 'shelf' })
    window.HtmlBookshelf.mountBookshelf(document.querySelector('#stack'), books, { animation: true, layout: 'stack' })
  })

  const dimensions = async (root) => page.locator(`${root} .hbs-book`).first().evaluate((book) => {
    const box = book.getBoundingClientRect()
    return { height: box.height, layoutHeight: book.offsetHeight, layoutWidth: book.offsetWidth, width: box.width }
  })
  await page.waitForTimeout(550)
  const before = { shelf: await dimensions('#shelf'), stack: await dimensions('#stack') }

  await page.locator('#shelf .hbs-book').first().hover()
  await page.waitForTimeout(180)
  const shelf = await dimensions('#shelf')
  await page.locator('#stack .hbs-book').first().hover()
  await page.waitForTimeout(180)
  const stack = await dimensions('#stack')

  expect(shelf.width).toBeCloseTo(before.shelf.width * 1.06, 0)
  expect(shelf.height).toBeCloseTo(before.shelf.height * 1.06, 0)
  expect(stack.width).toBeCloseTo(before.stack.width * 1.06, 0)
  expect(stack.height).toBeCloseTo(before.stack.height * 1.06, 0)
  expect({ layoutHeight: shelf.layoutHeight, layoutWidth: shelf.layoutWidth }).toEqual({ layoutHeight: before.shelf.layoutHeight, layoutWidth: before.shelf.layoutWidth })
  expect({ layoutHeight: stack.layoutHeight, layoutWidth: stack.layoutWidth }).toEqual({ layoutHeight: before.stack.layoutHeight, layoutWidth: before.stack.layoutWidth })
})

test('keeps Stack Slab Book Text within the Bookshelf after perspective is applied', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 30rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 412 },
    { title: 'Kindred', author: 'Octavia E. Butler', pages: 288 }
  ], { layout: 'stack', theme: 'mixed', seed: 'review' }))

  const bounds = await page.locator('.hbs-list').evaluate((list) => {
    const shelf = list.getBoundingClientRect()
    return Array.from(list.querySelectorAll('.hbs-title'), (title) => ({ left: title.getBoundingClientRect().left, shelfLeft: shelf.left }))
  })

  expect(bounds.every(({ left, shelfLeft }) => left >= shelfLeft)).toBe(true)
})

test('keeps old-school ornaments out of the Book Text zone without a framed panel', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 20rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 412 }
  ], { theme: 'old-school', layout: 'shelf', seed: 'old-6' }))

  const decoration = await page.locator('.hbs-book-art').evaluate((art) => ({
    topBorder: getComputedStyle(art).borderTopWidth,
    bottomBorder: getComputedStyle(art).borderBottomWidth
  }))

  expect(decoration).toEqual({ topBorder: '0px', bottomBorder: '0px' })
})

test('renders Victorian sunbursts as small ornaments rather than a full-spine pattern', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 20rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 412 }
  ], { theme: 'old-school', layout: 'shelf', seed: 'review' }))

  const backgroundSize = await page.locator('.hbs-book-art').evaluate((art) => getComputedStyle(art).backgroundSize)
  expect(backgroundSize).not.toContain('auto')
})

test('uses text along the spine when a long Book Text cannot fit across a capped spine', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 50rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 412 },
    { title: 'Kindred', author: 'Octavia E. Butler', pages: 288 },
    { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', pages: 304 },
    { title: 'Piranesi', author: 'Susanna Clarke', pages: 272 },
    { title: 'The Dispossessed', author: 'Ursula K. Le Guin', pages: 341 },
    { title: 'The Fifth Season', author: 'N. K. Jemisin', pages: 512 },
    { title: 'The Power', author: 'Naomi Alderman', pages: 384 },
    { title: 'The City We Became', author: 'N. K. Jemisin', pages: 448 }
  ], { layout: 'shelf', theme: 'academic' }))

  await expect(page.locator('.hbs-title').filter({ hasText: 'The Left Hand of Darkness' })).toHaveCSS('writing-mode', 'vertical-rl')
})

test('fits short Book Text on a narrow academic or old-school spine', async ({ page }) => {
  await page.setContent('<div id="academic" style="width: 21.5rem"></div><div id="old-school" style="width: 21.5rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => {
    const books = [
      { title: 'Dune', author: 'Frank Herbert', pages: 412, url: 'https://example.com/dune' },
      { title: 'Kindred', author: 'Octavia E. Butler', pages: 288 },
      { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', pages: 304 },
      { title: 'Piranesi', author: 'Susanna Clarke', pages: 272 },
      { title: 'The Dispossessed', author: 'Ursula K. Le Guin', pages: 341 },
      { title: 'The Fifth Season', author: 'N.K. Jemisin', pages: 1000 },
      { title: 'The Power', author: 'Naomi Alderman', pages: 352 },
      { title: 'The City We Became', author: 'N.K. Jemisin', pages: 448 }
    ]
    window.HtmlBookshelf.mountBookshelf(document.querySelector('#academic'), books, { fonts: ['Georgia'], shelfStyle: 'wood', theme: 'academic' })
    window.HtmlBookshelf.mountBookshelf(document.querySelector('#old-school'), books, { animation: true, shelfStyle: 'metal', theme: 'old-school' })
  })

  const fit = await page.locator('.hbs-book').filter({ hasText: 'Dune' }).evaluateAll((books) => books.map((book) => {
    const title = book.querySelector('.hbs-title').getBoundingClientRect()
    const author = book.querySelector('.hbs-author').getBoundingClientRect()
    const spine = book.getBoundingClientRect()
    return {
      inside: title.left >= spine.left + 4 && author.left >= spine.left + 4 && title.right <= spine.right - 4 && author.right <= spine.right - 4,
      separate: author.right <= title.left || title.right <= author.left
    }
  }))

  expect(fit).toEqual([
    { inside: true, separate: true },
    { inside: true, separate: true }
  ])
})

test('gives Stack Slabs a 30px touch thickness and lets them overlap without gaps', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 20rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 200 },
    { title: 'Kindred', author: 'Octavia E. Butler', pages: 200 },
    { title: 'Piranesi', author: 'Susanna Clarke', pages: 200 }
  ], { layout: 'stack', seed: 'stack-overlap' }))

  const slabs = await page.locator('.hbs-book').evaluateAll((books) => books.map((book) => {
    const box = book.getBoundingClientRect()
    return { bottom: box.bottom, height: box.height, top: box.top }
  }))

  expect(slabs.every((slab) => slab.height >= 30)).toBe(true)
  expect(slabs.slice(1).every((slab, index) => slab.top <= slabs[index].bottom)).toBe(true)
})

test('uses the along-spine author size for Across Spine Text and Stack Slabs', async ({ page }) => {
  await page.setContent('<div id="along" style="width: 20rem"></div><div id="across" style="width: 20rem"></div><div id="stack" style="width: 20rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => {
    window.HtmlBookshelf.mountBookshelf(document.querySelector('#along'), [{ title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', pages: 304 }], { layout: 'shelf' })
    window.HtmlBookshelf.mountBookshelf(document.querySelector('#across'), [{ title: 'Dune', author: 'Frank Herbert', pages: 412 }], { layout: 'shelf' })
    window.HtmlBookshelf.mountBookshelf(document.querySelector('#stack'), [{ title: 'Dune', author: 'Frank Herbert', pages: 412 }], { layout: 'stack' })
  })

  const sizes = await page.locator('.hbs-author').evaluateAll((authors) => authors.map((author) => getComputedStyle(author).fontSize))
  expect(sizes[1]).toBe(sizes[0])
  expect(sizes[2]).toBe(sizes[0])
})

test('changes from Shelf Layout to Stack Layout across its literal container threshold', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 24rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 412, url: '/dune' },
    { title: 'Kindred', author: 'Octavia E. Butler', pages: 288 }
  ], { stackThreshold: '20rem', animation: true }))

  const list = page.locator('.hbs-list')
  await expect(list).toHaveCSS('display', 'flex')
  await expect(page.locator('ol')).toHaveCount(1)
  await expect(page.locator('.hbs-book-link')).toHaveAttribute('href', '/dune')

  await page.locator('#target').evaluate((target) => { target.style.width = '18rem' })
  await expect(list).toHaveCSS('display', 'block')
  await expect(page.locator('.hbs-book').first()).toHaveCSS('transform', /matrix/)
})

test('places old-school ornaments below the Book Text zone', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 50rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 412 },
    { title: 'Kindred', author: 'Octavia E. Butler', pages: 288 }
  ], { theme: 'old-school', layout: 'shelf', seed: 'review' }))

  const clearances = await page.locator('.hbs-theme-old-school').evaluateAll((books) => books.map((book) => {
    const content = book.querySelector('.hbs-book-content').getBoundingClientRect()
    const art = book.querySelector('.hbs-book-art').getBoundingClientRect()
    return art.top - content.bottom
  }))

  expect(clearances.every((clearance) => clearance >= 0)).toBe(true)
})

test('shrinks long along-spine Book Text to one line on a thin old-school spine', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 20rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', pages: 80 },
    { title: 'Dune', author: 'Frank Herbert', pages: 1000 },
    { title: 'Kindred', author: 'Octavia E. Butler', pages: 1000 }
  ], { theme: 'old-school', layout: 'shelf', seed: 'review' }))

  const fit = await page.locator('.hbs-title').filter({ hasText: 'The Left Hand of Darkness' }).evaluate((title) => {
    const book = title.closest('.hbs-book')
    const author = book.querySelector('.hbs-author')
    const titleBox = title.getBoundingClientRect()
    const authorBox = author.getBoundingClientRect()
    const contentBox = book.querySelector('.hbs-book-content').getBoundingClientRect()
    const titleSize = Number.parseFloat(getComputedStyle(title).fontSize)
    return {
      inside: titleBox.left >= contentBox.left && authorBox.left >= contentBox.left && titleBox.right <= contentBox.right && authorBox.right <= contentBox.right,
      separate: authorBox.right <= titleBox.left || titleBox.right <= authorBox.left,
      singleLine: titleBox.width <= titleSize * 1.5
    }
  })

  expect(fit).toEqual({ inside: true, separate: true, singleLine: true })
})

test('shrinks long Along Spine Text to remain inside the book', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 20rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', pages: 304 }
  ], { layout: 'shelf' }))

  const fit = await page.locator('.hbs-title').filter({ hasText: 'The Left Hand of Darkness' }).evaluate((title) => {
    const book = title.closest('.hbs-book')
    const bookBox = book.getBoundingClientRect()
    const titleBox = title.getBoundingClientRect()
    const declaredSize = Number.parseFloat(getComputedStyle(book.parentElement).getPropertyValue('--hbs-title-size')) * Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    return {
      bottom: titleBox.bottom <= bookBox.bottom,
      small: Number.parseFloat(getComputedStyle(title).fontSize) <= declaredSize,
      top: titleBox.top >= bookBox.top
    }
  })

  expect(fit).toEqual({ bottom: true, small: true, top: true })
})

test('leans the final old-school book against its neighbour', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 50rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 412 },
    { title: 'Kindred', author: 'Octavia E. Butler', pages: 288 },
    { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', pages: 304 },
    { title: 'Piranesi', author: 'Susanna Clarke', pages: 272 },
    { title: 'The Dispossessed', author: 'Ursula K. Le Guin', pages: 341 },
    { title: 'The Fifth Season', author: 'N. K. Jemisin', pages: 512 },
    { title: 'The Power', author: 'Naomi Alderman', pages: 384 },
    { title: 'The City We Became', author: 'N. K. Jemisin', pages: 448 }
  ], { theme: 'old-school', layout: 'shelf', animation: true }))

  const angle = await page.locator('.hbs-book--leaning').evaluate((book) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(book).transform)
    return Math.abs(Math.atan2(matrix.b, matrix.a) * 180 / Math.PI)
  })
  expect(angle).toBeGreaterThanOrEqual(1)
})

test('keeps perspective Stack Slabs in a compact and continuous pile', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 30rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Dune', author: 'Frank Herbert', pages: 412 },
    { title: 'Kindred', author: 'Octavia E. Butler', pages: 288 },
    { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', pages: 304 },
    { title: 'Piranesi', author: 'Susanna Clarke', pages: 272 },
    { title: 'The Dispossessed', author: 'Ursula K. Le Guin', pages: 341 }
  ], { layout: 'stack', seed: 'review' }))

  const pile = await page.locator('.hbs-list').evaluate((list) => {
    const listBox = list.getBoundingClientRect()
    const books = Array.from(list.querySelectorAll('.hbs-book'), (book) => book.getBoundingClientRect())
    const contacts = books.slice(1).map((book, index) => ({
      horizontalOverlap: Math.min(books[index].right, book.right) - Math.max(books[index].left, book.left),
      narrowerWidth: Math.min(books[index].width, book.width),
      verticalGap: book.top - books[index].bottom
    }))
    return {
      angles: Array.from(list.querySelectorAll('.hbs-book'), (book) => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(book).transform)
        return Math.abs(Math.atan2(matrix.m13, matrix.m11) * 180 / Math.PI)
      }),
      contacts,
      widths: books.map((book) => book.width / listBox.width)
    }
  })

  expect(pile.angles.every((angle) => angle >= 1 && angle <= 3)).toBe(true)
  expect(pile.widths.every((width) => width >= 0.92)).toBe(true)
  expect(pile.contacts.every(({ horizontalOverlap, narrowerWidth }) => horizontalOverlap >= narrowerWidth * 0.94)).toBe(true)
  expect(pile.contacts.every(({ verticalGap }) => verticalGap <= 0.5)).toBe(true)
  await expect(page.locator('.hbs-book').first()).toHaveCSS('transform', /^matrix3d\(/)
})

test('keeps Across Spine Text inside the spine at its activation threshold', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 5.25rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'The Fifth Season', author: 'N. K. Jemisin', pages: 512 }
  ], { layout: 'shelf', minSpineWidth: '5.25rem', seed: 'across-overflow' }))

  const fit = await page.locator('.hbs-book-content').evaluate((content) => {
    const contentBox = content.getBoundingClientRect()
    const textBoxes = Array.from(content.children, (element) => element.getBoundingClientRect())
    return {
      horizontal: getComputedStyle(content).writingMode === 'horizontal-tb',
      inside: textBoxes.every((box) => box.left >= contentBox.left && box.right <= contentBox.right && box.top >= contentBox.top && box.bottom <= contentBox.bottom),
      noOverflow: Array.from(content.children, (element) => element.scrollWidth <= element.clientWidth).every(Boolean)
    }
  })

  expect(fit).toEqual({ horizontal: true, inside: true, noOverflow: true })
})

test('places old-school rules and stamps within horizontal Stack Slabs', async ({ page }) => {
  await page.setContent('<div id="target" style="width: 30rem"></div>')
  await page.addScriptTag({ path: 'dist/html-bookshelf.iife.js' })
  await page.evaluate(() => window.HtmlBookshelf.mountBookshelf(document.querySelector('#target'), [
    { title: 'Old School 5', author: 'Decoration', pages: 200 },
    { title: 'Old School 2', author: 'Decoration', pages: 200 },
    { title: 'Old School 1', author: 'Decoration', pages: 200 },
    { title: 'Old School 6', author: 'Decoration', pages: 200 }
  ], { theme: 'old-school', layout: 'stack', seed: 'stack-decorations' }))

  const decorations = await page.locator('.hbs-book').evaluateAll((books) => books.map((book) => {
      const bookBox = book.getBoundingClientRect()
      const art = book.querySelector('.hbs-book-art')
      const artBox = art.getBoundingClientRect()
      const artStyle = getComputedStyle(art)
      const rules = getComputedStyle(book, '::before')
      return {
        artInside: artBox.top >= bookBox.top && artBox.bottom <= bookBox.bottom,
        rulesAreVertical: rules.display !== 'none' && Number.parseFloat(rules.width) < Number.parseFloat(rules.height),
        stampAtEnd: artStyle.backgroundPositionX.split(',').every((position) => position.includes('100%')),
        stampLayersSized: artStyle.backgroundSize.split(',').every((size) => !size.includes('auto'))
      }
    }))

  expect(decorations.every(({ artInside, rulesAreVertical, stampAtEnd, stampLayersSized }) => artInside && rulesAreVertical && stampAtEnd && stampLayersSized)).toBe(true)
})
