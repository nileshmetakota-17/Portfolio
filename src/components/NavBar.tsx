import { motion } from 'framer-motion'
import { portfolioData } from '../portfolioData'

const linkBase =
  'relative shrink-0 px-3 py-2 text-sm font-semibold text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-xl whitespace-nowrap'

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

          {/* Horizontally scrollable section links */}
          <div
            className="nav-scroll min-w-0 flex-1 overflow-x-auto overscroll-x-contain"
            role="navigation"
            aria-label="Portfolio sections"
          >
            <motion.div className="flex min-w-max items-center gap-0.5 px-1">
              {items.map((it) => {
                const isActive = activeId === it.id
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => onNavigate(it.id)}
                    className={linkBase}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <span className="absolute inset-x-2 -top-1.5 h-1 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]" />
                    )}
                    {it.label}
                  </button>
                )
              })}
            </motion.div>
          </div>
        </nav>
      </motion.div>
    </header>
  )
}
