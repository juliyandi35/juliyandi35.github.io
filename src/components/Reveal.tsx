import { useEffect, useRef, useState, type ReactNode } from 'react'

type Props = { delay?: number; className?: string; children: ReactNode }

export default function Reveal({ delay = 0, className = '', children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[transform,opacity,filter] duration-[1100ms] ease-fluid motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-12 opacity-0 blur-md will-change-transform'
      } ${className}`}
    >
      {children}
    </div>
  )
}
