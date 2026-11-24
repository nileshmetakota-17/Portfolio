import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, MouseEvent, CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import { Activity, Check, CircuitBoard, Code2, Layers3, Mail, MapPin, Menu, Moon, Navigation, Pause, Play, Radar, ScanLine, Sun, X } from 'lucide-react'
import { portfolioData as data } from './portfolioData'
import { obstacleCloud } from './lib/pointCloud.js'
import { planRoute, start, obstacles } from './lib/navigation.js'
import { ResumeRequest } from './components/ResumeRequest'

const cloudObstacles = obstacles.map((obstacle: number[], index: number) => ({
  obstacle,
  height: [36,24,42,24][index],
  points: obstacleCloud(obstacle, [36,24,42,24][index]),
}))

function ObstacleCloud() {
  return <g className="obstacle-cloud" pointerEvents="none" aria-hidden="true">
    {cloudObstacles.map(({ obstacle: [x,y,w,d], height, points }, index) => {
      const dx = height * .38
      const dy = -height * .65
      return <g className={`cloud-block cloud-block-${index}`} key={index}>
        <path className="cloud-footprint" d={`M${x} ${y}h${w}v${d}h${-w}Z`} />
        <path className="cloud-volume" d={`M${x} ${y}l${dx} ${dy}h${w}v${d}l${-dx} ${-dy}M${x+dx} ${y+dy+d}h${w}M${x} ${y+d}l${dx} ${dy}v${-d}M${x+w} ${y}l${dx} ${dy}`} />
        {points.map((point: {cx:number;cy:number;z:number}, i: number) => <circle key={i} cx={point.cx} cy={point.cy} r={point.z === height ? 1.3 : 1} fill={point.z === height ? 'var(--accent)' : 'var(--signal)'} opacity={.25+.65*point.z/height} />)}
        <path className="cloud-scan" d={`M${x} ${y+d/2}h${w}`} style={{ '--scan-x': `${dx}px`, '--scan-y': `${dy}px`, animationDelay: `${index * -.7}s` } as CSSProperties} />
      </g>
    })}
  </g>
}

const defaultPoints = { target: [[470,120]], waypoints: [[210,350],[350,250],[470,120]] }

function NavigationStudy({ compact = false }: { compact?: boolean }) {
  const gridId = useId()
  const [mode, setMode] = useState<'target' | 'waypoints'>('target')
  const [points, setPoints] = useState<number[][]>(defaultPoints.target)
  const [cursor, setCursor] = useState([350,250])
  const [notice, setNotice] = useState('Select Target or Waypoints, then click the map.')
  const [running, setRunning] = useState(true)
  const [showCloud, setShowCloud] = useState(true)
  const [reduced, setReduced] = useState(false)
  const pathRef = useRef<SVGPathElement>(null)
  const robotRef = useRef<SVGGElement>(null)
  const progress = useRef(0)
  const usingDefaults = useRef(true)
  const planned = planRoute(points) || [start]
  const route = { path: planned.map((p: number[], i: number) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' '), end: points.at(-1) || start }
  function selectPoint(point: number[]) {
    const snapped = point.map(n => Math.round(n / 10) * 10)
    const next = mode === 'target' || usingDefaults.current ? [snapped] : [...points, snapped]
    if (next.length > 6) { setNotice('Six waypoints selected. Clear the route to start again.'); return }
    if (!planRoute(next)) { setNotice('Choose an open area with clearance around the obstacles.'); return }
    usingDefaults.current = false
    progress.current = 0
    setPoints(next)
    setRunning(true)
    setNotice(mode === 'target' ? 'Target selected. Following the planned route.' : `${next.length} waypoint${next.length === 1 ? '' : 's'} selected. Following them in order.`)
  }
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(preference.matches)
    const update = () => setReduced(preference.matches)
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    const path = pathRef.current
    const robot = robotRef.current
    if (!path || !robot) return
    let frame = 0
    let last = 0
    const length = path.getTotalLength()
    function place() {
      const distance = progress.current * length
      const point = path!.getPointAtLength(distance)
      const next = path!.getPointAtLength(Math.min(length, distance + 1))
      const before = path!.getPointAtLength(Math.max(0, distance - 1))
      const angle = Math.atan2(next.y - before.y, next.x - before.x) * 180 / Math.PI
      robot!.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`)
    }
    function advance(now: number) {
      if (last) progress.current = Math.min(1, progress.current + (now - last) / Math.max(4000, length * 20))
      last = now
      place()
      if (progress.current < 1) frame = requestAnimationFrame(advance)
      else { setRunning(false); setNotice('Route complete. Select a new point or replay the route.') }
    }
    place()
    if (running && !reduced && !compact && points.length) frame = requestAnimationFrame(advance)
    return () => cancelAnimationFrame(frame)
  }, [route.path, running, reduced, compact, points.length])
  return <div className={`navigation-study ${compact ? 'compact-study' : ''}`}>
    <div className="study-top"><span><Navigation size={15} /> LOCAL PLANNER</span><span className="study-label">ILLUSTRATIVE DEMO</span></div>
    <svg className="map-art" viewBox="0 0 560 480" role={compact ? 'img' : 'group'} tabIndex={compact ? undefined : 0} aria-label="Interactive navigation map. Use arrow keys to position the crosshair and Enter to select a point." onClick={event => {
      if (compact) return
      const matrix = event.currentTarget.getScreenCTM()
      if (!matrix) return
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
      selectPoint([point.x, point.y])
    }} onKeyDown={event => {
      if (compact) return
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectPoint(cursor) }
      const direction = { ArrowLeft: [-10,0], ArrowRight: [10,0], ArrowUp: [0,-10], ArrowDown: [0,10] }[event.key]
      if (direction) { event.preventDefault(); setCursor(([x,y]) => [Math.max(60,Math.min(500,x+direction[0])),Math.max(60,Math.min(430,y+direction[1]))]) }
    }}>
      <defs><pattern id={gridId} width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="currentColor" strokeOpacity=".09" /></pattern></defs>
      <rect x="25" y="25" width="510" height="430" fill={`url(#${gridId})`} />
      <path d="M55 75V430H505M55 75L51 83M55 75L59 83M505 430L497 426M505 430L497 434" fill="none" stroke="currentColor" strokeOpacity=".25" />
      <g className="map-obstacles">{obstacles.map(([x,y,w,h]: number[]) => <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="5" />)}</g>
      {showCloud && <ObstacleCloud />}
      <path d={route.path} fill="none" stroke="var(--accent)" strokeWidth="18" strokeOpacity=".07" />
      <path className="animated-route" ref={pathRef} d={route.path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="5 6" />
      {points.map(([x,y],index) => <g className="selected-waypoint" key={`${index}-${x}-${y}`} transform={`translate(${x} ${y})`}><circle r="14" fill="var(--bg)" stroke="var(--accent)" /><circle className="waypoint-halo" r="20" stroke="var(--accent)" fill="none" opacity=".3" />{mode === 'waypoints' ? <text textAnchor="middle" dominantBaseline="central" fill="var(--accent)" fontSize="12">{index+1}</text> : <circle r="4" fill="var(--accent)" />}</g>)}
      {!compact && <g className="map-crosshair" transform={`translate(${cursor[0]} ${cursor[1]})`} stroke="var(--signal)" opacity=".7"><path d="M-10 0H10M0 -10V10" /></g>}
      <g ref={robotRef} transform="translate(90 354)"><circle r="65" fill="var(--signal)" fillOpacity=".025" stroke="var(--signal)" strokeOpacity=".12" strokeDasharray="3 5" /><path d="M0 0L75 -35A83 83 0 0 1 75 35Z" fill="var(--signal)" fillOpacity=".075" /><rect x="-14" y="-19" width="11" height="6" rx="2" fill="#5a6c75" /><rect x="4" y="-19" width="11" height="6" rx="2" fill="#5a6c75" /><rect x="-14" y="13" width="11" height="6" rx="2" fill="#5a6c75" /><rect x="4" y="13" width="11" height="6" rx="2" fill="#5a6c75" /><rect x="-21" y="-14" width="42" height="28" rx="6" fill="var(--rover)" stroke="var(--signal)" strokeWidth="1.5" /><path d="M11 -7L17 0L11 7" fill="none" stroke="var(--accent)" strokeWidth="2" /><circle cx="-4" r="7" fill="var(--rover)" stroke="var(--signal)" /><circle cx="-4" r="2" fill="var(--signal)" /></g>
      <g fill="currentColor" opacity=".45" fontFamily="monospace" fontSize="10"><text x="65" y="60">Y</text><text x="510" y="434">X</text><text x="76" y="388">START</text><text x="330" y="55">{showCloud ? 'XY MAP / XYZ CLOUD' : 'MAP FRAME / 2D'}</text></g>
    </svg>
    {!compact && <><div className="study-controls"><div role="group" aria-label="Choose map selection mode">{(['target','waypoints'] as const).map(value => <button type="button" key={value} aria-pressed={mode === value} onClick={() => { setMode(value); setPoints(defaultPoints[value]); usingDefaults.current=true; progress.current=0; setRunning(true); setNotice(value === 'target' ? 'Default target loaded. Click the map to move it.' : 'Default waypoints loaded. Click to start your own route, then add points in order.') }}>{value === 'target' ? 'Target' : 'Waypoints'}</button>)}</div><button type="button" aria-pressed={showCloud} onClick={() => setShowCloud(!showCloud)}>3D cloud</button><button type="button" onClick={() => { setPoints([]); usingDefaults.current=false; progress.current=0; setRunning(false); setNotice('Route cleared. Click the map to select new points.') }}>Clear</button><button type="button" className="playback" disabled={reduced || !points.length} aria-label={running ? 'Pause navigation animation' : 'Play or replay navigation animation'} onClick={() => { if(progress.current>=1) progress.current=0; setRunning(!running) }}>{running && !reduced ? <Pause size={15} /> : <Play size={15} />}</button></div><p className="map-instructions" role="status">{notice}{reduced && ' Motion reduced; the planned route is shown without animation.'}</p><div className="study-footer"><span><i className="legend-route" />Planned route</span><span><i className="legend-points" />Obstacle cloud</span><span>Synthetic XYZ samples · not live LiDAR</span></div></>}

  </div>
}

function VisionStudy() {
  return <div className="vision-study" aria-hidden="true"><div className="study-top"><span><ScanLine size={15} /> VISUAL PLACE RECOGNITION</span><span>ON DEVICE</span></div><svg viewBox="0 0 500 295" fill="none"><rect className="vision-scan" x="70" y="68" width="360" height="2" fill="var(--accent)" /><rect className="vision-scan-trail" x="70" y="65" width="360" height="26" fill="var(--accent)" opacity=".035" /><g stroke="currentColor" opacity=".2"><path d="M70 225V65H205V225ZM295 225V65H430V225Z" /><path d="M70 65L205 225M205 65L70 225M295 65L430 225M430 65L295 225" strokeDasharray="3 6" /></g>{[[95, 100, 325, 110], [170, 85, 390, 90], [110, 190, 330, 195], [175, 175, 400, 170], [145, 135, 360, 140]].map(([x, y, a, b]) => <g className="vision-match" key={x} style={{ animationDelay: `${x % 5 * .35}s` }}><path d={`M${x} ${y}L${a} ${b}`} stroke="var(--accent)" strokeOpacity=".4" /><circle cx={x} cy={y} r="4" fill="var(--signal)" /><circle cx={a} cy={b} r="4" fill="var(--signal)" /></g>)}<g fill="currentColor" fontFamily="monospace" fontSize="11" opacity=".7"><text x="90" y="260">REFERENCE VIEW</text><text x="320" y="260">CAMERA VIEW</text></g></svg><span className="art-footnote">EXPERIMENTAL ANDROID PROTOTYPE</span></div>
}
function FitnessStudy() {
  return <div className="fitness-study" aria-hidden="true"><div className="study-top"><span><Activity size={15} /> FITOO</span><span>ANDROID / JAVA</span></div><div className="fitness-layout"><div className="fitness-orbit"><svg className="fitness-heartbeat" viewBox="0 0 100 50" width="70" height="40"><path d="M0 25H22L30 14L40 38L52 4L64 36L72 25H100" stroke="currentColor" strokeWidth="2" fill="none" /></svg><span>MOVE · FUEL · TRAIN</span></div><div><span className="mono-label">SENSEI AI</span><strong>A little better.<br />Every day.</strong><div className="fitness-tags"><span>Meals</span><span>Workouts</span><span>AI coach<i className="ai-thinking"><i /><i /><i /></i></span></div></div></div><span className="art-footnote">MEAL & WORKOUT MANAGEMENT</span></div>
}

function ContactForm() {
  const [ready, setReady] = useState(false)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    window.location.href = `mailto:${data.email}?subject=${encodeURIComponent(`Portfolio inquiry from ${fields.get('name')}`)}&body=${encodeURIComponent(`Hi Nilesh,\r\n\r\n${fields.get('message')}\r\n\r\nFrom: ${fields.get('name')}\r\nEmail: ${fields.get('email')}`)}`
    setReady(true)
  }
  return <form className="contact-form" onSubmit={submit}><h3>Start a conversation.</h3><p>Tell me about the problem you’re working on.</p><div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="Your name" minLength={2} required /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label></div><label>Your message<textarea name="message" placeholder="A project, opportunity, or interesting robotics problem…" minLength={10} required rows={4} /></label><button className="pill-button" type="submit"><Mail size={17} />Open email draft</button><p className="form-note" role="status">{ready ? 'Your email draft is ready. Send it from your email app.' : 'Opens your email app with a draft. Nothing is sent automatically.'}</p></form>
}

const navItems = [{ id: 'projects', label: 'Work' }, { id: 'skills', label: 'Expertise' }, { id: 'experience', label: 'Experience' }, { id: 'about', label: 'About' }]
const projects = [...data.projects].sort((a, b) => ['navigation', 'vision', 'fitness'].indexOf(a.artwork) - ['navigation', 'vision', 'fitness'].indexOf(b.artwork))

export default function Portfolio() {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('nilesh-theme') === 'light' ? 'light' : 'dark' } catch { return 'dark' } })
  const [themeChanging, setThemeChanging] = useState(false)
  const themeLocked = useRef(false)
  const themeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    if (themeLocked.current) return
    const root = document.documentElement
    const next = theme === 'dark' ? 'light' : 'dark'
    const apply = () => {
      flushSync(() => setTheme(next))
      root.dataset.theme = next
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(); return }
    themeLocked.current = true
    setThemeChanging(true)
    const finish = () => {
      root.classList.remove('theme-revealing', 'theme-fading')
      themeLocked.current = false
      setThemeChanging(false)
    }
    const fallback = () => {
      root.classList.add('theme-fading')
      apply()
      themeTimer.current = setTimeout(finish, 550)
    }
    if (!document.startViewTransition) { fallback(); return }
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    root.style.setProperty('--theme-x', `${x}px`)
    root.style.setProperty('--theme-y', `${y}px`)
    root.style.setProperty('--theme-radius', `${Math.hypot(Math.max(x, innerWidth-x), Math.max(y, innerHeight-y))}px`)
    root.classList.add('theme-revealing')
    try {
      const transition = document.startViewTransition(apply)
      void transition.finished.catch(() => {}).finally(finish)
    } catch {
      root.classList.remove('theme-revealing')
      fallback()
    }
  }
  useEffect(() => () => {
    clearTimeout(themeTimer.current)
    document.documentElement.classList.remove('theme-revealing', 'theme-fading')
  }, [])
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('home')
  const [filter, setFilter] = useState('All work')
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('nilesh-theme', theme) } catch { /* Browser storage may be disabled. */ }
  }, [theme])
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
    }, { rootMargin: '-15% 0px -65% 0px' })
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const elements = document.querySelectorAll('.section-heading, .project-card, .capability, .experience-row, .about-title, .about-story, .education-grid article, .contact-form, .resume-section')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target) } })
    }, { threshold: .08 })
    elements.forEach(element => { element.classList.add('motion-reveal'); observer.observe(element) })
    return () => observer.disconnect()
  }, [filter])
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenu(false) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])
  async function copyEmail() {
    try { await navigator.clipboard.writeText(data.email); setCopied(true); window.setTimeout(() => setCopied(false), 2500) }
    catch { window.location.href = `mailto:${data.email}` }
  }
  const visibleProjects = projects.filter(project => filter === 'All work' || (filter === 'Robotics & vision' ? project.artwork !== 'fitness' : project.artwork === 'fitness'))
  return <>
    <a className="skip-link" href="#projects">Skip to selected work</a>
    <header className="site-header"><a className="brand" href="#home" aria-label="Nilesh Metakota, home"><span className="brand-mark">N<span>.</span></span><span>Nilesh Metakota<span className="brand-role">ROBOTICS SOFTWARE ENGINEER</span></span></a><nav id="main-navigation" className={menu ? 'header-nav open' : 'header-nav'} aria-label="Main navigation">{navItems.map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined} onClick={() => setMenu(false)}>{item.label}</a>)}<a className="nav-contact" href="#contact" onClick={() => setMenu(false)}>Let’s talk</a></nav><div className="header-tools"><button className="icon-button theme-toggle" disabled={themeChanging} type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={toggleTheme}><span className="theme-icon" key={theme}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</span></button><button className="icon-button menu-toggle" type="button" aria-label={menu ? 'Close menu' : 'Open menu'} aria-controls="main-navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={21} /> : <Menu size={21} />}</button></div></header>
    <main>
      <section id="home" className="hero-section section-shell"><div className="hero-copy"><div className="eyebrow"><span className="small-line" />ROBOTICS / PERCEPTION / AUTONOMY</div><h1>Software that<br />moves the<br /><em>real world.</em></h1><p className="hero-description">I’m <strong>Nilesh Kumar Metakota</strong>, a robotics software engineer turning sensor data, algorithms, and code into purposeful robot movement.</p><div className="hero-actions"><a className="pill-button" href="#projects"><Layers3 size={17} />Explore my work</a><a className="pill-button secondary" href="#resume-request">Get my resume</a></div><div className="hero-current"><span className="current-indicator" /><span>Engineering autonomous navigation at<br /><strong>Bhairav Robotics Pvt. Ltd.</strong></span></div></div><div className="hero-visual"><div className="diagram-label"><span>THE SPACE BETWEEN CODE & MOTION</span><span>ROS 2 / NAV2</span></div><NavigationStudy /><div className="diagram-caption"><CircuitBoard size={16} /><span>Sense the environment. Plan a path. Make it move.</span></div></div><div className="hero-bottom"><span><MapPin size={14} />{data.location}</span><span>Python & C++ <i /> ROS 2 & Nav2 <i /> LiDAR & vision</span><a href={data.links.github} target="_blank" rel="noopener noreferrer"><Code2 size={15} />Find me on GitHub</a></div></section>

      <section id="projects" className="section-shell work-section"><div className="section-heading"><div><span className="eyebrow">SELECTED WORK</span><h2>From an idea<br />to a working system<span>.</span></h2></div><p>Navigation, perception, and useful applications.<br />A closer look at the things I build.</p></div><div className="work-toolbar"><div className="project-filters" role="group" aria-label="Filter projects">{['All work', 'Robotics & vision', 'Applications'].map(label => <button type="button" key={label} aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}</button>)}</div><span className="mono-label" aria-live="polite">{visibleProjects.length} PROJECT{visibleProjects.length !== 1 ? 'S' : ''}</span></div><div className="projects-grid">{visibleProjects.map(project => <article key={project.title} className={`project-card ${project.artwork === 'navigation' ? 'featured-project' : ''}`}><div className="project-visual">{project.artwork === 'navigation' ? <NavigationStudy compact /> : project.artwork === 'vision' ? <VisionStudy /> : <FitnessStudy />}</div><div className="project-copy"><span className="project-category">{project.category}</span><h3>{project.artwork === 'navigation' ? 'LiDAR-based autonomous navigation' : project.artwork === 'vision' ? 'VIO: recognizing familiar places' : 'Fitoo: an intelligent fitness companion'}</h3><p>{project.description}</p><div className="tag-list">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div><div className="project-details"><h4>Engineering notes</h4><ul>{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul></div><a className="text-link" href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Code2 size={17} />Explore source code</a></div></article>)}</div></section>

      <section id="skills" className="expertise-section"><div className="section-shell"><div className="section-heading"><div><span className="eyebrow">ENGINEERING TOOLKIT</span><h2>Across the<br />robotics stack<span>.</span></h2></div><p>Connecting the pieces that let machines<br />understand and navigate their environment.</p></div><div className="capability-grid">{[{ icon: Navigation, title: 'Navigation & autonomy', text: 'Point-to-point movement, path planning, and obstacle avoidance with ROS 2 and Nav2.', tags: ['ROS 2', 'Nav2', 'Autonomous Navigation'] }, { icon: Radar, title: 'Perception & sensors', text: 'Working with LiDAR, GPS, and cameras for localization and environmental awareness.', tags: ['LiDAR', 'GPS', 'Camera Integration', 'Sensor Fusion'] }, { icon: CircuitBoard, title: 'Machine learning', text: 'Preparing datasets, training models, and evaluating their performance in robotic systems.', tags: ['Model Training', 'Data Pipelines', 'Evaluation'] }, { icon: Code2, title: 'Software development', text: 'Building, testing, and debugging software—from robot behavior to user-facing applications.', tags: ['Python', 'C++', 'JavaScript', 'Git & GitHub'] }].map(item => <article className="capability" key={item.title}><item.icon size={26} strokeWidth={1.4} /><h3>{item.title}</h3><p>{item.text}</p><div className="capability-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}</div><div className="pipeline"><span className="mono-label">MY ENGINEERING LOOP</span><div><span>Observe</span><i /><span>Build</span><i /><span>Test</span><i /><span>Refine</span></div><p>Good behavior comes from understanding the failure cases.</p></div></div></section>

      <section id="experience" className="section-shell experience-section"><div className="section-heading"><div><span className="eyebrow">THE JOURNEY</span><h2>Building experience.<br />Taking responsibility<span>.</span></h2></div><p>From web development and system testing<br />to machine learning and autonomous navigation.</p></div><div className="experience-list">{data.experience.map((role, index) => <article className={`experience-row ${index === 0 ? 'current-role' : ''}`} key={role.role}><div className="experience-date"><span>{role.start} — {role.end}</span>{role.end === 'Present' && <span className="current-badge">CURRENT ROLE</span>}</div><div className="experience-title"><h3>{role.role}</h3><p>{role.company}</p></div><ul>{role.bullets.slice(0, 3).map(bullet => <li key={bullet}>{bullet}</li>)}</ul></article>)}</div></section>

      <section id="about" className="section-shell about-section"><div className="about-title"><span className="eyebrow">THE PERSON BEHIND THE CODE</span><h2>Curiosity.<br />A practical mindset.<br /><span>Keep building.</span></h2><div className="about-signature">Nilesh Metakota<span>Robotics Software Engineer</span></div></div><div className="about-story"><p className="large-copy">I’m interested in what happens when software leaves the screen and starts interacting with the real world.</p><p>At Bhairav Robotics, I work on autonomous navigation with ROS 2, Nav2, and LiDAR, alongside GPS and camera integration. My background in testing and machine learning shapes how I build: understand the system, test the assumptions, and improve what matters.</p><p>I’m pursuing a B.Tech in Computer Science and Engineering at KITS, building on my diploma in Computer Engineering. Outside the robotics stack, I explore computer vision and build applications that solve everyday problems.</p><div className="about-facts"><div><span className="mono-label">BASED IN</span><strong>{data.location}</strong></div><div><span className="mono-label">WORKING LANGUAGES</span><strong>Telugu · English · Hindi</strong></div></div><div className="about-links"><a className="text-link" href={data.links.github} target="_blank" rel="noopener noreferrer"><Code2 size={17} />GitHub</a><a className="text-link" href={data.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div></section>

      <section id="education" className="section-shell education-section"><div className="subsection-heading"><span className="eyebrow">FOUNDATIONS</span><h2>Always learning.</h2></div><div className="education-grid">{data.education.map(item => <article key={item.program}><span className="mono-label">{item.start === item.end ? item.start : `${item.start} — ${item.end}`}</span><h3>{item.program}</h3><p>{item.institution}</p>{item.detail && <span className="education-result">{item.detail}</span>}</article>)}</div>{data.certifications.map(cert => <div className="certificate-row" key={cert.title}><Check size={21} /><div><h3>{cert.title}</h3><p>{cert.issuingOrg} · Issued {new Date(`${cert.date}T00:00:00`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p></div><span className="mono-label">{cert.credentialId}</span></div>)}</section>

      <section id="contact" className="section-shell contact-section"><div className="contact-intro"><span className="eyebrow">LET’S CONNECT</span><h2>Have a problem<br />worth <em>solving?</em></h2><p>A robotics challenge, a software opportunity, or a thoughtful conversation. I’d like to hear about it.</p><a className="contact-email" href={`mailto:${data.email}`}>{data.email}</a><button type="button" className="text-link copy-button" onClick={copyEmail}>{copied ? <Check size={16} /> : <Mail size={16} />}{copied ? 'Email copied' : 'Copy email address'}</button><div className="contact-socials"><a href={data.links.github} target="_blank" rel="noopener noreferrer">GitHub</a><a href={data.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div><ContactForm /></section>
      <ResumeRequest />
    </main>
    <footer className="site-footer section-shell"><a className="brand-mark" href="#home" aria-label="Back to top">N<span>.</span></a><span>© {new Date().getFullYear()} Nilesh Kumar Metakota</span><span>Built with intention. Improved through iteration.</span><a href="#home">Back to top</a></footer>
  </>
}
