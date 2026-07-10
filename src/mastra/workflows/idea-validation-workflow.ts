import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'
import { searchMemory, storeMemory } from '../memory/embeddings'
import { checkSafety } from '../safety/enkrypt-gate'
import { tracedAgentCall } from '../observability/tracer'

const ideaIntakeStep = createStep({
  id: 'idea-intake',
  inputSchema: z.object({ rawIdea: z.string() }),
  outputSchema: z.object({
    industry: z.string(),
    targetUsers: z.string(),
    problemCategory: z.string(),
    rawIdea: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra.getAgentById('idea-intake-agent')
    const response = await tracedAgentCall('idea-intake', () => agent.generate(inputData.rawIdea))
    return JSON.parse(response.text)
  },
})

const marketResearchStep = createStep({
  id: 'market-research',
  inputSchema: z.object({}).passthrough(),
  outputSchema: z.object({}).passthrough(),
  execute: async ({ inputData, mastra }) => {
    const query = `${inputData.industry} ${inputData.problemCategory}`
    const cached = await searchMemory('market_cache', query, 1)

    let result
    if (cached.length > 0 && cached[0].score > 0.75) {
      result = cached[0].payload as any
    } else {
      const agent = mastra.getAgentById('market-research-agent')
      const response = await tracedAgentCall('market-research', () =>
        agent.generate(`Industry: "${inputData.industry}", Problem: "${inputData.problemCategory}"`)
      )
      result = JSON.parse(response.text)
      await storeMemory('market_cache', Date.now(), query, { industry: inputData.industry, ...result })
    }

    return {
      ...inputData,
      demandSignals: result.demandSignals,
      industryTrends: result.industryTrends,
      growthOpportunity: result.growthOpportunity,
      marketSummary: result.summary,
    }
  },
})

const competitorIntelStep = createStep({
  id: 'competitor-intel',
  inputSchema: z.object({}).passthrough(),
  outputSchema: z.object({}).passthrough(),
  execute: async ({ inputData, mastra }) => {
    const query = `${inputData.industry} ${inputData.problemCategory}`
    const cached = await searchMemory('competitor_cache', query, 1)

    let result
    if (cached.length > 0 && cached[0].score > 0.75) {
      result = cached[0].payload as any
    } else {
      const agent = mastra.getAgentById('competitor-intel-agent')
      const response = await tracedAgentCall('competitor-intel', () =>
        agent.generate(`Industry: "${inputData.industry}", Problem: "${inputData.problemCategory}"`)
      )
      result = JSON.parse(response.text)
      await storeMemory('competitor_cache', Date.now(), query, { industry: inputData.industry, ...result })
    }

    return {
      ...inputData,
      competitors: result.competitors,
      marketGaps: result.marketGaps,
    }
  },
})

const validationStep = createStep({
  id: 'validation',
  inputSchema: z.object({}).passthrough(),
  outputSchema: z.object({
    score: z.number(),
    breakdown: z.any(),
    recommendation: z.string(),
    routePath: z.enum(['investor-track', 'refinement', 'pivot']),
  }).passthrough(),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra.getAgentById('validation-agent')
    const prompt = `
Idea Brief: ${JSON.stringify({ industry: inputData.industry, targetUsers: inputData.targetUsers, problemCategory: inputData.problemCategory, rawIdea: inputData.rawIdea })}
Market Research: ${JSON.stringify({ demandSignals: inputData.demandSignals, industryTrends: inputData.industryTrends, growthOpportunity: inputData.growthOpportunity })}
Competitor Intel: ${JSON.stringify({ competitors: inputData.competitors, marketGaps: inputData.marketGaps })}
    `
    const response = await tracedAgentCall('validation', () => agent.generate(prompt))
    const validation = JSON.parse(response.text) as {
      score: number
      breakdown: any
      recommendation: string
    }

    const score = validation.score
    const routePath = score > 80 ? ('investor-track' as const) : score >= 50 ? ('refinement' as const) : ('pivot' as const)

    return {
      ...inputData,
      score,
      breakdown: validation.breakdown,
      recommendation: validation.recommendation,
      routePath,
    }
  },
})

const businessStrategyStep = createStep({
  id: 'business-strategy',
  inputSchema: z.object({}).passthrough(),
  outputSchema: z.object({}).passthrough(),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra.getAgentById('business-strategy-agent')
    const prompt = `Idea: "${inputData.rawIdea}", Market Gaps: "${inputData.marketGaps}", Growth Opportunity: "${inputData.growthOpportunity}"`
    const response = await tracedAgentCall('business-strategy', () => agent.generate(prompt))
    const strategy = JSON.parse(response.text)
    return { ...inputData, revenueModel: strategy.revenueModel, pricingStrategy: strategy.pricingStrategy, goToMarketPlan: strategy.goToMarketPlan }
  },
})

const mvpPlannerStep = createStep({
  id: 'mvp-planner',
  inputSchema: z.object({}).passthrough(),
  outputSchema: z.object({}).passthrough(),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra.getAgentById('mvp-planner-agent')
    const prompt = `Idea: "${inputData.rawIdea}", Go-To-Market Plan: "${inputData.goToMarketPlan}"`
    const response = await tracedAgentCall('mvp-planner', () => agent.generate(prompt))
    const mvp = JSON.parse(response.text)
    return { ...inputData, phase1Core: mvp.phase1Core, phase2Growth: mvp.phase2Growth, phase3Scale: mvp.phase3Scale }
  },
})

const riskAssessmentStep = createStep({
  id: 'risk-assessment',
  inputSchema: z.object({}).passthrough(),
  outputSchema: z.object({}).passthrough(),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra.getAgentById('risk-assessment-agent')
    const prompt = `Idea: "${inputData.rawIdea}", Market Gaps: "${inputData.marketGaps}"`
    const response = await tracedAgentCall('risk-assessment', () => agent.generate(prompt))
    const risks = JSON.parse(response.text)
    return { ...inputData, businessRisks: risks.businessRisks, technicalRisks: risks.technicalRisks, marketRisks: risks.marketRisks }
  },
})

const founderReportStep = createStep({
  id: 'founder-report',
  inputSchema: z.object({}).passthrough(),
  outputSchema: z.object({
    reportMarkdown: z.string(),
    safetyPassed: z.boolean(),
    safetyDetails: z.any(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra.getAgentById('founder-report-agent')
    const response = await tracedAgentCall('founder-report', () =>
      agent.generate(`Compile a founder report from this data: ${JSON.stringify(inputData)}`)
    )
    const reportMarkdown = response.text
    const safety = await checkSafety(reportMarkdown)
    return { reportMarkdown, safetyPassed: safety.passed, safetyDetails: safety.raw }
  },
})

export const ideaValidationWorkflow = createWorkflow({
  id: 'idea-validation-workflow',
  inputSchema: z.object({ rawIdea: z.string() }),
  outputSchema: z.object({
    reportMarkdown: z.string(),
    safetyPassed: z.boolean(),
    safetyDetails: z.any(),
  }),
})
  .then(ideaIntakeStep)
  .then(marketResearchStep)
  .then(competitorIntelStep)
  .then(validationStep)
  .then(businessStrategyStep)
  .then(mvpPlannerStep)
  .then(riskAssessmentStep)
  .then(founderReportStep)
  .commit()