'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'
import { revalidateCacheTag, revalidateAllCacheTags } from '../actions'
import type { CacheEntryMeta } from '@/lib/cache-tracker'
import { CACHE_LIFE_PROFILES } from '@/lib/cache-tracker'

interface Props {
  entries: CacheEntryMeta[]
  now: number
}

function getStatus(entry: CacheEntryMeta, now: number) {
  const profile = CACHE_LIFE_PROFILES[entry.profile]
  if (!profile) return 'unknown'
  const ageS = (now - entry.computedAt) / 1000
  if (profile.expire !== null && ageS >= profile.expire) return 'expired'
  if (ageS >= profile.stale) return 'stale'
  return 'fresh'
}

function formatRelative(ms: number): string {
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ${s % 60}s ago`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m ago`
}

function formatTimeLeft(untilMs: number, now: number): string {
  const diff = untilMs - now
  if (diff <= 0) return 'now'
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ${s % 60}s`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    fresh: 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/60',
    stale: 'bg-amber-900/50 text-amber-300 border border-amber-700/60',
    expired: 'bg-red-900/50 text-red-300 border border-red-700/60',
    unknown: 'bg-ink-800 text-ink-400 border border-ink-700',
  }
  const dots: Record<string, string> = {
    fresh: 'bg-emerald-400',
    stale: 'bg-amber-400',
    expired: 'bg-red-400',
    unknown: 'bg-ink-500',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${styles[status] ?? styles.unknown}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status] ?? dots.unknown}`} aria-hidden />
      {status.toUpperCase()}
    </span>
  )
}

export function ExplorerClient({ entries, now: initialNow }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const id = setInterval(() => {
      startTransition(() => router.refresh())
    }, 5000)
    return () => clearInterval(id)
  }, [router])

  function handleRevalidateTag(tag: string) {
    startTransition(async () => {
      await revalidateCacheTag(tag)
      router.refresh()
    })
  }

  function handleRevalidateAll() {
    startTransition(async () => {
      await revalidateAllCacheTags()
      router.refresh()
    })
  }

  const now = initialNow

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-10 text-center">
        <p className="text-ink-400">No cache entries tracked yet.</p>
        <p className="mt-2 text-sm text-ink-500">
          Visit the{' '}
          <a href="/" className="text-accent hover:text-accent-light underline underline-offset-2">
            home page
          </a>{' '}
          first to populate the cache, then come back.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-400">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'} tracked · auto-refreshes every 5s
          {isPending && <span className="ml-2 text-ink-500">refreshing…</span>}
        </p>
        <button
          onClick={handleRevalidateAll}
          disabled={isPending}
          className="rounded-md bg-accent/20 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/30 disabled:opacity-50 transition-colors"
        >
          Revalidate all
        </button>
      </div>

      {entries.map((entry) => {
        const profile = CACHE_LIFE_PROFILES[entry.profile]
        const status = getStatus(entry, now)
        const ageMs = now - entry.computedAt
        const freshUntil = entry.computedAt + (profile?.stale ?? 0) * 1000
        const expiresAt = profile?.expire != null ? entry.computedAt + profile.expire * 1000 : null

        return (
          <div
            key={entry.key}
            className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-5 space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink-100">{entry.key}</h2>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded bg-ink-800 px-2 py-0.5 font-mono text-xs text-ink-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <StatusBadge status={status} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              <Stat label="Profile">
                <span className="font-mono text-accent">{entry.profile}</span>
              </Stat>
              <Stat label="Last computed">
                <span title={new Date(entry.computedAt).toISOString()}>
                  {formatRelative(ageMs)}
                </span>
                <span className="block text-xs text-ink-500 font-mono">
                  {new Date(entry.computedAt).toLocaleTimeString()}
                </span>
              </Stat>
              <Stat label="Fresh until">
                {status === 'fresh' ? (
                  <span className="text-emerald-300">
                    {formatTimeLeft(freshUntil, now)} left
                  </span>
                ) : (
                  <span className="text-amber-300">passed</span>
                )}
                <span className="block text-xs text-ink-500 font-mono">
                  {new Date(freshUntil).toLocaleTimeString()}
                </span>
              </Stat>
              <Stat label="Expires at">
                {expiresAt != null ? (
                  <>
                    <span>{formatTimeLeft(expiresAt, now)} left</span>
                    <span className="block text-xs text-ink-500 font-mono">
                      {new Date(expiresAt).toLocaleTimeString()}
                    </span>
                  </>
                ) : (
                  <span className="text-ink-500">never</span>
                )}
              </Stat>
              {entry.itemCount != null && (
                <Stat label="Items cached">
                  <span>{entry.itemCount}</span>
                </Stat>
              )}
              {profile && (
                <Stat label="Stale after">
                  <span>{profile.stale}s ({Math.round(profile.stale / 60)}m)</span>
                </Stat>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {entry.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleRevalidateTag(tag)}
                  disabled={isPending}
                  className="rounded-md border border-ink-700 bg-ink-800/50 px-3 py-1 text-xs text-ink-300 hover:border-accent/50 hover:text-accent disabled:opacity-50 transition-colors"
                >
                  Revalidate <code className="font-mono">{tag}</code>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-ink-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink-200">{children}</dd>
    </div>
  )
}
