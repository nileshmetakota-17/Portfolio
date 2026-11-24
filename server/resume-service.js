import { readFile } from 'node:fs/promises'
import { createHmac, randomUUID } from 'node:crypto'
import { Webhook } from 'svix'
import { createGmailSender } from './gmail.js'
import { resolveMx, resolve4, resolve6 } from 'node:dns/promises'

export function validEmail(value) {
  if (typeof value !== 'string' || value.length > 254 || /[\r\n]/.test(value)) return false
  const parts = value.split('@')
  return parts.length === 2 && parts[0].length <= 64 &&
    /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/.test(parts[0]) &&
    parts[1].length <= 253 && parts[1].includes('.') &&
    parts[1].split('.').every(label => /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label))
}

export async function emailDomainStatus(domain, dns = { resolveMx, resolve4, resolve6 }) {
  try {
    const records = await dns.resolveMx(domain)
    // RFC 7505 null MX explicitly means this domain does not accept email.
    if (records.length) return records.some(record => record.exchange && record.exchange !== '.') ? 'valid' : 'nonexistent'
  } catch (error) {
    if (error.code === 'ENOTFOUND') return 'nonexistent'
    if (error.code !== 'ENODATA') return 'unavailable'
  }
  // SMTP permits an implicit MX using the domain's A/AAAA records.
  const results = await Promise.allSettled([dns.resolve4(domain), dns.resolve6(domain)])
  if (results.some(result => result.status === 'fulfilled' && result.value.length)) return 'valid'
  if (results.some(result => result.status === 'rejected' && !['ENODATA', 'ENOTFOUND'].includes(result.reason.code))) return 'unavailable'
  return 'nonexistent'
}

export function bounceStatus(bounce) {
  // A bounce may instead mean a full inbox, policy rejection, or a blocked sender.
  const message = String(bounce?.message || '')
  return /(?:^|[^0-9])5\.1\.1(?:[^0-9]|$)/.test(message) ? 'nonexistent' : 'failed'
}

export function notificationText(email, timestamp) {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) throw new Error('Invalid delivery timestamp')
  const options = { timeZone: 'Asia/Kolkata' }
  const day = new Intl.DateTimeFormat('en-GB', { ...options, day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
  const time = new Intl.DateTimeFormat('en-US', { ...options, hour: '2-digit', minute: '2-digit', hour12: true }).format(date)
  return `Visitor Email: ${email}\nDate: ${day}\nTime: ${time} IST\nStatus: Resume successfully delivered.`
}

export function createResumeService({ env = process.env, fetcher = fetch, gmailSend, checkDomain = emailDomainStatus, loadPdf = () => readFile(new URL('../private/Nilesh_Metakota_2026.pdf', import.meta.url)) } = {}) {
  const provider = env.RESUME_EMAIL_PROVIDER || 'resend'
  const usingGmail = provider === 'gmail'
  let smtpSend = gmailSend
  function configured() {
    const required = usingGmail
      ? ['GMAIL_USER', 'GMAIL_APP_PASSWORD', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']
      : ['RESEND_API_KEY', 'RESUME_FROM_EMAIL', 'RESEND_WEBHOOK_SECRET', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']
    if (!['gmail', 'resend'].includes(provider)) {
      console.error('[resume-config] Unsupported RESUME_EMAIL_PROVIDER')
      return false
    }
    const missing = required.filter(key => typeof env[key] !== 'string' || !env[key].trim())
    if (missing.length) {
      // Log names only: never log credentials, the request body, or the visitor email.
      console.error(`[resume-config] Missing environment variables: ${missing.join(', ')}`)
      return false
    }
    return true
  }
  async function redis(command) {
    const response = await fetcher(env.UPSTASH_REDIS_REST_URL, {
      method: 'POST', headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command), signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error('Request storage unavailable')
    const result = await response.json()
    if (result.error) throw new Error('Request storage unavailable')
    return result.result
  }
  async function send(message, idempotencyKey) {
    if (usingGmail) {
      smtpSend ||= createGmailSender(env)
      return smtpSend(message)
    }
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify({ from: env.RESUME_FROM_EMAIL, ...message }), signal: AbortSignal.timeout(15000),
    })
    if (!response.ok) throw new Error('Email provider unavailable')
    const result = await response.json()
    if (!result.id) throw new Error('Missing email confirmation')
    return result.id
  }
  async function notifyGmailOwner(token) {
    const key = `resume:gmail-notification:${token}`
    const lock = `${key}:lock`
    if (!await redis(['GET', key])) return true
    if (!await redis(['SET', lock, '1', 'NX', 'EX', '60'])) return false
    try {
      const pending = await redis(['GET', key])
      if (!pending) return true
      const { email, timestamp } = JSON.parse(pending)
      await send({
        to: [env.RESUME_OWNER_EMAIL || env.GMAIL_USER],
        subject: 'New Resume Download Request',
        text: notificationText(email, timestamp).replace('Resume successfully delivered.', 'Resume accepted for sending by Gmail. Inbox delivery is not confirmed.'),
      }, `gmail-notification/${token}`)
      await redis(['DEL', key])
      return true
    } catch {
      console.error('[resume-mail] Gmail owner notification pending; delivery status checks will retry it.')
      return false
    } finally {
      await redis(['DEL', lock])
    }
  }
  const reply = (status, body) => ({ status, body })
  return {
    async request(body, ip) {
      const email = typeof body?.email === 'string' ? body.email.trim() : ''
      if (!validEmail(email)) return reply(400, { error: 'Enter a valid email address.' })
      if (body?.website) return reply(400, { error: 'Unable to process this request.' })
      if (!configured()) return reply(503, { error: 'Resume email is not available yet. Please try again later.' })
      try {
        // Atomic per-key counters, shared by all serverless instances. Hash personal data.
        const hash = value => createHmac('sha256', env.UPSTASH_REDIS_REST_TOKEN).update(value).digest('hex')
        const rateScript = "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], 3600) end; return n"
        for (const [key, limit] of [[`ip:${hash(ip)}`, 5], [`email:${hash(email.toLowerCase())}`, 3], ['global', 100]]) {
          const count = await redis(['EVAL', rateScript, '1', `resume:rate:${key}`])
          if (count > limit) return reply(429, { error: 'Too many requests. Please try again in an hour.' })
        }
        const domainStatus = await checkDomain(email.split('@')[1])
        if (domainStatus === 'nonexistent') return reply(400, { error: 'This email domain does not accept email or does not exist. Please check the address.' })
        if (domainStatus !== 'valid') return reply(503, { error: 'We could not verify the email domain right now. Please try again shortly.' })
        const token = randomUUID()
        await redis(['SET', `resume:status:${token}`, 'pending', 'EX', '86400'])
        const pdf = await loadPdf()
        await send({
          to: [email], subject: 'Nilesh Kumar Metakota — Resume',
          text: 'Thank you for your interest in my work. My resume is attached as a PDF.\n\nNilesh Kumar Metakota\nRobotics Software Engineer',
          attachments: [{ filename: 'Nilesh_Metakota_2026.pdf', content: pdf.toString('base64'), content_type: 'application/pdf' }],
          tags: [{ name: 'category', value: 'portfolio_resume' }, { name: 'request_id', value: token }],
        }, `resume-request/${randomUUID()}`)
        if (usingGmail) {
          // No delivery webhook is available: do not label SMTP acceptance as delivered.
          let notificationPending = true
          try {
            await redis(['SET', `resume:status:${token}`, 'submitted', 'EX', '86400'])
            await redis(['SET', `resume:gmail-notification:${token}`, JSON.stringify({ email, timestamp: new Date().toISOString() }), 'EX', '86400'])
            notificationPending = !await notifyGmailOwner(token)
          } catch {
            console.error('[resume-mail] Gmail accepted the resume but follow-up storage is unavailable.')
          }
          return reply(202, { token, status: 'submitted', notificationPending, message: 'Your resume email has been sent through Gmail. Please check your inbox and spam folder.' })
        }
        return reply(202, { token, message: 'Your resume email has been queued. Check your inbox and spam folder shortly.' })
      } catch (error) {
        if (usingGmail && /(?:^|[^0-9])5\.1\.1(?:[^0-9]|$)/.test(String(error.response || ''))) {
          return reply(400, { error: 'This email address does not exist. Please check it and try again.' })
        }
        // Never log SMTP responses or credentials; only the coarse failure class.
        if (usingGmail) console.error(`[resume-mail] Gmail send failed: ${['EAUTH', 'ECONNECTION', 'ETIMEDOUT', 'EENVELOPE'].includes(error.code) ? error.code : 'SMTP_ERROR'}`)
        return reply(503, { error: 'We could not queue your resume email. Please try again later.' })
      }
    },
    async status(body) {
      if (!/^[a-f0-9-]{36}$/.test(body?.token || '')) return reply(400, { error: 'Invalid request token.' })
      if (!configured()) return reply(503, { error: 'Email delivery is not configured.' })
      try {
        const status = await redis(['GET', `resume:status:${body.token}`])
        if (!status) return reply(404, { error: 'This delivery check has expired. Please check your inbox or submit a new request.' })
        if (usingGmail && status === 'submitted') {
          return reply(200, { status, notificationPending: !await notifyGmailOwner(body.token) })
        }
        return reply(200, { status })
      } catch { return reply(503, { error: 'Unable to check delivery right now. Please try again shortly.' }) }
    },
    async webhook(payload, headers) {
      if (usingGmail) return reply(200, { received: true, ignored: true })
      if (!configured()) return reply(503, { error: 'Email delivery is not configured.' })
      let event
      try { event = new Webhook(env.RESEND_WEBHOOK_SECRET).verify(payload, headers) }
      catch { return reply(400, { error: 'Invalid webhook signature.' }) }
      // Ignore owner notifications to prevent notification loops.
      if (!['email.delivered', 'email.bounced', 'email.failed', 'email.suppressed'].includes(event.type) || event.data?.tags?.category !== 'portfolio_resume') return reply(200, { received: true })
      const data = event.data
      if (!/^[A-Za-z0-9-]{1,100}$/.test(data.email_id || '') || data.to?.length !== 1 || !validEmail(data.to[0])) return reply(400, { error: 'Invalid delivery event.' })
      const token = data.tags.request_id
      if (!/^[a-f0-9-]{36}$/.test(token || '')) return reply(400, { error: 'Invalid request token.' })
      try {
        if (event.type !== 'email.delivered') {
          const status = event.type === 'email.bounced' ? bounceStatus(data.bounce) : 'failed'
          // A permanent failure overrides delivery if a recipient rejects it later.
          await redis(['SET', `resume:status:${token}`, status, 'EX', '86400'])
          return reply(200, { received: true })
        }
        const previous = await redis(['GET', `resume:status:${token}`])
        if (previous === 'failed' || previous === 'nonexistent') return reply(200, { received: true })
        await redis(['SET', `resume:status:${token}`, 'delivered', 'EX', '86400'])
        const key = `resume:notified:${data.email_id}`
        if (await redis(['GET', key])) return reply(200, { received: true })
        await send({
          to: [env.RESUME_OWNER_EMAIL || 'nilesh.metakota@gmail.com'],
          subject: 'New Resume Download Request',
          text: notificationText(data.to[0], event.created_at),
          tags: [{ name: 'category', value: 'resume_owner_notification' }],
        }, `resume-notification/${data.email_id}`)
        // Permanent delivery-ID marker plus provider idempotency for concurrent retries.
        await redis(['SET', key, '1'])
        return reply(200, { received: true })
      } catch {
        // Non-2xx makes Resend retry instead of silently dropping a notification.
        return reply(503, { error: 'Notification pending. Please retry.' })
      }
    },
  }
}
