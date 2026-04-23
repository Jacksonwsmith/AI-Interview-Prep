export type PortalPosting = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  url: string;
  snippet: string;
  source: string;
  lastSeenAt: string;
  postedAt?: string | null;
};

export type PortalApplication = {
  id: string;
  created_at: string;
  job_title: string;
  company: string;
  focus_areas: string | null;
  generated_output: {
    applicationSummary?: string;
  } | null;
};

export type PortalFilters = {
  q?: string | string[];
  company?: string | string[];
  location?: string | string[];
  days?: string | string[];
  sort?: string | string[];
  view?: string | string[];
};

const topSkillTerms = [
  "react",
  "next",
  "typescript",
  "python",
  "sql",
  "data",
  "analytics",
  "product",
  "security",
  "cloud",
  "api",
  "platform",
  "ai",
  "machine learning",
  "frontend",
  "backend",
  "sales",
  "marketing",
  "operations",
  "finance",
  "customer success",
  "project management",
  "research",
  "communications",
  "design",
  "accounting",
];

const blockedApplicationHosts = ["job-boards.greenhouse.io", "boards.greenhouse.io"];

function paramValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function getPortalFilterState(filters: PortalFilters) {
  return {
    q: paramValue(filters.q)?.trim() ?? "",
    company: paramValue(filters.company)?.trim() ?? "",
    location: paramValue(filters.location)?.trim() ?? "",
    days: paramValue(filters.days)?.trim() ?? "",
    sort: paramValue(filters.sort)?.trim() || "recent",
    view: paramValue(filters.view)?.trim() || "all",
  };
}

export function extractPostingSkills(posting: PortalPosting) {
  const haystack = normalize(`${posting.title} ${posting.snippet}`);
  return topSkillTerms.filter((term) => haystack.includes(term)).slice(0, 5);
}

export function getPostingSourceLabel(source: string) {
  if (source.startsWith("arbeitnow")) {
    return "Arbeitnow";
  }
  if (source.startsWith("remoteok")) {
    return "Remote OK";
  }
  if (source.startsWith("lever:")) {
    return "Lever";
  }
  try {
    return new URL(source).hostname.replace(/^www\./, "");
  } catch {
    return source || "Imported";
  }
}

export function isValidApplicationUrl(url: string) {
  if (!url.trim()) {
    return false;
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }
    if (blockedApplicationHosts.some((blockedHost) => host === blockedHost)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getPostingFreshness(posting: PortalPosting) {
  const timestamp = new Date(posting.postedAt ?? posting.lastSeenAt).getTime();
  if (!Number.isFinite(timestamp)) {
    return { label: "Recently seen", rank: 30 };
  }

  const ageDays = Math.max(0, Math.round((Date.now() - timestamp) / 86_400_000));
  if (ageDays === 0) {
    return { label: "Today", rank: 0 };
  }
  if (ageDays === 1) {
    return { label: "Yesterday", rank: 1 };
  }
  if (ageDays <= 7) {
    return { label: `${ageDays} days ago`, rank: ageDays };
  }
  if (ageDays <= 30) {
    return { label: `${ageDays} days ago`, rank: ageDays };
  }
  return { label: "30+ days ago", rank: ageDays };
}

export function getPostingFit(posting: PortalPosting) {
  const skills = extractPostingSkills(posting);
  const remoteSignal = /remote|hybrid/i.test(`${posting.location ?? ""} ${posting.title}`);
  const senioritySignal = /senior|lead|staff|principal|manager/i.test(posting.title);
  const score = Math.min(98, 52 + skills.length * 8 + (remoteSignal ? 8 : 0) + (senioritySignal ? 6 : 0));

  if (score >= 82) {
    return { score, label: "Strong match" };
  }
  if (score >= 68) {
    return { score, label: "Good match" };
  }
  return { score, label: "Review fit" };
}

export function applyPortalFilters(
  postings: PortalPosting[],
  applications: PortalApplication[],
  filters: PortalFilters,
) {
  const state = getPortalFilterState(filters);
  const trackedKeys = new Set(
    applications.map((application) =>
      normalize(`${application.company}::${application.job_title}`),
    ),
  );

  let next = postings.filter((posting) => {
    if (!isValidApplicationUrl(posting.url)) {
      return false;
    }
    if (state.company && !normalize(posting.company).includes(normalize(state.company))) {
      return false;
    }
    if (state.location && !normalize(posting.location ?? "").includes(normalize(state.location))) {
      return false;
    }
    if (state.q) {
      const search = normalize(state.q);
      const haystack = normalize(
        `${posting.title} ${posting.company} ${posting.location ?? ""} ${posting.snippet}`,
      );
      if (!haystack.includes(search)) {
        return false;
      }
    }
    if (state.days) {
      const days = Number(state.days);
      if (Number.isFinite(days) && days > 0) {
        const timestamp = new Date(posting.postedAt ?? posting.lastSeenAt).getTime();
        const cutoff = Date.now() - days * 86_400_000;
        if (!Number.isFinite(timestamp) || timestamp < cutoff) {
          return false;
        }
      }
    }
    if (state.view === "tracked") {
      return trackedKeys.has(normalize(`${posting.company}::${posting.title}`));
    }
    if (state.view === "fresh") {
      return getPostingFreshness(posting).rank <= 7;
    }
    if (state.view === "remote") {
      return /remote|hybrid/i.test(`${posting.location ?? ""} ${posting.title} ${posting.snippet}`);
    }
    return true;
  });

  if (state.sort === "fit") {
    next = [...next].sort((a, b) => getPostingFit(b).score - getPostingFit(a).score);
  } else if (state.sort === "company") {
    next = [...next].sort((a, b) => a.company.localeCompare(b.company));
  } else {
    next = [...next].sort(
      (a, b) =>
        new Date(b.postedAt ?? b.lastSeenAt).getTime() -
        new Date(a.postedAt ?? a.lastSeenAt).getTime(),
    );
  }

  return next;
}

export function getPortalStats(postings: PortalPosting[], applications: PortalApplication[]) {
  const freshCount = postings.filter((posting) => getPostingFreshness(posting).rank <= 7).length;
  const remoteCount = postings.filter((posting) =>
    /remote|hybrid/i.test(`${posting.location ?? ""} ${posting.title} ${posting.snippet}`),
  ).length;
  const companies = new Set(postings.map((posting) => normalize(posting.company)).filter(Boolean));
  const trackedThisWeek = applications.filter((application) => {
    const created = new Date(application.created_at).getTime();
    return Number.isFinite(created) && created >= Date.now() - 7 * 86_400_000;
  }).length;

  return {
    totalPostings: postings.length,
    freshCount,
    remoteCount,
    companyCount: companies.size,
    trackedCount: applications.length,
    trackedThisWeek,
  };
}
