import { Suspense } from 'react'
import { CachedNewsFeed } from '@/components/CachedNewsFeed'
import { CachedHeadlines } from '@/components/CachedHeadlines'
import { UncachedNewsFeed } from '@/components/UncachedNewsFeed'
import { UncachedHeadlines } from '@/components/UncachedHeadlines'
import { CacheToggle } from '@/components/CacheToggle'

function FeedSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-ink-700/60 bg-ink-900/40 p-5 animate-pulse"
        >
          <div className="h-3 w-16 rounded bg-ink-600" />
          <div className="mt-3 h-5 w-full rounded bg-ink-600" />
          <div className="mt-2 h-4 w-4/5 rounded bg-ink-700" />
          <div className="mt-2 h-4 w-2/3 rounded bg-ink-700" />
          <div className="mt-3 h-3 w-20 rounded bg-ink-700" />
        </div>
      ))}
    </div>
  )
}

type SearchParams = Promise<{ cache?: string }>

/**
 * Reads searchParams (dynamic) inside Suspense so the static shell renders immediately.
 * With cacheComponents enabled, dynamic data must not block the initial render.
 */
async function FeedContent({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const useCache = params.cache !== 'off'

  return (
    <>
      <section>
        <h2 className="sr-only">All feeds</h2>
        <Suspense fallback={<FeedSkeleton />}>
          {useCache ? <CachedNewsFeed /> : <UncachedNewsFeed />}
        </Suspense>
      </section>

      <section className="grid gap-10 lg:grid-cols-2 mt-12">
        <Suspense fallback={<FeedSkeleton />}>
          {useCache ? <CachedHeadlines source="bbc" /> : <UncachedHeadlines source="bbc" />}
        </Suspense>
        <Suspense fallback={<FeedSkeleton />}>
          {useCache ? <CachedHeadlines source="npr" /> : <UncachedHeadlines source="npr" />}
        </Suspense>
      </section>
    </>
  )
}

export default function HomePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Static shell — rendered instantly, no dynamic data */}
      <header className="border-b border-ink-700/60 pb-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink-50 sm:text-4xl">
            Cache News
          </h1>
          <a
            href="/explorer"
            className="shrink-0 rounded-md border border-ink-700 bg-ink-800/50 px-3 py-1.5 text-xs font-medium text-ink-300 hover:border-accent/50 hover:text-accent transition-colors"
          >
            Cache Explorer →
          </a>
        </div>
        <p className="mt-2 text-ink-400">
          Real RSS feeds, cached with Next.js Cache Components. The list below is
          served from cache and revalidates every few minutes — no fresh fetch on every request.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {/* CacheToggle is a client component — reads URL state itself */}
          <Suspense>
            <CacheToggle />
          </Suspense>
          <span className="text-xs text-ink-500">
            Toggle to compare <code className="font-mono text-accent/90">use cache</code> vs live fetch
          </span>
        </div>
      </header>

      {/* Dynamic section — searchParams read here, inside Suspense */}
      <main className="mt-10 space-y-12">
        <Suspense fallback={<FeedSkeleton />}>
          <FeedContent searchParams={searchParams} />
        </Suspense>
      </main>

      <footer className="mt-16 border-t border-ink-700/60 py-6 text-center text-sm text-ink-500">
        Data from BBC News and NPR RSS. Built to demonstrate Next.js Cache Components.
      </footer>
    </div>
  )
}
