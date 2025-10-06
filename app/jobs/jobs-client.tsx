"use client";

import { useState } from "react";

import { Clipboard, ClipboardCheck, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/Button";
import { useToast } from "@/components/ToastProvider";

interface JobHelperResult {
  applicationSummary: string;
  valueProps: string[];
  coverLetter: string;
  screeningResponses: { question: string; answer: string }[];
  autoFill: {
    coreProfile: {
      headline: string;
      oneLiner: string;
      skills: string[];
    };
    formResponses: { fieldLabel: string; recommendedValue: string }[];
    screeningShortForm: { question: string; answer: string }[];
    followUpEmail: string;
  };
}

const defaultFocus =
  "Highlight cross-functional leadership, quantitative impact, and user-centric delivery.";

export default function JobsClient() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeSummary, setResumeSummary] = useState("");
  const [focusAreas, setFocusAreas] = useState(defaultFocus);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobHelperResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { publish } = useToast();

  const handleSubmit = async () => {
    if (!jobTitle || !company || !jobDescription || !resumeSummary) {
      publish("Fill in job title, company, description, and your summary.", "error");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/job-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          company,
          jobDescription,
          resumeSummary,
          focusAreas,
        }),
      });

      const payload = (await response.json()) as JobHelperResult & { message?: string };

      if (!response.ok || !payload.applicationSummary) {
        throw new Error(payload.message ?? "Unable to generate materials.");
      }

      setResult(payload);
      publish("Draft package ready. Tailor and paste into your application.", "success");
    } catch (error) {
      publish(error instanceof Error ? error.message : "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      publish(`${label} copied`, "success");
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      publish("Unable to copy to clipboard", "error");
    }
  };

  const renderCopyButton = (label: string, value: string, size: "sm" | "xs" = "sm") => (
    <Button
      type="button"
      intent="ghost"
      size={size}
      onClick={() => copyToClipboard(label, value)}
    >
      {copiedField === label ? (
        <ClipboardCheck className="h-4 w-4" />
      ) : (
        <Clipboard className="h-4 w-4" />
      )}
      Copy
    </Button>
  );

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-50">
          Job application assistant
        </h1>
        <p className="text-sm leading-relaxed text-slate-300">
          Paste the job description, add a quick summary of your experience, and let the
          AI draft targeted value props, recruiter-ready answers, and auto-fill
          suggestions for common forms.
        </p>
      </header>

      <section className="grid gap-6 rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Job title</label>
            <input
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              placeholder="Staff Product Manager"
              className="w-full rounded-lg border border-slate-700/70 bg-slate-950/80 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Company</label>
            <input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Acme Corp"
              className="w-full rounded-lg border border-slate-700/70 bg-slate-950/80 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">
              Resume summary / notable experience
            </label>
            <textarea
              value={resumeSummary}
              onChange={(event) => setResumeSummary(event.target.value)}
              placeholder="3-4 bullet summary of your experience and impact."
              className="min-h-[120px] w-full rounded-lg border border-slate-700/70 bg-slate-950/80 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">
              Job description / posting highlights
            </label>
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the job description here."
              className="min-h-[200px] w-full rounded-lg border border-slate-700/70 bg-slate-950/80 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">
              Focus areas (optional)
            </label>
            <textarea
              value={focusAreas}
              onChange={(event) => setFocusAreas(event.target.value)}
              className="min-h-[80px] w-full rounded-lg border border-slate-700/70 bg-slate-950/80 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Generate package
        </Button>
        <p className="text-xs text-slate-500">
          We’ll save the generated output so you can revisit or tweak it later.
        </p>
      </div>

      {result && (
        <section className="space-y-6 rounded-3xl border border-slate-800/60 bg-slate-950/60 p-6">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-100">Application summary</h2>
            <p className="text-sm leading-relaxed text-slate-300">
              {result.applicationSummary}
            </p>
            {renderCopyButton("Summary", result.applicationSummary)}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-200">Value propositions</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
              {result.valueProps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {renderCopyButton("Value props", result.valueProps.join("\n"))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-200">Cover letter snippet</h3>
            <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
              {result.coverLetter}
            </p>
            {renderCopyButton("Cover letter", result.coverLetter)}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-200">Screening responses</h3>
            <div className="space-y-3 text-sm text-slate-300">
              {result.screeningResponses.map(({ question, answer }) => (
                <div
                  key={question}
                  className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {question}
                  </p>
                  <p className="leading-relaxed text-slate-300 whitespace-pre-line">
                    {answer}
                  </p>
                  {renderCopyButton(question, answer, "xs")}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-800/60 bg-slate-950/50 p-6">
            <h3 className="text-sm font-semibold text-slate-200">
              Auto-apply form responses
            </h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Core profile
                </p>
                <p className="mt-1 font-semibold text-slate-100">
                  {result.autoFill.coreProfile.headline}
                </p>
                <p className="mt-1 leading-relaxed text-slate-300">
                  {result.autoFill.coreProfile.oneLiner}
                </p>
                <p className="mt-2 text-[11px] text-slate-500">
                  Top skills: {result.autoFill.coreProfile.skills.join(", ")}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Form field suggestions
                </p>
                <div className="grid gap-2 md:grid-cols-2">
                  {result.autoFill.formResponses.map((item) => (
                    <div
                      key={item.fieldLabel}
                      className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"
                    >
                      <p className="text-xs font-semibold text-slate-200">
                        {item.fieldLabel}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">
                        {item.recommendedValue}
                      </p>
                      {renderCopyButton(item.fieldLabel, item.recommendedValue, "xs")}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Short-form screening answers
                </p>
                <div className="space-y-2">
                  {result.autoFill.screeningShortForm.map(({ question, answer }) => (
                    <div
                      key={question}
                      className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"
                    >
                      <p className="text-xs font-semibold text-slate-200">{question}</p>
                      <p className="mt-1 text-xs text-slate-300 whitespace-pre-line">
                        {answer}
                      </p>
                      {renderCopyButton(`${question}-short`, answer, "xs")}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Follow-up email template
                </p>
                <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                  {result.autoFill.followUpEmail}
                </p>
                {renderCopyButton("Follow-up email", result.autoFill.followUpEmail)}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
