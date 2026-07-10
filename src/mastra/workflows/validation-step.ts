import { createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { mastra } from '../index'

export const validationStep = createStep({
  id: 'validation-step',
  inputSchema: z.object({
    ideaBrief: z.object({
      industry: z.string(),
      targetUsers: z.string(),
      problemCategory: z.string(),
      rawIdea: z.string(),
    }),
    marketResearch: z.object({
      demandSignals: z.string(),
      industryTrends: z.string(),
      growthOpportunity: z.string(),
    }),
    competitorIntel: z.object({
      competitors: z.array(z.object({
        name: z.string(),
        strength: z.string(),
        weakness: z.string(),
      })),
      marketGaps: z.string(),
    }),
  }),
  outputSchema: z.object({
    score: z.number(),
    breakdown: z.object({
      problemSeverity: z.object({ weight: z.number(), value: z.number(), reason: z.string() }),
      demand: z.object({ weight: z.number(), value: z.number(), reason: z.string() }),
      feasibility: z.object({ weight: z.number(), value: z.number(), reason: z.string() }),
      differentiation: z.object({ weight: z.number(), value: z.number(), reason: z.string() }),
    }),
    recommendation: z.string(),
  }),
  execute: async ({ inputData }) => {
    const agent = mastra.getAgentById('validation-agent')
    const prompt = `
Idea Brief: ${JSON.stringify(inputData.ideaBrief)}
Market Research: ${JSON.stringify(inputData.marketResearch)}
Competitor Intel: ${JSON.stringify(inputData.competitorIntel)}
    `
    const response = await agent.generate(prompt)
    return JSON.parse(response.text)
  },
})