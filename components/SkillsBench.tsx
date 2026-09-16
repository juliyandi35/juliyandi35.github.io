import { skillClusters, softSkills, languages } from "@/lib/content";
import Reveal from "@/components/Reveal";

export default function SkillsBench() {
  return (
    <section className="border-b hairline bg-porcelain py-20 sm:py-28">
      <div className="container-editorial">
        <Reveal className="max-w-2xl">
          <p className="font-mono-label text-xs text-oxide">Skills bench</p>
          <h2 className="mt-3 text-3xl font-medium text-ink sm:text-4xl">An integrated practice</h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {skillClusters.map((cluster) => (
            <div key={cluster.id} className="rounded-surface border hairline bg-paper p-6">
              <h3 className="font-mono-label text-[11px] text-oxide">{cluster.label}</h3>
              <ul className="mt-3 space-y-1.5">
                {cluster.items.map((item) => (
                  <li key={item} className="text-sm text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-surface border hairline bg-paper p-6">
            <h3 className="font-mono-label text-[11px] text-oxide">Working style</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink">{softSkills.join(", ")}.</p>
          </div>
          <div className="rounded-surface border hairline bg-paper p-6">
            <h3 className="font-mono-label text-[11px] text-oxide">Languages</h3>
            <ul className="mt-3 space-y-1.5">
              {languages.map((l) => (
                <li key={l.name} className="flex justify-between text-sm text-ink">
                  <span>{l.name}</span>
                  <span className="text-graphite">{l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
