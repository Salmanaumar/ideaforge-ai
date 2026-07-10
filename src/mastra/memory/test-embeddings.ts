import 'dotenv/config'
import { storeMemory, searchMemory } from './embeddings'

async function main() {
  await storeMemory('market_cache', 1, 'FinTech fraud detection for small merchants in India', {
    industry: 'FinTech',
    note: 'test entry',
  })
  console.log('Stored test memory.')

  const results = await searchMemory('market_cache', 'payment fraud prevention')
  console.log('Search results:', JSON.stringify(results, null, 2))
}

main()