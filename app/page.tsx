import Link from "next/link";
import { BrainCircuit, ClipboardCheck, Sparkles, TrendingUp } from "lucide-react";

import { buttonStyles } from "@/components/Button";
import { getOptionalServerSession } from "@/lib/auth-helpers";

const featureCards = [
  {
    title: "Role-specific prompts",
    description:
      "Leverage AI-crafted behavioral questions tailored to Data Analyst, Product Manager, and SWE interviews.",
    icon: BrainCircuit,
  },
  {
    title: "STAR feedback",
    description:
      "Structured scoring that pinpoints gaps in structure, relevance, impact, and delivery for each answer.",
    icon: ClipboardCheck,
  },
  {
    title: "Longitudinal insights",
    description:
      "Dashboard memories store every session so you can measure trend lines and prep efficiently.",
    icon: TrendingUp,
  },
];

export default async function Home() {
  const { session } = await getOptionalServerSession();

  const primaryCta = session
    ? {
        href: "/practice",
        label: "Start practicing",
      }
    : {
        href: "/login",
        label: "Get started",
      };

  return (
    <div className="space-y-16">
      <section className="grid gap-12 rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-600 via-purple-600 to-slate-900 p-12 text-white shadow-xl">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <Sparkles className="h-4 w-4" /> AI interview coach
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Mock interviews that actually prepare you for the real thing.
          </h1>
          <p className="max-w-2xl text-lg text-slate-100">
            Run focused, three-question drills, get honest STAR-aligned feedback, and keep
            every result in one Supabase-powered dashboard.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={primaryCta.href}
              className={buttonStyles({ intent: "primary", size: "lg" })}
            >
              {primaryCta.label}
            </Link>
            <Link
              href="/dashboard"
              className={buttonStyles({ intent: "secondary", size: "lg" })}
            >
              View dashboard
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-100">
          Why candidates use Interview Coach
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {featureCards.map((feature) => (
            <article
              key={feature.title}
              className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-100 shadow transition hover:border-indigo-400/60"
            >
              <feature.icon className="h-8 w-8 text-indigo-400" />
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
