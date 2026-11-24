import { test } from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import { Webhook } from 'svix'
import { validEmail, emailDomainStatus, bounceStatus, notificationText, createResumeService } from '../server/resume-service.js'

const secret = `whsec_${Buffer.from('a-test-signing-secret-with-32-bytes').toString('base64')}`
function fixture(options = {}) {
  const storage = new Map()
  const emails = []
  let failSend = false
  const env = { RESEND_API_KEY: 'test-key', RESUME_FROM_EMAIL: 'Nilesh <resume@example.com>', RESEND_WEBHOOK_SECRET: secret, UPSTASH_REDIS_REST_URL: 'https://storage.example.com', UPSTASH_REDIS_REST_TOKEN: 'test-token' }
  const service = createResumeService({ env, checkDomain: async () => 'valid', loadPdf: async () => Buffer.from('%PDF-test'), fetcher: async (url, init) => {
    const body = JSON.parse(init.body)
    if (url === env.UPSTASH_REDIS_REST_URL) {
      const [cmd, key, value] = body
      let result
      if (cmd === 'GET') result = storage.get(key) || null
      if (cmd === 'SET') { storage.set(key, value); result = 'OK' }
      if (cmd === 'EVAL') {
        const rateKey = body[3]
        result = (storage.get(rateKey) || 0) + 1
        storage.set(rateKey, result)
      }
      return Response.json({ result })
    }
    assert.equal(url, 'https://api.resend.com/emails')
    if (failSend) return Response.json({}, { status: 500 })
    emails.push({ ...body, idempotencyKey: init.headers['Idempotency-Key'] })
    return Response.json({ id: randomUUID() })
  }, ...options })
  async function webhook(type, token, extra = {}, headersOverride) {
    const payload = JSON.stringify({ type, created_at: '2026-11-24T18:45:00Z', data: { email_id: 'delivery-123', to: ['visitor@example.com'], tags: { category: 'portfolio_resume', request_id: token }, ...extra } })
    const timestamp = new Date()
    const id = 'msg_test'
    const signature = new Webhook(secret).sign(id, timestamp, payload)
    return service.webhook(payload, headersOverride || { 'svix-id': id, 'svix-timestamp': String(Math.floor(timestamp.getTime() / 1000)), 'svix-signature': signature })
  }
  return { service, storage, emails, webhook, failSend: value => { failSend = value } }
}

test('rejects malformed addresses and email header injection', async () => {
  for (const email of ['', 'a@', 'a@example', 'a..b@example.com', 'a@example..com', 'a@-bad.com', 'a@example.com\r\nBcc: x@y.com']) assert.equal(validEmail(email), false, email)
  assert.equal(validEmail('first.last+work@example.co.in'), true)
  const f = fixture()
  assert.equal((await f.service.request({ email: 'invalid' }, 'ip')).status, 400)
  assert.equal(f.emails.length, 0)
})

test('distinguishes absent domains, null MX, SMTP fallback, and temporary DNS failures', async () => {
  const fail = code => async () => { throw Object.assign(new Error(), { code }) }
  assert.equal(await emailDomainStatus('absent.test', { resolveMx: fail('ENOTFOUND') }), 'nonexistent')
  assert.equal(await emailDomainStatus('null.test', { resolveMx: async () => [{ exchange: '', priority: 0 }] }), 'nonexistent')
  assert.equal(await emailDomainStatus('fallback.test', { resolveMx: fail('ENODATA'), resolve4: async () => ['127.0.0.1'], resolve6: fail('ENODATA') }), 'valid')
  assert.equal(await emailDomainStatus('timeout.test', { resolveMx: fail('ETIMEOUT') }), 'unavailable')
})

test('rejects nonexistent email domains without sending a resume or owner notification', async () => {
  const f = fixture({ checkDomain: async () => 'nonexistent' })
  const response = await f.service.request({ email: 'visitor@absent.test' }, 'ip')
  assert.equal(response.status, 400)
  assert.match(response.body.error, /does not exist/)
  assert.equal(f.emails.length, 0)
})

test('attaches a private PDF, returns pending status, and waits for delivery before notifying owner', async () => {
  const f = fixture()
  const response = await f.service.request({ email: 'visitor@example.com' }, 'ip')
  assert.equal(response.status, 202)
  assert.equal(f.emails.length, 1)
  assert.equal(f.emails[0].attachments[0].content, Buffer.from('%PDF-test').toString('base64'))
  const token = response.body.token
  assert.equal((await f.service.status({ token })).body.status, 'pending')
  assert.equal((await f.webhook('email.sent', token)).status, 200)
  assert.equal(f.emails.length, 1)
  assert.equal((await f.webhook('email.delivered', token)).status, 200)
  assert.equal((await f.service.status({ token })).body.status, 'delivered')
  assert.equal(f.emails.length, 2)
  assert.deepEqual(f.emails[1].to, ['nilesh.metakota@gmail.com'])
  assert.equal(f.emails[1].subject, 'New Resume Download Request')
  assert.match(f.emails[1].text, /Date: 25\/11\/2026\nTime: 12:15 AM IST/)
  assert.match(f.emails[1].text, /Visitor Email: visitor@example.com/)
  await f.webhook('email.delivered', token)
  assert.equal(f.emails.length, 2, 'duplicate delivery must not duplicate the notification')
})

test('nonexistent mailbox updates visitor status and never triggers success notification', async () => {
  const f = fixture()
  const { body: { token } } = await f.service.request({ email: 'visitor@example.com' }, 'ip')
  await f.webhook('email.bounced', token, { bounce: { type: 'Permanent', message: '550 5.1.1 User unknown' } })
  assert.equal((await f.service.status({ token })).body.status, 'nonexistent')
  await f.webhook('email.delivered', token) // stale event cannot overwrite a permanent rejection
  assert.equal(f.emails.length, 1)
  assert.equal((await f.service.status({ token })).body.status, 'nonexistent')
})

test('policy rejection and failed sends are not falsely labelled nonexistent', async () => {
  assert.equal(bounceStatus({ message: '550 5.7.1 Policy rejected' }), 'failed')
  assert.equal(bounceStatus({ message: 'Mailbox full 5.2.2' }), 'failed')
  const f = fixture()
  const { body: { token } } = await f.service.request({ email: 'visitor@example.com' }, 'ip')
  await f.webhook('email.failed', token)
  assert.equal((await f.service.status({ token })).body.status, 'failed')
  assert.equal(f.emails.length, 1)
})

test('invalid webhook signatures are rejected without storage updates or notifications', async () => {
  const f = fixture()
  assert.equal((await f.webhook('email.delivered', randomUUID(), {}, {})).status, 400)
  assert.equal(f.storage.size, 0)
  assert.equal(f.emails.length, 0)
})

test('owner notification delivery events do not recursively trigger notifications', async () => {
  const f = fixture()
  await f.webhook('email.delivered', randomUUID(), { tags: { category: 'resume_owner_notification' } })
  assert.equal(f.emails.length, 0)
})

test('notification failure returns retryable error; retry uses stable idempotency key', async () => {
  const f = fixture()
  const { body: { token } } = await f.service.request({ email: 'visitor@example.com' }, 'ip')
  f.failSend(true)
  assert.equal((await f.webhook('email.delivered', token)).status, 503)
  f.failSend(false)
  assert.equal((await f.webhook('email.delivered', token)).status, 200)
  assert.equal(f.emails[1].idempotencyKey, 'resume-notification/delivery-123')
})

test('rate limits recipient requests and fails safely without credentials', async () => {
  const f = fixture()
  for (let i = 0; i < 10; i++) assert.equal((await f.service.request({ email: 'visitor@example.com' }, 'ip')).status, 202)
  assert.equal((await f.service.request({ email: 'visitor@example.com' }, 'ip')).status, 429)
  const unconfigured = fixture({ env: {} })
  assert.equal((await unconfigured.service.request({ email: 'visitor@example.com' }, 'ip')).status, 503)
  assert.equal(unconfigured.emails.length, 0)
})

test('notification uses the delivery event timestamp in IST including midnight rollover', () => {
  assert.equal(notificationText('a@example.com', '2026-11-24T18:45:00Z'), 'Visitor Email: a@example.com\nDate: 25/11/2026\nTime: 12:15 AM IST\nStatus: Resume successfully delivered.')
})

test('no PDF is publicly distributed in the static build', async () => {
  assert.equal((await readdir('public')).some(name => /\.pdf$/i.test(name)), false)
  assert.equal((await readdir('dist')).some(name => /\.pdf$/i.test(name)), false)
  const pdf = await readFile('private/Nilesh_Metakota_2026.pdf')
  assert.equal(pdf.subarray(0, 4).toString(), '%PDF')
  const src = await readFile('src/Portfolio.tsx', 'utf8')
  assert.equal(/download=|data\.resume\.path/.test(src), false)
})


test('new limits ignore old one-hour counters and report the shorter retry window', async () => {
  const f = fixture()
  f.storage.set('resume:rate:global', 1000)
  for (let i = 0; i < 10; i++) {
    assert.equal((await f.service.request({ email: 'visitor@example.com' }, 'ip')).status, 202)
  }
  const limited = await f.service.request({ email: 'visitor@example.com' }, 'ip')
  assert.equal(limited.status, 429)
  assert.equal(limited.body.retryAfter, 600)
  assert.match(limited.body.error, /10 minutes/)
  assert.equal(f.emails.length, 10, 'a blocked request must not send an email')
})
