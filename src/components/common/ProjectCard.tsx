import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function ProjectCard({
  title,
  description,
  technologies,
  features,
  githubUrl,
  liveUrl,
  badge,
}: {
  title: string
  description: string
  technologies: string[]
  features: string[]
  githubUrl?: string
  liveUrl?: string
  badge?: ReactNode
}) {
  const hasLive = Boolean(liveUrl)
  const hasGit = Boolean(githubUrl)

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px 0px -40px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/3 backdrop-blur-xl"
      whileHover={{ y: -4 }}
    >
      <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[rgba(167,139,250,0.18)] blur-2xl" />
        <div className="absolute -right-24 -bottom-24 h-56 w-56 rounded-full bg-[rgba(96,165,250,0.16)] blur-2xl" />
      </div>

      <div className="p-6">
        {/* Thumbnail/banner placeholder (image assets can be added later) */}
        <div className="relative h-28 overflow-hidden rounded-2xl ring-1 ring-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent">
          <div className="absolute inset-0 opacity-90">
            <div className="absolute -left-12 -top-10 h-28 w-28 rounded-full bg-[rgba(167,139,250,0.25)] blur-2xl" />
            <div className="absolute -right-12 -bottom-14 h-32 w-32 rounded-full bg-[rgba(96,165,250,0.22)] blur-2xl" />
          </div>
          <div className="relative flex h-full items-center justify-between px-4">
            <div>
              <div className="text-xs font-semibold text-white/70">Preview</div>
              <div className="mt-1 truncate text-sm font-bold text-white/90" title={title}>
                {title.replace(/\s–\s.*/, '')}
              </div>
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                <span className="text-base font-extrabold text-white/90">
                  {title.trim()[0]?.toUpperCase() ?? 'P'}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]" />
              Project
            </div>
          </div>
          {badge}
        </div>

        <div className="mt-5">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/75">{description}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {technologies.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/75 ring-1 ring-white/10"
            >
              {t}
            </span>
          ))}
        </div>

        <ul className="mt-5 space-y-2 text-sm text-white/80">
          {features.slice(0, 3).map((f) => (
            <li key={f} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          {hasGit && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
            >
              GitHub
            </a>
          )}
          {hasLive && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-white/0 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/5"
            >
              Live Demo
            </a>
          )}
          {!hasLive && <span className="text-sm text-white/55 self-center">Live demo: soon</span>}
        </div>
      </div>
    </motion.article>
  )
}

