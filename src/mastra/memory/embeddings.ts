import { qdrant } from './qdrant-client'

const EMBEDDING_MODEL = 'sentence-transformers/all-minilm-l6-v2'

export async function storeMemory(
  collectionName: string,
  id: number | string,
  text: string,
  payload: Record<string, any>
) {
  await qdrant.upsert(collectionName, {
    points: [
      {
        id,
        vector: { text, model: EMBEDDING_MODEL } as any,
        payload,
      },
    ],
  })
}

export async function searchMemory(collectionName: string, queryText: string, limit = 5) {
  const results = await qdrant.query(collectionName, {
    query: { text: queryText, model: EMBEDDING_MODEL } as any,
    with_payload: true,
    limit,
  })
  return results.points
}