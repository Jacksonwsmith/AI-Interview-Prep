export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-50">About Hire Ground</h1>
        <p className="text-sm text-slate-300">
          Hire Ground helps you move from job target to interview-ready with a practical
          workflow: job context, resume review, interview rehearsal, and tracking.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-100">Our story</h2>
        <p className="text-sm leading-6 text-slate-300">
          Hire Ground started as a personal tool. The creator was preparing for Big 4
          interviews and needed a better way to turn job descriptions, resume bullets,
          and practice answers into a focused prep routine.
        </p>
        <p className="text-sm leading-6 text-slate-300">
          That process worked. They landed the job, then kept building Hire Ground so
          other candidates could practice with the same clarity: know what the role is
          asking for, sharpen the story, rehearse out loud, and walk into the interview
          with momentum.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-100">What this product includes</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>Voice-first interview practice and STAR feedback.</li>
          <li>Resume review against a target job description.</li>
          <li>Job helper drafting and application tracking.</li>
        </ul>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-100">Design principle</h2>
        <p className="text-sm text-slate-300">
          Keep each step focused and actionable. Every screen should answer one question:
          what should I do next to get this application over the line.
        </p>
      </section>
    </div>
  );
}
