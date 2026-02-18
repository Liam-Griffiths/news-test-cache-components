import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { fetchArticleFromApi } from '@/lib/api'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const article = await fetchArticleFromApi(id)
  if (!article) return { title: 'Article not found' }
  return {
    title: `${article.title} — Cache News`,
    description: article.description?.slice(0, 160) ?? undefined,
  }
}

function formatArticleDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

function ArticleSkeleton() {
  return (
    <div className="animate-pulse space-y-4 mt-8">
      <div className="h-4 w-20 rounded bg-ink-700" />
      <div className="h-8 w-4/5 rounded bg-ink-600" />
      <div className="h-8 w-3/5 rounded bg-ink-600" />
      <div className="h-3 w-28 rounded bg-ink-700 mt-2" />
      <div className="space-y-2 mt-6">
        <div className="h-4 w-full rounded bg-ink-700" />
        <div className="h-4 w-full rounded bg-ink-700" />
        <div className="h-4 w-4/5 rounded bg-ink-700" />
      </div>
    </div>
  )
}

/**
 * Awaits params (dynamic) inside Suspense so the static back-link shell renders immediately.
 */
async function ArticleContent({ params }: { params: Params }) {
  const { id } = await params
  const article = await fetchArticleFromApi(id)

  if (!article) notFound()

  return (
    <>
      <header className="border-b border-ink-700/60 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-400 transition-colors hover:text-accent"
        >
          ← Back to feed
        </Link>
        <span className="mt-4 block text-xs font-medium uppercase tracking-wider text-accent">
          {article.source}
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-ink-50 sm:text-4xl">
          {article.title}
        </h1>
        <time dateTime={article.pubDate} className="mt-3 block text-sm text-ink-500">
          {formatArticleDate(article.pubDate)}
        </time>
      </header>

      <main className="mt-8">
        {article.description && (
          <p className="text-lg leading-relaxed text-ink-300 whitespace-pre-line">
            {article.description}
          </p>
        )}

        <div className="mt-10 border-t border-ink-700/60 pt-8">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-medium text-white transition-colors hover:bg-accent-light"
          >
            Read full article at {article.source}
            <span aria-hidden>→</span>
          </a>
        </div>
      </main>
    </>
  )
}

export default function ArticlePage({ params }: { params: Params }) {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6">
      {/* Dynamic article content — params read inside Suspense */}
      <Suspense fallback={<ArticleSkeleton />}>
        <ArticleContent params={params} />
      </Suspense>

      <footer className="mt-16 border-t border-ink-700/60 py-6 text-center text-sm text-ink-500">
        <Link href="/" className="hover:text-ink-400">
          Cache News
        </Link>
      </footer>
    </div>
  )
}
