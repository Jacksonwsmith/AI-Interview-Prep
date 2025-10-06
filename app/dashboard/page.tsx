import Link from "next/link";

import { requireServerSession } from "@/lib/auth-helpers";
import { SessionRow, type SessionRowType } from "@/lib/schemas";

function parseSessions(rows: unknown[]): SessionRowType[] {
  return rows
    .map((row) => SessionRow.safeParse(row))
    .filter((result): result is { success: true; data: SessionRowType } => result.success)
    .map((result) => result.data);
}

export default async function DashboardPage() {
  const { supabase } = await requireServerSession();

  const { data, error } = await supabase
    .from("sessions")
    .select("id, created_at, role, question_set, answers, scores, feedback")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Failed to load sessions", error);
  }

  const sessions = data ? parseSessions(data) : [];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-50">Dashboard</h1>
        <p className="text-sm text-slate-300">
          Track your recent practice sessions. Each row summarises the overall score and
          provides a link to dive into the detailed feedback.
        </p>
      </header>

      {sessions.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-sm text-slate-300">
          No sessions yet. Run your first practice session to populate this dashboard.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/70 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Overall</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/40">
              {sessions.map((session) => (
                <tr key={session.id} className="text-slate-200">
                  <td className="px-4 py-3 text-slate-300">
                    {new Date(session.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{session.role}</td>
                  <td className="px-4 py-3">
                    {session.scores.scores.overall.toFixed(1)} / 10
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/${session.id}`}
                      className="text-indigo-300 transition hover:text-indigo-100"
                    >
                      View details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
