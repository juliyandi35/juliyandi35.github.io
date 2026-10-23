import { ArrowUpRight } from 'lucide-react'
import Cta from './Cta'
import Reveal from './Reveal'
import Section from './Section'
import MethodMatrix from './MethodMatrix'
import { appColor, manifest, selected, titleFromName, type Repo } from '../data/projects'
import { glossOf } from '../data/profile'

const describe = (r: Repo) =>
  `${titleFromName(r.name)} applies ${r.methods.map(glossOf).join(' combined with ').toLowerCase()} in ${r.applicationRaw}.`

const stats = [
  { value: manifest.total, label: 'Public repositories' },
  { value: manifest.methodFamilies.length, label: 'Method families' },
  { value: Object.keys(manifest.applicationTokenCounts).length, label: 'Applications' },
  { value: manifest.applicationCombinations.length, label: 'Tool combinations' },
]

const toolEntries = Object.entries(manifest.applicationTokenCounts).sort((a, b) => b[1] - a[1])
const toolTotal = toolEntries.reduce((s, [, n]) => s + n, 0)
const langEntries = Object.entries(manifest.languageCounts).sort((a, b) => b[1] - a[1])

function Sub({ title, note }: { title: string; note: string }) {
  return (
    <Reveal className="mb-8 mt-28 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
      <h3 className="text-3xl font-light tracking-[-0.03em] text-ink sm:text-4xl">{title}</h3>
      <p className="max-w-md text-sm font-light leading-relaxed text-ink/60 sm:text-right">{note}</p>
    </Reveal>
  )
}

export default function Projects() {
  const [featured, ...rest] = selected

  return (
    <Section
      id="projects"
      index="01"
      badge="Selected Work"
      title={
        <>
          Evidence
          <br />
          <span className="text-ink/35">at scale.</span>
        </>
      }
      intro="Every figure here is read from the public GitHub account at build time. Each repository encodes its own method family and application."
    >
      <div className="grid grid-cols-2 gap-px overflow-hidden glass glass-ink lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 90} className="bg-white/75 p-6 sm:p-8">
            <p className="text-5xl font-light tracking-[-0.04em] text-ink sm:text-7xl">{s.value}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55">{s.label}</p>
          </Reveal>
        ))}
      </div>

      <Sub title="Flagship investigations" note="Five projects that represent the range — a glimpse, not the full list." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal className="lg:row-span-2">
          <a
            href={featured.url}
            target="_blank"
            rel="noreferrer"
            className="group flex h-full min-h-72 flex-col justify-between glass glass-strong p-8 transition-colors duration-500 ease-fluid hover:bg-white/90 sm:p-10"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/60">
              {featured.methods.map(glossOf).join(' · ')}
            </span>
            <div>
              <h4 className="text-4xl font-light leading-[1.02] tracking-[-0.035em] text-ink sm:text-5xl">{titleFromName(featured.name)}</h4>
              <p className="mt-4 max-w-md text-ink/70">{describe(featured)}</p>
              <Cta as="span" className="mt-8">
                View repository
              </Cta>
            </div>
          </a>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2">
          {rest.slice(0, 4).map((r, i) => (
            <Reveal key={r.name} delay={i * 90}>
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col glass p-6 transition-colors duration-500 ease-fluid hover:bg-white/85"
              >
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: appColor(r.applications[0]) }} />
                  {r.applicationRaw}
                </span>
                <h4 className="mt-4 flex items-start justify-between gap-2 text-lg font-medium leading-snug text-ink">
                  {titleFromName(r.name)}
                  <ArrowUpRight size={16} className="mt-1 shrink-0 text-ink/40 transition group-hover:text-ink" />
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{describe(r)}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      <Sub
        title="The project tree"
        note="Every public repository grown into one tree. Branches follow the field of analysis, leaves follow the tool."
      />
      <Reveal>
        <a
          href="/pohon/"
          className="group grid overflow-hidden glass glass-strong transition-colors duration-500 ease-fluid hover:bg-white/90 lg:grid-cols-[1fr_1.5fr]"
        >
          <div className="flex flex-col justify-between gap-8 p-8 sm:p-10">
            <p className="max-w-sm text-ink/70">
              Zoom into the canopy, filter by tool or field, and open any repository straight from its leaf.
            </p>
            <Cta as="span" className="self-start">Jelajahi Pohon</Cta>
          </div>
          <img
            src="/pohon/preview.webp"
            alt="Preview of the project tree: a slate trunk whose leaves are coloured by analysis tool"
            width={1200}
            height={656}
            loading="lazy"
            className="h-60 w-full bg-[#dfe7ee] object-contain transition-transform duration-700 ease-fluid group-hover:scale-[1.03] sm:h-72"
          />
        </a>
      </Reveal>

      <Sub title="Methods × tools" note="Where each method family meets each tool. Bubble size is the number of projects; pick one to list them." />
      <Reveal>
        <MethodMatrix />
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Reveal className="glass p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55">Tool spectrum</p>
          <div className="mt-4 flex h-3 overflow-hidden rounded-full">
            {toolEntries.map(([t, n]) => (
              <span key={t} title={`${t}: ${n}`} style={{ width: `${(n / toolTotal) * 100}%`, background: appColor(t) }} />
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
            {toolEntries.map(([t, n]) => (
              <li key={t} className="flex items-center gap-1.5 text-xs text-ink/70">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: appColor(t) }} />
                {t}
                <span className="font-mono text-[10px] text-ink/40">{n}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100} className="glass p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55">
            Language distribution · {manifest.total} repositories
          </p>
          <ul className="mt-4 space-y-2">
            {langEntries.map(([lang, n]) => (
              <li key={lang} className="flex items-center gap-3">
                <span className="w-36 shrink-0 truncate text-sm text-ink/80">{lang === 'None' ? 'No source language' : lang}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                  <span className="block h-full rounded-full bg-ink/80" style={{ width: `${(n / manifest.total) * 100}%` }} />
                </span>
                <span className="w-8 shrink-0 text-right font-mono text-xs text-ink/50">{n}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-ink/50">
            {manifest.languageCounts.None ?? 0} repositories carry no detected source language — typically Excel, SPSS or
            Stata project files rather than code.
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
