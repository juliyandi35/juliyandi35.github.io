import { ArrowUp, ArrowUpRight, Briefcase, GitBranch, Mail, Phone } from 'lucide-react'
import Badge from './Badge'
import Cta from './Cta'
import Reveal from './Reveal'
import { disclaimer, identity } from '../data/profile'

const links = [
  { label: 'Email', value: identity.email, href: `mailto:${identity.email}`, icon: Mail },
  { label: 'Phone', value: identity.phone, href: `tel:${identity.phone}`, icon: Phone },
  { label: 'LinkedIn', value: 'juli-yandi-rahman', href: identity.linkedin, icon: Briefcase, external: true },
  { label: 'GitHub', value: identity.githubHandle, href: identity.github, icon: GitBranch, external: true },
]

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-[1440px] scroll-mt-24 overflow-hidden px-5 pb-8 pt-28 sm:px-8 md:px-12 md:pt-40">
      <Reveal className="mb-7 flex items-center gap-4">
        <span className="font-mono text-[11px] text-ink/40">(04)</span>
        <Badge>Contact</Badge>
      </Reveal>
      <Reveal delay={120}>
        <h2 className="max-w-5xl text-5xl font-light leading-[0.95] tracking-[-0.045em] text-ink sm:text-7xl lg:text-[6.5rem]">
          Open to research, data, AI
          <span className="text-ink/35"> or information systems work.</span>
        </h2>
      </Reveal>
      <Reveal delay={220} className="mt-10 flex flex-wrap items-center gap-4">
        <Cta href={`mailto:${identity.email}`}>Start a conversation</Cta>
      </Reveal>

      <div className="mt-20 grid gap-px overflow-hidden glass glass-ink sm:grid-cols-2 lg:grid-cols-4">
        {links.map((l, i) => (
          <Reveal key={l.label} delay={i * 80} className="bg-white/75">
            <a
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noreferrer' : undefined}
              className="group flex items-center justify-between gap-4 p-7 transition-colors duration-500 ease-fluid hover:bg-white"
            >
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                  <l.icon size={13} />
                  {l.label}
                </span>
                <span className="mt-2 block truncate text-[15px] text-ink">{l.value}</span>
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] transition-transform duration-500 ease-fluid group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-105">
                <ArrowUpRight size={15} />
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <footer className="mt-24">
        <p
          aria-hidden="true"
          className="select-none bg-gradient-to-b from-ink/25 to-ink/0 bg-clip-text text-center text-[min(21vw,16.5rem)] font-light leading-[0.95] tracking-[-0.07em] text-transparent"
        >
          juliyandi
        </p>
        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-6 text-xs text-ink/50 sm:flex-row sm:items-center">
          <p>{disclaimer}</p>
          <div className="flex items-center gap-4">
            <p className="font-mono uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} {identity.shortName}
            </p>
            <a
              href="#top"
              aria-label="Back to top"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/[0.06] text-ink transition-transform duration-500 ease-fluid hover:-translate-y-0.5"
            >
              <ArrowUp size={15} />
            </a>
          </div>
        </div>
      </footer>
    </section>
  )
}
