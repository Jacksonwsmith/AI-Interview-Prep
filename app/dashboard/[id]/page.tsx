import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { buttonStyles } from "@/components/Button";
import ScoreCard from "@/components/ScoreCard";
import { requireServerSession } from "@/lib/auth-helpers";
import { SessionRow } from "@/lib/schemas";

export default async function DashboardDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { supabase } = await requireServerSession();
  const { id } = params;

  const { data, error } = await supabase
    .from("sessions")
    .select("id, created_at, role, question_set, answers, scores, feedback")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to load session", error);
    notFound();
  }

  const parsed = SessionRow.safeParse(data);

  if (!parsed.success) {
    notFound();
  }

  const session = parsed.data;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className={buttonStyles({ intent: "ghost" })}>
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {new Date(session.created_at).toLocaleString()} · {session.role}
        </p>
      </div>

      <ScoreCard evaluation={session.scores} heading="Session Summary" />

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold text-slate-50">Questions &amp; Answers</h2>
        <div className="space-y-6">
          {session.question_set.map((question, index) => (
            <article
              key={question}
              className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/40 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Question {index + 1}
              </p>
              <p className="text-sm text-slate-100">{question}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Your answer
              </p>
              <p className="whitespace-pre-wrap text-sm text-slate-200">
                {session.answers[index] ?? "Not captured"}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
