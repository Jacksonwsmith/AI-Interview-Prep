import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Clock3,
  Compass,
  Filter,
  FolderKanban,
  Gauge,
  MapPin,
  Search,
  Sparkles,
  Star,
} from "lucide-react";

import { requireServerSession } from "@/lib/auth-helpers";
import { isAirtableConfigured, listAirtableJobPostings } from "@/lib/airtable";
import {
  applyPortalFilters,
  extractPostingSkills,
  getPortalFilterState,
  getPortalStats,
  getPostingFit,
  getPostingFreshness,
  getPostingSourceLabel,
  isValidApplicationUrl,
  type PortalApplication,
  type PortalPosting,
} from "@/lib/job-portal";
import { listSupabaseJobPostings } from "@/lib/supabase-postings";
import PortalSyncPanel from "./sync-panel";

export const revalidate = 0;

export default async function JobsPortalPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    company?: string;
    location?: string;
    days?: string;
    sort?: string;
    view?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = getPortalFilterState(resolvedSearchParams ?? {});
  const { session, supabase } = await requireServerSession();
  const viewHref = (view: string) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.company) params.set("company", filters.company);
    if (filters.location) params.set("location", filters.location);
    if (filters.days) params.set("days", filters.days);
    if (filters.sort) params.set("sort", filters.sort);
    params.set("view", view);
    return `/jobs/portal?${params.toString()}`;
  };

  if (!session || !supabase) {
    return (
      <div className="space-y-4 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-sm text-slate-300">
        <p>Sign in to open your Job Portal and sync live postings.</p>
        <Link
          href="/login"
          className="inline-flex items-center rounded-md border border-[#eaaa00]/40 bg-[#eaaa00]/10 px-3 py-2 text-xs font-medium text-[#ffe49a] hover:bg-[#eaaa00]/20"
        >
          Log in
        </Link>
      </div>
    );
  }

  const { data, error } = await supabase
    .from("job_applications")
    .select("id, created_at, job_title, company, focus_areas, generated_output")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to load job portal", error);
  }

  const applications = (data ?? []) as PortalApplication[];
  const airtableEnabled = isAirtableConfigured();
  let feedError: string | null = null;
  let postings: PortalPosting[] = [];

  try {
    postings = airtableEnabled
      ? (await listAirtableJobPostings(150)).map((record) => ({
          id: record.id,
          title: record.fields.Title ?? "Untitled role",
          company: record.fields.Company ?? "Unknown company",
          location: record.fields.Location ?? null,
          url: record.fields.URL ?? "",
          snippet: record.fields.Snippet ?? "",
          source: record.fields.Source ?? "airtable",
          lastSeenAt: record.fields.LastSeenAt ?? record.createdTime,
          postedAt: record.fields.PostedAt ?? null,
        }))
      : (await listSupabaseJobPostings(supabase, 150)).map((row) => ({
          id: row.id,
          title: row.title,
          company: row.company,
          location: row.location,
          url: row.url,
          snippet: row.snippet ?? "",
          source: row.source,
          lastSeenAt: row.last_seen_at,
          postedAt: row.posted_at,
        }));
  } catch (jobFeedError) {
    console.error("Failed to load job posting feed", jobFeedError);
    feedError = airtableEnabled
      ? "Airtable listings are unavailable right now. Check the Airtable connection or use the Job Lab manually."
      : "Saved listings are unavailable right now. Try syncing again or use the Job Lab manually.";
  }

  const stats = getPortalStats(postings, applications);
  const filteredPostings = applyPortalFilters(postings, applications, filters);
  const featured = filteredPostings.slice(0, 3);
  const listingRows = filteredPostings.slice(3, 36);
  const trackedKeys = new Set(
    applications.map((application) =>
      `${application.company.toLowerCase()}::${application.job_title.toLowerCase()}`,
    ),
  );
  const pipelineStages = [
    { label: "Saved", count: stats.trackedCount },
    { label: "Prepared", count: applications.filter((item) => item.generated_output).length },
    { label: "This week", count: stats.trackedThisWeek },
  ];

  return (
    <div className="space-y-8">
      <header className="grid gap-6 rounded-3xl border border-slate-800/60 bg-slate-900/65 p-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[#eaaa00]/40 bg-[#eaaa00]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#ffe39f]">
            <FolderKanban className="h-3.5 w-3.5" />
            Application Portal
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-50">
            Find roles, prep faster, track every application.
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
            A job-board workspace inspired by LinkedIn, Handshake, Indeed, and ZipRecruiter:
            recent listings, match signals, application actions, and your active pipeline in
            one place.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-md border border-[#eaaa00]/40 bg-[#eaaa00]/10 px-3 py-2 text-xs font-medium text-[#ffe49a] hover:bg-[#eaaa00]/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Prepare application
            </Link>
            <Link
              href="/tracker"
              className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:border-[#eaaa00]/70"
            >
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Open tracker
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Pipeline</p>
          <div className="mt-4 grid gap-3">
            {pipelineStages.map((stage) => (
              <div key={stage.label} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{stage.label}</span>
                <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-100">
                  {stage.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <PortalSyncPanel />

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Compass} label="Recent listings" value={stats.totalPostings} />
        <StatCard icon={Clock3} label="Fresh this week" value={stats.freshCount} />
        <StatCard icon={MapPin} label="Remote or hybrid" value={stats.remoteCount} />
        <StatCard icon={Building2} label="Companies" value={stats.companyCount} />
      </section>

      <section className="space-y-4">
        <form
          method="GET"
          className="grid gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr_0.8fr_auto]"
        >
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              name="q"
              aria-label="Search jobs"
              defaultValue={filters.q}
              placeholder="Search title, company, keyword"
              className="w-full rounded-lg border border-slate-700/70 bg-slate-950/80 py-2 pl-9 pr-3 text-sm text-white focus:border-[#eaaa00] focus:outline-none"
            />
          </label>
          <input
            name="company"
            aria-label="Filter by company"
            defaultValue={filters.company}
            placeholder="Company"
            className="rounded-lg border border-slate-700/70 bg-slate-950/80 px-3 py-2 text-sm text-white focus:border-[#eaaa00] focus:outline-none"
          />
          <input
            name="location"
            aria-label="Filter by location"
            defaultValue={filters.location}
            placeholder="Location"
            className="rounded-lg border border-slate-700/70 bg-slate-950/80 px-3 py-2 text-sm text-white focus:border-[#eaaa00] focus:outline-none"
          />
          <select
            name="days"
            aria-label="Filter by posting age"
            defaultValue={filters.days}
            className="rounded-lg border border-slate-700/70 bg-slate-950/80 px-3 py-2 text-sm text-white focus:border-[#eaaa00] focus:outline-none"
          >
            <option value="">Any time</option>
            <option value="1">Today</option>
            <option value="7">Past week</option>
            <option value="30">Past month</option>
          </select>
          <select
            name="sort"
            aria-label="Sort jobs"
            defaultValue={filters.sort}
            className="rounded-lg border border-slate-700/70 bg-slate-950/80 px-3 py-2 text-sm text-white focus:border-[#eaaa00] focus:outline-none"
          >
            <option value="recent">Most recent</option>
            <option value="fit">Best match</option>
            <option value="company">Company</option>
          </select>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#eaaa00]/50 bg-[#eaaa00]/10 px-3 py-2 text-sm font-medium text-[#ffe49a] hover:bg-[#eaaa00]/20"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <input type="hidden" name="view" value={filters.view} />
        </form>

        <div className="flex flex-wrap gap-2">
          {[
            ["all", "All jobs"],
            ["fresh", "Fresh"],
            ["remote", "Remote"],
            ["tracked", "Tracked"],
          ].map(([view, label]) => (
            <Link
              key={view}
              href={viewHref(view)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                filters.view === view
                  ? "border-[#eaaa00]/60 bg-[#eaaa00]/10 text-[#ffe49a]"
                  : "border-slate-700 text-slate-300 hover:border-[#eaaa00]/60"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {filteredPostings.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-sm text-slate-300">
          {feedError ?? "No listings match this view. Run sync, clear filters, or broaden the search."}
        </section>
      ) : (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Recommended Jobs</h2>
              <p className="text-sm text-slate-400">
                Showing {filteredPostings.length} roles from{" "}
                {airtableEnabled ? "Airtable" : "Supabase"}.
              </p>
            </div>
            <span className="rounded-full border border-[#eaaa00]/40 bg-[#eaaa00]/10 px-3 py-1 text-xs font-medium text-[#f4d27d]">
              Recent first
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {featured.map((posting) => (
              <PostingCard
                key={posting.id}
                posting={posting}
                tracked={trackedKeys.has(
                  `${posting.company.toLowerCase()}::${posting.title.toLowerCase()}`,
                )}
                featured
              />
            ))}
          </div>

          <div className="grid gap-3">
            {listingRows.map((posting) => (
              <PostingCard
                key={posting.id}
                posting={posting}
                tracked={trackedKeys.has(
                  `${posting.company.toLowerCase()}::${posting.title.toLowerCase()}`,
                )}
              />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Tracked Applications</h2>
            <p className="text-sm text-slate-400">
              Your prepared applications stay connected to the job lab.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:border-[#eaaa00]/70"
          >
            Add from Job Lab
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-sm text-slate-300">
            No tracked applications yet. Prepare a role to create your first entry.
          </div>
        ) : (
          <div className="grid gap-3">
            {applications.map((application) => (
              <article
                key={application.id}
                className="grid gap-4 rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4 md:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {new Date(application.created_at).toLocaleString()}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-slate-100">
                    {application.job_title}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-300">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    {application.company}
                  </p>
                  {application.generated_output?.applicationSummary && (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-300">
                      {application.generated_output.applicationSummary}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 md:justify-end">
                  <span className="rounded-full border border-[#eaaa00]/40 bg-[#eaaa00]/10 px-3 py-1 text-xs font-medium text-[#f4d27d]">
                    Prepared
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Compass;
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5">
      <p className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
        <Icon className="h-3.5 w-3.5 text-[#eaaa00]" />
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-slate-100">{value}</p>
    </article>
  );
}

function PostingCard({
  posting,
  tracked,
  featured = false,
}: {
  posting: PortalPosting;
  tracked: boolean;
  featured?: boolean;
}) {
  const fit = getPostingFit(posting);
  const freshness = getPostingFreshness(posting);
  const skills = extractPostingSkills(posting);
  const hasApplicationUrl = isValidApplicationUrl(posting.url);

  return (
    <article
      className={`rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4 ${
        featured ? "min-h-[260px]" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">{getPostingSourceLabel(posting.source)}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-100">{posting.title}</h3>
          <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-300">
            <Building2 className="h-4 w-4 text-slate-500" />
            {posting.company}
          </p>
          {posting.location && (
            <p className="mt-1 inline-flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              {posting.location}
            </p>
          )}
        </div>
        <div className="space-y-2 text-right">
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-100">
            <Gauge className="h-3.5 w-3.5" />
            {fit.label}
          </span>
          {tracked && (
            <p className="inline-flex items-center gap-1 rounded-full border border-[#eaaa00]/40 bg-[#eaaa00]/10 px-2.5 py-1 text-xs text-[#ffe49a]">
              <Star className="h-3.5 w-3.5" />
              Tracked
            </p>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">Posted {freshness.label}</p>
      {posting.snippet && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-300">
          {posting.snippet}
        </p>
      )}
      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {hasApplicationUrl && (
          <a
            href={posting.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-[#eaaa00]/40 px-3 py-1 text-xs font-medium text-[#f4d27d] transition hover:bg-[#eaaa00]/10"
          >
            Apply
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
        <Link
          href={`/jobs?jobTitle=${encodeURIComponent(posting.title)}&company=${encodeURIComponent(posting.company)}&jobUrl=${encodeURIComponent(posting.url)}`}
          className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-[#eaaa00]/70 hover:text-[#ffe49a]"
        >
          Prep package
        </Link>
        <Link
          href={`/resume-review?jobTitle=${encodeURIComponent(posting.title)}&company=${encodeURIComponent(posting.company)}`}
          className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-[#eaaa00]/70 hover:text-[#ffe49a]"
        >
          Tailor resume
        </Link>
      </div>
    </article>
  );
}
