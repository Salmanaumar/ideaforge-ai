import { createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { checkSafety } from '../safety/enkrypt-gate'

export const safetyCheckStep = createStep({
  id: 'safety-check-step',
  inputSchema: z.object({
    reportText: z.string(),
  }),
  outputSchema: z.object({
    passed: z.boolean(),
    details: z.any(),
  }),
  execute: async ({ inputData }) => {
    const result = await checkSafety(inputData.reportText)
    return { passed: result.passed, details: result.raw }
  },
})