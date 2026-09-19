# @alexkorban/html-bookshelf

Render an ordered book collection as an accessible, responsive HTML and CSS
bookshelf.

```js
import { bookshelfFragment } from '@alexkorban/html-bookshelf'

const [ok, fragment] = bookshelfFragment([
  { title: 'Diaspora', author: 'Greg Egan', pages: 412, url: '/books/dune' }
], { theme: 'modern', layout: 'auto', label: 'Reading list' })
```

`bookshelfFragment` returns `[true, html]` on success, or a plain
`[false, validationError]` tuple. `mountBookshelf(target, books, options)`
uses the same pure renderer and replaces a target HTML element only after
validation succeeds.

For hosts that load the stylesheet themselves, use `style: 'none'` and import:

```js
import '@alexkorban/html-bookshelf/styles.css'
```

The renderer still emits a small inline per-instance container query for an
arbitrary Stack Layout threshold.

## Shelf widths

Shelf Layout uses one page-count scale across all rows: 2rem per 200 pages,
subject to the minimum and maximum spine widths. Books keep their calculated
width when they wrap, and unused space remains at the end of each row.
The shelf support still spans the full container width.

The default minimum spine width is 2.5rem. The shared maximum is the smallest
of 7rem, 22% of the container width, and 42% of the shortest permitted spine
height; a larger minimum takes precedence. These limits keep text readable
and book proportions bounded, but also limit page-count accuracy at the
extremes. Stack Layout continues to use the available container width.

## Mounting from an HTML list

Use `mountBookshelfFromList(listElement, options)` to replace an existing `ol`
or `ul` with a Bookshelf. The list stays readable, with working links, when
JavaScript is disabled or fails to load.

```html
<ol id="reading-list">
  <li data-hbs-pages="412">
    <a data-hbs-title href="/books/dune">Dune</a>
    by <span data-hbs-author>Frank Herbert</span>
  </li>
  <li>
    <span data-hbs-title>Kindred</span>
    by <span data-hbs-author>Octavia E. Butler</span>
  </li>
</ol>
```

Run the mount after the list is available in the DOM:

```js
import { mountBookshelfFromList } from '@alexkorban/html-bookshelf'

const result = mountBookshelfFromList(
  document.querySelector('#reading-list'),
  { theme: 'modern', label: 'Reading list' }
)
```

The browser script also exports `HtmlBookshelf.mountBookshelfFromList`.

- The target must be an HTML `ol` or `ul` with a parent node. It is replaced
  in place; its attributes, including `id` and `class`, are not copied.
- Direct child `li` elements supply Book Entries in DOM order. The collection
  must be non-empty, and nested lists are not supported. Other direct children do not supply entries.
- Each item must contain exactly one `[data-hbs-title]` and one
  `[data-hbs-author]` element. Their trimmed `textContent` supplies literal
  Book Text; inline formatting is not retained.
- Optional `data-hbs-pages` must contain a positive decimal integer. Surrounding whitespace is allowed. Omit it to use the default of 200 pages.
- The first `a[href]` within each item supplies its Destination URL, including when the link is outside the title. Relative URLs remain relative. If no anchor has an `href`, the book has no link. An empty or whitespace-only
  `href` is invalid. Other data attributes are ignored.
- All existing rendering options apply. Either source list type produces an
  ordered Bookshelf collection.

The function returns `[true, null]` on success, or `[false, error]` on failure.

An invalid target returns `target-error`; missing or duplicate field markers
and nested lists return `source-error` with indexed issue paths such as
`[1].title`. Invalid Book Entry values, an empty collection, or invalid options return `validation-error`. Extraction and validation finish before the source is replaced or styles are installed, so failures leave the original nodes intact.

This is a one-time conversion. Calling it again with the replaced source
returns a `target-error` because that list no longer has a parent. No initial
hiding rule or separate `<noscript>` content is needed.

## Command line

```sh
npx @alexkorban/html-bookshelf books.json --theme mixed \
  --font Aptos --font Merriweather \
  --label "2026 reading list" --document --output bookshelf.html
```

Use `-` instead of `books.json` to read JSON from standard input. Invalid
input is written to standard error and returns an unsuccessful exit status.

## Development

Node.js 20 or later is required.

```sh
npm install
npm test
npm run typecheck
npm run build
```
