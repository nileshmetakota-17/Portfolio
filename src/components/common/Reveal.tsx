import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Reveal({
  children,
  className,
  delayMs = 0,
}: {
  children: ReactNode
  className?: string
  delayMs?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px 0px -40px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: delayMs / 1000 }}
    >
      {children}
    </motion.div>
  )
}

