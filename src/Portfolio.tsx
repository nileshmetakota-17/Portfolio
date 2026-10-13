import { useEffect, useRef, useState } from 'react'
import type { FormEvent, MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { ArrowUpRight, ArrowDown, ArrowUp, Code2, Network, Sun, Moon, Download, Check, Menu, X, Mail } from 'lucide-react'
import { portfolioData as data } from './portfolioData'

function NavigationArt({ small = false }: { small?: boolean }) {
  const grid = small ? 'project-grid' : 'hero-grid'
  const routeRef = useRef<SVGPathElement>(null)
  const carRef = useRef<SVGGElement>(null)
  useEffect(() => {
    const route = routeRef.current
    const car = carRef.current
    if (!route || !car) return
    const length = route.getTotalLength()
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let started = performance.now()
    function position(progress: number) {
      const distance = progress * length
      const point = route!.getPointAtLength(distance)
      const before = route!.getPointAtLength(Math.max(0, distance - 1))
      const after = route!.getPointAtLength(Math.min(length, distance + 1))
      const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI
      car!.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`)
    }
    function drive(now: number) {
      position(Math.min(((now - started) % 8000) / 7000, 1))
      frame = requestAnimationFrame(drive)
    }
    function start() {
      cancelAnimationFrame(frame)
      started = performance.now()
      if (preference.matches) position(.5)
      else { position(0); frame = requestAnimationFrame(drive) }
    }
    start()
    preference.addEventListener?.('change', start)
    return () => { cancelAnimationFrame(frame); preference.removeEventListener?.('change', start) }
  }, [])
  return <svg className="navigation-art" viewBox="0 0 640 640" fill="none" aria-hidden="true">
    <defs><pattern id={grid} width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" stroke="currentColor" strokeOpacity=".1" /></pattern></defs>
    <rect width="640" height="640" fill={`url(#${grid})`} />
    {[100, 180, 260].map(r => <circle key={r} cx="320" cy="320" r={r} stroke="currentColor" strokeOpacity=".2" strokeDasharray={r === 180 ? '3 7' : undefined} />)}
    <path d="M320 20V620M20 320H620M108 108L532 532M108 532L532 108" stroke="currentColor" strokeOpacity=".13" />
    <g fill="currentColor" fillOpacity=".06" stroke="currentColor" strokeOpacity=".35"><rect x="130" y="200" width="90" height="65" rx="8" /><rect x="380" y="350" width="115" height="75" rx="8" /><rect x="385" y="145" width="70" height="75" rx="8" /></g>
    <path d="M145 475H245Q270 475 270 445V360Q270 320 310 320H330Q355 320 355 295V265Q355 240 380 240H480V135" stroke="#b8efbf" strokeOpacity=".15" strokeWidth="15" />
    <path ref={routeRef} className="navigation-route" d="M145 475H245Q270 475 270 445V360Q270 320 310 320H330Q355 320 355 295V265Q355 240 380 240H480V135" stroke="#b8efbf" strokeWidth="2" strokeDasharray="6 7" />
    <g ref={carRef} className="route-traveler navigation-car" transform="translate(145 475)">
      <g fill="#10251a" stroke="#b8efbf" strokeWidth="1">
        <rect x="-18" y="-19" width="12" height="6" rx="2" /><rect x="9" y="-19" width="12" height="6" rx="2" />
        <rect x="-18" y="13" width="12" height="6" rx="2" /><rect x="9" y="13" width="12" height="6" rx="2" />
      </g>
      <rect x="-27" y="-15" width="54" height="30" rx="10" fill="#f0587a" stroke="#fff1f4" strokeWidth="2" />
      <path d="M8 -11L15 -9V9L8 11Z" fill="#173c31" stroke="#f8c9d3" strokeWidth="1" />
      <path d="M-16 -9L-11 -11V11L-16 9Z" fill="#173c31" stroke="#f8c9d3" strokeWidth="1" />
      <rect x="-9" y="-9" width="15" height="18" rx="3" fill="#ffc4d2" />
      <path d="M-6 -11H3M-6 11H3" stroke="#173c31" strokeWidth="2" strokeLinecap="round" />
      <rect x="22" y="-10" width="4" height="6" rx="2" fill="#fff4c1" /><rect x="22" y="4" width="4" height="6" rx="2" fill="#fff4c1" />
      <path d="M-25 -9V-4M-25 4V9" stroke="#9b2541" strokeWidth="3" strokeLinecap="round" />
    </g>
    <circle cx="145" cy="475" r="7" fill="#b8efbf" /><circle className="target-pulse" cx="480" cy="135" r="16" stroke="#f0587a" /><circle cx="480" cy="135" r="5" fill="#f0587a" />
    <g className="radar-sweep"><path d="M320 320V60A260 260 0 0 1 450 95Z" fill="#b8efbf" fillOpacity=".045" /><path d="M320 320V60" stroke="#b8efbf" strokeOpacity=".35" /></g>
    <circle cx="320" cy="320" r="23" fill="#182a21" stroke="#b8efbf" /><path d="M320 307L329 330L320 325L311 330Z" fill="#b8efbf" />
    <g fill="currentColor" fontSize="11" fontFamily="monospace" opacity=".6"><text x="25" y="32">LOCAL FRAME / MAP</text><text x="25" y="615">ROS 2 · NAV2</text><text x="446" y="615">POINT-TO-POINT</text><text x="110" y="505">START</text><text x="495" y="139">GOAL</text></g>
  </svg>
}

function FitnessArt() {
  return <div className="fitness-art" aria-hidden="true"><div className="fitness-orbit" /><div className="fitness-window"><div className="fitness-top"><span>fitoo<span className="pink">.</span></span><span>YOUR DAILY COMPANION</span></div><div className="fitness-greeting">A little better.<br /><strong>Every day.</strong></div><div className="fitness-ring"><span><strong>MOVE</strong><small>FUEL · TRAIN · REPEAT</small></span></div><div className="fitness-bottom"><span>Meals</span><span>Workouts</span><span className="ai-chip">Sensei AI ✦</span></div></div><span className="art-caption">AI × EVERYDAY WELLNESS</span></div>
}

function ContactForm() {
  const [ready, setReady] = useState(false)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const name = String(fields.get('name')).trim()
    const email = String(fields.get('email')).trim()
    const message = String(fields.get('message')).trim()
    window.location.href = `mailto:${data.email}?subject=${encodeURIComponent(`Portfolio inquiry from ${name}`)}&body=${encodeURIComponent(`Hi Nilesh,\r\n\r\n${message}\r\n\r\nFrom: ${name}\r\nEmail: ${email}`)}`
    setReady(true)
  }
  return <form className="contact-form" onSubmit={submit}><h3>Have something in mind?</h3><p>This form opens a draft in your email app.</p><div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="Your name" minLength={2} required /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label></div><label>Your message<textarea name="message" placeholder="Tell me about your project or opportunity." minLength={10} required rows={3} /></label><button className="pill-button" type="submit">Open email draft <ArrowUpRight size={17} /></button><p role="status">{ready ? 'Your draft is ready. Send it from your email app to get in touch.' : ''}</p></form>
}

export default function Portfolio() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try { return localStorage.getItem('nilesh-theme') === 'light' ? 'light' : 'dark' } catch { return 'dark' }
  })
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('home')
  const [copied, setCopied] = useState(false)
  const [themeChanging, setThemeChanging] = useState(false)
  const themeTransitionActive = useRef(false)
  async function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    if (themeTransitionActive.current) return
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    const applyTheme = () => {
      document.documentElement.dataset.theme = nextTheme
      flushSync(() => setTheme(nextTheme))
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyTheme()
      return
    }
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = bounds.left + bounds.width / 2
    const y = bounds.top + bounds.height / 2
    const root = document.documentElement
    root.style.setProperty('--theme-x', `${x}px`)
    root.style.setProperty('--theme-y', `${y}px`)
    root.style.setProperty('--theme-radius', `${Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))}px`)
    themeTransitionActive.current = true
    setThemeChanging(true)
    try {
      if (document.startViewTransition) {
        root.classList.add('theme-switching')
        const transition = document.startViewTransition(applyTheme)
        await transition.finished
      } else {
        root.classList.add('theme-smoothing')
        applyTheme()
        await new Promise(resolve => window.setTimeout(resolve, 550))
      }
    } catch {
      applyTheme()
    } finally {
      root.classList.remove('theme-switching', 'theme-smoothing')
      themeTransitionActive.current = false
      setThemeChanging(false)
    }
  }
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('nilesh-theme', theme) } catch { /* Theme works without storage. */ }
  }, [theme])
  useEffect(() => {
    if (typeof window.IntersectionObserver !== 'function') return
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
    }, { rootMargin: '-20% 0px -55% 0px' })
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      '.section-intro, .project-art, .project-copy, .about-story, .about-notes > div, .skills-grid > div, .experience-row, .education-grid article, .certificate-row, .highlights-grid article, .contact-section > .display-title, .contact-grid > div, .contact-form',
    )
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (typeof window.IntersectionObserver !== 'function') return
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      }
    }, { threshold: 0 })
    elements.forEach(element => {
      element.classList.add('scroll-reveal')
      if (preference.matches) element.classList.add('revealed')
      else observer.observe(element)
    })
    const showContent = () => {
      if (preference.matches) elements.forEach(element => element.classList.add('revealed'))
    }
    preference.addEventListener?.('change', showContent)
    return () => {
      observer.disconnect()
      preference.removeEventListener?.('change', showContent)
      elements.forEach(element => element.classList.remove('scroll-reveal', 'revealed'))
    }
  }, [])
  async function copyEmail() {
    try { await navigator.clipboard.writeText(data.email); setCopied(true); window.setTimeout(() => setCopied(false), 2000) }
    catch { window.location.href = `mailto:${data.email}` }
  }
  return <>
    <a href="#projects" className="skip-link">Skip to work</a>
    <header className={`site-header ${active === 'home' ? 'on-cover' : ''}`}>
      <a className="brand" href="#home" aria-label="Nilesh Metakota, home"><span className="monogram">N<span>.</span></span><span>Nilesh Metakota</span></a>
      <button className="menu-toggle icon-button" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} aria-controls="main-navigation" onClick={() => setMenu(!menu)}>{menu ? <X size={21} /> : <Menu size={21} />}</button>
      <nav id="main-navigation" className={menu ? 'header-nav open' : 'header-nav'} aria-label="Main navigation"><a href="#projects" aria-current={active === 'projects' ? 'location' : undefined} onClick={() => setMenu(false)}>Work</a><a href="#about" aria-current={active === 'about' ? 'location' : undefined} onClick={() => setMenu(false)}>About</a><a href={data.resume.path} download={data.resume.downloadName} onClick={() => setMenu(false)}>Resume</a><a className="pill-button" href="#contact" onClick={() => setMenu(false)}>Get in touch <ArrowUpRight size={16} /></a></nav>
      <button className="icon-button theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} disabled={themeChanging} onClick={toggleTheme}><span className="theme-icon" key={theme}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</span></button>
    </header>
    <main>
      <section id="home" className="hero-cover">
        <div className="star-trails" aria-hidden="true">{Array.from({ length: 22 }, (_, i) => <i key={i} style={{ left: `${i * 5}%`, top: `${(i * 13) % 70 - 30}%`, height: `${200 + (i % 5) * 90}px`, animationDelay: `${i * -.4}s` }} />)}</div>
        <div className="hero-art"><NavigationArt /></div>
        <div className="cover-topline"><span>ENGINEERING / INTELLIGENT AUTOMATION</span><span>BASED IN INDIA ↗</span></div>
        <div className="hero-content"><div className="eyebrow"><span className="status-dot" />{data.title} at Bhairav Robotics</div><h1>Nilesh Kumar<br /><span>Metakota<span className="pink">.</span></span></h1><p>I build autonomous navigation systems,<br className="desktop-break" /> work with machine learning, and turn ideas into code.</p><div className="hero-actions"><a className="pill-button" href="#projects">View work <ArrowDown size={17} /></a><a className="pill-button outlined" href={data.resume.path} download={data.resume.downloadName}>Resume <ArrowUpRight size={17} /></a></div></div>
        <div className="cover-footer"><span>ROS 2 / NAV2 / MACHINE LEARNING</span><a href="#projects">SCROLL TO EXPLORE <ArrowDown size={14} /></a></div>
      </section>
      <section id="projects" className="section-shell"><div className="section-intro"><span className="eyebrow muted">01 / SELECTED PROJECTS</span><h2 className="display-title">Work<span className="pink">.</span></h2><p>Robots that find their way. Applications that make everyday life better. A look at what I’ve been building.</p></div>
        {data.projects.map((project, index) => <article className="project-row" key={project.title}><div className={`project-art ${index === 0 ? 'navigation-project' : 'fitness-project'}`}>{index === 0 ? <NavigationArt small /> : <FitnessArt />}</div><div className="project-copy"><div className="project-category">{index === 0 ? 'Robotics / Autonomous systems' : 'Application development / AI'}</div><h3>{index === 0 ? 'Finding a way forward.' : 'Fitness, with a little intelligence.'}</h3><div className="project-name">{project.title}</div><p>{project.description}</p><ul className="project-features">{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul><div className="tag-list">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div><a className="text-link" href={project.githubUrl} target="_blank" rel="noopener noreferrer">Explore the repository <ArrowUpRight size={20} /></a></div></article>)}
      </section>
      <section id="about" className="section-shell about-section"><div className="section-intro"><span className="eyebrow muted">02 / A LITTLE ABOUT ME</span><h2 className="display-title">Curiosity<br />into code<span className="pink">.</span></h2></div><div className="about-grid"><div className="about-story"><p className="large-copy">I’m Nilesh, a robotics software engineer interested in how intelligent systems move, learn, and interact with the real world.</p><p>At Bhairav Robotics, I work on ROS 2 navigation, point-to-point movement, obstacle avoidance, and LiDAR, GPS, and camera integration. My path here has taken me through web development, testing, and machine learning.</p><p>I’m pursuing a B.Tech in Computer Science and Engineering at KITS, building on my diploma in Computer Engineering. I enjoy learning by building, debugging, and collaborating.</p><div className="about-links"><a className="text-link" href={data.links.github} target="_blank" rel="noopener noreferrer"><Code2 size={18} />GitHub <ArrowUpRight size={16} /></a><a className="text-link" href={data.links.linkedin} target="_blank" rel="noopener noreferrer"><Network size={18} />LinkedIn <ArrowUpRight size={16} /></a></div></div><div className="about-notes"><div><span className="tiny-label">CURRENTLY</span><strong>{data.title}</strong><span>Bhairav Robotics Pvt. Ltd.</span></div><div><span className="tiny-label">BASED IN</span><strong>{data.location}</strong><span>Building for the real world.</span></div><div><span className="tiny-label">MY APPROACH</span><strong>Build. Test. Learn. Repeat.</strong><span>Curiosity, collaboration, and dependable systems.</span></div></div></div><div id="skills"><div className="subsection-heading"><h3>My toolkit</h3><span className="muted">Across robotics, ML, and development</span></div><div className="skills-grid">{[...data.skills.technical, ...data.skills.professional].map(group => <div key={group.category}><h4>{group.category}</h4><div className="tag-list">{group.items.map(item => <span key={item}>{item}</span>)}</div></div>)}</div></div></section>
      <section id="experience" className="section-shell experience-section"><div className="section-intro"><span className="eyebrow muted">03 / THE JOURNEY SO FAR</span><h2 className="display-title">Experience<span className="pink">.</span></h2><p>A progression from interfaces and testing to machine learning and autonomous robotics.</p></div><div>{data.experience.map(role => <article className="experience-row" key={role.role}><div className="experience-date">{role.start} — {role.end}{role.end === 'Present' && <span className="current-badge">CURRENT</span>}</div><div><h3>{role.role}</h3><p className="company">{role.company}</p><ul>{role.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></div></article>)}</div><div id="education" className="education-block"><div className="subsection-heading"><h3>Education</h3><a className="text-link" href={data.resume.path} download={data.resume.downloadName}>Full resume <Download size={16} /></a></div><div className="education-grid">{data.education.map(education => <article key={education.program}><span className="tiny-label">{education.start === education.end ? education.start : `${education.start} — ${education.end}`}</span><h4>{education.program}</h4><p>{education.institution}</p>{education.detail && <strong className="grade">{education.detail}</strong>}</article>)}</div></div><div id="certifications">{data.certifications.map(cert => <div className="certificate-row" key={cert.title}><span className="tiny-label">CERTIFICATION</span><div><h4>{cert.title}</h4><p>{cert.issuingOrg} · Issued {cert.date}</p><p className="muted">Credential ID: {cert.credentialId}</p></div><Check size={24} className="pink" /></div>)}</div><div id="achievements" className="highlights"><div className="subsection-heading"><h3>Work highlights</h3></div><div className="highlights-grid">{data.achievements.map(item => <article key={item.title}><span className="pink">↗</span><h4>{item.title}</h4><p>{item.description}</p></article>)}</div></div></section>
      <section id="contact" className="section-shell contact-section"><span className="eyebrow muted">04 / WHAT’S NEXT?</span><h2 className="display-title">Let’s build<br />something<span className="pink">.</span></h2><div className="contact-grid"><div><p className="large-copy">A robotics challenge, an AI idea,<br />or a conversation worth having.</p><a className="email-link" href={`mailto:${data.email}`}>{data.email}<ArrowUpRight size={22} /></a><button className="text-link copy-button" onClick={copyEmail}>{copied ? <Check size={15} /> : <Mail size={15} />}{copied ? 'Email copied' : 'Copy email address'}</button><a className="phone-link" href={`tel:${data.phone.replace(/\s/g, '')}`}>{data.phone}</a></div><ContactForm /></div></section>
    </main><footer className="site-footer"><a className="monogram" href="#home" aria-label="Back to top">N<span>.</span></a><span>© Nilesh Kumar Metakota</span><a href="#home" className="text-link">Back to top <ArrowUp size={16} /></a></footer>
  </>
}
