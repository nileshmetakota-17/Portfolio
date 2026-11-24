import { deferTask } from '../server/background.js'
import { createResumeService } from '../server/resume-service.js'
import { readBody, respond } from '../server/http.js'
export const config = { api: { bodyParser: false } }
export default async function handler(req, res) {
  if (req.method !== 'POST') return respond(res, 405, { error: 'Use POST.' })
  let body
  try { body = JSON.parse(await readBody(req)) }
  catch { return respond(res, 400, { error: 'Invalid request.' }) }
  const result = await createResumeService({ defer: deferTask }).status(body)
  return respond(res, result.status, result.body)
}
