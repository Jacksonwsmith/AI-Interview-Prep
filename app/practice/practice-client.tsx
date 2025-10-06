"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";

import { Button, buttonStyles } from "@/components/Button";
import QuestionCard from "@/components/QuestionCard";
import ScoreCard from "@/components/ScoreCard";
import { useToast } from "@/components/ToastProvider";
import type { Role, StoredEvaluationType } from "@/lib/schemas";

interface PracticeClientProps {
  roles: Role[];
}

interface QuestionResponsePayload {
  questions: string[];
  message?: string;
}

export default function PracticeClient({ roles }: PracticeClientProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [evaluation, setEvaluation] = useState<StoredEvaluationType | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { publish } = useToast();

  const handleGenerateQuestions = async () => {
    setLoadingQuestions(true);
    setEvaluation(null);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });

      const payload = (await response.json()) as QuestionResponsePayload;

      if (!response.ok || !payload.questions) {
        throw new Error(payload.message ?? "Unable to fetch questions.");
      }

      setQuestions(payload.questions);
      setAnswers(["", "", ""]);
      publish("Question set ready. Time to craft your STAR answers.", "success");
    } catch (error) {
      publish(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading questions.",
        "error",
      );
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (questions.length !== 3) {
      publish("Generate questions before requesting feedback.", "error");
      return;
    }

    if (answers.some((answer) => answer.trim().length < 20)) {
      publish("Each answer should be at least 20 characters to evaluate.", "error");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          questions,
          answers,
        }),
      });

      const payload = (await response.json()) as StoredEvaluationType & {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message ?? "Evaluation failed. Try again.");
      }

      setEvaluation(payload);
      publish("Feedback ready! Review your scores below.", "success");
    } catch (error) {
      publish(
        error instanceof Error ? error.message : "Unable to fetch feedback.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setEvaluation(null);
    setAnswers(["", "", ""]);
    publish("Session reset. Draft fresh answers.", "info");
  };

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-50">Practice Session</h1>
        <p className="text-sm text-slate-300">
          Choose a role, generate three tailored questions, and structure each response
          using the STAR framework. Once you submit, OpenAI will analyse and score you
          across key interview dimensions.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-200">
            Role
            <select
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value as Role)}
              className="rounded-md border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none"
            >
              {roles.map((role) => (
                <option key={role} value={role} className="bg-slate-900 text-white">
                  {role}
                </option>
              ))}
            </select>
          </label>
          <Button
            type="button"
            intent="secondary"
            onClick={handleGenerateQuestions}
            disabled={loadingQuestions}
          >
            {loadingQuestions ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate Questions
          </Button>
        </div>
      </header>

      {questions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-sm text-slate-300">
          Generate a question set to begin your practice session.
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionCard
              key={question}
              index={index}
              question={question}
              value={answers[index] ?? ""}
              onChange={(value) => handleAnswerChange(index, value)}
              disabled={submitting}
            />
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || questions.length === 0}
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Get Feedback
        </Button>
        <Button
          type="button"
          intent="ghost"
          onClick={handleReset}
          disabled={questions.length === 0}
        >
          Reset Session
        </Button>
        {evaluation && (
          <Link
            href="/dashboard"
            className={buttonStyles({ intent: "secondary", size: "md" })}
          >
            Save &amp; View Dashboard
          </Link>
        )}
      </div>

      {evaluation && <ScoreCard evaluation={evaluation} heading="Latest Feedback" />}
    </div>
  );
}
