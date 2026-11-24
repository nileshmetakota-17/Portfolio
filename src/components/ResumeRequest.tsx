import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type Delivery = 'idle' | 'sending' | 'pending' | 'delivered' | 'error'

export function ResumeRequest() {
  const [email, setEmail] = useState('')
  const [delivery, setDelivery] = useState<Delivery>('idle')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')
  const [pollRun, setPollRun] = useState(0)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (!token) return
    let stopped = false
    let timer: ReturnType<typeof setTimeout>
    const controller = new AbortController()
    const started = Date.now()
    async function check() {
      try {
        const response = await fetch('/api/resume-status', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }), signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
        })
        const result = await response.json()
        if (stopped) return
        if (!response.ok) throw new Error(result.error || 'Unable to check delivery right now.')
        if (result.status === 'delivered') {
          setDelivery('delivered')
          setMessage('Your resume was delivered. Please check your inbox and spam folder.')
          setChecking(false)
          return
        }
        if (result.status === 'failed' || result.status === 'nonexistent') {
          setDelivery('error')
          setMessage(result.status === 'nonexistent' ? 'This email address does not exist. Please check it and try again.' : 'The resume could not be delivered to this address. Please check the address or try another email.')
          setChecking(false)
          return
        }
        if (Date.now() - started < 120000) {
          setChecking(true)
          timer = setTimeout(check, 3000)
        } else {
          setMessage('Delivery has not been confirmed yet. Check your inbox or check the delivery status again shortly.')
          setChecking(false)
        }
      } catch (error) {
        if (stopped) return
        setMessage(error instanceof Error ? error.message : 'Unable to check delivery right now.')
        setChecking(false)
      }
    }
    void check()
    return () => { stopped = true; controller.abort(); clearTimeout(timer) }
  }, [token, pollRun])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return
    const website = String(new FormData(event.currentTarget).get('website') || '')
    setToken('')
    setDelivery('sending')
    setMessage('Requesting your resume email…')
    try {
      const response = await fetch('/api/request-resume', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), website }), signal: AbortSignal.timeout(60000),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to send the resume. Please try again later.')
      if (!result.token) throw new Error('Unable to track delivery. Please try again later.')
      setDelivery('pending')
      setMessage('Your email is queued. Waiting for delivery confirmation…')
      setChecking(true)
      setToken(result.token)
    } catch (error) {
      setDelivery('error')
      setMessage(error instanceof Error ? error.message : 'Unable to send the resume. Please try again later.')
    }
  }
  return <section id="resume-request" className="section-shell resume-section" aria-labelledby="resume-title">
    <span className="eyebrow muted">RESUME BY EMAIL</span>
    <h2 id="resume-title">Get my resume</h2>
    <p>Enter your email address and I’ll send my resume as a PDF attachment.</p>
    <form className="resume-form" onSubmit={submit}>
      <label htmlFor="resume-email">Email address</label>
      <input id="resume-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" aria-describedby="resume-help resume-status" disabled={delivery === 'sending' || checking} />
      <div className="resume-trap" aria-hidden="true"><label htmlFor="resume-website">Website</label><input id="resume-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <p id="resume-help" className="muted">Your email is used to deliver this resume.</p>
      <button className="pill-button" type="submit" disabled={delivery === 'sending' || checking}>{delivery === 'sending' ? 'Sending…' : checking ? 'Checking delivery…' : 'Email me the resume'}</button>
    </form>
    <p id="resume-status" role={delivery === 'error' ? 'alert' : 'status'} className={`resume-status ${delivery === 'error' ? 'resume-error' : ''}`}>{message}</p>
    {token && delivery === 'pending' && !checking && <button className="text-link copy-button" type="button" onClick={() => { setChecking(true); setPollRun(value => value + 1) }}>Check delivery status</button>}
  </section>
}
