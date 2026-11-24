import { createResumeService } from '../server/resume-service.js'
import { readBody, respond } from '../server/http.js'
export const config = { api: { bodyParser: false } }
export default async function handler(req, res) {
  if (req.method !== 'POST') return respond(res, 405, { error: 'Use POST.' })
  if (!req.headers['content-type']?.startsWith('application/json')) return respond(res, 415, { error: 'Use JSON.' })
  // Browsers submit to this origin only; no cross-origin API access is advertised.
  const origin = req.headers.origin
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) return respond(res, 403, { error: 'Invalid origin.' })
    } catch { return respond(res, 403, { error: 'Invalid origin.' }) }
  }
  let body
  try { body = JSON.parse(await readBody(req)) }
  catch { return respond(res, 400, { error: 'Invalid request.' }) }
  const ip = process.env.VERCEL ? String(req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || '').split(',')[0].trim() : req.socket?.remoteAddress || 'local'
  const result = await createResumeService().request(body, ip)
  return respond(res, result.status, result.body)
}
