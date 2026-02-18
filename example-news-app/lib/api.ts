import type { FeedSource, NewsItem } from './types'
import { fetchAllFeeds, fetchFeed } from './rss'

/**
 * Base URL for server-side fetch to our own API.
 * Required because relative URLs in fetch() from the server have no host.
 */
export function getApiBaseUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }
  if (typeof process.env.VERCEL_URL === 'string' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

export function getNewsApiUrl(source?: string): string {
  const base = getApiBaseUrl()
  const path = source ? `/api/news?source=${encodeURIComponent(source)}` : '/api/news'
  return `${base}${path}`
}

export function getNewsArticleApiUrl(id: string): string {
  return `${getApiBaseUrl()}/api/news/${encodeURIComponent(id)}`
}

/**
 * Fetches news via the app's API when the server is available (e.g. at runtime).
 * Falls back to the RSS lib when the API is unreachable (e.g. during build/prerender).
 */
export async function fetchNewsFromApi(source?: FeedSource): Promise<NewsItem[]> {
  try {
    const url = getNewsApiUrl(source)
    const res = await fetch(url, { next: { tags: ['news', source ? `feed-${source}` : 'rss-feeds'] } })
    if (!res.ok) throw new Error('API error')
    return res.json()
  } catch {
    return source ? fetchFeed(source) : fetchAllFeeds()
  }
}

/**
 * Fetches a single article by id via the API, with fallback to fetching all and finding by id.
 */
export async function fetchArticleFromApi(id: string): Promise<NewsItem | null> {
  try {
    const res = await fetch(getNewsArticleApiUrl(id), { next: { tags: ['news', `article-${id}`] } })
    if (res.status === 404) return null
    if (!res.ok) throw new Error('API error')
    return res.json()
  } catch {
    const items = await fetchAllFeeds()
    return items.find((item) => item.id === id) ?? null
  }
}
