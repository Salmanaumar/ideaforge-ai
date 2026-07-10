
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { DuckDBStore } from "@mastra/duckdb";
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


export const mastra: Mastra = await (async () => {
  const observabilityStore = await new DuckDBStore().getStore('observability');

  return new Mastra({
    workflows: { weatherWorkflow, ideaValidationWorkflow },
    agents: { weatherAgent, ideaIntakeAgent, marketResearchAgent ,competitorIntelAgent, validationAgent, businessStrategyAgent, mvpPlannerAgent, riskAssessmentAgent, founderReportAgent },
    scorers: { toolCallAppropriatenessScorer, completenessScorer, translationScorer },
    storage: new MastraCompositeStore({
      id: 'composite-storage',
      default: new LibSQLStore({
        id: "mastra-storage",
        url: "file:./mastra.db",
      }),
      domains: {
        observability: observabilityStore,
      }
    }),
    logger: new PinoLogger({
      name: 'Mastra',
      level: 'info',
    }),
    observability: new Observability({
      configs: {
        default: {
          serviceName: 'mastra',
          exporters: [
            new MastraStorageExporter(), // Persists observability events to Mastra Storage
            new MastraPlatformExporter(), // Sends observability events to Mastra Platform (if MASTRA_PLATFORM_ACCESS_TOKEN is set)
          ],
          spanOutputProcessors: [
            new SensitiveDataFilter(), // Redacts sensitive data like passwords, tokens, keys
          ],
        },
      },
    }),
    server: {
  apiRoutes: [
    registerApiRoute('/qdrant-stats', {
      method: 'GET',
      handler: async (c: any) => {
        const stats = await getQdrantStats()
        return c.json(stats)
      },
    }),
  ],
},
  });
})();