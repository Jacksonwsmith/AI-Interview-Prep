import type { StoredEvaluationType } from "@/lib/schemas";
import { Sparkles } from "lucide-react";

interface ScoreCardProps {
  evaluation: StoredEvaluationType;
  heading?: string;
}

export function ScoreCard({ evaluation, heading = "Session Feedback" }: ScoreCardProps) {
  const { scores, feedback, tips_next_time } = evaluation;

  const scoreEntries = [
    { label: "Structure", value: scores.structure },
    { label: "Relevance", value: scores.relevance },
    { label: "Impact", value: scores.impact },
    { label: "Delivery", value: scores.delivery },
  ];

  return (
    <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">{heading}</h2>
          <p className="text-sm text-slate-400">
            STAR-aligned coaching powered by OpenAI
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-200">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold">
            Overall {scores.overall.toFixed(1)} / 10
          </span>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {scoreEntries.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-100"
          >
            <p className="font-medium">{item.label}</p>
            <p className="text-xs">{item.value.toFixed(1)} / 10</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-200">Summary</h3>
        <p className="text-sm text-slate-300">{feedback.summary}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">Answer-level coaching</h3>
        <div className="space-y-3">
          {feedback.by_answer.map((item, index) => (
            <div
              key={index}
              className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Answer {index + 1}
              </p>
              <div>
                <p className="text-xs font-semibold text-slate-300">Improvements</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-400">
                  {item.improvements.map((improvement) => (
                    <li key={improvement}>{improvement}</li>
                  ))}
                </ul>
              </div>
              {item.missing_keywords.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-300">Missing keywords</p>
                  <p className="text-xs text-slate-400">
                    {item.missing_keywords.join(", ")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {tips_next_time.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-200">Tips for next time</h3>
          <ul className="list-disc space-y-1 pl-5 text-xs text-slate-400">
            {tips_next_time.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default ScoreCard;
