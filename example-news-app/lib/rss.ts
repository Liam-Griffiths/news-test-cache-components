import Parser from 'rss-parser'
import type { NewsItem } from './types'

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Next.js News Demo (RSS Reader)',
  },
})

const FEEDS: Record<string, string> = {
  bbc: 'https://feeds.bbci.co.uk/news/rss.xml',
  npr: 'https://feeds.npr.org/1001/rss.xml',
}

/** Artificial latency in ms — makes the cache speedup obvious when toggling. */
export const SIMULATED_DELAY_MS = 2000

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function slugify(title: string, index: number): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${base}-${index}`.slice(0, 80)
}

export async function fetchFeed(source: keyof typeof FEEDS): Promise<NewsItem[]> {
  const url = FEEDS[source]
  if (!url) return []

  const [feed] = await Promise.all([parser.parseURL(url), sleep(SIMULATED_DELAY_MS)])
  const sourceName = feed.title ?? source.toUpperCase()

  return (feed.items ?? []).slice(0, 20).map((item, i) => ({
    id: slugify(item.title ?? `item-${i}`, i),
    title: item.title ?? 'Untitled',
    link: item.link ?? item.guid ?? '#',
    pubDate: item.pubDate ?? new Date().toISOString(),
    description: item.contentSnippet ?? item.content ?? '',
    source: sourceName,
  }))
}

export async function fetchAllFeeds(): Promise<NewsItem[]> {
  const results = await Promise.all([
    fetchFeed('bbc').catch(() => []),
    fetchFeed('npr').catch(() => []),
  ])
  const combined = results.flat()
  combined.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
  return combined.slice(0, 24)
}
