export async function readBody(req, limit = 16384) {
  let size = 0
  const chunks = []
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > limit) throw new Error('Request too large')
    chunks.push(buffer)
  }
  return Buffer.concat(chunks).toString('utf8')
}
export function respond(res, status, body) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Type', 'application/json')
  if (status === 405) res.setHeader('Allow', 'POST')
  if (status === 429) res.setHeader('Retry-After', '3600')
  res.statusCode = status
  res.end(JSON.stringify(body))
}
