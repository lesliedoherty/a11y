import { sumNodes } from './utils'

/**
 * Summarise the node counts in the given result JSON
 *
 * @param {object} resultJson
 *
 * @returns {object}
 */
const summarizeResults = (resultJson) => {
  return {
    violations: sumNodes(resultJson.violations),
    passes: sumNodes(resultJson.passes),
    incomplete: sumNodes(resultJson.incomplete),
    inapplicable: Array.isArray(resultJson.inapplicable) ? resultJson.inapplicable.length : 0
  }
}

/**
 * Wrap the test results, and supplement with metadata
 *
 * @param {object} testPage
 * @param {object} resultJson
 *
 * @returns {object}
 */
const enhanceResults = (testPage, resultJson) => {
  return {
    metadata: {
      ...testPage,
      ...summarizeResults(resultJson)
    },
    result: resultJson
  }
}

export {
  enhanceResults,
  summarizeResults
}
