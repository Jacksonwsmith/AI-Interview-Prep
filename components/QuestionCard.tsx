"use client";

import { ChangeEvent } from "react";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  index: number;
  question: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MAX_LENGTH = 1200;

export function QuestionCard({
  index,
  question,
  value,
  onChange,
  disabled = false,
}: QuestionCardProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">
          Question {index + 1}
        </p>
        <h3 className="text-base font-medium text-slate-50">{question}</h3>
      </header>
      <div className="space-y-3">
        <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">
          Your answer
        </label>
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="Structure your answer with STAR: Situation, Task, Action, Result."
          className={cn(
            "min-h-[160px] w-full resize-y rounded-xl border bg-slate-950/60 p-4 text-sm text-slate-100 shadow-inner transition",
            "border-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40",
            disabled && "cursor-not-allowed opacity-70",
          )}
          maxLength={MAX_LENGTH}
          disabled={disabled}
        />
        <p className="text-right text-xs text-slate-400">
          {value.length}/{MAX_LENGTH}
        </p>
      </div>
    </article>
  );
}

export default QuestionCard;
