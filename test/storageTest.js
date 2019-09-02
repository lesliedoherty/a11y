/* eslint-env mocha */

import * as fs from 'fs'
import * as path from 'path'
import { assert } from 'chai'
import * as subject from '../lib/storage'
import { cleanDirectory } from '../lib/utils'

const baseFilepath = path.join(__dirname, 'support', 'storage.js')
const baseInputFilepath = path.join(baseFilepath, 'input')
const baseOutputFilepath = path.join(baseFilepath, 'output')

describe('input.js', () => {
  afterEach('clean up results directory', async () => {
    await cleanDirectory(path.join(baseFilepath, 'output'))
  })

  describe('#loadPagesList', () => {
    it('returns an array of pages to process', async () => {
      const filename = path.join(baseInputFilepath, 'pages.txt')
      const result = await subject.loadTestPages(filename)

      assert.equal(3, result.length)

      assert.deepEqual(result[0], { url: 'https://www.google.com/', visits: 12345 })
      assert.deepEqual(result[1], { url: 'https://www.duckduckgo.com/', visits: 23456 })
      assert.deepEqual(result[2], { url: 'https://www.startpage.com/', visits: 34567 })
    })

    it('trims whitespace', async () => {
      const filename = path.join(baseInputFilepath, 'pages_with_whitespace.txt')
      const result = await subject.loadTestPages(filename)

      assert.equal(3, result.length)

      assert.deepEqual(result[0], { url: 'https://www.google.com/', visits: 12345 })
      assert.deepEqual(result[1], { url: 'https://www.duckduckgo.com/', visits: 23456 })
      assert.deepEqual(result[2], { url: 'https://www.startpage.com/', visits: 34567 })
    })

    it('ignores empty lines in the input file', async () => {
      const filename = path.join(baseInputFilepath, 'pages_with_empty_lines.txt')
      const result = await subject.loadTestPages(filename)

      assert.equal(3, result.length)
    })

    it('ignores lines with missing data', async () => {
      const filename = path.join(baseInputFilepath, 'pages_with_missing_data.txt')
      const result = await subject.loadTestPages(filename)

      assert.equal(3, result.length)
    })

    it('ignores duplicate pages', async () => {
      const filename = path.join(baseInputFilepath, 'pages_with_duplicates.txt')
      const result = await subject.loadTestPages(filename)

      assert.equal(4, result.length)

      assert.deepEqual(result[0], { url: 'https://www.one.com/', visits: 12345 })
      assert.deepEqual(result[1], { url: 'https://www.two.com/', visits: 23456 })
      assert.deepEqual(result[2], { url: 'https://www.three.com/', visits: 34567 })
      assert.deepEqual(result[3], { url: 'https://www.two.com/', visits: 45678 })
    })
  })

  describe('#saveResult', () => {
    it('saves JSON to a result file', async () => {
      const page = { url: 'https://www.tableau.com/about-us/careers', visits: 12345 }
      const resultJson = { success: true }

      await subject.saveResult(baseOutputFilepath, page, resultJson)

      assert.isTrue(fs.existsSync(path.join(baseOutputFilepath, 'about-us', 'careers.json')))
    })

    it('uses "index" as the path for a root URL', async () => {
      const page = { url: 'https://www.tableau.com/', visits: 12345 }
      const resultJson = { success: true }

      await subject.saveResult(baseOutputFilepath, page, resultJson)

      assert.isTrue(fs.existsSync(path.join(baseOutputFilepath, 'index.json')))
    })
  })
})
