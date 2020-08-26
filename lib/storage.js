import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import * as url from 'url'
import { promisify } from 'util'

/**
 * Convert the given input string into a "test page" object
 *
 * If the input data is invalid, return false
 *
 * @param {string} line
 *
 * @returns {object|false}
 */
const parsePageLine = (line) => {
  let pageUrl
  const parts = line.split(',').map(part => part.trim()).filter(part => part)

  if (parts.length !== 2) {
    return false
  }

  if (isNaN(parts[0])) {
    return false
  }

  try {
    pageUrl = new url.URL(parts[1])
  } catch (TypeError) {
    return false
  }

  return { url: pageUrl.toString(), visits: parseInt(parts[0]) }
}

/**
 * Load and parse the URL strings from the specified files
 *
 * Remove duplicates and empty lines.
 *
 * @param {string} filename
 * @returns {array}
 */
const loadTestPages = async (filename) => {
  const stream = fs.createReadStream(filename)
  const rli = readline.createInterface({ input: stream })
  const pages = []

  for await (const page of rli) {
    const parsed = parsePageLine(page)
    parsed && pages.push(parsed)
  }

  const deduped = [...new Set(pages.map(page => JSON.stringify(page)))]

  return deduped.map(page => JSON.parse(page))
}

const buildFilename = (testUrl) => {
  const urlPath = new url.URL(testUrl).pathname
  const urlSegments = urlPath.split('/').filter(segment => segment)
  return urlSegments.length ? path.join(...urlSegments) + '.json' : 'index.json'
}

/**
 * Save test result JSON to a file, named after the tested URL
 *
 * @param {string} filepath
 * @param {object} testPage
 * @param {json} resultJson
 */
const saveResult = async (filepath, testPage, resultJson) => {
  const mkdir = promisify(fs.mkdir)
  const writeFile = promisify(fs.writeFile)
  const outputFile = path.join(filepath, buildFilename(testPage.url))

  try {
    await mkdir(path.dirname(outputFile), { recursive: true })

    await writeFile(outputFile, JSON.stringify({
      metadata: testPage,
      result: resultJson
    }))

    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export { loadTestPages, saveResult }
