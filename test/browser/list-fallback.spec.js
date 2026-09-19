import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

const serveExample = async (page) => {
  await page.route('http://bookshelf.test/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname
    const resources = {
      '/examples/index.html': ['../../examples/index.html', 'text/html'],
      '/dist/styles.css': ['../../dist/styles.css', 'text/css'],
      '/dist/html-bookshelf.iife.js': ['../../dist/html-bookshelf.iife.js', 'text/javascript']
    }
    const resource = resources[pathname]
    // The static-list example must work even when the JSON examples cannot load.
    if (!resource) return route.fulfill({ status: 404, body: 'Not found' })
    await route.fulfill({
      contentType: resource[1],
      body: await readFile(new URL(resource[0], import.meta.url))
    })
  })
}

test.describe('HTML list without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('keeps the example list readable and its links usable', async ({ page }) => {
    await serveExample(page)
    await page.route('https://en.wikipedia.org/wiki/Dune_(novel)', (route) => route.fulfill({
      contentType: 'text/html', body: '<h1>Dune destination</h1>'
    }))
    await page.goto('http://bookshelf.test/examples/index.html')

    const source = page.locator('#reading-list')
    await expect(source).toBeVisible()
    await expect(source.locator('li')).toHaveCount(2)
    await expect(source).toContainText('Frank Herbert')
    await expect(source).toContainText('Octavia E. Butler')
    await expect(page.locator('[data-html-bookshelf]')).toHaveCount(0)
    await source.getByRole('link', { name: 'Dune', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Dune destination' })).toBeVisible()
  })
})

test('replaces the example list when JavaScript is enabled, independently of JSON loading', async ({ page }) => {
  await serveExample(page)
  await page.goto('http://bookshelf.test/examples/index.html')

  await expect(page.locator('#reading-list')).toHaveCount(0)
  const root = page.getByRole('region', { name: 'Reading list', exact: true })
  await expect(root).toBeVisible()
  await expect(root.getByRole('listitem')).toHaveCount(2)
  await expect(root.getByRole('link', { name: 'Dune Frank Herbert' })).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Dune_(novel)')
  await expect(root.locator('.hbs-book').first()).toHaveCSS('position', 'relative')
  await expect(page.locator('head style[data-html-bookshelf-styles]')).toHaveCount(1)
})

test('keeps the example list when the JavaScript bundle fails to load', async ({ page }) => {
  await serveExample(page)
  await page.route('**/html-bookshelf.iife.js', (route) => route.abort())
  await page.goto('http://bookshelf.test/examples/index.html')

  await expect(page.locator('#reading-list')).toBeVisible()
  await expect(page.locator('#reading-list').getByRole('link', { name: 'Dune', exact: true })).toBeVisible()
  await expect(page.locator('[data-html-bookshelf]')).toHaveCount(0)
})
