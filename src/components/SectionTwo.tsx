import Badge from './Badge'
import Cta from './Cta'
import Reveal from './Reveal'
import { identity, trajectory } from '../data/profile'

export default function SectionTwo() {
  return (
    <section
      id="about"
      className="flex min-h-[100dvh] scroll-mt-24 flex-col justify-between gap-12 px-5 pb-12 pt-32 sm:px-8 md:px-12 md:pb-16"
    >
      <div className="flex flex-col justify-between gap-8 sm:flex-row">
        <Reveal delay={120} className="text-white">
          <Badge>Trajectory</Badge>
        </Reveal>

        <Reveal delay={220} className="max-w-sm sm:text-right">
          <p className="text-lg font-light leading-relaxed text-white drop-shadow-md sm:text-xl">{identity.positioning}</p>
        </Reveal>
      </div>

      <div className="flex flex-1 flex-col justify-end">
        <div className="flex flex-col items-start gap-12 md:flex-row md:items-end md:justify-between md:gap-16">
          <div className="max-w-xl">
            <Reveal delay={180}>
              <h2 className="text-[3.25rem] font-light leading-[0.95] tracking-[-0.045em] text-white drop-shadow-lg sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]">
                Mathematics,
                <br />
                <span className="text-white/70">applied.</span>
              </h2>
            </Reveal>
            <Reveal delay={320}>
              <p className="mt-7 max-w-md text-sm font-light leading-relaxed text-white/85 drop-shadow-md sm:text-base">
                From {identity.origin} to the Ministry of Defense data center — a path from proofs and regressions to data
                services, applied AI, and network security.
              </p>
            </Reveal>
            <Reveal delay={420} className="mt-9 flex flex-wrap items-center gap-3 text-white">
              <Cta href="#projects" tone="light">
                Explore the work
              </Cta>
              <Cta href="#experience" tone="ghost">
                Experience
              </Cta>
            </Reveal>
          </div>

          <Reveal delay={300} className="w-full max-w-md">
            <div className="rounded-[2rem] bg-white/15 p-1.5 ring-1 ring-white/25 backdrop-blur-xl">
              <ol className="rounded-[calc(2rem-0.375rem)] bg-white/10 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] sm:px-6">
                {trajectory.map((t, i) => (
                  <li key={t.title} className={`group flex gap-5 py-5 ${i < trajectory.length - 1 ? 'border-b border-white/15' : ''}`}>
                    <span className="pt-1 font-mono text-[11px] tracking-[0.15em] text-white/55">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                        {t.label} · {t.year}
                      </p>
                      <h3 className="mt-1.5 text-base font-medium text-white sm:text-lg">{t.title}</h3>
                      <p className="mt-1.5 text-sm font-light leading-relaxed text-white/75">{t.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
