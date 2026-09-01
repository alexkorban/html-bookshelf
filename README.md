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
