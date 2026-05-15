import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const next = max > 0 ? (doc.scrollTop / max) * 100 : 0
      setProgress(next)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[60] h-0 w-full">
      <div
        className="h-[2px] w-full bg-white/5"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

