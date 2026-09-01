import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const runCli = (argumentsList, input) => spawnSync(process.execPath, ['src/cli.js', ...argumentsList], {
  cwd: process.cwd(),
  encoding: 'utf8',
  input
})

describe('html-bookshelf command-line tool', () => {
  it('prints every available option with an explanation for --help', () => {
    const result = runCli(['--help'])

    expect(result.status).toBe(0)
    expect(result.stderr).toBe('')
    expect(result.stdout).toContain('Usage: html-bookshelf <books.json|-> [options]')
    expect(result.stdout).toContain('--help')
    expect(result.stdout).toContain('Show this help text.')
    expect(result.stdout).toContain('--theme <name>')
    expect(result.stdout).toContain('Select the bookshelf theme.')
    expect(result.stdout).toContain('--layout <name>')
    expect(result.stdout).toContain('Select the bookshelf layout.')
    expect(result.stdout).toContain('--shelf-style <name>')
    expect(result.stdout).toContain('Select the visual style for shelves.')
    expect(result.stdout).toContain('--seed <value>')
    expect(result.stdout).toContain('Set the seed for deterministic visual variation.')
    expect(result.stdout).toContain('--min-spine-width <length>')
    expect(result.stdout).toContain('Set the minimum width of each book spine.')
    expect(result.stdout).toContain('--stack-threshold <length>')
    expect(result.stdout).toContain('Set the width at which books use the Stack Layout.')
    expect(result.stdout).toContain('--spine-height <length>')
    expect(result.stdout).toContain('Set the height of each book spine.')
    expect(result.stdout).toContain('--label <text>')
    expect(result.stdout).toContain('Set the accessible label for the bookshelf.')
    expect(result.stdout).toContain('--style <mode>')
    expect(result.stdout).toContain('Select how the bookshelf CSS is included.')
    expect(result.stdout).toContain('--font <family>')
    expect(result.stdout).toContain('Add a family to the Font Cycle; repeat this option to add more families.')
    expect(result.stdout).toContain('--document')
    expect(result.stdout).toContain('Wrap the bookshelf markup in a complete HTML document.')
    expect(result.stdout).toContain('--animation')
    expect(result.stdout).toContain('Enable the bookshelf animation.')
    expect(result.stdout).toContain('--output <file>')
    expect(result.stdout).toContain('Write the result to a file instead of standard output.')
  })

  it('renders standard input to standard output with repeated Font Cycle flags', () => {
    const result = runCli(['-', '--theme', 'mixed', '--font', 'Aptos', '--font', 'Merriweather', '--label', 'Reading'], JSON.stringify([
      { title: 'Dune', author: 'Frank Herbert' }
    ]))

    expect(result.status).toBe(0)
    expect(result.stdout).toContain('aria-label="Reading"')
    expect(result.stdout).toContain('hbs-theme-')
  })

  it('reports validation errors and exits unsuccessfully', () => {
    const result = runCli(['-'], '[]')

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('[0]: must contain at least one Book Entry')
  })
})
