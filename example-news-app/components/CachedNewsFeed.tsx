import { cacheLife, cacheTag } from 'next/cache'
import { fetchAllFeeds, SIMULATED_DELAY_MS } from '@/lib/rss'
import { trackCacheEntry } from '@/lib/cache-tracker'
import { NewsCard } from './NewsCard'

export async function CachedNewsFeed() {
  'use cache'
  cacheTag('news', 'rss-feeds')
  cacheLife('minutes')

  const items = await fetchAllFeeds()
  trackCacheEntry({ key: 'CachedNewsFeed', tags: ['news', 'rss-feeds'], profile: 'minutes', itemCount: items.length })
  const cachedAt = new Date().toISOString()

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          Cache hit — served instantly
        </span>
        <span className="text-xs text-ink-500">
          Rendered at <code className="font-mono">{cachedAt}</code> — stays the same on reload while cache is warm
        </span>
        <span className="text-xs text-ink-600">
          (artificial delay: {SIMULATED_DELAY_MS / 1000}s per feed, invisible when cached)
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
