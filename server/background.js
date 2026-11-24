import { waitUntil } from '@vercel/functions'

// Vercel must retain the invocation after the HTTP response for email work.
// In local development the Node process remains alive without that context.
export function deferTask(task) {
  const promise = Promise.resolve().then(task).catch(() => {
    console.error('[resume-mail] Background notification failed; pending state is retained for retry.')
  })
  if (process.env.VERCEL) waitUntil(promise)
}
