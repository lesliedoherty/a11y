import * as path from 'path'
import { modernize } from './lib/legacy'

const storagePath = path.join(__dirname, 'storage')

const dirs = [
  path.join(storagePath, 'results', 'legacy-001')
]

console.log('⏳ Updating legacy JSON...')
modernize(dirs)
console.log('👍 Welcome to the modern world')
