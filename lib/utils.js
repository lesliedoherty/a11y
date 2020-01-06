import * as fs from 'fs'
import * as path from 'path'

/**
 * Recursively delete a filesystem directory
 *
 * @param {string} fsPath
 */
const cleanDirectory = (fsPath) => {
  let itemStats

  try {
    if (!fs.statSync(fsPath).isDirectory()) {
      return
    }
  } catch (err) {
    return
  }

  fs.readdirSync(fsPath).forEach((fsItem) => {
    const fullPath = path.join(fsPath, fsItem)

    try {
      itemStats = fs.statSync(fullPath)
    } catch (err) {
      return
    }

    itemStats.isDirectory() ? cleanDirectory(fullPath) : fs.unlinkSync(fullPath)
  })

  fs.rmdirSync(fsPath)
}

/**
 * Calculate the total number of "node" elements in the given array of rules
 *
 * @param {array} rules
 *
 * @returns int
 */
const sumNodes = (rules) => {
  if (Array.isArray(rules) !== true) {
    return 0
  }

  return rules.reduce((total, rule) => {
    return Array.isArray(rule.nodes) ? total + rule.nodes.length : total
  }, 0)
}

export {
  cleanDirectory,
  sumNodes
}
