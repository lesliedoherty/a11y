import * as path from 'path'

const storagePath = path.join(__dirname, '..', 'storage')

const FILE_PATHS = {
  TEST_URLS: path.join(storagePath, 'urls'),
  TEST_RESULTS: path.join(storagePath, 'results')
}

export { FILE_PATHS }
