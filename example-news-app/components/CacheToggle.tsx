'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export function CacheToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const cacheOn = searchParams.get('cache') !== 'off'

  function toggle() {
    router.push(cacheOn ? `${pathname}?cache=off` : pathname)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-lg border border-ink-700/60 bg-ink-900/60 px-3 py-1.5 text-sm transition-colors hover:border-ink-600 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-ink-950"
      aria-pressed={!cacheOn}
      aria-label={cacheOn ? 'Cache on — click to turn off' : 'Cache off — click to turn on'}
    >
      <span
        className={`h-2 w-2 rounded-full ${cacheOn ? 'bg-accent animate-pulse' : 'bg-ink-500'}`}
        aria-hidden
      />
      <span className={cacheOn ? 'text-accent' : 'text-ink-400'}>
        Cache {cacheOn ? 'on' : 'off'}
      </span>
      <span className="text-ink-500">·</span>
      <span className="text-ink-500 font-mono text-xs">
        {cacheOn ? 'use cache' : 'live fetch'}
      </span>
    </button>
  )
}
