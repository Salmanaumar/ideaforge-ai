import { QdrantClient } from '@qdrant/js-client-rest'

export const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
})

export async function ensureCollection(collectionName: string) {
  const collections = await qdrant.getCollections()
  const exists = collections.collections.some(c => c.name === collectionName)

  if (!exists) {
    await qdrant.createCollection(collectionName, {
      vectors: { size: 384, distance: 'Cosine' },
    })
    console.log(`Created Qdrant collection: ${collectionName}`)
  } else {
    console.log(`Collection already exists: ${collectionName}`)
  }
}