import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { MastraCompositeStore } from '@mastra/core/storage';
import { Observability, MastraStorageExporter, MastraPlatformExporter, SensitiveDataFilter } from '@mastra/observability';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { ideaIntakeAgent } from './agents/idea-intake-agent';
import { toolCallAppropriatenessScorer, completenessScorer, translationScorer } from './scorers/weather-scorer';
import { marketResearchAgent } from './agents/market-research-agent';
import { competitorIntelAgent } from './agents/competitor-intel-agent';
import { validationAgent } from './agents/validation-agent';
import { businessStrategyAgent } from './agents/business-strategy-agent';
import { mvpPlannerAgent } from './agents/mvp-planner-agent';
import { riskAssessmentAgent } from './agents/risk-assessment-agent';
import { founderReportAgent } from './agents/founder-report-agent';
import { ideaValidationWorkflow } from './workflows/idea-validation-workflow';
import { getQdrantStats } from './tools/qdrant-stats';
import { registerApiRoute } from '@mastra/core/server';
import { isRateLimited } from './tools/rate-limiter';

export const mastra = new Mastra({
  workflows: { weatherWorkflow, ideaValidationWorkflow },
  agents: { weatherAgent, ideaIntakeAgent, marketResearchAgent, competitorIntelAgent, validationAgent, businessStrategyAgent, mvpPlannerAgent, riskAssessmentAgent, founderReportAgent },
  scorers: { toolCallAppropriatenessScorer, completenessScorer, translationScorer },
  storage: new MastraCompositeStore({
    id: 'composite-storage',
    default: new LibSQLStore({
      id: "mastra-storage",
      url: "file:./mastra.db",
    }),
    domains: {
      observability: new MastraStorageExporter(),
    }
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  // @ts-ignore — Mastra type definitions mismatch in this scaffold version (flush signature), does not affect runtime
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'mastra',
        exporters: [
          new MastraStorageExporter(),
          new MastraPlatformExporter(),
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(),
        ],
      },
    },
  }),
  server: {
    apiRoutes: [
      registerApiRoute('/qdrant-stats', {
        method: 'GET',
        handler: async (c: any) => {
          const identifier = c.req.header('x-forwarded-for') || 'anonymous';
          if (isRateLimited(identifier)) {
            return c.json({ error: 'Rate limit exceeded. Try again in a minute.' }, 429);
          }
          const stats = await getQdrantStats();
          return c.json(stats);
        },
      }),
    ],
  },
});