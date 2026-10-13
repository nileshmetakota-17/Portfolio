import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

export type VehiclePose = { x: number; y: number; angle: number }

type Point = { x: number; y: number; z: number; seed: number; obstacle: boolean }

function createPoints(compact: boolean): Point[] {
  let seed = 517
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
  const points: Point[] = []
  const count = compact ? 210 : 390
  for (let i = 0; i < count; i++) {
    const angle = random() * Math.PI * 2
    const radius = 65 + Math.sqrt(random()) * 220
    points.push({ x: 320 + Math.cos(angle) * radius, y: 320 + Math.sin(angle) * radius, z: random() * 10, seed: random(), obstacle: false })
  }
  // Vertical returns around the same obstacles shown on the navigation map.
  for (const [x, y, width, height] of [[130, 200, 90, 65], [380, 350, 115, 75], [385, 145, 70, 75]]) {
    for (let i = 0; i < (compact ? 95 : 150); i++) {
      const side = Math.floor(random() * 4)
      const along = random()
      points.push({ x: x + (side < 2 ? along * width : side === 2 ? 0 : width), y: y + (side >= 2 ? along * height : side === 0 ? 0 : height), z: random() * 78, seed: random(), obstacle: true })
    }
  }
  return points
}

export function PointCloud({ compact = false, vehicle }: { compact?: boolean; vehicle: RefObject<VehiclePose> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const points = createPoints(compact)
    const lastSeen = new Float64Array(points.length).fill(-Infinity)
    const project = (x: number, y: number, z = 0) => ({ x: x + .3 * (y - 320), y: 370 + .62 * (y - 320) - z })
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
    canvas.width = Math.round(640 * ratio)
    canvas.height = Math.round(640 * ratio)
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    let colors = { primary: '', secondary: '', ground: '' }
    let frame = 0
    let lastDraw = -Infinity
    let visible = true
    const started = performance.now()
    function readColors() {
      const style = getComputedStyle(canvas!)
      colors = { primary: style.getPropertyValue('--cloud-primary').trim(), secondary: style.getPropertyValue('--cloud-secondary').trim(), ground: style.getPropertyValue('--cloud-ground').trim() }
    }
    function draw(time: number) {
      const ctx = context!
      const seconds = preference.matches ? 1.8 : (time - started) / 1000
      const sweep = seconds * 1.7
      const car = vehicle.current
      const origin = project(car.x, car.y, 12)
      ctx.clearRect(0, 0, 640, 640)
      // Emit a fan of 3D scan rays from the moving roof sensor.
      for (let ray = 0; ray < 18; ray++) {
        const angle = sweep - ray * .018
        const end = project(car.x + Math.cos(angle) * 225, car.y + Math.sin(angle) * 225, 12 + (ray % 3) * 5)
        ctx.globalAlpha = .22 * (1 - ray / 18)
        ctx.strokeStyle = colors.primary
        ctx.lineWidth = ray === 0 ? 1.5 : .7
        ctx.beginPath(); ctx.moveTo(origin.x, origin.y); ctx.lineTo(end.x, end.y); ctx.stroke()
      }
      for (let index = 0; index < points.length; index++) {
        const point = points[index]
        const dx = point.x - car.x
        const dy = point.y - car.y
        const distance = Math.hypot(dx, dy)
        const angle = Math.atan2(dy, dx)
        const behindSweep = ((sweep - angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)
        if (distance < 245 && behindSweep < .34) lastSeen[index] = seconds
        const age = seconds - lastSeen[index]
        const lit = preference.matches ? (distance < 245 ? .8 : .15) : Math.exp(-age * .4)
        if (lit < .04) continue
        const pointOnScreen = project(point.x, point.y, point.z)
        // New returns travel outward from the sensor before settling into their 3D position.
        const arrival = preference.matches ? 1 : Math.min(1, Math.max(0, age / .18))
        const x = origin.x + (pointOnScreen.x - origin.x) * arrival
        const y = origin.y + (pointOnScreen.y - origin.y) * arrival
        ctx.globalAlpha = (point.obstacle ? .9 : .5) * lit
        ctx.fillStyle = point.obstacle ? (point.z > 23 ? colors.secondary : colors.primary) : colors.ground
        const size = (point.obstacle ? 1.1 : .7) + lit * 1.1
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
        if (point.obstacle && point.z > 60 && lit > .65) {
          const foot = project(point.x, point.y)
          ctx.globalAlpha = .1 * lit
          ctx.strokeStyle = colors.primary
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(foot.x, foot.y); ctx.stroke()
        }
      }
      // Ground-level pulses share the car's exact world position.
      ctx.globalAlpha = .35
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 1
      for (let pulse = 0; pulse < 2; pulse++) {
        const radius = 12 + ((seconds * 75 + pulse * 110) % 220)
        ctx.globalAlpha = .3 * (1 - radius / 240)
        ctx.beginPath()
        for (let step = 0; step <= 64; step++) {
          const angle = step / 64 * Math.PI * 2
          const p = project(car.x + Math.cos(angle) * radius, car.y + Math.sin(angle) * radius)
          if (step === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        }
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = colors.primary
      ctx.beginPath(); ctx.arc(origin.x, origin.y, 3, 0, Math.PI * 2); ctx.fill()
      ctx.globalAlpha = 1
    }
    function tick(now: number) {
      if (now - lastDraw >= 1000 / 30) { draw(now); lastDraw = now }
      frame = requestAnimationFrame(tick)
    }
    function resume() {
      cancelAnimationFrame(frame)
      draw(performance.now())
      if (visible && !document.hidden && !preference.matches) frame = requestAnimationFrame(tick)
    }
    readColors()
    resume()
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting
      resume()
    }, { rootMargin: '100px' }) : null
    observer?.observe(canvas)
    const themeObserver = new MutationObserver(() => { readColors(); draw(performance.now()) })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    preference.addEventListener?.('change', resume)
    document.addEventListener('visibilitychange', resume)
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      themeObserver.disconnect()
      preference.removeEventListener?.('change', resume)
      document.removeEventListener('visibilitychange', resume)
    }
  }, [compact, vehicle])
  return <canvas ref={canvasRef} className="point-cloud" aria-hidden="true" />
}
