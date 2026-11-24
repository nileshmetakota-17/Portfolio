import nodemailer from 'nodemailer'

// Gmail does not support the confirmed-delivery webhooks used by Resend.
// A successful result means Gmail accepted the message for onward delivery.
export function createGmailSender(env, createTransport = nodemailer.createTransport) {
  const user = env.GMAIL_USER?.trim()
  const password = env.GMAIL_APP_PASSWORD?.replace(/\s/g, '')
  const transport = createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user, pass: password },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
    disableFileAccess: true, disableUrlAccess: true,
  })
  return async message => {
    const result = await transport.sendMail({
      from: { name: 'Nilesh Kumar Metakota', address: user },
      to: message.to, subject: message.subject, text: message.text,
      attachments: message.attachments?.map(attachment => ({
        filename: attachment.filename,
        content: Buffer.from(attachment.content, 'base64'),
        contentType: 'application/pdf',
      })),
    })
    const accepted = (result.accepted || []).map(address => String(address).toLowerCase())
    if (!message.to.every(address => accepted.includes(address.toLowerCase()))) {
      throw Object.assign(new Error('SMTP recipient rejected'), { responseCode: 550 })
    }
    return result.messageId
  }
}
