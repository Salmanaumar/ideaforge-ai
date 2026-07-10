import { createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { mastra } from '../index'

export const founderReportStep = createStep({
  id: 'founder-report-step',
  inputSchema: z.object({
    allData: z.any(),
  }),
  outputSchema: z.object({
    reportMarkdown: z.string(),
  }),
  execute: async ({ inputData }) => {
    const agent = mastra.getAgentById('founder-report-agent')
    const response = await agent.generate(
      `Compile a founder report from this data: ${JSON.stringify(inputData.allData)}`
    )
    return { reportMarkdown: response.text }
  },
})