export interface NewsItem {
  id: string
  title: string
  link: string
  pubDate: string
  description: string
  source: string
}

export type FeedSource = 'bbc' | 'npr'
