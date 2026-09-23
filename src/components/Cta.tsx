import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  href?: string
  children: ReactNode
  tone?: 'ink' | 'light' | 'ghost'
  external?: boolean
  as?: 'a' | 'span'
  className?: string
}

const tones = {
  ink: 'bg-ink text-white shadow-[0_12px_30px_-12px_rgba(22,32,43,0.55)]',
  light: 'bg-white text-ink shadow-[0_12px_30px_-12px_rgba(22,32,43,0.35)]',
  ghost: 'bg-white/10 text-current ring-1 ring-current/25 backdrop-blur-md',
}
const bubble = { ink: 'bg-white/15', light: 'bg-ink/[0.07]', ghost: 'bg-current/10' }

// Pill with the arrow nested in its own circle; the circle drifts on hover, the pill presses on click.
export default function Cta({ href, children, tone = 'ink', external, as = 'a', className = '' }: Props) {
  const cls = `group inline-flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-sm font-medium transition-transform duration-500 ease-fluid active:scale-[0.97] ${tones[tone]} ${className}`
  const inner = (
    <>
      {children}
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-500 ease-fluid group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-105 ${bubble[tone]}`}
      >
        <ArrowUpRight size={15} />
      </span>
    </>
  )
  if (as === 'span') return <span className={cls}>{inner}</span>
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className={cls}>
      {inner}
    </a>
  )
}
