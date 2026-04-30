import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { projectAreas } from "@/lib/project-ideas";

export const metadata = {
  title: "Project Ideas | Hire Ground",
  description: "Resume-worthy project ideas by area of interest.",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-8 pb-10">
      <header className="rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6 shadow-lg">
        <p className="text-xs font-semibold uppercase text-slate-500">
          Resume project library
        </p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-tight text-slate-100 md:text-5xl">
          Choose an area of interest and build proof for your resume.
        </h1>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {projectAreas.map((area) => (
          <Link
            key={area.slug}
            href={`/projects/${area.slug}`}
            className="rounded-2xl border border-slate-800/60 bg-[#fffaf2] p-5 shadow-lg transition hover:-translate-y-1 hover:border-[#b85f43]/40"
          >
            <p className="text-xs font-semibold uppercase text-slate-500">
              {area.industry}
            </p>
            <h2 className="mt-3 text-xl font-semibold text-slate-100">{area.headline}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{area.roleFit}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8f3e2e]">
              Browse projects
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
