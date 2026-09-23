export default function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-current/[0.07] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] ring-1 ring-current/15">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-40 motion-reduce:hidden" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {children}
    </span>
  )
}
