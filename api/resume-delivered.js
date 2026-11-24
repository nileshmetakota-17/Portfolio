import { createResumeService } from '../server/resume-service.js'
import { readBody, respond } from '../server/http.js'
export const config = { api: { bodyParser: false } }
export default async function handler(req, res) {
  if (req.method !== 'POST') return respond(res, 405, { error: 'Use POST.' })
  let payload
  try { payload = await readBody(req, 65536) }
  catch { return respond(res, 413, { error: 'Request too large.' }) }
  const result = await createResumeService().webhook(payload, req.headers)
  return respond(res, result.status, result.body)
}
