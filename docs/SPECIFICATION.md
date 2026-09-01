# `@alexkorban/html-bookshelf` specification

## 1. Purpose

`@alexkorban/html-bookshelf` is an npm package that turns a non-empty JSON
collection of books into a responsive, skeuomorphic digital bookshelf. Its
rendered result consists only of HTML and CSS. It supports both static
generation and browser mounting into an existing HTML element.

The package is deliberately a renderer, not a book-data service or a complete
application. It accepts book information from the caller and never fetches,
stores, sorts, paginates, or edits that information.

## 2. Goals

- Create a portable HTML/CSS bookshelf from a Book Collection.
- Give page count a clear but relative visual effect on book thickness.
- Adapt to the width of its own container, not the browser viewport.
- Provide a shelf scene for wider containers and one imperfect stack for
  narrow containers.
- Provide modern, academic, old-school, and balanced mixed Spine Themes.
- Be deterministic: the same Book Collection, options, and seed produce the
  same visual variation in static and browser use.
- Keep the public interface small and the rendering core functional.
- Be accessible, testable, and safe when rendering Book Text.

## 3. Version-1 scope

### Included

- Static HTML/CSS generation.
- ESM and browser-script use.
- A Node.js command-line tool.
- Built-in themes and a mixed theme mode.
- Optional host-provided font families.
- Optional, restrained animation.
- Four Shelf Styles.
- Unicode-aware text handling.

### Excluded

- Caller-defined themes or arbitrary CSS in JSON.
- Cover images, remote fonts, bundled fonts, or external visual assets.
- Internet Explorer and other legacy-browser support.
- CommonJS output.
- Browser fetching of Book Collections.
- Pagination, internal scrolling, hidden books, virtualisation, or DOM diffing.
- Stateful updates, hydration, or an `unmount` lifecycle.
- Rich text or HTML in titles and authors.

## 4. Terminology

The project glossary in [CONTEXT.md](../CONTEXT.md) is authoritative. The
principal terms are:

- **Book Entry**: one source object with `title`, `author`, optional `pages`,
  and optional `url`.
- **Book Collection**: a non-empty ordered array of Book Entries.
- **Bookshelf**: the visual collection, in Shelf Layout or Stack Layout.
- **Render Fragment**: the HTML string generated for a Bookshelf.
- **Relative Thickness**: the page-count-derived visual weight of a book.
- **Spine Theme**: one predefined visual style for book spines.

## 5. Input contract

### 5.1 Book Collection

The core input is a JSON-compatible array. Its order is meaningful and is
preserved in both layouts.

```json
[
  {
    "title": "Dune",
    "author": "Frank Herbert",
    "pages": 412,
    "url": "/books/dune"
  },
  {
    "title": "The Dispossessed",
    "author": "Ursula K. Le Guin"
  }
]
```

Each Book Entry has the following fields.

| Field | Required | Rules |
| --- | --- | --- |
| `title` | Yes | Non-empty Unicode string after outer whitespace is trimmed. It is rendered as literal text. |
| `author` | Yes | Non-empty Unicode string after outer whitespace is trimmed. It is rendered as literal text. |
| `pages` | No | A finite positive integer. It defaults to `200` only when omitted. |
| `url` | No | A non-empty string when supplied. It becomes the `href` for the complete visible book. URL schemes are not restricted. |

An empty array is invalid. Supplied invalid values are errors; the renderer does
not silently repair them.

### 5.2 Book Text and URLs

Titles and authors are HTML-escaped and never treated as markup. A title such
as `<em>Dune</em>` displays those characters literally.

URLs are attribute-escaped but otherwise not validated or restricted. This
permits custom schemes and non-web destinations. Therefore, callers must apply
their own URL policy before rendering untrusted Book Collections. In
particular, the package does not protect callers from an untrusted
`javascript:` URL.

## 6. Options contract

The second argument to the public functions is an optional plain object. These
are the complete version-1 options.

```js
{
  theme: 'modern',
  layout: 'auto',
  shelfStyle: 'abstract',
  seed: undefined,
  fonts: undefined,
  minSpineWidth: '2.5rem',
  stackThreshold: '20rem',
  spineHeight: '13rem',
  style: 'embedded',
  animation: false,
  label: 'Bookshelf'
}
```

| Option | Accepted values | Default | Meaning |
| --- | --- | --- | --- |
| `theme` | `modern`, `academic`, `old-school`, `mixed` | `modern` | Spine Theme selection. |
| `layout` | `auto`, `shelf`, `stack` | `auto` | Responsive or forced layout mode. |
| `shelfStyle` | `abstract`, `wood`, `metal`, `none` | `abstract` | Visible support under books in Shelf Layout. |
| `seed` | Optional stable value | Derived from the Book Collection | Changes deterministic visual variation. |
| `fonts` | Optional non-empty array of font-family names | Theme defaults | Font Cycle for books in input order. |
| `minSpineWidth` | CSS length | `2.5rem` | Minimum Shelf Layout spine width and wrap control. |
| `stackThreshold` | CSS length | `20rem` | Automatic Layout threshold for Stack Layout. It is written as a literal value in a generated per-instance container query. |
| `spineHeight` | CSS length | `13rem` | Base upright spine height. |
| `style` | `embedded`, `none` | `embedded` | Whether the renderer includes or injects package CSS. |
| `animation` | Boolean | `false` | Enables the defined entrance and interaction effects. |
| `label` | String | `Bookshelf` | Non-visual accessible name for the Bookshelf Root. |

`fonts` entries are individual font family names, not arbitrary `font-family`
CSS. Each selected host font is placed before the assigned theme's system stack
as a fallback. The Font Cycle applies in Book Entry order, in both layouts.

The caller cannot configure per-book themes, colours, text direction, or
arbitrary custom themes in version 1.

## 7. Public interfaces

### 7.1 Pure static renderer

```js
bookshelfFragment(bookCollection, options)
```

`bookshelfFragment` is pure. It does not read or modify the DOM, write files,
change its inputs, access the network, or throw validation exceptions.

It returns one of these two-item tuples:

```js
[true, htmlString]

[false, {
  type: 'validation-error',
  issues: [
    {
      path: '[0].title',
      message: 'must be a non-empty string'
    }
  ]
}]
```

On success, `htmlString` is the Render Fragment. With `style: 'embedded'`, it
contains the shared scoped stylesheet and the per-instance responsive rule,
followed by the Bookshelf Root. With `style: 'none'`, it omits the shared
stylesheet but retains the small per-instance responsive rule; the host must
load the exported stylesheet itself.

### 7.2 Browser mounting adapter

```js
mountBookshelf(targetElement, bookCollection, options)
```

`mountBookshelf` is a side-effecting adapter. It accepts an HTML element,
validates both its target and the Book Collection before changing the DOM, then
replaces the element's contents with a Bookshelf.

Its result is:

```js
[true, null]

[false, {
  type: 'target-error',
  message: 'target must be an HTML element'
}]
```

Validation failures use the same `validation-error` form as the pure renderer.
On any failure, the target remains unchanged. A later successful call replaces
the earlier mounted Bookshelf completely; the package performs no DOM diffing
or state preservation.

When `style` is `embedded`, the adapter adds the shared scoped stylesheet only
once to the target document. Every mounted Bookshelf retains its own generated
responsive rule. When `style` is `none`, the host must load the package
stylesheet itself; the generated responsive rule is still required so an
arbitrary `stackThreshold` can work in static HTML.

### 7.3 Browser IIFE

The IIFE build exposes the same functions under the `HtmlBookshelf` global:

```js
HtmlBookshelf.bookshelfFragment(bookCollection, options)
HtmlBookshelf.mountBookshelf(targetElement, bookCollection, options)
```

### 7.4 Command-line tool

The executable is `html-bookshelf`.

```sh
html-bookshelf books.json \
  --theme mixed \
  --layout auto \
  --shelf-style abstract \
  --seed winter \
  --font Aptos \
  --font Merriweather \
  --min-spine-width 2.5rem \
  --stack-threshold 20rem \
  --spine-height 13rem \
  --animate \
  --label "2026 reading list"
```

The command accepts one JSON file or `-` for standard input. It writes the
Render Fragment to standard output by default; `--output path.html` writes the
same result to a file. `--document` wraps it in a minimal standalone HTML
document for quick previewing. Repeated `--font` flags form the Font Cycle.

Validation failures are printed clearly and cause unsuccessful command exit.

## 8. Responsive layout requirements

### 8.1 Automatic Layout

Automatic Layout uses container queries. It must respond to the width of the
Bookshelf Root's container, not to viewport width.

- At widths below `stackThreshold` (default `20rem`), it uses Stack Layout.
- At or above the threshold, it uses Shelf Layout.
- The supported minimum container width is `12rem`. Below that, the renderer
  makes a best effort, but long unbroken text can overflow.
- `layout: 'shelf'` and `layout: 'stack'` force the selected layout.

### 8.2 Reflow mechanism

Reflow is entirely CSS-driven. The package must not install a resize listener,
use `ResizeObserver`, measure the DOM, or remount a Bookshelf when its parent
changes size.

The Bookshelf Root has `container-type: inline-size` and a generated unique
container name. The pure renderer derives a stable instance identifier from the
normalised Book Collection and responsive options. It emits a literal,
per-instance rule of this form, using the validated `stackThreshold` value
from the caller:

```css
@container hbs-a1b2c3 (inline-size < 20rem) {
  [data-hbs-instance="a1b2c3"] .hbs-list {
    /* Stack Layout rules */
  }
}
```

The literal `20rem` in this example is generated from the option; it is not a
CSS custom-property reference. A unique container name prevents one instance's
custom breakpoint rule from changing another Bookshelf on the same page.

On every layout pass, the browser re-evaluates the root's container query:

1. A wider root applies Shelf Layout. Its flex list wraps books into as many
   rows as the current inline size permits.
2. As the root narrows, flex wrapping moves books to later shelf rows. Flex
   weights then expand each row to the available width without changing source
   order or generated markup.
3. When the root crosses the literal threshold, the container query changes the
   same list to Stack Layout. All Book Entries become normal-flow horizontal
   Stack Slabs.
4. When the root widens again, the query becomes false and Shelf Layout returns.

Each upright book is also an inline-size query container. Its nested query uses
the fixed literal `3.75rem` to select Across Spine Text for eligible Book Text;
otherwise text remains along the spine. This query also re-evaluates as flex
layout changes a particular spine's width.

The host must give the Bookshelf Root a usable inline size through normal page
layout, such as a block, grid, flex, or sidebar column. `inline-size`
containment prevents the root from sizing itself from its book contents.

### 8.3 CSS delivery and responsive rules

The exported `styles.css` contains shared structural, visual, and default CSS.
An arbitrary `stackThreshold` cannot live only in that shared file because its
value differs by Bookshelf instance. The Render Fragment therefore always
contains a small, scoped per-instance `@container` rule.

This has an important Content Security Policy consequence: `style: 'none'`
avoids the shared inline stylesheet, but it cannot remove the generated
per-instance responsive rule. A host that forbids every inline style without a
nonce or hash cannot use an arbitrary static `stackThreshold` from this
interface. Such a host must either permit that generated rule, use a future
external generated stylesheet workflow, or accept a future restricted
breakpoint interface.

### 8.4 Shelf Layout

Shelf Layout is a wrapping horizontal flex arrangement. There is no fixed
`booksPerShelf` setting. The browser determines row breaks from the real
available width.

Every flex row has a full-width support directly below its books. The support
repeats at the fixed row pitch, so a shelf remains aligned under every row as
the container width changes and books wrap. Individual book heights still vary
within each row and align at its support.

Each book has a minimum width of `minSpineWidth`, a page-derived base width,
and a page-derived flex weight. Books in a row expand to fill the available
shelf width. Input order is never changed.

Relative Thickness is:

```text
clamp(0.6, pages / 200, 5)
```

It controls the relative apparent thickness of books, while every shelf still
fills its available width.

Upright spines use `spineHeight` as their base height. Each has a seeded
variation between -8% and +8%, aligned at the bottom so the height difference
is visible at the top of the shelf.

The final Book Entry in a Shelf Layout containing more than one book receives
a small seeded inward lean. It leans against the preceding book and pivots from
its upper inner corner. This is a CSS-only approximation of a final book on an
incomplete shelf; layout measurement JavaScript is not used.

### 8.5 Stack Layout

Stack Layout shows the full Book Collection as one normal document-flow pile.
It does not paginate, hide books, or make an internal scrolling region.

Each Book Entry becomes a horizontal Stack Slab in input order, from top to
bottom. The slab's long edge carries a horizontal title and author label that
may wrap between words. Relative Thickness controls slab height:

```text
0.75rem + (0.75rem × relativeThickness)
```

This produces roughly `1.2rem` for a thin book, `1.5rem` for a 200-page book,
and up to `4.5rem` for the maximum relative thickness. Each slab has a small
seeded sideways shift and a top-down `rotateZ()` transform between -1.5° and
1.5°, around its centre. It has no perspective tilt.

## 9. Visual design

The visual style is skeuomorphic, not photorealistic. It should suggest real
books with controlled CSS detail rather than attempt to reproduce photographs.

### 9.1 Spine Themes

All built-in themes use only CSS colours, gradients, borders, shadows, and
installed system font stacks. They must keep title and author text at WCAG AA
normal-text contrast (at least 4.5:1) against all generated spine colours.

| Theme | Visual language | Default font stack |
| --- | --- | --- |
| `modern` | Clean saturated colours, sans-serif type, simple geometric bands. | `ui-sans-serif, system-ui, sans-serif` |
| `academic` | Muted cloth-like colours, serif type, restrained labels and rules. | `ui-serif, Georgia, Cambria, "Times New Roman", serif` |
| `old-school` | Warm, slightly faded colours, classic serif type, decorative bands and subtle CSS texture. | `"Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif` |

`mixed` uses a seed-based ordering of the three built-in themes and repeats the
three-theme cycle. Every complete group of three Book Entries therefore has
one book from each built-in theme.

### 9.2 Shelf Styles

Shelf Styles affect Shelf Layout only:

- `abstract`: a simple support line with a restrained shadow.
- `wood`: a warm plank, slight CSS grain, and edge shadow.
- `metal`: a thin brushed-metal support with a highlight.
- `none`: no visible support beneath the books.

### 9.3 Spine text direction

Spine text direction is automatic in version 1.

The renderer identifies word-like units using `Intl.Segmenter` with word
granularity and counts their grapheme clusters. Across Spine Text is eligible
only when every word-like unit in both title and author has eight or fewer
graphemes. The browser uses Across Spine Text only when the rendered spine is
at least `3.75rem` wide; otherwise it uses text along the spine.

Across Spine Text may wrap between words. Its font size adapts to the spine
width and may shrink to `0.55rem`. If an unusual host font still makes an
eligible word too wide, it may break as a last-resort safeguard against clipped
text.

### 9.4 Deterministic variation

Theme assignment, height variation, lean angle, Stack Slab rotation, and
sideways shifts must be deterministic. The Visual Key combines the optional
global seed with each Book Entry's trimmed title, author, and page count. When
identical Book Entries occur more than once, their occurrence number
distinguishes them.

This rule makes static and browser output reproducible. Moving a unique Book
Entry must not restyle unrelated unique entries.

### 9.5 Animation

Animation is off by default. When `animation: true`:

- Each book has one entrance animation of 180 ms with an ease-out curve.
- Entrance delays use seeded 25 ms steps and are capped at 300 ms.
- Books grow by 6% on hover and linked Books also grow on keyboard focus, without
  changing the Shelf or Stack Layout. Linked Books lift slightly and gain a
  stronger shadow over 120 ms.
- There are no looping or continuous animations.
- `prefers-reduced-motion: reduce` disables all package animation, even when
  the option is enabled.

## 10. HTML, CSS, and accessibility requirements

- The Bookshelf Root must be a labelled section with `label` as its accessible
  name.
- The Book Collection must render as an ordered list, preserving source order.
- A Book Entry with `url` must render as one full-book link. It uses normal
  browser link behaviour: no forced new tab, no invented `target`, and no
  click handler.
- A Book Entry without `url` is non-interactive.
- Linked Books must have a visible keyboard `:focus-visible` treatment.
- The visible title and author provide a book's accessible name.
- Generated CSS must scope every selector beneath `[data-html-bookshelf]` and
  prefix internal classes with `hbs-`. It must not style bare `a`, `ol`,
  `section`, `body`, or other host-page elements.
- Per-instance settings use CSS custom properties on the Bookshelf Root.
- The package must not require a remote font, image, or other network asset.

## 11. Technical architecture

### 11.1 Runtime and builds

- Package name: `@alexkorban/html-bookshelf`.
- Language: JavaScript, with JSDoc types and JavaScript type checking.
- Node.js support: Node.js 20 or later for the CLI and build tools.
- Browser support: current evergreen Chrome, Firefox, Safari, and Edge.
- Module support: ESM is the primary package format. Version 1 has no CommonJS
  build.
- Browser-script support: an IIFE build exposes `HtmlBookshelf`.
- Build tool: esbuild, as a development-only dependency.
- Runtime dependency: Ramda only.
- Licence: MIT.

The package exports the ESM functions and a separate
`@alexkorban/html-bookshelf/styles.css` stylesheet for `style: 'none'` hosts.

### 11.2 Functional design rules

Package-private source modules may expose pure functions for direct unit tests,
but they are not part of the npm package interface.

## 12. Quality and test requirements

Development follows red/green TDD in vertical slices:

1. Add one failing test at an agreed seam or package-private pure function.
2. Write the smallest implementation that makes that test pass.
3. Repeat for the next behaviour.
4. Perform refactoring during review, not as part of the red/green loop.

Use the following verification layers.

| Layer | Tool | Required behaviour |
| --- | --- | --- |
| Unit | Vitest | Validation, normalisation, Visual Keys, variation, text-direction eligibility, escaping, and result tuples. |
| Public interface integration | Vitest | `bookshelfFragment` output and `mountBookshelf` replacement, error, and stylesheet behaviour. |
| Browser integration | Playwright | Resize a host container across each literal threshold; assert Shelf/Stack selection, flex reflow, nested text direction, list and link semantics, computed dimensions, transforms, focus behaviour, and reduced-motion behaviour. |
| Manual visual review | Static `examples/` page | Built-in themes, mixed mode, Shelf Styles, layouts, Font Cycle, and animation. |

Do not use pixel screenshot assertions. System font availability and text
rasterisation differ between environments. Browser tests must instead assert
HTML structure, active layout mode, computed geometry, and bounded transform
values.

## 13. Acceptance criteria

Version 1 is complete when all of the following are true:

- A valid Book Collection produces the same deterministic HTML/CSS through the
  static renderer, CLI, and browser adapter.
- Invalid Book Collections return plain data errors and never throw validation
  exceptions or partly modify a mount target.
- Books wrap into shelves from real container width and switch to one stack
  below the configured threshold, then return to shelves when the container
  widens without JavaScript remounting.
- Page count visibly affects thickness in both layouts.
- Built-in themes, mixed mode, Shelf Styles, Font Cycle, lean, stack
  imperfection, automatic text direction, and optional animation work as
  specified.
- All built-in themes meet the defined text contrast level and linked books are
  keyboard accessible.
- The package ships ESM, the `HtmlBookshelf` IIFE, the CLI, and `styles.css`.
- The Vitest and Playwright suites pass, and the examples page demonstrates
  every supported visual mode.
