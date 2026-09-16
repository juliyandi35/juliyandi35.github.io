# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and hiring managers evaluating Juli Yandi Rahman, S.Mat for roles in mathematics, statistics, data systems, or applied AI. Secondary: collaborators or peers assessing the body of work directly.

## Product Purpose

A portfolio site presenting Juli Yandi Rahman's work across mathematics, statistical research, public-sector data systems, and applied AI, built from 301 verified public GitHub repositories. Success is a recruiter/evaluator being able to trust and explore the breadth and substance of the work without the site inventing credentials it cannot back up.

## Positioning

Every claim on the site is derived at build time from real GitHub data, never authored by hand: `scripts/build-manifest.mjs` reads the taxonomy each of the 301 repositories already carries in its own GitHub description (`<method family> | <application>`) and computes `data/manifest.json` from it. No star counts, client outcomes, accuracy scores, or years-of-experience figures appear anywhere, because they are not derivable from public data. This is the mechanism a template portfolio or a hand-written CV page could not truthfully copy.

## Operating Context

Scroll-driven, single-page Next.js (App Router) site. Sections arrive from depth and pass behind the reader via CSS 3D (`components/Exploration/DepthLayer.tsx`, GSAP ScrollTrigger); the journey ends in a WebGL graph of the whole catalog (`components/Graph/GraphStage.tsx`, React Three Fiber) with a searchable/paginated project atlas as its full keyboard and screen-reader equivalent. Data refreshes via `npm run build:data` against the live GitHub API (falls back to the committed manifest on failure/rate-limit); a `GITHUB_TOKEN` raises the unauthenticated 60/hour cap to 5,000/hour and is read only at build time, never bundled or committed.

## Capabilities and Constraints

- Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, React Three Fiber, GSAP ScrollTrigger, Framer Motion.
- Graph layout is computed at load from `data/manifest.json` (golden-angle sphere distribution, seeded PRNG for server/client parity) — deliberately no committed `data/graph.json`, so it can never drift out of sync with the repository catalog.
- Canvas is decorative and `aria-hidden`; every graph interaction (click a project, focus an application hub) has a real `<button>`/link equivalent outside the canvas. Color is never the only channel.
- Testing: Vitest (manifest parsing, atlas filtering, graph topology, camera framing math), Playwright e2e smoke test.
- Deploys unmodified to Vercel, Netlify, or any Node host.

## Evidence on Hand

`data/manifest.json`, verified at build time: 301 repositories, 13 method families, 16 distinct applications (19 combinations, since a few projects use two tools). Source: `github.com/juliyandi35`. Two repositories on the account lack the required description taxonomy and are intentionally excluded. No testimonials, client outcomes, or press exist and none should be fabricated.

## Product Principles

- Never state a claim the public data cannot back up; when evidence is missing, omit rather than invent.
- Keep the catalog and its computed layout mechanically derived from `data/manifest.json`, never hand-authored or manually positioned.
- Every graph/canvas interaction must have a keyboard- and screen-reader-reachable equivalent; the canvas itself stays decorative.
- Prefer closed-form/computed solutions over committed derived-data files that can silently drift out of sync.

## Accessibility & Inclusion

Established requirement, already implemented: canvas is `aria-hidden` and purely decorative; all graph functionality (browsing applications, opening a project) is reachable via real focusable controls and the project atlas; color is never the sole channel for distinguishing applications.
