import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function TimelineCard({
  title,
  subtitle,
  dateRange,
  children,
  icon,
}: {
  title: string
  subtitle: string
  dateRange: string
  children: ReactNode
  icon?: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px 0px -40px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="relative rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-6"
    >
      <div className="absolute left-5 top-7 h-3 w-3 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] shadow-[0_0_0_4px_rgba(167,139,250,0.12)]" />

      <div className="ml-10">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              {icon}
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <p className="text-sm text-white/70">{subtitle}</p>
          </div>
          <div className="text-sm text-white/55">{dateRange}</div>
        </div>
        <div className="mt-4 text-sm leading-relaxed text-white/80">{children}</div>
      </div>
    </motion.div>
  )
}

