import { NextRequest } from 'next/server'
import { fetchAllFeeds } from '@/lib/rss'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) {
    return Response.json({ error: 'Missing id' }, { status: 400 })
  }

  try {
    const items = await fetchAllFeeds()
    const article = items.find((item) => item.id === id)
    if (!article) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    return Response.json(article)
  } catch (error) {
    console.error('[api/news/[id]]', error)
    return Response.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}
