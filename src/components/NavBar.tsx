import { useEffect, useRef } from 'react'
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    const container = scrollContainerRef.current
    const activeButton = linkRefs.current[activeId]
    if (!container || !activeButton) return

    const containerRect = container.getBoundingClientRect()
    const buttonRect = activeButton.getBoundingClientRect()

    const padding = 8
    const isHiddenLeft = buttonRect.left < containerRect.left + padding
    const isHiddenRight = buttonRect.right > containerRect.right - padding

    if (isHiddenLeft || isHiddenRight) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [activeId])

  return (
    <header className="sticky top-0 z-50">
      <motion.div initial={false} className="mx-auto max-w-6xl px-4 pt-3">
        <nav className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 py-2 pl-1.5 pr-1.5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:gap-2 sm:py-2.5 sm:pl-2 sm:pr-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex shrink-0 items-center gap-1.5 rounded-xl px-1 py-1 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:gap-2 sm:px-2"
            aria-label="Go to top"
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] text-[10px] font-extrabold text-[#070a12] ring-1 ring-white/15 sm:h-9 sm:w-9 sm:rounded-xl sm:text-xs">
              NM
            </span>
            <motion.div className="hidden min-w-0 flex-row items-center gap-2 whitespace-nowrap lg:flex">
              <span className="text-sm font-bold text-white">{portfolioData.shortName}</span>
              <span className="hidden text-white/30 xl:inline" aria-hidden="true">
                |
              </span>
              <span className="hidden text-xs font-medium text-white/60 xl:inline">
                {portfolioData.title}
              </span>
            </motion.div>
          </button>

          <div
            ref={scrollContainerRef}
            className="nav-scroll min-w-0 flex-1 overflow-x-auto overscroll-x-contain scroll-smooth"
            role="navigation"
            aria-label="Portfolio sections"
          >
            <div className="flex min-w-max items-center gap-0.5 px-0.5 sm:gap-1 sm:px-1">
              {items.map((it) => {
                const isActive = activeId === it.id
                return (
                  <button
                    key={it.id}
                    ref={(el) => {
                      linkRefs.current[it.id] = el
                    }}
                    type="button"
                    onClick={() => onNavigate(it.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={[
                      'relative shrink-0 rounded-lg px-2 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:rounded-xl sm:px-2.5 sm:py-2 sm:text-sm',
                      isActive
                        ? 'bg-gradient-to-r from-[var(--accent)]/25 to-[var(--accent2)]/25 text-white ring-1 ring-[var(--accent)]/40 shadow-[0_0_16px_rgba(167,139,250,0.12)]'
                        : 'text-white/55 hover:bg-white/5 hover:text-white/85',
                    ].join(' ')}
                  >
                    {it.label}
                  </button>
                )
              })}
            </div>
          </div>
        </nav>
      </motion.div>
    </header>
  )
}
