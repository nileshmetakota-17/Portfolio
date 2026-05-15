import type { ReactNode } from 'react'

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={[
        'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl',
        'shadow-[0_0_0_1px_rgba(255,255,255,0.02)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

