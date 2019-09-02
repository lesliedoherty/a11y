#! /usr/bin/env node --no-warnings

import express from 'express'
import { FILE_PATHS } from './lib/constants'
import * as runner from './lib/runner'
import * as storage from './lib/storage'
import * as path from 'path'
import * as df from 'date-format'

const app = express()
const port = 3000

app.use(express.json())

/**
 * Build the path to the JSON results of a test started at this moment in time
 *
 * @returns {string}
 */
const buildResultsPath = () => {
  return path.join(
    FILE_PATHS.TEST_RESULTS,
    df.asString('yyyy-MM-dd-hhmm', df.now())
  )
}

/**
 * Get the URLs to test
 *
 * @param {string} filename The URLs list file
 *
 * @returns {array}
 */
const getTestPages = async (filename) => {
  const urlsFile = path.join(FILE_PATHS.TEST_URLS, `${filename}`)
  return storage.loadTestPages(urlsFile)
}

const sleep = async (maximum) => {
  return new Promise(resolve => setTimeout(resolve, Math.random() * maximum))
}

/**
 * Test the given URLs
 *
 * @param {array} testPages
 */
const runPageTests = async (testPages) => {
  const outputPath = buildResultsPath()
  const totalCount = testPages.length
  let doneCount = 0

  for await (const testPage of testPages) {
    const resultJson = await runner.checkUrl(testPage.url)
    await storage.saveResult(outputPath, testPage, resultJson)
    console.log(`[${++doneCount}/${totalCount}] Finished testing ${testPage.url}`)

    // Rudimentary attempt to avoid rate-limiting
    await sleep(3)
  }
}

app.post('/tests', async (req, res) => {
  let testPages = []
  const pagesFile = req.body.filename

  try {
    testPages = await getTestPages(req.body.filename)
  } catch (err) {
    res.status(422).json({ message: `Unknown test pages file "${pagesFile}` })
    return
  }

  res.status(200).json({ pages: testPages })

  await runPageTests(testPages)
  console.log('👍 All done')
})

app.listen(port, () => console.log(`Easally is listening on port ${port}!`))
