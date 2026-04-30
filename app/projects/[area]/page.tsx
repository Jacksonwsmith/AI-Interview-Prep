import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Layers3 } from "lucide-react";

import { buttonStyles } from "@/components/Button";
import { getProjectArea, getProjectIdea, projectAreas } from "@/lib/project-ideas";

type ProjectAreaPageProps = {
  params: Promise<{ area: string }>;
  searchParams: Promise<{ project?: string }>;
};

export function generateStaticParams() {
  return projectAreas.map((area) => ({ area: area.slug }));
}

export async function generateMetadata({ params }: Pick<ProjectAreaPageProps, "params">) {
  const { area: areaSlug } = await params;
  const area = getProjectArea(areaSlug);

  if (!area) {
    return {
      title: "Project Ideas | Hire Ground",
    };
  }

  return {
    title: `${area.industry} Project Ideas | Hire Ground`,
    description: area.roleFit,
  };
}

export default async function ProjectAreaPage({
  params,
  searchParams,
}: ProjectAreaPageProps) {
  const { area: areaSlug } = await params;
  const { project: projectSlug } = await searchParams;
  const area = getProjectArea(areaSlug);

  if (!area) {
    notFound();
  }

  const selectedProject = getProjectIdea(area, projectSlug);

  return (
    <div className="space-y-8 pb-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#8f3e2e] hover:text-[#261f19]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <section className="rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6 shadow-lg">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              Resume project library
            </p>
            <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-tight text-slate-100 md:text-5xl">
              {area.industry}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">{area.headline}</p>
          </div>
          <div className="rounded-2xl border border-slate-800/60 bg-[#fffaf2] p-5">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-100">
              <Layers3 className="h-4 w-4 text-[#8f3e2e]" />
              Best fit
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{area.roleFit}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-100">Project menu</h2>
          <div className="space-y-3">
            {area.projects.map((project) => {
              const isSelected = project.slug === selectedProject.slug;

              return (
                <Link
                  key={project.slug}
                  href={`/projects/${area.slug}?project=${project.slug}`}
                  aria-current={isSelected ? "page" : undefined}
                  className={`block rounded-2xl border p-4 transition ${
                    isSelected
                      ? "border-[#b85f43]/45 bg-[#ead7c5]"
                      : "border-slate-800/60 bg-[#fffaf2] hover:border-[#b85f43]/35 hover:bg-[#f8efe2]"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-100">{project.project}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-300">
                    {project.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </aside>

        <article className="rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6 shadow-lg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Selected project
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-100">
                {selectedProject.project}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                {selectedProject.description}
              </p>
            </div>
            <Link href="/resume-review" className={buttonStyles({ intent: "secondary", size: "sm" })}>
              Turn into resume bullet
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {selectedProject.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[#cdbca6] bg-[#f3e8d7] px-3 py-1 text-xs font-medium text-[#261f19]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <section>
              <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-100">
                <CheckCircle2 className="h-4 w-4 text-[#8f3e2e]" />
                Walkthrough
              </h3>
              <ol className="mt-4 space-y-3 text-sm text-slate-300">
                {selectedProject.walkthrough.map((step, index) => (
                  <li key={step} className="flex gap-3 rounded-xl border border-slate-800/60 bg-[#fffaf2] p-3">
                    <span className="font-semibold text-[#8f3e2e]">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-slate-100">Stretch upgrades</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {selectedProject.stretch.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-slate-800/60 bg-[#fffaf2] p-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mt-8 rounded-2xl border border-[#b85f43]/30 bg-[#ead7c5] p-5">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Suggested resume bullet
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-100">
              {selectedProject.resumeBullet}
            </p>
          </section>

          <div className="mt-6 flex flex-wrap gap-3">
            {projectAreas
              .filter((nextArea) => nextArea.slug !== area.slug)
              .map((nextArea) => (
                <Link
                  key={nextArea.slug}
                  href={`/projects/${nextArea.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-[#fffaf2] px-3 py-2 text-xs font-semibold text-slate-100 hover:border-[#b85f43]/35"
                >
                  {nextArea.industry}
                  <ArrowRight className="h-3.5 w-3.5 text-[#8f3e2e]" />
                </Link>
              ))}
          </div>
        </article>
      </section>
    </div>
  );
}
