import { tenunThreads } from "@/lib/motifs";

/**
 * A vertical-thread texture in the manner of tenun (handwoven Nusantara
 * cloth): each thread's width is a method family's real share of the
 * catalog, coloured with the same palette used in the method tabs — so the
 * texture is a second rendering of real data, not an unrelated background
 * image. Purely decorative placement; the counts themselves are stated in
 * text wherever this appears.
 */
export default function TenunTexture({ className = "" }: { className?: string }) {
  const threads = tenunThreads();

  return (
    <div aria-hidden="true" className={`flex h-full w-full overflow-hidden ${className}`}>
      {threads.map((thread) => (
        <span
          key={thread.name}
          style={{ flexGrow: thread.weight || 0.001, flexBasis: 0, backgroundColor: thread.color }}
          className="h-full min-w-[1px] opacity-70"
        />
      ))}
    </div>
  );
}
