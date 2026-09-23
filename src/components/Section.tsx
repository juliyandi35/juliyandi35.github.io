import type { ReactNode } from 'react'
import Badge from './Badge'
import Reveal from './Reveal'

type Props = { id: string; index: string; badge: string; title: ReactNode; intro?: string; children: ReactNode }

export default function Section({ id, index, badge, title, intro, children }: Props) {
  return (
    <section id={id} className="mx-auto max-w-[1440px] scroll-mt-24 px-5 py-28 sm:px-8 md:px-12 md:py-40">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <Reveal className="mb-7 flex items-center gap-4">
            <span className="font-mono text-[11px] text-ink/40">({index})</span>
            <Badge>{badge}</Badge>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="text-5xl font-light leading-[0.95] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[5.5rem]">{title}</h2>
          </Reveal>
        </div>
        {intro && (
          <Reveal delay={220} className="max-w-sm md:text-right">
            <p className="text-base font-light leading-relaxed text-ink/70 sm:text-lg">{intro}</p>
          </Reveal>
        )}
      </div>
      <div className="mt-14 md:mt-20">{children}</div>
    </section>
  )
}
