/**
 * Generate a unique idempotency key for booking creation
 * Format: userId_timestamp_random
 */
export function generateIdempotencyKey(userId: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `${userId}_${timestamp}_${random}`
}
