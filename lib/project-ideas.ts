export type ProjectIdea = {
  slug: string;
  project: string;
  description: string;
  tech: string[];
  walkthrough: string[];
  resumeBullet: string;
  stretch: string[];
};

export type ProjectArea = {
  slug: string;
  industry: string;
  headline: string;
  roleFit: string;
  projects: ProjectIdea[];
};

export const projectAreas = [
  {
    slug: "consulting",
    industry: "Consulting / Big 4",
    headline: "Build evidence that you can structure messy business problems.",
    roleFit:
      "Best for consulting, advisory, risk, operations, and business analyst interviews.",
    projects: [
      {
        slug: "operations-kpi-dashboard",
        project: "Operations KPI dashboard",
        description:
          "Turn a messy operations dataset into an executive dashboard with metrics, risks, and recommendations.",
        tech: ["SQL", "Python", "Excel", "Power BI"],
        walkthrough: [
          "Clean the source data and document assumptions.",
          "Define KPIs for cost, cycle time, quality, and throughput.",
          "Build a dashboard with filters for team, date, and region.",
          "Write a one-page insight summary with three recommendations.",
        ],
        resumeBullet:
          "Built an operations KPI dashboard using SQL, Python, and Power BI to identify cost and cycle-time drivers across business units.",
        stretch: [
          "Add scenario modeling for best, base, and worst cases.",
          "Create an executive memo that recommends one operational change.",
        ],
      },
      {
        slug: "market-entry-brief",
        project: "Market entry brief",
        description:
          "Create a consulting-style market sizing and competitor brief for a new product or region.",
        tech: ["Excel", "Research", "Slides", "Charts"],
        walkthrough: [
          "Choose a realistic product and target geography.",
          "Estimate market size with clear assumptions.",
          "Compare three competitors across pricing, positioning, and channels.",
          "Package findings into a concise slide deck.",
        ],
        resumeBullet:
          "Produced a market entry analysis with sizing assumptions, competitor benchmarking, and go-to-market recommendations.",
        stretch: [
          "Add sensitivity analysis around adoption and pricing.",
          "Record a five-minute presentation walking through the recommendation.",
        ],
      },
      {
        slug: "process-improvement-case",
        project: "Process improvement case",
        description:
          "Map a broken workflow, quantify bottlenecks, and propose a measurable improvement plan.",
        tech: ["Lucidchart", "Excel", "SQL", "Process Mapping"],
        walkthrough: [
          "Pick a workflow such as onboarding, ticket triage, or invoice approval.",
          "Map the current-state process and identify friction points.",
          "Estimate time saved by removing or automating bottlenecks.",
          "Create a future-state workflow and implementation plan.",
        ],
        resumeBullet:
          "Modeled a process improvement case that quantified bottlenecks and proposed automation steps to reduce cycle time.",
        stretch: [
          "Build a before-and-after KPI scorecard.",
          "Add risk, owner, and timeline fields to the implementation plan.",
        ],
      },
    ],
  },
  {
    slug: "finance-accounting",
    industry: "Finance / Accounting",
    headline: "Show that you can explain numbers, not just calculate them.",
    roleFit:
      "Best for audit, tax, FP&A, accounting advisory, corporate finance, and analyst roles.",
    projects: [
      {
        slug: "variance-analysis-report",
        project: "Variance analysis report",
        description:
          "Automate a monthly comparison of budget vs. actuals and flag the accounts that need explanation.",
        tech: ["Python", "pandas", "SQL", "Charts"],
        walkthrough: [
          "Import budget and actual CSV files.",
          "Calculate absolute and percentage variances.",
          "Flag accounts above a materiality threshold.",
          "Generate a summary table and narrative explanation.",
        ],
        resumeBullet:
          "Automated budget-to-actual variance analysis with Python and SQL, surfacing material account-level drivers for review.",
        stretch: [
          "Add rolling month-over-month trend charts.",
          "Export the final report to Excel with formatted tabs.",
        ],
      },
      {
        slug: "revenue-recognition-simulator",
        project: "Revenue recognition simulator",
        description:
          "Model how subscription contracts turn into recognized revenue over time.",
        tech: ["Excel", "Python", "Accounting Logic", "Charts"],
        walkthrough: [
          "Create sample contracts with start dates, terms, and prices.",
          "Calculate deferred and recognized revenue by month.",
          "Build a roll-forward schedule.",
          "Explain the accounting treatment in plain English.",
        ],
        resumeBullet:
          "Built a revenue recognition simulator to model deferred revenue and monthly recognition across subscription contracts.",
        stretch: [
          "Add contract modifications and cancellations.",
          "Create a reconciliation view for beginning and ending balances.",
        ],
      },
      {
        slug: "audit-sampling-workbook",
        project: "Audit sampling workbook",
        description:
          "Create a workbook that selects sample transactions and documents audit rationale.",
        tech: ["Excel", "SQL", "Controls", "Documentation"],
        walkthrough: [
          "Generate or source a transaction population.",
          "Filter for risk signals such as high value or unusual timing.",
          "Select a sample and explain the selection method.",
          "Create a testing summary with exceptions and conclusions.",
        ],
        resumeBullet:
          "Designed an audit sampling workbook to identify high-risk transactions and document testing conclusions.",
        stretch: [
          "Add stratified sampling by transaction value.",
          "Build an exceptions dashboard for reviewer signoff.",
        ],
      },
    ],
  },
  {
    slug: "tech-product",
    industry: "Tech / Product",
    headline: "Build product proof that connects data, users, and automation.",
    roleFit:
      "Best for software engineering, product analyst, product manager, data analyst, and AI builder roles.",
    projects: [
      {
        slug: "ai-applicant-tracker",
        project: "AI applicant tracker",
        description:
          "Build a small app that tracks roles, extracts job requirements, and suggests tailored next steps.",
        tech: ["Next.js", "Supabase", "OpenAI API", "Auth"],
        walkthrough: [
          "Design tables for jobs, statuses, notes, and generated insights.",
          "Build CRUD flows for adding and updating applications.",
          "Use AI to extract requirements from job descriptions.",
          "Deploy the app and document the product decisions.",
        ],
        resumeBullet:
          "Built and deployed an AI-powered applicant tracker with Next.js, Supabase, and OpenAI to turn job descriptions into tailored action plans.",
        stretch: [
          "Add email reminders for follow-ups.",
          "Create analytics for pipeline stage conversion rates.",
        ],
      },
      {
        slug: "customer-feedback-classifier",
        project: "Customer feedback classifier",
        description:
          "Classify raw customer feedback into themes, sentiment, urgency, and product opportunities.",
        tech: ["Python", "OpenAI API", "Next.js", "Charts"],
        walkthrough: [
          "Collect or generate realistic feedback examples.",
          "Define categories for sentiment, theme, and urgency.",
          "Classify entries and store structured results.",
          "Build a dashboard that highlights top product opportunities.",
        ],
        resumeBullet:
          "Developed an AI feedback classifier that grouped customer comments by sentiment, theme, and urgency to prioritize product improvements.",
        stretch: [
          "Add human review controls for correcting labels.",
          "Compare AI classifications against keyword-based rules.",
        ],
      },
      {
        slug: "feature-adoption-dashboard",
        project: "Feature adoption dashboard",
        description:
          "Analyze simulated product usage data to show which features drive engagement.",
        tech: ["SQL", "Python", "Postgres", "Visualization"],
        walkthrough: [
          "Create event data for users, sessions, and feature usage.",
          "Write SQL queries for adoption, retention, and activation.",
          "Visualize cohorts and usage trends.",
          "Recommend one product experiment based on the data.",
        ],
        resumeBullet:
          "Analyzed feature adoption data with SQL and Python to identify engagement drivers and recommend a product experiment.",
        stretch: [
          "Add cohort retention by signup month.",
          "Build an A/B test readout with confidence intervals.",
        ],
      },
    ],
  },
] satisfies ProjectArea[];

export function getProjectArea(slug: string) {
  return projectAreas.find((area) => area.slug === slug);
}

export function getProjectIdea(area: ProjectArea, slug?: string) {
  return area.projects.find((project) => project.slug === slug) ?? area.projects[0];
}
