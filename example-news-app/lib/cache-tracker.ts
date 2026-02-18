export interface CacheEntryMeta {
  key: string
  tags: string[]
  profile: string
  computedAt: number
  itemCount?: number
}

export interface CacheLifeProfile {
  stale: number
  revalidate: number
  expire: number | null
}

/**
 * Approximate Next.js built-in cacheLife profile values (in seconds).
 * stale: how long the client can use the value before revalidating
 * revalidate: interval at which the server revalidates in the background
 * expire: hard max-age; null means it never hard-expires
 */
export const CACHE_LIFE_PROFILES: Record<string, CacheLifeProfile> = {
  seconds: { stale: 0, revalidate: 1, expire: 60 },
  minutes: { stale: 300, revalidate: 300, expire: 3600 },
  hours: { stale: 3600, revalidate: 3600, expire: 86400 },
  days: { stale: 86400, revalidate: 86400, expire: 604800 },
  weeks: { stale: 604800, revalidate: 604800, expire: 2592000 },
  max: { stale: 2592000, revalidate: 2592000, expire: null },
}

/**
 * Module-level store — persists for the lifetime of the server process.
 * Only populated when a cached component actually executes its body (cache miss / revalidation).
 */
const store = new Map<string, CacheEntryMeta>()

export function trackCacheEntry(entry: Omit<CacheEntryMeta, 'computedAt'>): void {
  store.set(entry.key, { ...entry, computedAt: Date.now() })
}

export function getCacheEntries(): CacheEntryMeta[] {
  return Array.from(store.values()).sort((a, b) => b.computedAt - a.computedAt)
}

export function getCacheStatus(
  entry: CacheEntryMeta,
  now = Date.now(),
): 'fresh' | 'stale' | 'expired' | 'unknown' {
  const profile = CACHE_LIFE_PROFILES[entry.profile]
  if (!profile) return 'unknown'
  const ageMs = now - entry.computedAt
  const ageS = ageMs / 1000
  if (profile.expire !== null && ageS >= profile.expire) return 'expired'
  if (ageS >= profile.stale) return 'stale'
  return 'fresh'
}
