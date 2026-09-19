// @vitest-environment jsdom
import * as R from 'ramda'
import { beforeEach, describe, expect, it } from 'vitest'
import { mountBookshelf, mountBookshelfFromList } from '../../src/index.js'

const bookItem = '<li><span data-hbs-title>Dune</span> by <span data-hbs-author>Frank Herbert</span></li>'

const createList = (markup = bookItem, tag = 'ol') => {
  document.body.innerHTML = `<p id="before">Before</p><${tag} id="source">${markup}</${tag}><p id="after">After</p>`
  return document.querySelector('#source')
}

describe('mountBookshelfFromList', () => {
  beforeEach(() => {
    document.head.replaceChildren()
    document.body.replaceChildren()
  })

  it.each(['ol', 'ul'])('replaces a source %s in place with the same rendering as plain Book Entries', (tag) => {
    const source = createList(`
      <li data-hbs-pages=" 412 " data-unrelated="ignored">
        <a data-hbs-title href="../books/dune?edition=1&amp;format=paper"> <em>Dune</em> &amp; &lt;script&gt; </a>
        by <span data-hbs-author> Frank Herbert </span>
      </li>
      <li><span data-hbs-title>Kindred</span> by <span data-hbs-author>Octavia E. Butler</span></li>
    `, tag)
    const before = source.previousSibling
    const after = source.nextSibling
    const options = { theme: 'mixed', layout: 'shelf', label: 'Reading list', seed: 'list' }
    const expected = document.createElement('div')
    expect(mountBookshelf(expected, [
      { title: 'Dune & <script>', author: 'Frank Herbert', pages: 412, url: '../books/dune?edition=1&format=paper' },
      { title: 'Kindred', author: 'Octavia E. Butler' }
    ], options)).toEqual([true, null])

    expect(mountBookshelfFromList(source, options)).toEqual([true, null])

    const root = document.querySelector('[data-html-bookshelf]')
    expect(root.outerHTML).toBe(expected.innerHTML)
    expect(root.previousSibling).toBe(before)
    expect(root.nextSibling).toBe(after)
    expect(source.parentNode).toBeNull()
    expect(document.querySelector('#source')).toBeNull()
    expect(root.querySelector('script, em')).toBeNull()
    expect(root.querySelectorAll('li')).toHaveLength(2)
    expect(root.querySelectorAll('a')).toHaveLength(1)
    expect(document.head.querySelectorAll('style[data-html-bookshelf-styles]')).toHaveLength(1)
  })

  it('uses the first anchor with an href, including a link outside the title', () => {
    const source = createList(`<li data-hbs-url="/ignored">
      <a name="bookmark">Bookmark</a>
      <span data-hbs-title>Dune</span> by <span data-hbs-author>Frank Herbert</span>
      <a href="../first">Details</a><a href="/second">Another edition</a>
    </li>`)

    expect(mountBookshelfFromList(source)).toEqual([true, null])
    expect(document.querySelector('.hbs-book-link').getAttribute('href')).toBe('../first')
  })

  it('omits a Destination URL when no anchor has an href', () => {
    const source = createList(`<li data-hbs-url="/ignored">
      <a data-hbs-title>Dune</a> by <span data-hbs-author>Frank Herbert</span>
    </li>`)

    expect(mountBookshelfFromList(source)).toEqual([true, null])
    expect(document.querySelector('.hbs-book-link')).toBeNull()
  })

  it.each([
    ['missing title', '<li><span data-hbs-author>Author</span></li>', 'source-error', '[0].title'],
    ['duplicate title', `<li><span data-hbs-title>One</span>${R.slice(4, -5, bookItem)}</li>`, 'source-error', '[0].title'],
    ['missing author', '<li><span data-hbs-title>Title</span></li>', 'source-error', '[0].author'],
    ['duplicate author', '<li><span data-hbs-title>Title</span><span data-hbs-author>A</span><span data-hbs-author>B</span></li>', 'source-error', '[0].author'],
    ['nested list', `<li><span data-hbs-title>Title</span><span data-hbs-author>Author</span><ul>${bookItem}</ul></li>`, 'source-error', '[0]'],
    ['empty list', '', 'validation-error', '[0]'],
    ['blank title', '<li><span data-hbs-title> </span><span data-hbs-author>Author</span></li>', 'validation-error', '[0].title'],
    ['blank author', '<li><span data-hbs-title>Title</span><span data-hbs-author> </span></li>', 'validation-error', '[0].author'],
    ['empty href', '<li><a data-hbs-title href="">Title</a><span data-hbs-author>Author</span><a href="/valid">Later</a></li>', 'validation-error', '[0].url'],
    ['blank href', '<li><a data-hbs-title href="  ">Title</a><span data-hbs-author>Author</span></li>', 'validation-error', '[0].url']
  ])('preserves source nodes and styles for %s', (_name, markup, type, path) => {
    const source = createList(markup)
    const nodes = Array.from(source.childNodes)
    const original = document.body.innerHTML

    const result = mountBookshelfFromList(source)

    expect(result[0]).toBe(false)
    expect(result[1]).toMatchObject({ type, issues: expect.arrayContaining([expect.objectContaining({ path })]) })
    expect(document.body.innerHTML).toBe(original)
    R.addIndex(R.forEach)((node, index) => expect(source.childNodes[index]).toBe(node), nodes)
    expect(document.head.innerHTML).toBe('')
  })

  it.each(['', ' ', '300pages', '2.5', '0', '-1', 'Infinity', 'NaN', '1e3', '0x10'])('rejects invalid page count %j without changing the list', (pages) => {
    const source = createList(bookItem)
    source.firstElementChild.setAttribute('data-hbs-pages', pages)
    const original = source.outerHTML

    expect(mountBookshelfFromList(source)).toEqual([false, {
      type: 'validation-error',
      issues: [{ path: '[0].pages', message: 'must be a finite positive integer' }]
    }])
    expect(source.outerHTML).toBe(original)
    expect(source.parentNode).toBe(document.body)
    expect(document.head.innerHTML).toBe('')
  })

  it('reports the index of a malformed entry after valid entries', () => {
    const source = createList(`${bookItem}<li><span data-hbs-title>Kindred</span></li>`)
    expect(mountBookshelfFromList(source)).toEqual([false, {
      type: 'source-error',
      issues: [{ path: '[1].author', message: 'must contain exactly one [data-hbs-author] element' }]
    }])
  })

  it('preserves the source when rendering options are invalid', () => {
    const source = createList()
    const item = source.firstElementChild
    expect(mountBookshelfFromList(source, { layout: 'unknown' })[0]).toBe(false)
    expect(source.parentNode).toBe(document.body)
    expect(source.firstElementChild).toBe(item)
    expect(document.head.innerHTML).toBe('')
  })

  it.each([null, undefined, {}, { ownerDocument: null }, 'ol'])('rejects a non-element target %j', (target) => {
    expect(mountBookshelfFromList(target)).toEqual([false, {
      type: 'target-error', message: 'target must be an HTML ol or ul element'
    }])
  })

  it('rejects a container instead of looking for a list inside it', () => {
    createList()
    expect(mountBookshelfFromList(document.body)[1].type).toBe('target-error')
    expect(document.querySelector('#source')).not.toBeNull()
  })

  it('rejects a list without a parent, including a previously replaced source', () => {
    expect(mountBookshelfFromList(document.createElement('ol'))).toEqual([false, {
      type: 'target-error', message: 'target must have a parent node'
    }])
    const source = createList()
    expect(mountBookshelfFromList(source)).toEqual([true, null])
    const rendered = document.body.innerHTML
    expect(mountBookshelfFromList(source)[1].type).toBe('target-error')
    expect(document.body.innerHTML).toBe(rendered)
  })

  it('supports lists in a DocumentFragment', () => {
    const fragment = document.createDocumentFragment()
    const source = document.createElement('ul')
    source.innerHTML = bookItem
    fragment.append(source)

    expect(mountBookshelfFromList(source)).toEqual([true, null])
    expect(fragment.querySelector('[data-html-bookshelf]')).not.toBeNull()
    expect(source.parentNode).toBeNull()
  })

  it('uses the source document for elements from another window', () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    const otherDocument = iframe.contentDocument
    otherDocument.body.innerHTML = `<ul>${bookItem}</ul>`

    expect(mountBookshelfFromList(otherDocument.querySelector('ul'))).toEqual([true, null])
    expect(otherDocument.querySelector('[data-html-bookshelf]')).not.toBeNull()
    expect(otherDocument.head.querySelectorAll('style[data-html-bookshelf-styles]')).toHaveLength(1)
    expect(document.head.innerHTML).toBe('')
  })

  it('shares styles across both mounting modes and multiple list mounts', () => {
    const source = createList()
    const second = source.cloneNode(true)
    const target = document.createElement('div')
    document.body.append(second, target)

    expect(mountBookshelfFromList(source)).toEqual([true, null])
    expect(mountBookshelfFromList(second)).toEqual([true, null])
    expect(mountBookshelf(target, [{ title: 'Kindred', author: 'Octavia E. Butler' }])).toEqual([true, null])
    expect(document.head.querySelectorAll('style[data-html-bookshelf-styles]')).toHaveLength(1)
    expect(document.querySelectorAll('[data-html-bookshelf]')).toHaveLength(3)
    expect(document.body.querySelectorAll('style[data-hbs-responsive]')).toHaveLength(3)
    expect(document.body.querySelector('style[data-html-bookshelf-styles]')).toBeNull()
  })

  it('honours style none and retains the per-instance responsive rule', () => {
    const source = createList()
    expect(mountBookshelfFromList(source, { style: 'none' })).toEqual([true, null])
    expect(document.head.innerHTML).toBe('')
    expect(document.querySelector('style[data-hbs-responsive]')).not.toBeNull()
    expect(document.querySelector('[data-html-bookshelf]')).not.toBeNull()
  })
})
