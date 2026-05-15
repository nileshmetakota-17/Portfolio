import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Briefcase,
  Calendar,
  Code2,
  GraduationCap,
  Globe,
  Laptop,
  Mail,
  MapPin,
  Network,
  Phone,
  BadgeCheck,
  Sparkles,
  Star,
} from 'lucide-react'

import { portfolioData } from './portfolioData'
import { NavBar } from './components/NavBar'
import { ScrollProgress } from './components/ScrollProgress'
import { BackToTop } from './components/BackToTop'

import { Button } from './components/common/Button'
import { GlassCard } from './components/common/GlassCard'
import { Reveal } from './components/common/Reveal'
import { Typewriter } from './components/common/Typewriter'
import { AnimatedCounter } from './components/common/AnimatedCounter'
import { SkillBar } from './components/common/SkillBar'
import { TimelineCard } from './components/common/TimelineCard'
import { ProjectCard } from './components/common/ProjectCard'

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-white/65">{subtitle}</p> : null}
      </div>
    </div>
  )
}

function Divider() {
  return <div className="my-10 h-px w-full bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
}

export default function App() {
  const sectionItems = useMemo(
    () => [
      { id: 'home', label: 'Home' },
      { id: 'about', label: 'About' },
      { id: 'skills', label: 'Skills' },
      { id: 'experience', label: 'Experience' },
      { id: 'projects', label: 'Projects' },
      { id: 'education', label: 'Education' },
      { id: 'certifications', label: 'Certifications' },
      { id: 'achievements', label: 'Achievements' },
      { id: 'contact', label: 'Contact' },
    ],
    [],
  )

  const [activeId, setActiveId] = useState('home')

  const scrollOffset = 112 // matches scroll-mt-28 on sections

  const onNavigate = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setActiveId(id)

    if (id === 'contact') {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: Math.max(0, maxScroll), behavior: 'smooth' })
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - scrollOffset
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }

  useEffect(() => {
    const ids = sectionItems.map((s) => s.id)

    const updateActiveSection = () => {
      const navLine = scrollOffset + 24
      const viewportHeight = window.innerHeight
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - viewportHeight

      const contactEl = document.getElementById('contact')
      if (contactEl) {
        const contactTop = contactEl.getBoundingClientRect().top
        if (scrollY >= maxScroll - 80 || contactTop <= viewportHeight * 0.45) {
          setActiveId('contact')
          return
        }
      }

      let current = ids[0] ?? 'home'
      let bestVisible = 0

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue

        const rect = el.getBoundingClientRect()
        const visibleTop = Math.max(rect.top, navLine)
        const visibleBottom = Math.min(rect.bottom, viewportHeight)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)

        if (visibleHeight > bestVisible) {
          bestVisible = visibleHeight
          current = id
        }
      }

      setActiveId(current)
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        updateActiveSection()
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    updateActiveSection()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [sectionItems, scrollOffset])

  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <NavBar activeId={activeId} onNavigate={onNavigate} items={sectionItems} />

      <main className="mx-auto max-w-6xl px-4 pb-32 pt-10">
        {/* HERO */}
        <section id="home" className="scroll-mt-28">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/4 backdrop-blur-xl">
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 -z-10"
              style={{
                background:
                  'radial-gradient(600px circle at 10% 10%, rgba(96,165,250,0.18), transparent 55%), radial-gradient(650px circle at 90% 20%, rgba(167,139,250,0.18), transparent 60%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
            />

            <motion.div
              aria-hidden="true"
              className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[rgba(167,139,250,0.20)] blur-2xl"
              animate={{ x: [0, 36, 0], y: [0, 14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
              aria-hidden="true"
              className="absolute -right-24 top-28 h-72 w-72 rounded-full bg-[rgba(96,165,250,0.18)] blur-3xl"
              animate={{ x: [0, -32, 0], y: [0, 16, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="grid gap-10 p-8 md:grid-cols-12 md:p-10">
              <div className="md:col-span-7">
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 ring-1 ring-white/10">
                    <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                    ML Engineering | Robotics Automation | Full-Stack Mindset
                  </div>
                </Reveal>

                <Reveal delayMs={80}>
                  <h1 className="mt-5 flex flex-row flex-wrap items-baseline gap-x-3 gap-y-1 text-3xl font-extrabold leading-tight text-white sm:gap-x-4 sm:text-4xl md:text-5xl md:whitespace-nowrap">
                    {portfolioData.nameParts.map((part, i) => (
                      <span
                        key={part}
                        className={
                          i === portfolioData.nameParts.length - 1
                            ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] bg-clip-text text-transparent'
                            : ''
                        }
                      >
                        {part}
                      </span>
                    ))}
                  </h1>
                </Reveal>

                <Reveal delayMs={140}>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="text-white/70 text-base font-semibold">
                      {portfolioData.title}
                    </div>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <div className="text-sm text-white/65">
                      Focus: <span className="text-white/80">training, datasets, optimization</span>
                    </div>
                  </div>
                </Reveal>

                <Reveal delayMs={220}>
                  <div className="mt-6 text-lg leading-relaxed text-white/75">
                    {portfolioData.hero.tagline}
                  </div>
                </Reveal>

                <Reveal delayMs={260}>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">
                    {portfolioData.hero.intro[0]}
                    <br />
                    {portfolioData.hero.intro[1]}
                  </p>
                </Reveal>

                <Reveal delayMs={320}>
                  <div className="mt-6 text-sm text-white/60">
                    Building for impact: <Typewriter phrases={portfolioData.hero.typewriterPhrases} className="font-semibold text-white" />
                  </div>
                </Reveal>

                <Reveal delayMs={380}>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      href={portfolioData.resume.path}
                      download={portfolioData.resume.downloadName}
                      variant="primary"
                      icon={<Star className="h-4 w-4" />}
                    >
                      {portfolioData.hero.cta.downloadResumeLabel}
                    </Button>
                    <Button
                      onClick={() => onNavigate('contact')}
                      variant="secondary"
                      icon={<Mail className="h-4 w-4" />}
                    >
                      {portfolioData.hero.cta.contactLabel}
                    </Button>
                    <Button
                      onClick={() => onNavigate('projects')}
                      variant="ghost"
                      icon={<ArrowRight className="h-4 w-4" />}
                      className="sm:ml-1"
                    >
                      {portfolioData.hero.cta.viewProjectsLabel}
                    </Button>
                  </div>
                </Reveal>

                <Reveal delayMs={440}>
                  <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-white/60">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
                      <MapPin className="h-4 w-4 text-white/70" />
                      {portfolioData.location}
                    </div>
                    <a
                      href={portfolioData.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                      aria-label={`GitHub profile @${portfolioData.githubHandle}`}
                    >
                      <Code2 className="h-4 w-4 text-white/70" />
                      GitHub: @{portfolioData.githubHandle}
                    </a>
                    <a
                      href={portfolioData.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                      aria-label={`LinkedIn profile ${portfolioData.linkedinHandle}`}
                    >
                      <Network className="h-4 w-4 text-white/70" />
                      LinkedIn: {portfolioData.linkedinHandle}
                    </a>
                  </div>
                </Reveal>
              </div>

              <div className="md:col-span-5">
                <div className="flex h-full flex-col items-center justify-center gap-5">
                  <div className="w-full">
                    <div className="grid grid-cols-2 gap-3">
                      {portfolioData.stats.map((s) => (
                        <GlassCard key={s.label} className="p-4">
                          <div className="text-xs font-semibold text-white/65">{s.label}</div>
                          <div className="mt-2 text-2xl font-extrabold text-white">
                            {s.value.match(/^\d+$/) ? (
                              <AnimatedCounter value={Number(s.value)} />
                            ) : (
                              s.value
                            )}
                          </div>
                          <div className="mt-1 text-xs text-white/55">{s.hint}</div>
                        </GlassCard>
                      ))}
                    </div>
                  </div>

                  <div className="w-full">
                    <GlassCard className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                          <Laptop className="h-5 w-5 text-[var(--accent)]" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">Industry-ready mindset</div>
                          <div className="mt-1 text-sm leading-relaxed text-white/65">
                            Focused on measurable improvements: reliable data pipelines, consistent evaluation, and deployment-safe ML workflows.
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ABOUT */}
        <section id="about" className="scroll-mt-28">
          <Reveal>
            <SectionHeader
              icon={<Sparkles className="h-5 w-5 text-[var(--accent2)]" />}
              title="About Me"
              subtitle="Confident, recruiter-friendly, and built for real-world impact."
            />
          </Reveal>

          <div className="mt-7 grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-7" delayMs={60}>
              <GlassCard className="p-7">
                <p className="text-sm leading-relaxed text-white/75">
                  I’m an <span className="font-semibold text-white">{portfolioData.title}</span> with a strong foundation in ML model training,
                  dataset preparation, and optimization. I’m currently focused on building reliable automation capabilities for robotics environments.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  My goal is to grow into an industry Machine Learning Engineer role where I can ship trustworthy models, improve iteration speed with
                  robust data pipelines, and deliver measurable outcomes in production systems.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <Briefcase className="h-4 w-4 text-[var(--accent)]" />
                      Career goals
                    </div>
                    <div className="mt-2 text-sm text-white/65">
                      Deliver robotics-ready ML that performs reliably in real environments.
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <Code2 className="h-4 w-4 text-[var(--accent2)]" />
                      Strengths
                    </div>
                    <div className="mt-2 text-sm text-white/65">
                      Training workflows, dataset handling, evaluation, and performance optimization.
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <Star className="h-4 w-4 text-[var(--accent)]" />
                      Work ethic
                    </div>
                    <div className="mt-2 text-sm text-white/65">
                      Continuous monitoring and fine-tuning to keep models accurate and dependable.
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <Award className="h-4 w-4 text-[var(--accent2)]" />
                      Mindset
                    </div>
                    <div className="mt-2 text-sm text-white/65">
                      Curiosity, fast learning, and collaboration across teams.
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            <Reveal className="lg:col-span-5" delayMs={120}>
              <GlassCard className="p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                    <Globe className="h-5 w-5 text-[var(--accent2)]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">What I bring</div>
                    <div className="mt-1 text-sm text-white/65">
                      A practical blend of ML engineering and full-stack fundamentals.
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm font-semibold text-white">
                      <span>Model Lifecycle</span>
                      <span className="text-white/55">train &rarr; eval &rarr; tune</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/5 ring-1 ring-white/10 overflow-hidden">
                      <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm font-semibold text-white">
                      <span>Data Readiness</span>
                      <span className="text-white/55">prep &rarr; label &rarr; optimize</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/5 ring-1 ring-white/10 overflow-hidden">
                      <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-[var(--accent2)] to-[var(--accent)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm font-semibold text-white">
                      <span>Delivery Mindset</span>
                      <span className="text-white/55">deploy-safe workflows</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/5 ring-1 ring-white/10 overflow-hidden">
                      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]" />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </section>

        <Divider />

        {/* SKILLS */}
        <section id="skills" className="scroll-mt-28">
          <Reveal>
            <SectionHeader
              icon={<Code2 className="h-5 w-5 text-[var(--accent)]" />}
              title="Skills"
              subtitle="Structured, categorized, and designed to be recruiter-scannable."
            />
          </Reveal>

          <div className="mt-7 grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-7" delayMs={70}>
              <div className="grid gap-4 sm:grid-cols-2">
                {portfolioData.skills.technical.map((cat) => (
                  <GlassCard key={cat.category} className="p-5">
                    <div className="text-sm font-bold text-white">{cat.category}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {cat.items.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70 ring-1 ring-white/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </Reveal>

            <Reveal className="lg:col-span-5" delayMs={120}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">Strength Areas</div>
                    <div className="mt-1 text-sm text-white/65">Animated progress for key capabilities</div>
                  </div>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                    <Sparkles className="h-5 w-5 text-[var(--accent2)]" />
                  </div>
                </div>
                <div className="mt-5 space-y-5">
                  {portfolioData.skills.progress.map((s) => (
                    <SkillBar key={s.label} label={s.label} value={s.value} />
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          </div>

          <Reveal delayMs={120}>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {portfolioData.skills.professional.map((cat) => (
                <GlassCard key={cat.category} className="p-5">
                  <div className="text-sm font-bold text-white">{cat.category}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cat.items.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70 ring-1 ring-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          </Reveal>
        </section>

        <Divider />

        {/* EXPERIENCE */}
        <section id="experience" className="scroll-mt-28">
          <Reveal>
            <SectionHeader
              icon={<Briefcase className="h-5 w-5 text-[var(--accent2)]" />}
              title="Experience"
              subtitle="Timeline highlights with recruiter-focused responsibilities."
            />
          </Reveal>

          <div className="mt-7 grid gap-4">
            {portfolioData.experience.map((exp, idx) => (
              <Reveal key={`${exp.company}-${exp.role}`} delayMs={idx * 60}>
                <TimelineCard
                  title={exp.role}
                  subtitle={exp.company}
                  dateRange={`${exp.start} – ${exp.end}`}
                  icon={<Calendar className="h-5 w-5 text-[var(--accent)]" />}
                >
                  <ul className="space-y-2">
                    {exp.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </TimelineCard>
              </Reveal>
            ))}
          </div>
        </section>

        <Divider />

        {/* PROJECTS */}
        <section id="projects" className="scroll-mt-28">
          <Reveal>
            <SectionHeader
              icon={<Laptop className="h-5 w-5 text-[var(--accent)]" />}
              title="Projects"
              subtitle="Production-grade presentation with premium project cards."
            />
          </Reveal>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {portfolioData.projects.map((p, idx) => (
              <ProjectCard
                key={p.title}
                title={p.title}
                description={p.description}
                technologies={p.technologies}
                features={p.features}
                githubUrl={p.githubUrl}
                liveUrl={p.liveUrl || ''}
                badge={
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)]" />
                    {idx === 0 ? 'Featured' : 'Project'}
                  </div>
                }
              />
            ))}
          </div>

          <div className="mt-6 text-sm text-white/60">
            Want more projects showcased? Add links and screenshots and I’ll upgrade the grid layout to match.
          </div>
        </section>

        <Divider />

        {/* EDUCATION */}
        <section id="education" className="scroll-mt-28">
          <Reveal>
            <SectionHeader
              icon={<GraduationCap className="h-5 w-5 text-[var(--accent2)]" />}
              title="Education"
              subtitle="Clear and recruiter-friendly academic timeline."
            />
          </Reveal>

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {portfolioData.education.map((edu) => (
              <Reveal key={edu.institution} delayMs={60}>
                <GlassCard className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                      <GraduationCap className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{edu.institution}</div>
                      <div className="mt-1 text-xs text-white/60">{edu.program}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-white/55">
                    <span>{edu.start}</span>
                    <span>{edu.end}</span>
                  </div>
                  {edu.detail ? (
                    <div className="mt-4 rounded-2xl bg-white/4 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/10">
                      {edu.detail}
                    </div>
                  ) : null}
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </section>

        <Divider />

        {/* CERTIFICATIONS */}
        <section id="certifications" className="scroll-mt-28">
          <Reveal>
            <SectionHeader
              icon={<BadgeCheck className="h-5 w-5 text-[var(--accent)]" />}
              title="Certifications"
              subtitle="Credential cards with clear issuing organization and date."
            />
          </Reveal>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {portfolioData.certifications.map((c) => (
              <Reveal key={c.title} delayMs={80}>
                <GlassCard className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-white">{c.title}</div>
                      <div className="mt-1 text-sm text-white/65">{c.issuingOrg}</div>
                    </div>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                      <BadgeCheck className="h-5 w-5 text-[var(--accent2)]" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-white/55">
                    Completed: <span className="font-semibold text-white/70">{c.date}</span>
                  </div>
                  {c.credentialId ? (
                    <div className="mt-2 text-xs text-white/55">
                      Credential ID: <span className="font-semibold text-white/70">{c.credentialId}</span>
                    </div>
                  ) : null}
                  <div className="mt-5 flex flex-wrap gap-3">
                    {c.credentialUrl ? (
                      <Button href={c.credentialUrl} variant="secondary" className="px-4">
                        Credential Link
                      </Button>
                    ) : (
                      <span className="text-sm text-white/55">Credential link: available soon</span>
                    )}
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </section>

        <Divider />

        {/* ACHIEVEMENTS */}
        <section id="achievements" className="scroll-mt-28">
          <Reveal>
            <SectionHeader
              icon={<Award className="h-5 w-5 text-[var(--accent2)]" />}
              title="Achievements"
              subtitle="Impact-focused highlights tailored for hiring managers."
            />
          </Reveal>

          <div className="mt-7 grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <GlassCard className="p-6">
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                    <Sparkles className="h-5 w-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Quick proof points</div>
                    <div className="mt-1 text-sm text-white/65">Animated counters for fast scanning</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  {portfolioData.stats.map((s) => (
                    <div key={s.label} className="rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
                      <div className="text-xs font-semibold text-white/65">{s.label}</div>
                      <div className="mt-2 text-2xl font-extrabold text-white">
                        {s.value.match(/^\d+$/) ? (
                          <AnimatedCounter value={Number(s.value)} />
                        ) : (
                          s.value
                        )}
                      </div>
                      <div className="mt-1 text-xs text-white/55">{s.hint}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-4 sm:grid-cols-2">
                {portfolioData.achievements.map((a) => (
                  <Reveal key={a.title} delayMs={60}>
                    <GlassCard className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                          <Award className="h-5 w-5 text-[var(--accent2)]" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{a.title}</div>
                          <div className="mt-2 text-sm text-white/65">{a.description}</div>
                        </div>
                      </div>
                    </GlassCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-28 min-h-[50vh] pb-8">
          <Reveal>
            <SectionHeader
              icon={<Mail className="h-5 w-5 text-[var(--accent)]" />}
              title="Contact"
              subtitle="Let’s build something reliable and impactful."
            />
          </Reveal>

          <div className="mt-7 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="grid gap-4">
                <GlassCard className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                      <Mail className="h-5 w-5 text-[var(--accent2)]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Email</div>
                      <a
                        href={`mailto:${portfolioData.email}`}
                        className="mt-1 block text-sm font-semibold text-white/80 hover:text-white"
                      >
                        {portfolioData.email}
                      </a>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                      <Phone className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Phone</div>
                      <a
                        href={`tel:${portfolioData.phone.replace(/\s+/g, '')}`}
                        className="mt-1 block text-sm font-semibold text-white/80 hover:text-white"
                      >
                        {portfolioData.phone}
                      </a>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                      <MapPin className="h-5 w-5 text-[var(--accent2)]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Location</div>
                      <div className="mt-1 text-sm text-white/70">{portfolioData.location}</div>
                    </div>
                  </div>
                </GlassCard>

                <div className="flex flex-wrap gap-3">
                  <Button
                    href={portfolioData.links.github}
                    variant="secondary"
                    icon={<Code2 className="h-4 w-4" />}
                  >
                    GitHub
                  </Button>
                  <Button
                    href={portfolioData.links.linkedin}
                    variant="ghost"
                    icon={<Network className="h-4 w-4" />}
                  >
                    LinkedIn
                  </Button>
                  <Button
                    href={portfolioData.resume.path}
                    download={portfolioData.resume.downloadName}
                    variant="ghost"
                    icon={<Star className="h-4 w-4" />}
                  >
                    Resume
                  </Button>
                  <Button
                    href="#projects"
                    variant="ghost"
                    icon={<Laptop className="h-4 w-4" />}
                  >
                    Projects
                  </Button>
                </div>

              </div>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>

      <BackToTop />
    </div>
  )
}

function ContactForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; message?: string }>({})

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (fullName.trim().length < 2) nextErrors.fullName = 'Please enter your name.'
    if (!validateEmail(email)) nextErrors.email = 'Please enter a valid email.'
    if (message.trim().length < 10) nextErrors.message = 'Message should be at least 10 characters.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('error')
      return
    }

    const subject = `Portfolio inquiry from ${fullName}`
    const body = `Hi Nilesh,%0D%0A%0D%0A${message}%0D%0A%0D%0AFrom: ${fullName}%0D%0AEmail: ${email}%0D%0A`
    window.location.href = `mailto:${portfolioData.email}?subject=${encodeURIComponent(subject)}&body=${body}`
    setStatus('sent')
  }

  return (
    <GlassCard className="lg:col-span-7 p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white">Contact form</div>
          <div className="mt-1 text-sm text-white/65">
            Uses mailto fallback (client-side) and includes validation for recruiter-ready outreach.
          </div>
        </div>
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
          <Mail className="h-5 w-5 text-[var(--accent)]" />
        </div>
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={onSubmit}
        data-netlify="true"
        name="contact"
        method="post"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-white/80">Full name</span>
            <input
              value={fullName}
              onChange={(ev) => setFullName(ev.target.value)}
              className="mt-2 w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder="Your name"
              autoComplete="name"
              required
            />
            {errors.fullName ? <div className="mt-1 text-xs text-rose-300">{errors.fullName}</div> : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-white/80">Email</span>
            <input
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className="mt-2 w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder="you@example.com"
              autoComplete="email"
              required
              inputMode="email"
            />
            {errors.email ? <div className="mt-1 text-xs text-rose-300">{errors.email}</div> : null}
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-white/80">Message</span>
          <textarea
            value={message}
            onChange={(ev) => setMessage(ev.target.value)}
            className="mt-2 min-h-28 w-full resize-y rounded-xl bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            placeholder="Tell me what role/project you’re considering and how I can help."
            required
          />
          {errors.message ? <div className="mt-1 text-xs text-rose-300">{errors.message}</div> : null}
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-white/55">
            {status === 'sent' ? (
              <span className="text-emerald-300 font-semibold">Message ready. Your email client should open.</span>
            ) : status === 'error' ? (
              <span className="text-rose-300 font-semibold">Please fix the highlighted fields.</span>
            ) : (
              <span>By submitting, your message will open via email.</span>
            )}
          </div>

          <Button type="submit" variant="primary" icon={<ArrowRight className="h-4 w-4" />}>
            Send Message
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}

