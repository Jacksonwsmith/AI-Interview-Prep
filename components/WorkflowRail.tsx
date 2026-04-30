import Link from "next/link";

const steps = [
  { id: "jobs", label: "Job Lab", href: "/jobs" },
  { id: "resume-review", label: "Resume Review", href: "/resume-review" },
  { id: "practice", label: "Practice", href: "/practice" },
  { id: "tracker", label: "Tracker", href: "/tracker" },
] as const;

type WorkflowStepId = (typeof steps)[number]["id"];

type WorkflowRailProps = {
  current: WorkflowStepId;
};

export default function WorkflowRail({ current }: WorkflowRailProps) {
  return (
    <nav
      aria-label="Workflow progress"
      className="rounded-full border border-slate-800/60 bg-slate-950/60 p-2 shadow-sm"
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {steps.map((step, index) => {
          const isCurrent = step.id === current;
          return (
            <li key={step.id} className="flex items-center gap-2">
              <Link
                href={step.href}
                aria-current={isCurrent ? "step" : undefined}
                className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  isCurrent
                    ? "border-[#b85f43]/45 bg-[#ead7c5] text-[#261f19]"
                    : "border-transparent text-slate-300 hover:border-[#b85f43]/30 hover:bg-[#f3e8d7] hover:text-[#261f19]"
                }`}
              >
                {index + 1}. {step.label}
              </Link>
              {index < steps.length - 1 && (
                <span className="text-xs text-slate-600" aria-hidden="true">
                  →
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
