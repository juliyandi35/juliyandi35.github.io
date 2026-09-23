import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight, Minus, Plus, RotateCcw, Search, X } from 'lucide-react'
import Cta from './Cta'
import { graph } from '../data/projects'
import { glossOf } from '../data/profile'

const { apps, projects } = graph
const N = projects.length
const BASE_DIST = 46
const MIN_ZOOM = 0.3
const MAX_ZOOM = 1.9

const sizeScale = (kb: number) => 0.7 + 0.6 * Math.min(1, Math.log10(Math.max(1, kb)) / 5)
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}
const APP_RGB = apps.map((a) => hexToRgb(a.color))

type Hit = { kind: 'app' | 'project'; i: number } | null

export default function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [focus, setFocus] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [hover, setHover] = useState<{ label: string; x: number; y: number } | null>(null)
  const [panelOpen, setPanelOpen] = useState(() => typeof window === 'undefined' || window.innerWidth >= 768)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    const hits: number[] = []
    projects.forEach((p, i) => {
      const r = p.repo
      const hay = [p.title, r.name, r.applicationRaw, ...r.methods, ...r.methods.map(glossOf)].join(' ').toLowerCase()
      if (hay.includes(q)) hits.push(i)
    })
    return hits
  }, [query])

  // Render loop reads the latest React state through this ref, so it never restarts.
  const live = useRef({ focus, selected, matchSet: null as Set<number> | null })
  useEffect(() => {
    live.current = { focus, selected, matchSet: matches ? new Set(matches) : null }
  }, [focus, selected, matches])

  const cam = useRef({ yaw: 0.5, pitch: 0.28, zoom: 1, tZoom: 1, c: [0, 0, 0], tc: [0, 0, 0] })
  useEffect(() => {
    const c = cam.current
    c.tc = focus === null ? [0, 0, 0] : [...apps[focus].pos]
    c.tZoom = focus === null ? 1 : 0.42
  }, [focus])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let visible = false
    let last = performance.now()

    // Screen-space positions from the last frame, used for picking.
    const px = new Float32Array(N), py = new Float32Array(N), pr = new Float32Array(N), pz = new Float32Array(N)
    const ax = new Float32Array(apps.length), ay = new Float32Array(apps.length), ar = new Float32Array(apps.length), az = new Float32Array(apps.length)
    const order = Array.from({ length: N }, (_, i) => i)
    let rootX = 0, rootY = 0, rootS = 0

    const drag = { active: false, moved: 0, x: 0, y: 0 }
    let hoverKey = ''

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
    }

    const tick = (now: number) => {
      raf = 0
      if (!visible) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const c = cam.current
      const { focus, selected, matchSet } = live.current
      const k = reduced ? 1 : 1 - Math.pow(0.002, dt)
      for (let j = 0; j < 3; j++) c.c[j] += (c.tc[j] - c.c[j]) * k
      c.zoom += (c.tZoom - c.zoom) * k
      if (!reduced && !drag.active && selected === null) c.yaw += dt * 0.05

      const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw), cp = Math.cos(c.pitch), sp = Math.sin(c.pitch)
      const f = Math.min(w, h) * 1.15
      const dist = BASE_DIST * c.zoom
      const proj = (x: number, y: number, z: number) => {
        x -= c.c[0]; y -= c.c[1]; z -= c.c[2]
        const x1 = x * cy - z * sy
        const z1 = x * sy + z * cy
        const y2 = y * cp - z1 * sp
        const z2 = y * sp + z1 * cp
        const s = f / Math.max(1, dist - z2)
        return [w / 2 + x1 * s, h / 2 - y2 * s, s, z2] as const
      }

      ;[rootX, rootY, rootS] = proj(0, 0, 0)
      apps.forEach((a, i) => {
        const [x, y, s, z] = proj(a.pos[0], a.pos[1], a.pos[2])
        ax[i] = x; ay[i] = y; az[i] = z
        ar[i] = clamp(0.5 * (0.85 + 0.5 * Math.min(1, a.count / 112)) * s, 4, 18)
      })
      projects.forEach((p, i) => {
        const [x, y, s, z] = proj(p.pos[0], p.pos[1], p.pos[2])
        px[i] = x; py[i] = y; pz[i] = z
        pr[i] = clamp(0.17 * sizeScale(p.repo.sizeKb) * s, 1.3, 7)
      })

      const fog = (z: number) => clamp(0.3 + 0.7 * ((z + 22) / 44), 0.18, 1)
      const lit = (i: number) => (focus === null || projects[i].apps.includes(focus)) && (!matchSet || matchSet.has(i))

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1

      // Root → application spokes.
      apps.forEach((_, i) => {
        const on = focus === null || focus === i
        ctx.strokeStyle = `rgba(22,32,43,${on ? 0.3 : 0.06})`
        ctx.beginPath()
        ctx.moveTo(rootX, rootY)
        ctx.lineTo(ax[i], ay[i])
        ctx.stroke()
      })

      // Application → project edges, batched per application.
      apps.forEach((a, ai) => {
        const on = focus === null || focus === ai
        const base = focus === null ? (matchSet ? 0.05 : 0.16) : on ? 0.5 : 0.03
        ctx.strokeStyle = `rgba(${APP_RGB[ai]},${base})`
        ctx.beginPath()
        for (const pi of a.projects) {
          if (matchSet && !matchSet.has(pi)) continue
          ctx.moveTo(ax[ai], ay[ai])
          ctx.lineTo(px[pi], py[pi])
        }
        ctx.stroke()
        if (matchSet && on) {
          ctx.strokeStyle = `rgba(${APP_RGB[ai]},0.55)`
          ctx.beginPath()
          for (const pi of a.projects) {
            if (!matchSet.has(pi)) continue
            ctx.moveTo(ax[ai], ay[ai])
            ctx.lineTo(px[pi], py[pi])
          }
          ctx.stroke()
        }
      })

      // Core.
      const rg = Math.min(rootS * 3, 60)
      const glow = ctx.createRadialGradient(rootX, rootY, 0, rootX, rootY, rg)
      glow.addColorStop(0, 'rgba(22,32,43,0.22)')
      glow.addColorStop(1, 'rgba(22,32,43,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(rootX, rootY, rg, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#16202b'
      ctx.beginPath()
      ctx.arc(rootX, rootY, clamp(rootS * 0.9, 5, 20), 0, Math.PI * 2)
      ctx.fill()

      // Projects, back to front.
      order.sort((a, b) => pz[a] - pz[b])
      for (const i of order) {
        const on = lit(i)
        ctx.globalAlpha = fog(pz[i]) * (on ? 1 : 0.12)
        ctx.fillStyle = apps[projects[i].primary].color
        ctx.beginPath()
        ctx.arc(px[i], py[i], pr[i], 0, Math.PI * 2)
        ctx.fill()
        if (i === selected) {
          ctx.globalAlpha = 1
          ctx.strokeStyle = '#16202b'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(px[i], py[i], pr[i] + 5, 0, Math.PI * 2)
          ctx.stroke()
          ctx.lineWidth = 1
        }
      }

      // Application hubs with glow and label.
      ctx.font = '500 12px Geist, system-ui, sans-serif'
      ctx.textBaseline = 'middle'
      apps.forEach((a, i) => {
        const on = focus === null || focus === i
        const alpha = fog(az[i]) * (on ? 1 : 0.1)
        ctx.globalAlpha = alpha
        const g = ctx.createRadialGradient(ax[i], ay[i], 0, ax[i], ay[i], ar[i] * 2.6)
        g.addColorStop(0, `rgba(${APP_RGB[i]},0.45)`)
        g.addColorStop(1, `rgba(${APP_RGB[i]},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(ax[i], ay[i], ar[i] * 2.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = a.color
        ctx.beginPath()
        ctx.arc(ax[i], ay[i], ar[i], 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.95)'
        ctx.stroke()
        ctx.fillStyle = 'rgba(22,32,43,0.85)'
        ctx.fillText(a.name, ax[i] + ar[i] + 6, ay[i])
      })
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!raf && visible) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }

    const pick = (x: number, y: number): Hit => {
      let best: Hit = null
      let bestD = Infinity
      apps.forEach((_, i) => {
        const d = Math.hypot(ax[i] - x, ay[i] - y)
        if (d < ar[i] + 6 && d < bestD) (best = { kind: 'app', i }), (bestD = d)
      })
      if (best) return best
      const { focus, matchSet } = live.current
      let bestZ = -Infinity
      for (let i = 0; i < N; i++) {
        if ((focus !== null && !projects[i].apps.includes(focus)) || (matchSet && !matchSet.has(i))) continue
        const d = Math.hypot(px[i] - x, py[i] - y)
        if (d < pr[i] + 5 && pz[i] > bestZ) (best = { kind: 'project', i }), (bestZ = pz[i])
      }
      return best
    }

    const local = (e: PointerEvent | WheelEvent) => {
      const r = canvas.getBoundingClientRect()
      return [e.clientX - r.left, e.clientY - r.top] as const
    }

    const onDown = (e: PointerEvent) => {
      drag.active = true
      drag.moved = 0
      drag.x = e.clientX
      drag.y = e.clientY
      canvas.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (drag.active) {
        const dx = e.clientX - drag.x
        const dy = e.clientY - drag.y
        drag.x = e.clientX
        drag.y = e.clientY
        drag.moved += Math.abs(dx) + Math.abs(dy)
        const c = cam.current
        c.yaw += dx * 0.005
        c.pitch = clamp(c.pitch + dy * 0.005, -1.2, 1.2)
        return
      }
      const [x, y] = local(e)
      const hit = pick(x, y)
      const key = hit ? `${hit.kind}${hit.i}` : ''
      if (key === hoverKey) return
      hoverKey = key
      canvas.style.cursor = hit ? 'pointer' : 'grab'
      setHover(
        hit
          ? { label: hit.kind === 'app' ? `${apps[hit.i].name} · ${apps[hit.i].count} projects` : projects[hit.i].title, x, y }
          : null,
      )
    }
    const onUp = (e: PointerEvent) => {
      if (!drag.active) return
      drag.active = false
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
      if (drag.moved > 6) return
      const [x, y] = local(e)
      const hit = pick(x, y)
      if (!hit) return setSelected(null)
      if (hit.kind === 'app') {
        setSelected(null)
        setFocus((f) => (f === hit.i ? null : hit.i))
      } else setSelected(hit.i)
    }
    const onCancel = () => (drag.active = false)
    const onLeave = () => {
      hoverKey = ''
      setHover(null)
    }
    // Plain wheel keeps scrolling the page; ctrl/cmd + wheel (and trackpad pinch) zooms.
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      const c = cam.current
      c.tZoom = clamp(c.tZoom * (1 + e.deltaY * 0.002), MIN_ZOOM, MAX_ZOOM)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      start()
    })
    io.observe(canvas)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onCancel)
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onCancel)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (selected !== null) setSelected(null)
      else setFocus(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  const zoomBy = (m: number) => {
    const c = cam.current
    c.tZoom = clamp(c.tZoom * m, MIN_ZOOM, MAX_ZOOM)
  }
  const reset = () => {
    setFocus(null)
    setSelected(null)
    setQuery('')
    Object.assign(cam.current, { yaw: 0.5, pitch: 0.28, tZoom: 1 })
  }

  const sel = selected === null ? null : projects[selected]
  const listed = matches ?? (focus !== null ? apps[focus].projects : null)

  return (
    <div className="relative h-[82svh] min-h-[560px] overflow-hidden glass bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.75),transparent_65%)]">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Network of ${N} projects grouped under ${apps.length} applications. Use the list panel for keyboard access.`}
        className="absolute inset-0 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      />

      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[140%] whitespace-nowrap rounded-md border border-ink/10 bg-white/60 px-2.5 py-1 text-xs text-ink backdrop-blur-md"
          style={{ left: hover.x, top: hover.y }}
        >
          {hover.label}
        </div>
      )}

      {/* Side panel: search + application list; keyboard equivalent of the canvas. */}
      <div className={`absolute left-3 top-3 z-20 flex ${panelOpen ? 'bottom-3' : ''} w-[min(18rem,calc(100%-4.5rem))] flex-col rounded-2xl border border-ink/10 bg-white/75`}>
        <div className="flex items-center gap-2 border-b border-ink/10 p-2.5">
          <Search size={14} className="shrink-0 text-ink/50" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPanelOpen(true)
            }}
            placeholder={`Search ${N} projects…`}
            aria-label="Search projects"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="text-ink/60 hover:text-ink">
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            aria-expanded={panelOpen}
            onClick={() => setPanelOpen((o) => !o)}
            className="rounded-full border border-ink/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/70 hover:text-ink"
          >
            {panelOpen ? 'Hide' : 'List'}
          </button>
        </div>

        {panelOpen && (
          <div className="min-h-0 flex-1 overflow-y-auto p-2 [scrollbar-width:thin] [scrollbar-color:rgba(22,32,43,0.2)_transparent]">
            {listed ? (
              <>
                <p className="px-2 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55">
                  {matches ? `${matches.length} matches` : `${apps[focus!].name} · ${listed.length} projects`}
                </p>
                <ul className="space-y-0.5">
                  {listed.map((i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setSelected(i)}
                        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${
                          selected === i ? 'bg-ink/10 text-ink' : 'text-ink/75 hover:bg-white/85 hover:text-ink'
                        }`}
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: apps[projects[i].primary].color }} />
                        <span className="truncate">{projects[i].title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                {focus !== null && !matches && (
                  <button
                    type="button"
                    onClick={() => setFocus(null)}
                    className="mt-2 w-full rounded-md px-2 py-1.5 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-ink/60 hover:text-ink"
                  >
                    ← All applications
                  </button>
                )}
              </>
            ) : (
              <ul className="space-y-0.5">
                {apps.map((a, i) => (
                  <li key={a.name}>
                    <button
                      type="button"
                      aria-pressed={focus === i}
                      onClick={() => {
                        setSelected(null)
                        setFocus(i)
                      }}
                      className="group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[13px] text-ink/80 transition-colors hover:bg-white/85 hover:text-ink"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: a.color, boxShadow: `0 0 8px ${a.color}` }} />
                      <span className="flex-1 truncate">{a.name}</span>
                      <span className="font-mono text-[10px] text-ink/50">{a.count}</span>
                      <ChevronRight size={12} className="text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-ink" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Camera controls. */}
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5">
        {[
          { label: 'Zoom in', icon: <Plus size={14} />, on: () => zoomBy(0.8) },
          { label: 'Zoom out', icon: <Minus size={14} />, on: () => zoomBy(1.25) },
          { label: 'Reset view', icon: <RotateCcw size={14} />, on: reset },
        ].map((b) => (
          <button
            key={b.label}
            type="button"
            aria-label={b.label}
            title={b.label}
            onClick={b.on}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-ink/10 bg-white/60 text-ink/80 backdrop-blur-md transition-colors hover:bg-white/90 hover:text-ink"
          >
            {b.icon}
          </button>
        ))}
      </div>

      {!sel && (
        <p className="pointer-events-none absolute bottom-4 right-4 z-10 hidden max-w-md text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-ink/50 sm:block">
          Drag to orbit · Ctrl + scroll to zoom
          <br />
          Click a hub to focus · Click a node to open
        </p>
      )}

      {sel && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="project-popup-title"
          className="absolute inset-x-3 bottom-3 z-30 rounded-2xl border border-ink/10 bg-white/60 p-5 backdrop-blur-md sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[22rem]"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="inline-block border-l-2 border-ink bg-ink/5 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em]">
              Repository
            </span>
            <button type="button" aria-label="Close" onClick={() => setSelected(null)} className="text-ink/60 hover:text-ink">
              <X size={16} />
            </button>
          </div>
          <h3 id="project-popup-title" className="mt-3 text-lg font-medium leading-snug text-ink">
            {sel.title}
          </h3>
          <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-ink/50">{sel.repo.name}</p>
          <dl className="mt-4 space-y-2 text-[13px]">
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 text-ink/50">Tools</dt>
              <dd className="text-ink/85">{sel.repo.applicationRaw}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 text-ink/50">Methods</dt>
              <dd className="text-ink/85">{sel.repo.methods.map(glossOf).join(' · ')}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 text-ink/50">Created</dt>
              <dd className="text-ink/85">
                {new Date(sel.repo.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                {sel.repo.language ? ` · ${sel.repo.language}` : ''}
              </dd>
            </div>
          </dl>
          <Cta href={sel.repo.url} external className="mt-5">
            Open repository
          </Cta>
        </div>
      )}
    </div>
  )
}
