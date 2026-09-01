#!/usr/bin/env node
// @ts-nocheck
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import * as R from 'ramda'
import { bookshelfFragment } from './bookshelf-fragment.js'

const optionFlags = {
  '--theme': 'theme',
  '--layout': 'layout',
  '--shelf-style': 'shelfStyle',
  '--seed': 'seed',
  '--min-spine-width': 'minSpineWidth',
  '--stack-threshold': 'stackThreshold',
  '--spine-height': 'spineHeight',
  '--label': 'label',
  '--style': 'style'
}

const argumentState = (state, argument) => {
  if (state.error !== undefined) return state
  if (state.pending === '--font') return R.pipe(R.assoc('fonts', R.append(argument, state.fonts)), R.assoc('pending', undefined))(state)
  if (state.pending === '--output') return R.pipe(R.assoc('output', argument), R.assoc('pending', undefined))(state)
  if (state.pending !== undefined) return R.pipe(R.assoc('options', R.assoc(R.prop(state.pending, optionFlags), argument, state.options)), R.assoc('pending', undefined))(state)
  if (argument === '--document') return R.assoc('document', true, state)
  if (argument === '--animate') return R.assoc('options', R.assoc('animation', true, state.options), state)
  if (argument === '--font' || argument === '--output' || R.has(argument, optionFlags)) return R.assoc('pending', argument, state)
  if (R.startsWith('--', argument)) return R.assoc('error', `unknown option ${argument}`, state)
  if (state.input === undefined) return R.assoc('input', argument, state)
  return R.assoc('error', 'only one JSON input file is allowed', state)
}

/** @param {string[]} argumentsList */
export const commandArguments = (argumentsList) => {
  const initialState = { input: undefined, output: undefined, document: false, fonts: [], options: {}, pending: undefined, error: undefined }
  const state = R.reduce(argumentState, initialState, argumentsList)
  if (state.error !== undefined) return [false, state.error]
  if (state.pending !== undefined) return [false, `missing value for ${state.pending}`]
  if (state.input === undefined) return [false, 'a JSON input file or - is required']
  const options = R.isEmpty(state.fonts) ? state.options : R.assoc('fonts', state.fonts, state.options)
  return [true, { input: state.input, output: state.output, document: state.document, options }]
}

/** @param {{ type: string, issues?: { path: string, message: string }[] }} error */
const errorText = (error) => error.type === 'validation-error'
  ? R.join('\n', R.map((entry) => `${entry.path}: ${entry.message}`, error.issues))
  : 'could not render Bookshelf'

/** @param {string} fragment */
const standaloneDocument = (fragment) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Bookshelf</title></head><body>${fragment}</body></html>`

/**
 * Run the html-bookshelf command with explicit I/O for testability.
 *
 * @param {string[]} argumentsList
 * @param {{ stdin: string, stdout: (value: string) => void, stderr: (value: string) => void }} io
 */
export const runCommand = async (argumentsList, io) => {
  const parsed = commandArguments(argumentsList)
  if (!parsed[0]) {
    io.stderr(`html-bookshelf: ${parsed[1]}\n`)
    return 1
  }
  const { input, output, document, options } = parsed[1]
  let inputText
  try {
    inputText = input === '-' ? io.stdin : await readFile(input, 'utf8')
  } catch (error) {
    io.stderr(`html-bookshelf: could not read ${input}: ${error instanceof Error ? error.message : String(error)}\n`)
    return 1
  }
  let books
  try {
    books = JSON.parse(inputText)
  } catch (error) {
    io.stderr(`html-bookshelf: invalid JSON: ${error instanceof Error ? error.message : String(error)}\n`)
    return 1
  }
  const result = bookshelfFragment(books, options)
  if (!result[0]) {
    io.stderr(`html-bookshelf: ${errorText(result[1])}\n`)
    return 1
  }
  const outputText = document ? standaloneDocument(result[1]) : result[1]
  if (output === undefined) {
    io.stdout(outputText)
  } else {
    try {
      await writeFile(output, outputText)
    } catch (error) {
      io.stderr(`html-bookshelf: could not write ${output}: ${error instanceof Error ? error.message : String(error)}\n`)
      return 1
    }
  }
  return 0
}

if (process.argv[1] !== undefined && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const stdin = await new Promise((resolveInput, reject) => {
    let text = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (chunk) => { text += chunk })
    process.stdin.on('end', () => resolveInput(text))
    process.stdin.on('error', reject)
  })
  process.exitCode = await runCommand(R.slice(2, R.length(process.argv), process.argv), {
    stdin,
    stdout: (value) => process.stdout.write(value),
    stderr: (value) => process.stderr.write(value)
  })
}
