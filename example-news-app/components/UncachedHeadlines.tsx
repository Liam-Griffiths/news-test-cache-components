import { fetchFeed, SIMULATED_DELAY_MS } from '@/lib/rss'
import type { FeedSource } from '@/lib/types'
import { NewsCard } from './NewsCard'

/** Same as CachedHeadlines but without "use cache" — fetches fresh every request. */
export async function UncachedHeadlines({ source }: { source: FeedSource }) {
  const items = await fetchFeed(source)

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-ink-200">
        {source === 'bbc' ? 'BBC News' : 'NPR'} — Live
        <span className="ml-2 text-sm font-normal text-ink-500">
          (+{SIMULATED_DELAY_MS / 1000}s delay)
        </span>
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.slice(0, 6).map((item) => (
          <li key={item.id}>
            <NewsCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  )
}
