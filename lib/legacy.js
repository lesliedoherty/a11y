import * as fs from 'fs'
import * as path from 'path'
import { enhanceResults } from './resultHelper'

const walk = (directory, filepaths = []) => {
  const files = fs.readdirSync(directory)

  for (const filename of files) {
    const filepath = path.join(directory, filename)

    if (path.extname(filename) === '.json') {
      filepaths.push(filepath)
    } else if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, filepaths)
    }
  }

  return filepaths
}

const buildFilesList = (dirs) => {
  let files = []

  dirs.forEach(dir => {
    files = [...files, ...walk(dir)]
  })

  return files
}

/**
 * Update legacy JSON data to include result summary
 *
 * @param {object} legacyJson
 *
 * @returns {object}
 */
const updateJson = (legacyJson) => {
  return enhanceResults(legacyJson.metadata, legacyJson.result)
}

const modernize = (dirs) => {
  const files = buildFilesList(dirs)

  files.forEach(file => {
    console.log(`⚗️ Modernising ${file}...`)

    const legacyJson = JSON.parse(fs.readFileSync(file))
    const modernJson = updateJson(legacyJson)

    fs.writeFileSync(file, JSON.stringify(modernJson))
  })
}

export { modernize, buildFilesList }
