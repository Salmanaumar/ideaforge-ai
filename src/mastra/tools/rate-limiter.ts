const requestLog = new Map<string, number[]>()

const WINDOW_MS = 60_000 // 1 minute
const MAX_REQUESTS = 10 // max 10 requests per minute per IP

export function isRateLimited(identifier: string): boolean {
  const now = Date.now()
  const timestamps = requestLog.get(identifier) || []
  const recent = timestamps.filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_REQUESTS) {
    requestLog.set(identifier, recent)
    return true
  }

  recent.push(now)
  requestLog.set(identifier, recent)
  return false
}