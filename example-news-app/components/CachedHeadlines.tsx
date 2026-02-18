import { cacheLife, cacheTag } from 'next/cache'
import { fetchFeed } from '@/lib/rss'
import { trackCacheEntry } from '@/lib/cache-tracker'
import type { FeedSource } from '@/lib/types'
import { NewsCard } from './NewsCard'

export async function CachedHeadlines({ source }: { source: FeedSource }) {
  'use cache'
  cacheTag('news', `feed-${source}`)
  cacheLife('minutes')

  const items = await fetchFeed(source)
  trackCacheEntry({ key: `CachedHeadlines:${source}`, tags: ['news', `feed-${source}`], profile: 'minutes', itemCount: items.length })

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-ink-200">
        {source === 'bbc' ? 'BBC News' : 'NPR'} — Cached
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
