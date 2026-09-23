import manifestJson from './manifest.json'
import selectedJson from './selected.json'

export interface Repo {
  name: string
  methods: string[]
  applicationRaw: string
  applications: string[]
  language: string | null
  url: string
  updatedAt: string
  createdAt: string
  sizeKb: number
}

interface Manifest {
  generatedAt: string
  total: number
  methodFamilies: string[]
  methodCounts: Record<string, number>
  applicationCombinations: string[]
  applicationTokenCounts: Record<string, number>
  languageCounts: Record<string, number>
  repos: Repo[]
}

export const manifest = manifestJson as Manifest
export const selected = selectedJson as Repo[]

const ACRONYMS: Record<string, string> = {
  ...Object.fromEntries(
    ['qgis', 'jasp', 'spss', 'gis', 'sem', 'pls', 'ann', 'knn', 'svm', 'pca', 'ols', 'ahp', 'mcdm', 'topsis', 'arima',
      'sarima', 'garch', 'anova', 'ancova', 'manova', 'lstm', 'cnn', 'ml', 'ai', 'gwr', 'vecm', 'ardl', 'cfa', 'efa',
      'amos', 'var', 'dea', 'irt', 'roc', 'auc', 'nlp', 'glm'].map((a) => [a, a.toUpperCase()]),
  ),
  glms: 'GLMs',
  eviews: 'EViews',
  matlab: 'MATLAB',
}

export function titleFromName(name: string): string {
  return name
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((w) => ACRONYMS[w.toLowerCase()] ?? (/^[A-Z0-9]+$/.test(w) && w.length <= 5 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

// Mendeley's single repo is a citation dump, not an investigation — excluded from the graph, as on the CV site.
const EXCLUDED = new Set(['Mendeley'])

// The CV site's porcelain palette: solid mid-tones that hold up on bright glass; busiest application gets the first.
export const APP_COLORS = [
  '#2E8F68', '#2E7D7D', '#5D9147', '#3A7FA8', '#A6772E', '#A85D40', '#6F68A8', '#3B9880',
  '#5786BA', '#587D3A', '#AD8038', '#935F82', '#45908C', '#838F3F', '#6779AA', '#A16752',
]

export type Vec3 = [number, number, number]

export interface AppNode {
  name: string
  count: number
  pos: Vec3
  color: string
  projects: number[]
}

export interface ProjectNode {
  repo: Repo
  title: string
  pos: Vec3
  apps: number[]
  primary: number
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function fibonacci(i: number, n: number): Vec3 {
  const off = 2 / n
  const y = i * off - 1 + off / 2
  const r = Math.sqrt(Math.max(0, 1 - y * y))
  const phi = i * Math.PI * (3 - Math.sqrt(5))
  return [Math.cos(phi) * r, y, Math.sin(phi) * r]
}

function buildGraph() {
  const counts = manifest.applicationTokenCounts
  const names = Object.keys(counts)
    .filter((n) => !EXCLUDED.has(n))
    .sort((a, b) => counts[b] - counts[a] || a.localeCompare(b))
  const idx = new Map(names.map((n, i) => [n, i]))

  const apps: AppNode[] = names.map((name, i) => {
    const d = fibonacci(i, names.length)
    return { name, count: counts[name], pos: [d[0] * 14, d[1] * 14, d[2] * 14], color: APP_COLORS[i % APP_COLORS.length], projects: [] }
  })

  const members: Repo[][] = names.map(() => [])
  for (const repo of manifest.repos) {
    if (repo.applications.some((a) => EXCLUDED.has(a))) continue
    const p = idx.get(repo.applications[0])
    if (p !== undefined) members[p].push(repo)
  }

  const rand = mulberry32(0x5eed301)
  const projects: ProjectNode[] = []
  members.forEach((list, a) => {
    const radius = Math.min(5.4, Math.max(1.7, 1.5 * Math.cbrt(list.length)))
    list.forEach((repo, m) => {
      const d = fibonacci(m, list.length)
      const s = radius * (0.6 + 0.4 * rand())
      const c = apps[a].pos
      const appIdx = repo.applications.map((n) => idx.get(n)).filter((v): v is number => v !== undefined)
      projects.push({ repo, title: titleFromName(repo.name), pos: [c[0] + d[0] * s, c[1] + d[1] * s, c[2] + d[2] * s], apps: appIdx, primary: a })
    })
  })
  projects.forEach((p, i) => p.apps.forEach((a) => apps[a].projects.push(i)))
  return { apps, projects }
}

export const graph = buildGraph()

const colorByApp = new Map(graph.apps.map((a) => [a.name, a.color]))
export const appColor = (name: string) => colorByApp.get(name) ?? '#A3A3A3'
