export async function tracedAgentCall<T>(
  stepName: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now()
  console.log(`[TRACE] Starting: ${stepName}`)
  try {
    const result = await fn()
    const durationMs = Date.now() - start
    console.log(`[TRACE] Completed: ${stepName} | Duration: ${durationMs}ms`)
    return result
  } catch (error) {
    const durationMs = Date.now() - start
    console.log(`[TRACE] Failed: ${stepName} | Duration: ${durationMs}ms | Error: ${error}`)
    throw error
  }
}