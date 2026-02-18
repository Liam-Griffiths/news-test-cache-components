import { fetchAllFeeds, SIMULATED_DELAY_MS } from '@/lib/rss'
import { NewsCard } from './NewsCard'

/** Same as CachedNewsFeed but without "use cache" — fetches fresh every request. */
export async function UncachedNewsFeed() {
  const items = await fetchAllFeeds()

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-ink-700/60 px-2.5 py-1 text-xs font-medium text-ink-300">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-400" aria-hidden />
          No cache — fresh fetch every request
        </span>
        <span className="text-xs text-ink-500">
          Fetched at <code className="font-mono">{new Date().toISOString()}</code> — changes on every reload
        </span>
        <span className="text-xs text-ink-600">
          (artificial delay: {SIMULATED_DELAY_MS / 1000}s per feed)
        </span>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li
            key={item.id}
            className="animate-slide-up"
            style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
          >
            <NewsCard item={item} />
          </li>
        ))}
      </ul>
    </>
  )
}
