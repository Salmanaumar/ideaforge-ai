import { createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { mastra } from '../index'

export const businessStrategyStep = createStep({
  id: 'business-strategy-step',
  inputSchema: z.object({
    rawIdea: z.string(),
    marketGaps: z.string(),
    growthOpportunity: z.string(),
  }),
  outputSchema: z.object({
    revenueModel: z.string(),
    pricingStrategy: z.string(),
    goToMarketPlan: z.string(),
    summary: z.string(),
  }),
  execute: async ({ inputData }) => {
    const agent = mastra.getAgentById('business-strategy-agent')
    const prompt = `Idea: "${inputData.rawIdea}", Market Gaps: "${inputData.marketGaps}", Growth Opportunity: "${inputData.growthOpportunity}"`
    const response = await agent.generate(prompt)
    return JSON.parse(response.text)
  },
})