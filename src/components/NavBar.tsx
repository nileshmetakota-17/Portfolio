import { motion } from 'framer-motion'
import { portfolioData } from '../portfolioData'

export function NavBar({
  activeId,
  onNavigate,
  items,
}: {
  activeId: string
  onNavigate: (id: string) => void
  items: Array<{ id: string; label: string }>
}) {
  return (
    <header className="sticky top-0 z-50">
      <motion.div initial={false} className="mx-auto max-w-6xl px-4 pt-3">
        <nav className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-2 pr-2 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:gap-3 sm:pl-3 sm:pr-3">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex shrink-0 items-center gap-2 rounded-xl px-1 py-1 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:px-2"
            aria-label="Go to top"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] text-xs font-extrabold text-[#070a12] ring-1 ring-white/15">
              NM
            </span>
            <motion.div
              layout
              className="hidden min-w-0 flex-row items-center gap-2 whitespace-nowrap md:flex"
            >
              <span className="text-sm font-bold text-white">{portfolioData.name}</span>
              <span className="text-white/30" aria-hidden="true">
                |
              </span>
              <span className="text-xs font-medium text-white/60">{portfolioData.title}</span>
            </motion.div>
          </button>

          <motion.div
            className="nav-scroll min-w-0 flex-1 overflow-x-auto overscroll-x-contain"
            role="navigation"
            aria-label="Portfolio sections"
          >
            <div className="flex min-w-max items-center gap-1 px-1">
              {items.map((it) => {
                const isActive = activeId === it.id
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => onNavigate(it.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={[
                      'relative shrink-0 rounded-xl px-3 py-2 text-sm font-semibold whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
                      isActive
                        ? 'text-white'
                        : 'text-white/55 hover:bg-white/5 hover:text-white/85',
                    ].join(' ')}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-section-highlight"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--accent)]/25 to-[var(--accent2)]/25 ring-1 ring-[var(--accent)]/40 shadow-[0_0_20px_rgba(167,139,250,0.15)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{it.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-section-underline"
                        className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </nav>
      </motion.div>
    </header>
  )
}
