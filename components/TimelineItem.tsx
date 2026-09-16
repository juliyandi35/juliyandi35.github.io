"use client";

import { motion } from "framer-motion";
import type { WorkExperience } from "@/lib/content";

/**
 * framer-motion's motion.* components read/write React context and are not
 * server-renderable, so — like <MotionConfig> in app/layout.tsx (see
 * components/MotionProvider.tsx) — <motion.li> cannot be used directly
 * inside ProfessionalTimeline.tsx, which stays a plain Server Component.
 * This is the client boundary for just the one animated list item.
 */
export default function TimelineItem({ role, index }: { role: WorkExperience; index: number }) {
  return (
    <motion.li
      className="relative pb-10 last:pb-0"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
    >
      <span
        aria-hidden="true"
        className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-oxide"
      />
      <p className="font-mono-label text-[11px] text-graphite">{role.period}</p>
      <h3 className="mt-1 text-lg font-medium text-ink">{role.organization}</h3>
      <p className="mt-0.5 text-sm text-graphite">{role.role}</p>
      <ul className="mt-3 space-y-1.5">
        {role.responsibilities.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-graphite">
            {item}
          </li>
        ))}
      </ul>
    </motion.li>
  );
}
