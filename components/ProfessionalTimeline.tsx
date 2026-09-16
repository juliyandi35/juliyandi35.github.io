import { workExperience } from "@/lib/content";
import Reveal from "@/components/Reveal";
import TimelineItem from "@/components/TimelineItem";

export default function ProfessionalTimeline() {
  return (
    <section id="experience" className="border-b hairline bg-porcelain py-20 sm:py-28">
      <div className="container-editorial">
        <Reveal className="max-w-2xl">
          <p className="font-mono-label text-xs text-oxide">Professional timeline</p>
          <h2 className="mt-3 text-3xl font-medium text-ink sm:text-4xl">
            From client research to public-sector systems
          </h2>
        </Reveal>

        <ol className="mt-10 space-y-0 border-l hairline pl-8">
          {workExperience.map((role, i) => (
            <TimelineItem key={role.id} role={role} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
