# Cache News — Next.js Cache Components Demo

A small **news app** built with **Next.js**, **Tailwind CSS**, and **Cache Components**. It uses **real RSS feeds** (BBC News, NPR) as the data source and demonstrates how `use cache` speeds up the app by avoiding a fresh fetch on every request.

## How Cache Components Speed This App Up

1. **Static shell**  
   The header, nav, and layout are static. They can be served from the CDN immediately with no server work.

2. **Cached data**  
   The news lists are wrapped in **`use cache`** with **`cacheLife('minutes')`** and **`cacheTag('news', …)`**:
   - **First request** (or after cache expiry): the server fetches BBC/NPR RSS, renders the list, and stores the result.
   - **Later requests**: the server (or CDN) serves the cached HTML/segment. No RSS fetch, no re-render — **much faster TTFB** and lower load on the RSS sources.

3. **Revalidation**  
   With `cacheLife('minutes')`, the cache revalidates in the background so content doesn’t stay stale forever. You can also invalidate on demand with **`revalidateTag('news')`** or **`updateTag('news')`** from a Server Action or route handler (e.g. after a “Refresh” action).

4. **Suspense**  
   The cached feed is wrapped in `<Suspense>`. While the cached block is being restored or filled, users see a skeleton instead of a blank area.

So in practice: **first hit** does the RSS work; **subsequent hits** are fast until revalidation. That’s how Cache Components speed up this news app.

## Tech Stack

- **Next.js** (App Router) with **Cache Components** (`cacheComponents: true` in `next.config.ts`)
- **Tailwind CSS** for styling
- **rss-parser** for fetching and parsing BBC + NPR RSS
- **TypeScript**

Note: This is a **Next.js** app (no Vite). Cache Components are a Next.js feature; Vite is used with other frameworks (e.g. Vite + React), not with the Next.js bundler.

## Getting Started

```bash
cd example-news-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first load will fetch RSS; subsequent reloads should be faster when the cache is warm.

## Enabling Cache Components

**Next.js 15** (this app):

```ts
// next.config.ts
const nextConfig = {
  experimental: { useCache: true },
}
```

The API uses `unstable_cacheLife` and `unstable_cacheTag` from `next/cache`; the app imports them as `cacheLife` and `cacheTag` for clarity.

**Next.js 16+** uses `cacheComponents: true` and stable `cacheLife` / `cacheTag` exports. See the [Next.js docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) for your version.

## Project Structure

- **`app/`** — Layout, global styles, home page (static shell + Suspense around cached feed).
- **`components/`** — `CachedNewsFeed`, `CachedHeadlines` (both use `use cache`, `cacheLife`, `cacheTag`), and `NewsCard`.
- **`lib/`** — `rss.ts` (fetch/parse BBC & NPR RSS), `types.ts` (e.g. `NewsItem`).

## Cache Invalidation (optional)

To refresh the news list on demand (e.g. a “Refresh” button), add a Server Action that calls **`revalidateTag('news')`** or **`updateTag('news')`** (see [Next.js Cache Components](https://nextjs.org/docs/app/api-reference/directives/use-cache) and the skills in `.agents/skills/next-cache-components/`).
