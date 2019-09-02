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

export { cleanDirectory }
