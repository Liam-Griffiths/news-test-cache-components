import { connection } from 'next/server'
import { getCacheEntries, CACHE_LIFE_PROFILES } from '@/lib/cache-tracker'
import { ExplorerClient } from './_components/ExplorerClient'

export const metadata = {
  title: 'Cache Explorer — Cache News',
  description: 'Inspect what is in the Next.js cache and when it was computed.',
}

export default async function ExplorerPage() {
  await connection()
  const entries = getCacheEntries()
  const now = Date.now()

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-ink-700/60 pb-8">
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-ink-400 hover:text-ink-200 transition-colors">
            ← Back
          </a>
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-50 sm:text-4xl">
          Cache Explorer
        </h1>
        <p className="mt-2 text-ink-400">
          Live view of tracked cache entries. Entries only appear after a cache miss — if a
          component served from a warm cache, it won't re-run its body and the timestamp stays
          fixed until the next revalidation.
        </p>
      </header>

      <section className="mt-6 rounded-xl border border-ink-700/40 bg-ink-900/30 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-3">
          cacheLife profiles (Next.js built-ins)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-ink-300">
            <thead>
              <tr className="border-b border-ink-800">
                <th className="py-2 pr-6 text-left font-medium text-ink-500">Profile</th>
                <th className="py-2 pr-6 text-right font-medium text-ink-500">Stale after</th>
                <th className="py-2 pr-6 text-right font-medium text-ink-500">Revalidate every</th>
                <th className="py-2 text-right font-medium text-ink-500">Hard expires</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(CACHE_LIFE_PROFILES).map(([name, profile]) => (
                <tr key={name} className="border-b border-ink-800/50 last:border-0">
                  <td className="py-2 pr-6 font-mono text-accent">{name}</td>
                  <td className="py-2 pr-6 text-right">{profile.stale}s</td>
                  <td className="py-2 pr-6 text-right">{profile.revalidate}s</td>
                  <td className="py-2 text-right">
                    {profile.expire != null ? `${profile.expire}s` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <main className="mt-8">
        <ExplorerClient entries={entries} now={now} />
      </main>

      <footer className="mt-16 border-t border-ink-700/60 py-6 text-center text-sm text-ink-500">
        Cache entries are tracked in server process memory and reset on restart.
      </footer>
    </div>
  )
}
