import { useMemo, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { appColor, manifest, titleFromName } from '../data/projects'
import { glossOf } from '../data/profile'

const byCount = (rec: Record<string, number>) => Object.keys(rec).sort((a, b) => rec[b] - rec[a] || a.localeCompare(b))
const methods = byCount(manifest.methodCounts)
const tools = byCount(manifest.applicationTokenCounts)

const cells = new Map<string, typeof manifest.repos>()
for (const r of manifest.repos)
  for (const m of r.methods)
    for (const a of r.applications) {
      const k = `${m}|${a}`
      cells.set(k, [...(cells.get(k) ?? []), r])
    }
const maxCell = Math.max(...[...cells.values()].map((v) => v.length))
const maxMethod = manifest.methodCounts[methods[0]]

export default function MethodMatrix() {
  const [active, setActive] = useState<string | null>(`${methods[0]}|${tools[0]}`)
  const [hoverRow, setHoverRow] = useState<string | null>(null)
  const [hoverCol, setHoverCol] = useState<string | null>(null)
  const list = useMemo(() => (active ? cells.get(active) ?? [] : []), [active])
  const [am, aa] = active?.split('|') ?? []

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0 overflow-x-auto glass p-4 sm:p-6">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              <th className="w-72 pb-3 align-bottom font-mono text-[10px] font-normal uppercase tracking-[0.15em] text-ink/50">
                Method family ↓ · Tool →
              </th>
              {tools.map((t) => (
                <th key={t} className="h-28 w-9 pb-3 align-bottom font-normal">
                  <span
                    className={`block origin-bottom-left translate-x-4 -rotate-50 whitespace-nowrap text-[11px] transition-colors ${
                      hoverCol === t || aa === t ? 'text-ink' : 'text-ink/60'
                    }`}
                  >
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full" style={{ background: appColor(t) }} />
                    {t}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {methods.map((m) => (
              <tr key={m}>
                <th scope="row" className="border-t border-ink/10 py-1.5 pr-3 font-normal">
                  <span className={`block text-[13px] leading-tight ${hoverRow === m || am === m ? 'text-ink' : 'text-ink/75'}`}>
                    {glossOf(m)}
                  </span>
                  <span className="mt-1 flex items-center gap-2">
                    <span className="h-1 rounded-full bg-ink/70" style={{ width: `${(manifest.methodCounts[m] / maxMethod) * 7}rem` }} />
                    <span className="font-mono text-[10px] text-ink/45">{manifest.methodCounts[m]}</span>
                  </span>
                </th>
                {tools.map((t) => {
                  const k = `${m}|${t}`
                  const n = cells.get(k)?.length ?? 0
                  const size = n ? 8 + 22 * Math.sqrt(n / maxCell) : 0
                  const color = appColor(t)
                  return (
                    <td key={t} className={`border-t border-ink/10 p-0 text-center ${hoverRow === m || hoverCol === t ? 'bg-ink/[0.04]' : ''}`}>
                      {n > 0 ? (
                        <button
                          type="button"
                          aria-label={`${glossOf(m)} with ${t}: ${n} projects`}
                          aria-pressed={active === k}
                          onClick={() => setActive(k)}
                          onMouseEnter={() => (setHoverRow(m), setHoverCol(t))}
                          onMouseLeave={() => (setHoverRow(null), setHoverCol(null))}
                          className="group mx-auto flex h-9 w-9 items-center justify-center"
                        >
                          <span
                            className={`flex items-center justify-center rounded-full font-mono text-[9px] text-white transition-transform duration-500 ease-fluid group-hover:scale-110 ${
                              active === k ? 'ring-2 ring-ink ring-offset-2 ring-offset-white' : ''
                            }`}
                            style={{ width: size, height: size, background: color, boxShadow: `0 0 ${size / 2}px ${color}55` }}
                          >
                            {size > 16 ? n : ''}
                          </span>
                        </button>
                      ) : (
                        <span className="mx-auto block h-1 w-1 rounded-full bg-ink/10" />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex max-h-[640px] flex-col self-start lg:sticky lg:top-24 glass p-5">
        {active ? (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55">{list.length} projects</p>
            <h3 className="mt-2 text-lg font-medium leading-snug text-ink">{glossOf(am)}</h3>
            <p className="text-sm text-ink/60">with {aa}</p>
            <ul className="mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(22,32,43,0.2)_transparent]">
              {list.map((r) => (
                <li key={r.name}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-md px-2 py-2 text-[13px] text-ink/80 transition-colors hover:bg-white/85 hover:text-ink"
                  >
                    <span className="truncate">{titleFromName(r.name)}</span>
                    <ArrowUpRight size={14} className="shrink-0 text-ink/30 group-hover:text-ink" />
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-ink/60">Pick a bubble to list its projects.</p>
        )}
      </div>
    </div>
  )
}
