import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createResumeService } from '../server/resume-service.js'
import { createGmailSender } from '../server/gmail.js'

function fixture() {
  const values = new Map()
  const messages = []
  let failVisitor = false
  let failOwner = false
  const env = { RESUME_EMAIL_PROVIDER: 'gmail', GMAIL_USER: 'owner@gmail.com', GMAIL_APP_PASSWORD: 'test-app-password', UPSTASH_REDIS_REST_URL: 'https://storage.example.com', UPSTASH_REDIS_REST_TOKEN: 'test-token' }
  const service = createResumeService({ env, checkDomain: async () => 'valid', loadPdf: async () => Buffer.from('%PDF-test'), gmailSend: async message => {
    if (failVisitor && message.attachments) throw Object.assign(new Error('recipient does not exist'), { code: 'EENVELOPE', response: '550 5.1.1 mailbox does not exist' })
    if (failOwner && !message.attachments) throw new Error('temporary failure')
    messages.push(message)
    return '<smtp-message-id@gmail.com>'
  }, fetcher: async (url, init) => {
    assert.equal(url, env.UPSTASH_REDIS_REST_URL, 'Gmail mode must never send to Resend')
    const [command, key, value, ...args] = JSON.parse(init.body)
    let result
    if (command === 'GET') result = values.get(key) || null
    if (command === 'DEL') result = values.delete(key) ? 1 : 0
    if (command === 'SET') {
      if (args.includes('NX') && values.has(key)) result = null
      else { values.set(key, value); result = 'OK' }
    }
    if (command === 'EVAL') {
      const rateKey = args[0]
      result = (values.get(rateKey) || 0) + 1
      values.set(rateKey, result)
    }
    return Response.json({ result })
  } })
  return { service, messages, values, failVisitor: value => { failVisitor = value }, failOwner: value => { failOwner = value } }
}

test('Gmail sends PDF to a visitor different from the sender without Resend credentials', async () => {
  const f = fixture()
  const result = await f.service.request({ email: 'visitor@outlook.com' }, 'ip')
  assert.equal(result.status, 202)
  assert.equal(result.body.status, 'submitted')
  assert.equal(result.body.notificationPending, false)
  assert.equal(f.messages.length, 2)
  assert.deepEqual(f.messages[0].to, ['visitor@outlook.com'])
  assert.equal(f.messages[0].attachments[0].content, Buffer.from('%PDF-test').toString('base64'))
  assert.deepEqual(f.messages[1].to, ['owner@gmail.com'])
  assert.match(f.messages[1].text, /Visitor Email: visitor@outlook.com/)
  assert.match(f.messages[1].text, /IST/)
  assert.match(f.messages[1].text, /Inbox delivery is not confirmed/)
  assert.doesNotMatch(f.messages[1].text, /successfully delivered/)
  assert.equal((await f.service.status({ token: result.body.token })).body.status, 'submitted')
  assert.equal(f.messages.length, 2, 'status check does not duplicate the PDF or notification')
})

test('Gmail recipient rejection gives a nonexistent-mailbox error and no owner notification', async () => {
  const f = fixture()
  f.failVisitor(true)
  const result = await f.service.request({ email: 'absent@outlook.com' }, 'ip')
  assert.equal(result.status, 400)
  assert.match(result.body.error, /does not exist/)
  assert.equal(f.messages.length, 0)
})

test('notification failure does not falsely report that the PDF failed; status checks retry notification only', async () => {
  const f = fixture()
  f.failOwner(true)
  const result = await f.service.request({ email: 'visitor@outlook.com' }, 'ip')
  assert.equal(result.status, 202)
  assert.equal(result.body.status, 'submitted')
  assert.equal(result.body.notificationPending, true)
  assert.equal(f.messages.length, 1)
  f.failOwner(false)
  assert.equal((await f.service.status({ token: result.body.token })).body.notificationPending, false)
  assert.equal(f.messages.length, 2)
  assert.equal((await f.service.status({ token: result.body.token })).body.notificationPending, false)
  assert.equal(f.messages.length, 2)
})

test('Gmail mode ignores the old Resend webhook', async () => {
  const f = fixture()
  assert.equal((await f.service.webhook('invalid', {})).body.ignored, true)
  assert.equal(f.messages.length, 0)
})

test('SMTP adapter enforces TLS, strips App Password spacing, and attaches bytes', async () => {
  let options, sent
  const sender = createGmailSender({ GMAIL_USER: 'owner@gmail.com', GMAIL_APP_PASSWORD: 'abcd efgh ijkl mnop' }, config => {
    options = config
    return { sendMail: async message => { sent = message; return { accepted: ['visitor@outlook.com'], messageId: 'smtp-1' } } }
  })
  await sender({ to: ['visitor@outlook.com'], subject: 'Resume', text: 'Attached', attachments: [{ filename: 'resume.pdf', content: Buffer.from('%PDF-test').toString('base64') }] })
  assert.equal(options.host, 'smtp.gmail.com')
  assert.equal(options.port, 465)
  assert.equal(options.secure, true)
  assert.equal(options.auth.pass, 'abcdefghijklmnop')
  assert.equal(options.disableFileAccess, true)
  assert.equal(sent.from.address, 'owner@gmail.com')
  assert.equal(sent.attachments[0].content.toString(), '%PDF-test')
})

test('SMTP adapter rejects a result with no accepted recipient', async () => {
  const sender = createGmailSender({ GMAIL_USER: 'owner@gmail.com', GMAIL_APP_PASSWORD: 'test' }, () => ({ sendMail: async () => ({ accepted: [], rejected: ['visitor@outlook.com'] }) }))
  await assert.rejects(() => sender({ to: ['visitor@outlook.com'], text: 'Resume' }), /recipient rejected/)
})

test('SMTP authentication failure is not mistaken for a nonexistent mailbox or success', async () => {
  const service = createResumeService({
    env: { RESUME_EMAIL_PROVIDER: 'gmail', GMAIL_USER: 'owner@gmail.com', GMAIL_APP_PASSWORD: 'test', UPSTASH_REDIS_REST_URL: 'https://storage.example.com', UPSTASH_REDIS_REST_TOKEN: 'token' },
    checkDomain: async () => 'valid', loadPdf: async () => Buffer.from('%PDF'),
    fetcher: async () => Response.json({ result: 1 }),
    gmailSend: async () => { throw Object.assign(new Error('secret authentication response'), { code: 'EAUTH' }) },
  })
  const result = await service.request({ email: 'visitor@outlook.com' }, 'ip')
  assert.equal(result.status, 503)
  assert.doesNotMatch(JSON.stringify(result.body), /secret|does not exist|delivered/)
})
