import Link from "next/link";
import { ArrowRight, ClipboardCheck, Coffee, MessageCircle, Mic, Route } from "lucide-react";

import { buttonStyles } from "@/components/Button";
import { getOptionalServerSession } from "@/lib/auth-helpers";
import { interviewStories } from "@/lib/interview-stories";
import { projectAreas } from "@/lib/project-ideas";

const featureList = [
  {
    title: "Voice-first drills",
    description:
      "Record answers one question at a time, review the transcript, and keep iterating until it sounds right.",
    icon: Mic,
  },
  {
    title: "STAR grading",
    description:
      "Structured scoring across structure, relevance, impact, and delivery—plus precise improvements for each answer.",
    icon: ClipboardCheck,
  },
  {
    title: "Momentum tracking",
    description:
      "Every session is saved to your dashboard so you can scan progress, spot trends, and prepare with intention.",
    icon: ArrowRight,
  },
];

const journeySteps = [
  {
    title: "1. Pick a target role",
    description: "Start in Job Lab with a posting URL or pasted job description.",
    href: "/jobs",
    cta: "Open Job Lab",
  },
  {
    title: "2. Tailor your resume",
    description: "Run Resume Review to surface keyword gaps and rewrite weak bullets.",
    href: "/resume-review",
    cta: "Review resume",
  },
  {
    title: "3. Rehearse answers",
    description: "Use Interview Prep for STAR drills and timed mock prompts.",
    href: "/interview-prep",
    cta: "Start prep",
  },
  {
    title: "4. Track pipeline",
    description: "Keep every application, status, and note in one tracker.",
    href: "/tracker",
    cta: "Track apps",
  },
];

export default async function Home() {
  const { session } = await getOptionalServerSession();

  const primaryCta = session
    ? {
        href: "/practice",
        label: "Start a session",
      }
    : {
        href: "/login",
        label: "Create free account",
      };

  return (
    <div className="space-y-16 pb-12">
      <section className="relative overflow-hidden border-b border-slate-800/60 pb-14 pt-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-7">
          <h1 className="font-display max-w-3xl text-5xl font-semibold leading-[0.98] text-slate-50 sm:text-6xl">
            Hire Ground for interviews that sound like you.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            Practice the way the real conversation happens: voice-first, question by
            question. Each run gives you targeted STAR feedback, highlights what to fix,
            and saves the transcript so you can track momentum over time.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={primaryCta.href}
              className={buttonStyles({ intent: "primary", size: "lg" })}
            >
              {primaryCta.label}
            </Link>
            <Link
              href="/practice"
              className={buttonStyles({ intent: "secondary", size: "lg" })}
            >
              Explore the flow
            </Link>
          </div>
          </div>

          <dl className="grid gap-3 rounded-[1.75rem] border border-slate-800/60 bg-slate-950/60 p-4 text-xs text-slate-400 shadow-lg">
            <div className="rounded-2xl border border-slate-800/60 bg-[#fffaf2] px-4 py-4">
              <dt className="font-semibold uppercase">Interview modes</dt>
              <dd className="mt-2 text-xl font-semibold text-slate-100">
                Behavioral · Situational · Technical
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-800/60 bg-[#fffaf2] px-4 py-4">
              <dt className="font-semibold uppercase">Answer cadence</dt>
              <dd className="mt-2 text-xl font-semibold text-slate-100">
                One question at a time
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-800/60 bg-[#fffaf2] px-4 py-4">
              <dt className="font-semibold uppercase">Feedback turnaround</dt>
              <dd className="mt-2 text-xl font-semibold text-slate-100">Under 30 seconds</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-100">What you get inside</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {featureList.map((feature) => (
            <article
              key={feature.title}
              className="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-900/65 p-6 text-slate-100 shadow-lg shadow-slate-950/20 transition hover:border-[#eaaa00]/60 hover:shadow-[#eaaa00]/10"
            >
              <feature.icon className="h-8 w-8 text-[#f2c04b]" />
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6">
        <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-end">
          <div>
            <h2 className="font-display text-3xl font-semibold leading-tight text-slate-100">
              Build resume-worthy projects for the roles you want.
            </h2>
          </div>
          <p className="text-sm leading-6 text-slate-300">
            Get project ideas matched to target industries, with practical walkthroughs
            and relevant tech stacks so your resume shows proof, not just interest.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {projectAreas.map((area) => {
            const idea = area.projects[0];
            return (
            <Link
              key={area.industry}
              href={`/projects/${area.slug}`}
              className="flex min-h-full flex-col rounded-2xl border border-slate-800/60 bg-[#fffaf2] p-5 shadow-lg transition hover:-translate-y-1 hover:border-[#b85f43]/45 hover:shadow-[0_26px_62px_-42px_rgba(61,42,30,0.7)]"
            >
              <p className="text-xs font-semibold uppercase text-slate-500">
                {area.industry}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-100">
                {idea.project}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{idea.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {idea.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[#cdbca6] bg-[#f3e8d7] px-2.5 py-1 text-xs font-medium text-[#261f19]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-5 border-t border-slate-800/60 pt-4">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                  <Route className="h-3.5 w-3.5 text-[#8f3e2e]" />
                  Walkthrough
                </p>
                <ol className="mt-3 space-y-2 text-sm text-slate-300">
                  {idea.walkthrough.map((step, index) => (
                    <li key={step} className="flex gap-2">
                      <span className="font-semibold text-[#8f3e2e]">
                        {index + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8f3e2e]">
                View more {area.industry.toLowerCase()} projects
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6 shadow-lg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                <MessageCircle className="h-4 w-4 text-[#8f3e2e]" />
                Interview stories
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-100">
                Learn from real interview recaps.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                A reddit-style board where candidates can share interview questions,
                role context, surprises, and advice for the next person.
              </p>
            </div>
            <Link
              href="/interview-stories"
              className={buttonStyles({ intent: "secondary", size: "sm" })}
            >
              Open stories
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {interviewStories.slice(0, 2).map((story) => (
              <Link
                href="/interview-stories"
                key={story.title}
                className="block rounded-2xl border border-slate-800/60 bg-[#fffaf2] p-4 transition hover:border-[#b85f43]/40"
              >
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {story.role} · {story.companyType}
                </p>
                <h3 className="mt-1 text-base font-semibold text-slate-100">
                  {story.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-300">
                  {story.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/coffee-chats"
          className="rounded-3xl border border-dashed border-[#b85f43]/35 bg-[#ead7c5] p-6 shadow-lg transition hover:-translate-y-1"
        >
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
            <Coffee className="h-4 w-4 text-[#8f3e2e]" />
            Under construction
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-100">
            Request coffee chats with consultants.
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            A future matching flow where candidates can request conversations with real
            consultants from a database filtered by industry, role, and goals.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8f3e2e]">
            Preview the flow
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </section>

      <section className="space-y-6 rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">
              Landing to interview-ready in four steps
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Follow this path: landing -&gt; job description -&gt; resume review -&gt;
              outputs -&gt; interview prep.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/resume-review"
              className={buttonStyles({ intent: "secondary", size: "sm" })}
            >
              Resume Review
            </Link>
            <Link
              href="/interview-prep"
              className={buttonStyles({ intent: "secondary", size: "sm" })}
            >
              Interview Prep
            </Link>
            <Link href="/tracker" className={buttonStyles({ intent: "secondary", size: "sm" })}>
              Tracker
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {journeySteps.map((step) => (
            <article
              key={step.title}
              className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5"
            >
              <h3 className="text-base font-semibold text-slate-100">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{step.description}</p>
              <Link
                href={step.href}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#f4d27d] hover:text-[#ffe49a]"
              >
                {step.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5">
          <h2 className="text-lg font-semibold text-slate-100">Try with sample data</h2>
          <p className="mt-2 text-sm text-slate-300">
            New to the workflow. Jump into prefilled examples and see the full output fast.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/resume-review" className={buttonStyles({ intent: "primary", size: "sm" })}>
              Open sample resume flow
            </Link>
            <Link href="/jobs" className={buttonStyles({ intent: "ghost", size: "sm" })}>
              Open sample job workflow
            </Link>
          </div>
        </article>
        <article className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold text-slate-100">First-time checklist</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
            <li>Paste one target job description.</li>
            <li>Paste your current resume text.</li>
            <li>Review keyword gaps and bullet rewrites.</li>
            <li>Practice two STAR prompts and score yourself.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
