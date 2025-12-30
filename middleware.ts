import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * BASIC CONFIG
 */
const RATE_LIMIT = 60        // max requests
const WINDOW_MS = 60_000     // per minute

/**
 * In-memory store (Edge-safe)
 * NOTE: This resets on cold start — good enough for scraping deterrence
 */
const ipStore = new Map<string, { count: number; time: number }>()

/**
 * Allowed bots (SEO)
 */
const ALLOWED_BOTS = [
  'googlebot',
  'bingbot',
  'yandex',
  'duckduckbot',
  'baiduspider'
]

/**
 * Blocked user agents (downloaders / scrapers)
 */
const BLOCKED_UA = [
  'wget',
  'curl',
  'httrack',
  'libwww',
  'python',
  'scrapy',
  'httpclient',
  'go-http-client',
  'axios',
  'postman',
  'insomnia'
]

export function middleware(req: NextRequest) {
  const ua = (req.headers.get('user-agent') || '').toLowerCase()
  const ip = req.ip || 'unknown'
  const now = Date.now()

  /**
   * Allow known good bots
   */
  if (ALLOWED_BOTS.some(bot => ua.includes(bot))) {
    return NextResponse.next()
  }

  /**
   * Block known downloaders
   */
  if (BLOCKED_UA.some(bot => ua.includes(bot))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  /**
   * Rate limiting
   */
  const entry = ipStore.get(ip) || { count: 0, time: now }

  if (now - entry.time > WINDOW_MS) {
    entry.count = 0
    entry.time = now
  }

  entry.count++
  ipStore.set(ip, entry)

  if (entry.count > RATE_LIMIT) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  return NextResponse.next()
}

/**
 * Apply to all routes except static assets
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'
  ]
}
