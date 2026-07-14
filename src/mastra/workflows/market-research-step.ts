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

        let cached: any[] = []
        try {
            cached = await searchMemory('market_cache', query, 1)
        } catch (err: any) {
            console.error('searchMemory failed:', err.message, err.cause)
            cached = []
        }

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

        const agent = mastra.getAgentById('market-research-agent' as any)
        let response
        try {
            response = await agent.generate(
                `Industry: "${industry}", Problem: "${problemCategory}"`
            )
        } catch (err: any) {
            console.error('agent.generate failed:', err.message, err.cause)
            throw err
        }

        const result = JSON.parse(response.text)

        try {
            await storeMemory('market_cache', Date.now(), query, {
                industry,
                problemCategory,
                ...result,
            })
        } catch (err: any) {
            console.error('storeMemory failed:', err.message, err.cause)
        }

        return { ...result, source: 'fresh' as const }
    },
})