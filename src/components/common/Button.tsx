import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  icon?: ReactNode
  type?: 'button' | 'submit'
  /** `true` uses the URL filename; pass a string to force the saved filename */
  download?: boolean | string
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]'

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  className,
  icon,
  type = 'button',
  download,
}: Props) {
  const variants: Record<string, string> = {
    primary:
      'bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15 hover:ring-white/25',
    secondary:
      'bg-white/0 text-slate-200 ring-1 ring-white/15 hover:bg-white/5 hover:ring-white/25',
    ghost: 'bg-transparent text-slate-200 hover:bg-white/5 ring-1 ring-transparent hover:ring-white/15',
  }

  const motionProps = {
    whileHover: { y: -1 },
    whileTap: { scale: 0.98 },
  }

  if (href) {
    return (
      <motion.a
        {...motionProps}
        href={href}
        download={download === true ? true : download || undefined}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
        className={[base, variants[variant], className].filter(Boolean).join(' ')}
      >
        {icon}
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      {...motionProps}
      type={type}
      onClick={onClick}
      className={[base, variants[variant], className].filter(Boolean).join(' ')}
    >
      {icon}
      {children}
    </motion.button>
  )
}

