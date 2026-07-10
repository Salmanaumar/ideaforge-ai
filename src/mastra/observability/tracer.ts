import './otel-setup'
import { tracer } from './otel-setup'
import { SpanStatusCode } from '@opentelemetry/api'

export async function tracedAgentCall<T>(
  stepName: string,
  fn: () => Promise<T>
): Promise<T> {
  return tracer.startActiveSpan(stepName, async (span) => {
    const start = Date.now()
    try {
      const result = await fn()
      span.setAttribute('duration_ms', Date.now() - start)
      span.setStatus({ code: SpanStatusCode.OK })
      return result
    } catch (error: any) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
      span.recordException(error)
      throw error
    } finally {
      span.end()
    }
  })
}