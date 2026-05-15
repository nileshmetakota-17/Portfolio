import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useState } from 'react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const controls = useAnimationControls()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    controls.start({ opacity: visible ? 1 : 0, y: visible ? 0 : 10 })
  }, [controls, visible])

  return (
    <motion.button
      aria-label="Back to top"
      initial={false}
      animate={controls}
      transition={{ duration: 0.2 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-[70] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-3 py-2 text-sm font-semibold text-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      ↑ Top
    </motion.button>
  )
}

