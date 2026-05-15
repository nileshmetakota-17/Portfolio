import { motion } from 'framer-motion'

export function SkillBar({ label, value }: { label: string; value: number }) {
  const safe = Math.max(0, Math.min(100, value))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-200">{label}</span>
        <span className="text-sm text-white/60">{safe}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]"
          initial={{ width: 0 }}
          whileInView={{ width: `${safe}%` }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

