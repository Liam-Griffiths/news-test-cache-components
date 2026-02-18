import Link from 'next/link'
import type { NewsItem } from '@/lib/types'

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60_000) return 'Just now'
    if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`
    if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link href={`/article/${item.id}`} className="block group">
      <article className="relative rounded-xl border border-ink-700/60 bg-ink-900/60 p-5 transition-all duration-200 hover:border-accent/40 hover:bg-ink-800/80">
        <span className="text-xs font-medium uppercase tracking-wider text-accent">
          {item.source}
        </span>
        <h2 className="mt-1 font-display text-lg font-semibold leading-tight text-ink-100 transition-colors group-hover:text-accent-light">
          {item.title}
        </h2>
        {item.description && (
          <p className="mt-2 line-clamp-2 text-sm text-ink-400">
            {item.description}
          </p>
        )}
        <time
          dateTime={item.pubDate}
          className="mt-3 block text-xs text-ink-500"
        >
          {formatDate(item.pubDate)}
        </time>
      </article>
    </Link>
  )
}
