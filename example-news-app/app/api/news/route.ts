import { NextRequest } from 'next/server'
import { fetchAllFeeds, fetchFeed } from '@/lib/rss'
import type { FeedSource } from '@/lib/types'

const VALID_SOURCES: FeedSource[] = ['bbc', 'npr']

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source')

  try {
    if (source && VALID_SOURCES.includes(source as FeedSource)) {
      const items = await fetchFeed(source as FeedSource)
      return Response.json(items)
    }
    const items = await fetchAllFeeds()
    return Response.json(items)
  } catch (error) {
    console.error('[api/news]', error)
    return Response.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
