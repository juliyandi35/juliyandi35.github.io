import Reveal from './Reveal'
import Section from './Section'
import { education, organization, structuralTraining, workExperience } from '../data/profile'

const label = 'font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55'
const card = 'glass'

export default function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      badge="Experience & Formation"
      title={
        <>
          Where the work
          <br />
          <span className="text-ink/35">happens.</span>
        </>
      }
      intro="Public-sector data services, statistical consulting for researchers, and a mathematics foundation underneath both."
    >
      <ol className={`${card} px-6 sm:px-10`}>
        {workExperience.map((w, i) => (
          <Reveal
            key={w.period}
            delay={i * 100}
            className={`grid gap-6 py-8 md:grid-cols-[14rem_1fr] ${i < workExperience.length - 1 ? 'border-b border-ink/10' : ''}`}
          >
            <div className="flex items-start gap-3">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${w.current ? 'bg-ink shadow-[0_0_10px_rgba(22,32,43,0.35)]' : 'bg-ink/35'}`} />
              <div>
                <p className={label}>{w.period}</p>
                {w.current && <p className="mt-1 text-xs text-ink">Current</p>}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-light tracking-[-0.02em] leading-snug text-ink">{w.organization}</h3>
              <p className="mt-1 text-sm text-ink/70">{w.role}</p>
              <ul className="mt-4 space-y-2">
                {w.responsibilities.map((r) => (
                  <li key={r} className="flex gap-3 text-sm leading-relaxed text-ink/65">
                    <span className="mt-2 h-px w-3 shrink-0 bg-ink/40" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {education
          .filter((e) => e.primary)
          .map((e, i) => (
            <Reveal key={e.institution} delay={i * 100} className={`${card} flex flex-col gap-8 glass-strong p-6 sm:p-8`}>
              <p className={label}>Education · {e.period}</p>
              <div>
                <p className="text-6xl font-light tracking-[-0.05em] text-ink">{e.detail?.split(' — ')[0]}</p>
                <h3 className="mt-3 text-lg font-medium leading-snug text-ink">{e.program}</h3>
                <p className="mt-1 text-sm text-ink/65">{e.institution}</p>
                {e.detail?.includes(' — ') && <p className="mt-1 text-xs text-ink/50">{e.detail.split(' — ')[1]}</p>}
              </div>
            </Reveal>
          ))}
        <Reveal delay={200} className={`${card} p-6 sm:p-8`}>
          <p className={label}>Earlier education</p>
          <ul className="mt-4 space-y-4">
            {education
              .filter((e) => !e.primary)
              .map((e) => (
                <li key={e.institution}>
                  <p className="text-sm text-ink">{e.institution}</p>
                  <p className="text-xs text-ink/55">
                    {e.program} · {e.period}
                  </p>
                </li>
              ))}
          </ul>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Reveal className={`${card} p-6 sm:p-8`}>
          <p className={label}>Organization · {organization.period}</p>
          <h3 className="mt-3 text-lg font-medium text-ink">{organization.name}</h3>
          <p className="text-sm text-ink/65">{organization.role}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">{organization.detail}</p>
        </Reveal>
        <Reveal delay={100} className={`${card} p-6 sm:p-8`}>
          <p className={label}>Structural training</p>
          <ul className="mt-3 divide-y divide-ink/10">
            {structuralTraining.map((t) => (
              <li key={t.title} className="flex items-baseline justify-between gap-4 py-3">
                <div>
                  <p className="text-sm text-ink">{t.title}</p>
                  <p className="text-xs text-ink/55">{t.detail}</p>
                </div>
                <span className="font-mono text-xs text-ink/50">{t.period}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
