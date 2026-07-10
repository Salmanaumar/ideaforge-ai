import { createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { mastra } from '../index'
import { searchMemory, storeMemory } from '../memory/embeddings'

export const marketResearchStep = createStep({
    id: 'market-research-step',
    inputSchema: z.object({
        industry: z.string(),
        problemCategory: z.string(),
    }),
    outputSchema: z.object({
        demandSignals: z.string(),
        industryTrends: z.string(),
        growthOpportunity: z.string(),
        summary: z.string(),
        source: z.enum(['cache', 'fresh']),
    }),
    execute: async ({ inputData }) => {
        const { industry, problemCategory } = inputData
        const query = `${industry} ${problemCategory}`

        // Step A: check Qdrant cache first
        const cached = await searchMemory('market_cache', query, 1)

        if (cached.length > 0 && cached[0].score > 0.75) {
            const payload = cached[0].payload as any
            return {
                demandSignals: payload.demandSignals,
                industryTrends: payload.industryTrends,
                growthOpportunity: payload.growthOpportunity,
                summary: payload.summary,
                source: 'cache' as const,
            }
        }

        // Step B: nothing good cached, generate fresh research
        const agent = mastra.getAgentById('market-research-agent' as any)
        const response = await agent.generate(
            `Industry: "${industry}", Problem: "${problemCategory}"`
        )
        const result = JSON.parse(response.text)

        // Step C: store it in Qdrant for next time
        await storeMemory('market_cache', Date.now(), query, {
            industry,
            problemCategory,
            ...result,
        })

        return { ...result, source: 'fresh' as const }
    },
})