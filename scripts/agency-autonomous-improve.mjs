import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const appDir = join(rootDir, "app");
const maxChanges = Number.parseInt(process.env.AGENCY_MAX_CHANGES ?? "1", 10);

const ignoredSegments = new Set(["api"]);

function routeFromPage(pagePath) {
  return dirname(pagePath)
    .replace(appDir, "")
    .replace(/\\/g, "/")
    .replace(/\/page$/, "") || "/";
}

function listPageDirs(current = appDir, pages = []) {
  readdirSync(current).forEach((entry) => {
    const next = join(current, entry);
    const stats = statSync(next);

    if (stats.isDirectory()) {
      if (!ignoredSegments.has(entry)) {
        listPageDirs(next, pages);
      }
      return;
    }

    if (entry === "page.tsx") {
      pages.push(current);
    }
  });

  return pages;
}

function titleFromRoute(route) {
  if (route === "/") {
    return "Page";
  }

  const lastSegment = route
    .split("/")
    .filter(Boolean)
    .at(-1)
    ?.replace(/[()[\]]/g, "")
    .replace(/-/g, " ");

  if (!lastSegment) {
    return "Page";
  }

  return lastSegment
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function loadingTemplate(route) {
  const title = titleFromRoute(route);

  return `export default function ${title.replace(/\W/g, "") || "Page"}Loading() {
  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 text-sm text-slate-300">
      Loading ${title}...
    </div>
  );
}
`;
}

function errorTemplate(route) {
  const title = titleFromRoute(route);

  return `"use client";

import { Button } from "@/components/Button";

export default function ${title.replace(/\W/g, "") || "Page"}Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-100">
      <h2 className="text-lg font-semibold">${title} could not load</h2>
      <p className="mt-2 text-red-100/80">
        The agents caught this route failure and left a retry path.
      </p>
      <Button type="button" intent="secondary" className="mt-4" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
`;
}

function findCandidates() {
  return listPageDirs()
    .map((pageDir) => {
      const pagePath = join(pageDir, "page.tsx");
      const route = routeFromPage(pagePath);
      return {
        pageDir,
        route,
        loadingPath: join(pageDir, "loading.tsx"),
        errorPath: join(pageDir, "error.tsx"),
      };
    })
    .filter(({ route }) => !route.includes("/api"))
    .flatMap((candidate) => {
      const improvements = [];
      if (!existsSync(candidate.loadingPath)) {
        improvements.push({
          kind: "loading",
          route: candidate.route,
          path: candidate.loadingPath,
          content: loadingTemplate(candidate.route),
        });
      }
      if (!existsSync(candidate.errorPath)) {
        improvements.push({
          kind: "error",
          route: candidate.route,
          path: candidate.errorPath,
          content: errorTemplate(candidate.route),
        });
      }
      return improvements;
    })
    .sort((a, b) => {
      const priority = ["/admin/agents", "/admin/jobs", "/jobs/portal", "/jobs", "/practice"];
      const aRank = priority.indexOf(a.route);
      const bRank = priority.indexOf(b.route);
      return (aRank === -1 ? 999 : aRank) - (bRank === -1 ? 999 : bRank);
    });
}

const candidates = findCandidates();
const selected = candidates.slice(0, Number.isFinite(maxChanges) ? Math.max(maxChanges, 0) : 1);

if (selected.length === 0) {
  console.log("No autonomous improvement candidates found.");
  process.exit(0);
}

selected.forEach((improvement) => {
  mkdirSync(dirname(improvement.path), { recursive: true });
  writeFileSync(improvement.path, improvement.content);
  console.log(
    `Created ${improvement.kind} state for ${improvement.route}: ${relative(
      rootDir,
      improvement.path,
    )}`,
  );
});
