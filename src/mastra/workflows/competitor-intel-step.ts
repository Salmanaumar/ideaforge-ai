import { createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { mastra } from '../index'
import { searchMemory, storeMemory } from '../memory/embeddings'

export const competitorIntelStep = createStep({
  id: 'competitor-intel-step',
  inputSchema: z.object({
    industry: z.string(),
    problemCategory: z.string(),
  }),
  outputSchema: z.object({
    competitors: z.array(z.object({
      name: z.string(),
      strength: z.string(),
      weakness: z.string(),
    })),
    marketGaps: z.string(),
    summary: z.string(),
    source: z.enum(['cache', 'fresh']),
  }),
  execute: async ({ inputData }) => {
    const { industry, problemCategory } = inputData
    const query = `${industry} ${problemCategory}`

    const cached = await searchMemory('competitor_cache', query, 1)

    if (cached.length > 0 && cached[0].score > 0.75) {
      const payload = cached[0].payload as any
      return {
        competitors: payload.competitors,
        marketGaps: payload.marketGaps,
        summary: payload.summary,
        source: 'cache' as const,
      }
    }

    const agent = mastra.getAgentById('competitor-intel-agent')
    const response = await agent.generate(
      `Industry: "${industry}", Problem: "${problemCategory}"`
    )
    const result = JSON.parse(response.text)

    await storeMemory('competitor_cache', Date.now(), query, {
      industry,
      problemCategory,
      ...result,
    })

    return { ...result, source: 'fresh' as const }
  },
})