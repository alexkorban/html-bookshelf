import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const runCli = (argumentsList, input) => spawnSync(process.execPath, ['src/cli.js', ...argumentsList], {
  cwd: process.cwd(),
  encoding: 'utf8',
  input
})

describe('html-bookshelf command-line tool', () => {
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
