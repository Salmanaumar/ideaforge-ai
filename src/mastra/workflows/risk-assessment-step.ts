import { createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { mastra } from '../index'

export const riskAssessmentStep = createStep({
  id: 'risk-assessment-step',
  inputSchema: z.object({
    rawIdea: z.string(),
    marketGaps: z.string(),
  }),
  outputSchema: z.object({
    businessRisks: z.array(z.object({ risk: z.string(), mitigation: z.string() })),
    technicalRisks: z.array(z.object({ risk: z.string(), mitigation: z.string() })),
    marketRisks: z.array(z.object({ risk: z.string(), mitigation: z.string() })),
    summary: z.string(),
  }),
  execute: async ({ inputData }) => {
    const agent = mastra.getAgentById('risk-assessment-agent')
    const prompt = `Idea: "${inputData.rawIdea}", Market Gaps: "${inputData.marketGaps}"`
    const response = await agent.generate(prompt)
    return JSON.parse(response.text)
  },
})