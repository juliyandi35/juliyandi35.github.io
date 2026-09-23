import { useEffect, useState } from 'react'
import { Hexagon } from 'lucide-react'
import Cta from './Cta'
import { identity } from '../data/profile'
import { manifest } from '../data/projects'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  // White over the video, ink once the bright frosted sections fill the top half of the viewport.
  const [light, setLight] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const work = document.getElementById('work')
    if (!work) return
    const io = new IntersectionObserver(([e]) => setLight(e.boundingClientRect.top < window.innerHeight * 0.5), {
      rootMargin: '0px 0px -50% 0px',
      threshold: [0, 1],
    })
    io.observe(work)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const ink = light || open

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5">
        <div
          className={`pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-6 rounded-full py-2 pl-5 pr-2 ring-1 backdrop-blur-xl transition-colors duration-700 ease-fluid ${
            ink
              ? 'bg-white/70 text-ink shadow-[0_20px_50px_-25px_rgba(22,32,43,0.35)] ring-ink/10'
              : 'bg-ink/25 text-white ring-white/20 shadow-[0_20px_50px_-25px_rgba(22,32,43,0.5)]'
          }`}
        >
          <a href="#top" onClick={() => setOpen(false)} className="flex items-center gap-2 text-[15px] font-medium tracking-tight">
            <Hexagon size={20} />
            juliyandi
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-[13px] opacity-75 transition-[opacity,background-color] duration-500 ease-fluid hover:bg-current/[0.07] hover:opacity-100"
              >
                {l.label}
                {l.label === 'Projects' && <sup className="ml-0.5 font-mono text-[9px] opacity-60">{manifest.total}</sup>}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <Cta href={`mailto:${identity.email}`} tone={ink ? 'ink' : 'light'} className="py-1! pl-4! text-[13px]">
                Get in touch
              </Cta>
            </span>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-current/[0.08] md:hidden"
            >
              <span className={`absolute h-px w-4 bg-current transition-transform duration-500 ease-fluid ${open ? 'rotate-45' : '-translate-y-[3px]'}`} />
              <span className={`absolute h-px w-4 bg-current transition-transform duration-500 ease-fluid ${open ? '-rotate-45' : 'translate-y-[3px]'}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col justify-end bg-white/80 px-6 pb-12 text-ink backdrop-blur-3xl transition-opacity duration-700 ease-fluid md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-1">
          {links.map((l, i) => (
            <div key={l.label} className="overflow-hidden">
              <a
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }}
                className={`block py-1 text-5xl font-light tracking-tight transition-[transform,opacity] duration-700 ease-fluid ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
              >
                {l.label}
              </a>
            </div>
          ))}
        </nav>
        <div
          style={{ transitionDelay: open ? '450ms' : '0ms' }}
          className={`mt-10 transition-[transform,opacity] duration-700 ease-fluid ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <Cta href={`mailto:${identity.email}`}>Get in touch</Cta>
        </div>
      </div>
    </>
  )
}
