export const config = {
  matcher: '/:path*',
  runtime: 'edge',
}

const RATE_LIMIT = 60
const WINDOW_MS = 60_000

const ipStore = new Map<string, { count: number; time: number }>()

const ALLOWED_BOTS = [
  'googlebot',
  'bingbot',
  'yandex',
  'duckduckbot',
  'baiduspider',
]

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
  'insomnia',
]

export default async function middleware(req: Request) {
  const ua = (req.headers.get('user-agent') || '').toLowerCase()
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0]
  const now = Date.now()

  // Allow known SEO bots
  if (ALLOWED_BOTS.some(bot => ua.includes(bot))) {
    return fetch(req) // continue request
  }

  // Block known downloaders
  if (BLOCKED_UA.some(bot => ua.includes(bot))) {
    return new Response('Forbidden', { status: 403 })
  }

  // Rate limiting
  const entry = ipStore.get(ip) || { count: 0, time: now }

  if (now - entry.time > WINDOW_MS) {
    entry.count = 0
    entry.time = now
  }

  entry.count++
  ipStore.set(ip, entry)

  if (entry.count > RATE_LIMIT) {
    return new Response('Too Many Requests', { status: 429 })
  }

  return fetch(req)
}
