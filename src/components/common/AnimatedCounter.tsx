import { useInView } from 'framer-motion'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

function formatNumber(n: number) {
  // Keeps output clean for large-ish values without decimals.
  return Math.round(n).toString()
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  durationMs = 1100,
  className,
}: {
  value: number
  suffix?: string
  prefix?: string
  durationMs?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const start = performance.now()
    const from = 0
    const to = value

    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      const next = from + (to - from) * eased
      setDisplay(next)
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [durationMs, isInView, value])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {prefix}
      {formatNumber(display)}
      {suffix}
    </motion.span>
  )
}

