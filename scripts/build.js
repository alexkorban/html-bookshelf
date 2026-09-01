import { mkdir, writeFile } from 'node:fs/promises'
import { build } from 'esbuild'
import { sharedStyles } from '../src/bookshelf-styles.js'

await mkdir('dist', { recursive: true })
await Promise.all([
  build({ entryPoints: ['src/index.js'], bundle: true, format: 'esm', platform: 'browser', target: 'es2022', outfile: 'dist/index.js' }),
  build({ entryPoints: ['src/browser-iife.js'], bundle: true, format: 'iife', globalName: 'HtmlBookshelf', platform: 'browser', target: 'es2022', outfile: 'dist/html-bookshelf.iife.js' }),
  build({ entryPoints: ['src/cli.js'], bundle: true, format: 'esm', platform: 'node', target: 'node20', outfile: 'dist/cli.js' }),
  writeFile('dist/styles.css', sharedStyles)
])
