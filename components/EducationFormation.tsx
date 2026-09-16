"use client";

import { useState } from "react";
import {
  education,
  organization,
  structuralTraining,
  courses,
  courseGroupLabels,
  type CourseGroup,
} from "@/lib/content";
import Reveal from "@/components/Reveal";

const primaryEducation = education.filter((e) => e.tier === "primary");
const earlyEducation = education.filter((e) => e.tier === "early");
const courseGroups = Object.keys(courseGroupLabels) as CourseGroup[];

export default function EducationFormation() {
  const [earlyOpen, setEarlyOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<CourseGroup | null>("ai-data");

  return (
    <section id="formation" className="border-b hairline bg-paper py-20 sm:py-28">
      <div className="container-editorial">
        <Reveal className="max-w-2xl">
          <p className="font-mono-label text-xs text-oxide">Education and formation</p>
          <h2 className="mt-3 text-3xl font-medium text-ink sm:text-4xl">
            University, research, and continuous training
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {primaryEducation.map((entry) => (
            <div key={entry.id} className="rounded-surface border hairline bg-porcelain p-6">
              <p className="font-mono-label text-[11px] text-graphite">{entry.period}</p>
              <h3 className="mt-1 text-lg font-medium text-ink">{entry.institution}</h3>
              <p className="mt-1 text-sm text-graphite">{entry.program}</p>
              {entry.detail && <p className="mt-2 font-mono-label text-[11px] text-oxide">{entry.detail}</p>}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-surface border hairline bg-porcelain p-6">
          <p className="font-mono-label text-[11px] text-graphite">{organization.period}</p>
          <h3 className="mt-1 text-lg font-medium text-ink">{organization.name}</h3>
          <p className="mt-1 text-sm text-graphite">
            {organization.role} — {organization.detail}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEarlyOpen((v) => !v)}
          aria-expanded={earlyOpen}
          aria-controls="early-education"
          className="mt-4 flex min-h-[44px] w-full items-center justify-between rounded-surface border hairline bg-porcelain px-6 py-4 text-left text-sm font-medium text-ink"
        >
          Complete education timeline (primary and secondary schooling)
          <span aria-hidden="true">{earlyOpen ? "−" : "+"}</span>
        </button>
        {earlyOpen && (
          <ul id="early-education" className="mt-2 divide-y divide-hairline rounded-surface border hairline bg-porcelain">
            {earlyEducation.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-center justify-between gap-2 px-6 py-4">
                <span className="text-sm text-ink">{entry.institution}</span>
                <span className="font-mono-label text-[11px] text-graphite">{entry.period}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {structuralTraining.map((t) => (
            <div key={t.id} className="rounded-surface border hairline bg-porcelain p-6">
              <p className="font-mono-label text-[11px] text-graphite">{t.period}</p>
              <h3 className="mt-1 text-base font-medium text-ink">{t.title}</h3>
              {t.detail && <p className="mt-1 text-sm text-graphite">{t.detail}</p>}
            </div>
          ))}
        </div>

        <h3 className="mt-14 text-xl font-medium text-ink">Courses and certifications</h3>
        <div className="mt-6 divide-y divide-hairline rounded-surface border hairline">
          {courseGroups.map((group) => {
            const items = courses.filter((c) => c.group === group);
            if (items.length === 0) return null;
            const isOpen = openGroup === group;
            return (
              <div key={group} className="bg-porcelain">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : group)}
                  aria-expanded={isOpen}
                  aria-controls={`course-group-${group}`}
                  className="flex min-h-[44px] w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-medium text-ink">{courseGroupLabels[group]}</span>
                  <span className="font-mono-label text-[11px] text-graphite">
                    {items.length} {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <ul id={`course-group-${group}`} className="divide-y divide-hairline border-t hairline">
                    {items.map((course) => (
                      <li key={course.id} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-ink">{course.title}</p>
                          <p className="mt-0.5 text-xs text-graphite">
                            {course.provider} · {course.year}
                            {course.hours ? ` · ${course.hours}h` : ""}
                          </p>
                        </div>
                        <p className="font-mono-label text-[11px] text-graphite">Completed {course.completed}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
