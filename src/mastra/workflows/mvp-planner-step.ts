import { createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { mastra } from '../index'

export const mvpPlannerStep = createStep({
  id: 'mvp-planner-step',
  inputSchema: z.object({
    rawIdea: z.string(),
    goToMarketPlan: z.string(),
  }),
  outputSchema: z.object({
    phase1Core: z.object({ title: z.string(), features: z.array(z.string()) }),
    phase2Growth: z.object({ title: z.string(), features: z.array(z.string()) }),
    phase3Scale: z.object({ title: z.string(), features: z.array(z.string()) }),
    summary: z.string(),
  }),
  execute: async ({ inputData }) => {
    const agent = mastra.getAgentById('mvp-planner-agent')
    const prompt = `Idea: "${inputData.rawIdea}", Go-To-Market Plan: "${inputData.goToMarketPlan}"`
    const response = await agent.generate(prompt)
    return JSON.parse(response.text)
  },
})