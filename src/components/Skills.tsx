import Reveal from './Reveal'
import Section from './Section'
import { courses, languages, skillClusters, softSkills } from '../data/profile'

const label = 'font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55'
const card = 'glass'
const totalHours = courses.reduce((s, c) => s + (c.hours ?? 0), 0)
const groups = [...new Set(courses.map((c) => c.group))]

export default function Skills() {
  return (
    <Section
      id="skills"
      index="03"
      badge="Skills & Certification"
      title={
        <>
          An integrated
          <br />
          <span className="text-ink/35">practice.</span>
        </>
      }
      intro="Statistical computing and research software, extended into data engineering, applied AI, and network security."
    >
      <div className="grid gap-px overflow-hidden glass glass-ink sm:grid-cols-2 xl:grid-cols-4">
        {skillClusters.map((c, i) => (
          <Reveal key={c.label} delay={(i % 4) * 80} className="bg-white/75 p-6">
            <span className="font-mono text-[11px] text-ink/45">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-3 text-base font-medium text-ink">{c.label}</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {c.items.map((item) => (
                <li key={item} className="rounded-full border border-ink/10 bg-white/60 px-2.5 py-1 text-xs text-ink/75">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Reveal className={`${card} p-6 sm:p-8`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className={label}>Courses & certification</p>
            <p className="text-sm text-ink/60">
              <span className="text-4xl font-light tracking-[-0.04em] text-ink">{totalHours}</span> hours across {courses.length} programs
            </p>
          </div>
          {groups.map((g) => (
            <div key={g} className="mt-6">
              <p className="text-xs text-ink/50">{g}</p>
              <ul className="mt-2 divide-y divide-ink/10">
                {courses
                  .filter((c) => c.group === g)
                  .map((c) => (
                    <li key={c.title} className="grid gap-1 py-3 sm:grid-cols-[1fr_8rem_9rem] sm:items-center sm:gap-4">
                      <div>
                        <p className="text-sm text-ink">{c.title}</p>
                        <p className="text-xs text-ink/50">{c.provider}</p>
                      </div>
                      <span className="flex items-center gap-2">
                        {c.hours ? (
                          <>
                            <span className="h-1 rounded-full bg-ink/70" style={{ width: `${(c.hours / 40) * 4}rem` }} />
                            <span className="font-mono text-[10px] text-ink/50">{c.hours}h</span>
                          </>
                        ) : (
                          <span className="font-mono text-[10px] text-ink/40">—</span>
                        )}
                      </span>
                      <span className="font-mono text-[11px] text-ink/55 sm:text-right">{c.completed}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal delay={100} className={`${card} glass-strong p-6`}>
            <p className={label}>Languages</p>
            <ul className="mt-4 space-y-3">
              {languages.map((l) => (
                <li key={l.name}>
                  <p className="text-sm text-ink">{l.name}</p>
                  <p className="text-xs text-ink/55">{l.level}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={180} className={`${card} p-6`}>
            <p className={label}>Working style</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {softSkills.map((s) => (
                <li key={s} className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-white">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
