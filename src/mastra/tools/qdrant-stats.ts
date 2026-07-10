import { qdrant } from '../memory/qdrant-client'
console.log('qdrant-stats.ts loaded')
export async function getQdrantStats() {
  const collections = ['market_cache', 'founder_memory', 'competitor_cache']
  const stats = await Promise.all(
    collections.map(async (name) => {
      const info = await qdrant.getCollection(name)
      return { name, count: info.points_count || 0 }
    })
  )
  const total = stats.reduce((sum, c) => sum + c.count, 0)
  return { collections: stats, total }
}