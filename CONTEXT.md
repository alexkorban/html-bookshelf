# Digital Bookshelf

This context defines the public concepts of a package that turns a collection
of book information into a visual bookshelf made from HTML and CSS.

## Language

**Book Entry**:
The source description of one book: `title`, `author`, optional `pages`, and
optional `url`. Omitted `pages` default to 200.
_Avoid_: book data, record, item

**Book Text**:
The title and author values of a Book Entry. They are literal Unicode text,
not HTML markup, and are escaped when rendered.
_Avoid_: rich text, label markup

**Book Collection**:
A non-empty ordered array of Book Entries supplied to create one Bookshelf.
_Avoid_: book list, catalogue, library

**Bookshelf**:
A rendered collection of Book Entries, arranged as either shelves or a stack.
_Avoid_: library, display, widget

**Bookshelf Root**:
The outer HTML element of a Bookshelf. It scopes the generated CSS and holds
the per-instance layout and theme settings.
_Avoid_: component root, widget container

**Bookshelf Label**:
The non-visual accessible name of a Bookshelf Root. It defaults to
“Bookshelf” and may be set by the caller.
_Avoid_: aria label, screen-reader title

**Linked Book**:
A Book Entry with a non-empty destination URL string. It renders as one
full-book link inside the ordered Bookshelf collection.
_Avoid_: clickable book, book link

**Destination URL**:
A caller-provided string used as the `href` of a Linked Book. The package does
not limit URL schemes or validate the destination.
_Avoid_: safe URL, web URL

**Shelf Layout**:
A Bookshelf layout that places books in one or more horizontal rows on visible
shelves.
_Avoid_: row layout, grid layout

**Shelf Style**:
The visual support beneath books in Shelf Layout. It can be wood, metal,
abstract, or none; abstract is the default.
_Avoid_: shelf theme, shelf skin

**Stack Layout**:
A Bookshelf layout that places books in one imperfect vertical pile for narrow
containers.
_Avoid_: pile layout, mobile layout

**Automatic Layout**:
The layout mode that selects Shelf Layout or Stack Layout from the width of the
Bookshelf container. Its default Stack Layout threshold is 20rem and it
guarantees usable rendering down to 12rem.
_Avoid_: responsive mode, adaptive layout

**Minimum Spine Width**:
The narrowest permitted width of a book spine in Shelf Layout. It controls
where the browser wraps books onto the next shelf and defaults to 2.5rem.
_Avoid_: book width, column width

**Spine Height**:
The base height of an upright book spine in Shelf Layout. It defaults to 13rem;
individual book spines vary by a deterministic amount of up to 8%.
_Avoid_: book height, shelf height

**Relative Thickness**:
The visual width weight of a Book Entry derived from its page count. It is the
page count divided by 200, clamped from 0.6 to 5, before a shelf fills its
available width. An upright spine normally cannot exceed 42% of its rendered
height, unless the caller's Minimum Spine Width is larger.
_Avoid_: page width, physical thickness

**Across Spine Text**:
Title and author text laid out horizontally across a spine. In automatic mode,
it is used only when every word has at most eight grapheme characters, the
complete Book Text can fit on a capped spine, and the rendered spine meets its
content-derived width threshold. Its text can shrink to 0.55rem and break a
word only as a last-resort overflow safeguard.
_Avoid_: horizontal spine text, landscape text

**Leaning Final Book**:
The final Book Entry in Shelf Layout, when the collection has more than one
entry. It leans inward against the preceding book from its upper inner corner.
_Avoid_: leaning last book, tilted book

**Stack Slab**:
The horizontal visual form of a Book Entry in Stack Layout. Stack Slabs appear
in input order and have a seeded Y-axis perspective and sideways shift. Its
height is the greater of 30px or 0.75rem plus 0.75rem multiplied by Relative
Thickness.
_Avoid_: pile book, stacked spine

**Animated Bookshelf**:
A Bookshelf with opt-in entrance and linked-book interaction animation. It has
no looping motion and remains still when reduced motion is requested.
_Avoid_: motion mode, animated theme

**Variation Seed**:
An optional value that deterministically changes the visual variants assigned
to a Bookshelf without changing its Book Collection.
_Avoid_: random seed, shuffle key

**Visual Key**:
The stable value used to derive a Book Entry's visual variation. It combines
the Variation Seed with its trimmed title, author, page count, and, for an
identical entry, its occurrence number.
_Avoid_: random key, style ID

**Spine Theme**:
A predefined visual style for a book spine, made from CSS colours, gradients,
borders, shadows, and installed system fonts. Modern is the default theme.
All built-in theme variants provide WCAG AA text contrast.
_Avoid_: skin, palette, template

**Font Cycle**:
An optional non-empty ordered array of host-provided font family names. It
cycles in Book Entry order and supplies the first font family for each book,
with the assigned Spine Theme's system stack retained as fallback.
_Avoid_: font theme, raw font CSS

**Mixed Theme**:
A Spine Theme mode that assigns modern, academic, and old-school themes in a
balanced, seed-based cycle.
_Avoid_: random theme, multi-theme

**Render Fragment**:
A self-contained HTML fragment containing a Bookshelf and its scoped CSS.
_Avoid_: snippet, component output

**Render Result**:
A two-item result tuple returned by rendering: `[true, Render Fragment]` on
success or `[false, plain error object]` on failure.
_Avoid_: thrown error, exception result

**Mount Result**:
A two-item result tuple returned by mounting: `[true, null]` on success or
`[false, plain error object]` when no Bookshelf is mounted.
_Avoid_: thrown error, exception result
