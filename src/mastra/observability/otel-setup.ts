import { NodeSDK } from '@opentelemetry/sdk-node'
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { trace } from '@opentelemetry/api'

const sdk = new NodeSDK({
  serviceName: 'ideaforge-ai',
  spanProcessors: [new SimpleSpanProcessor(new ConsoleSpanExporter())],
})

sdk.start()

export const tracer = trace.getTracer('ideaforge-ai-tracer')