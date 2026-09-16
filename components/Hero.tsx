import Image from "next/image";
import { identity } from "@/lib/content";
import { manifest } from "@/lib/data";

export default function Hero() {
  return (
    <section id="top" className="border-b hairline bg-porcelain pt-10 sm:pt-14">
      <div className="container-editorial pb-14 lg:pb-20">
        <div className="max-w-2xl">
          <div className="mb-8 flex items-center gap-4">
            <Image
              src="/images/portrait.jpg"
              alt={`Portrait of ${identity.name}`}
              width={64}
              height={64}
              priority
              className="h-16 w-16 rounded-full border hairline object-cover"
            />
            <div>
              <p className="text-sm font-medium text-ink">{identity.name}</p>
              <p className="font-mono-label text-[11px] text-graphite">{identity.location}</p>
            </div>
          </div>

          <h1 className="text-[2.5rem] font-medium leading-[1.08] tracking-tight text-ink sm:text-[3.25rem]">
            {identity.heroHeadline}
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-graphite sm:text-lg">
            {identity.heroSubtext}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#practice"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-ink px-6 py-3 text-sm font-medium text-paper transition-transform duration-200 ease-atelier hover:-translate-y-0.5"
            >
              Explore the work
              <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-[44px] items-center rounded-pill border hairline px-6 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:border-oxide hover:text-oxide"
            >
              Discuss a role
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4 border-t hairline pt-6">
            <div>
              <dt className="font-mono-label text-[10px] text-graphite">Repositories</dt>
              <dd className="mt-1 text-2xl font-medium text-ink">{manifest.total}</dd>
            </div>
            <div>
              <dt className="font-mono-label text-[10px] text-graphite">Method families</dt>
              <dd className="mt-1 text-2xl font-medium text-ink">{manifest.methodFamilies.length}</dd>
            </div>
            <div>
              <dt className="font-mono-label text-[10px] text-graphite">Applications</dt>
              <dd className="mt-1 text-2xl font-medium text-ink">
                {Object.keys(manifest.applicationTokenCounts).length}
              </dd>
            </div>
          </dl>
        </div>

      </div>
    </section>
  );
}
