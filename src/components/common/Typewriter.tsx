import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function Typewriter({
  phrases,
  className,
  typingMs = 60,
  pauseMs = 900,
  deletingMs = 35,
}: {
  phrases: string[]
  className?: string
  typingMs?: number
  pauseMs?: number
  deletingMs?: number
}) {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing')

  const current = phrases[clamp(phraseIdx, 0, phrases.length - 1)] ?? ''

  const remaining = useMemo(() => current.slice(text.length), [current, text])

  useEffect(() => {
    if (!current) return

    const timer = window.setTimeout(() => {
      if (phase === 'typing') {
        setText((prev) => (prev.length < current.length ? current.slice(0, prev.length + 1) : prev))
        if (text.length >= current.length - 1) setPhase('pause')
      } else if (phase === 'pause') {
        setPhase('deleting')
      } else if (phase === 'deleting') {
        setText((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev))
        if (text.length <= 0) {
          setPhraseIdx((i) => (i + 1) % phrases.length)
          setPhase('typing')
        }
      }
    }, phase === 'typing' ? typingMs : phase === 'pause' ? pauseMs : deletingMs)

    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, phase, phraseIdx, pauseMs, deletingMs, typingMs, remaining, text.length, phrases.length])

  return (
    <span className={className}>
      <motion.span
        className="relative inline-flex"
        initial={false}
        animate={{ color: 'rgba(255,255,255,0.98)' }}
        transition={{ duration: 0.25 }}
      >
        {text}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1 right-0 h-[1.05em] w-[2px] rounded-sm bg-white/60"
          style={{ opacity: phase === 'deleting' ? 0 : 1 }}
        />
      </motion.span>
    </span>
  )
}

