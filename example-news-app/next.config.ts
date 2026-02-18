import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Avoid bundling rss-parser (and xml2js/xmlbuilder) into vendor chunks; use Node resolution
  serverExternalPackages: ['rss-parser', 'xml2js', 'xmlbuilder'],
}

export default nextConfig
