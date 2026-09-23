import Badge from './Badge'
import Cta from './Cta'
import Reveal from './Reveal'
import { identity } from '../data/profile'
import { manifest } from '../data/projects'

const services = ['Statistical modelling', 'Data & information systems', 'Applied AI & cybersecurity']

export default function SectionOne() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col justify-between gap-12 px-5 pb-12 pt-32 sm:px-8 md:px-12 md:pb-16"
    >
      <div className="flex flex-col justify-between gap-8 sm:flex-row">
        <div className="flex flex-col gap-2">
          {services.map((s, i) => (
            <Reveal key={s} delay={150 + i * 120}>
              <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/90 drop-shadow-md">
                <span className="text-white/50">0{i + 1}</span>
                {s}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300} className="max-w-xs sm:text-right">
          <p className="text-lg font-light leading-relaxed text-white drop-shadow-md sm:text-xl">{identity.heroSubtext}</p>
        </Reveal>
      </div>

      <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal delay={150} className="mb-6 text-white">
            <Badge>{`${manifest.total} public repositories`}</Badge>
          </Reveal>
          <Reveal delay={280}>
            <h1 className="text-[3.25rem] font-light leading-[0.95] tracking-[-0.045em] text-white drop-shadow-lg sm:text-7xl lg:text-[5.5rem] xl:text-[6.75rem]">
              Turning research
              <br />
              <span className="text-white/70">into working systems.</span>
            </h1>
          </Reveal>
        </div>

        <Reveal delay={420} className="shrink-0">
          <div className="w-max rounded-[1.75rem] bg-white/15 p-1.5 ring-1 ring-white/25 backdrop-blur-xl">
            <div className="flex items-center gap-4 rounded-[calc(1.75rem-0.375rem)] bg-white/10 p-2 pr-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
              <img src="/portrait.jpg" alt={`Portrait of ${identity.name}`} className="h-24 w-20 rounded-[1.1rem] object-cover" />
              <div className="flex flex-col items-start gap-1">
                <p className="whitespace-nowrap text-sm font-medium text-white">{identity.name}</p>
                <p className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.15em] text-white/65">Mathematics · Data · AI</p>
                <Cta href="#contact" tone="light" className="mt-2 py-1! pl-4! text-xs">
                  Get in touch
                </Cta>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-white/70 md:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/25">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(0.32,0.72,0,1)_infinite] bg-white motion-reduce:animate-none" />
        </span>
      </a>
    </section>
  )
}
