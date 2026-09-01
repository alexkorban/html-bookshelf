import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

describe('Examples page', () => {
  it('includes separate Shelf Layout examples for vertical and Across Spine Text', async () => {
    const page = await readFile(new URL('../../examples/index.html', import.meta.url), 'utf8')

    expect(page).toContain('id="vertical-spine"')
    expect(page).toContain('id="across-spine"')
    expect(page).toContain("querySelector('#vertical-spine')")
    expect(page).toContain("querySelector('#across-spine')")
    expect(page).toContain("{ theme: 'modern', layout: 'shelf'")
  })
})
