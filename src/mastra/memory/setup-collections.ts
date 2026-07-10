import 'dotenv/config'
import { ensureCollection } from './qdrant-client'

async function main() {
  await ensureCollection('market_cache')
  await ensureCollection('founder_memory')
  await ensureCollection('competitor_cache')
  console.log('All collections ready.')
}

main()