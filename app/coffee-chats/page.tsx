import { CalendarDays, Database, MessageSquareText, UsersRound } from "lucide-react";

export const metadata = {
  title: "Coffee Chats | Hire Ground",
  description: "Request coffee chats with consultants and professionals.",
};

const requestFlow = [
  {
    title: "Tell us your target",
    description: "Share role interests, industry, timeline, and what you want to learn.",
    icon: MessageSquareText,
  },
  {
    title: "Match with a consultant",
    description: "A future consultant database will match requests by industry and background.",
    icon: Database,
  },
  {
    title: "Schedule the chat",
    description: "Candidates would receive available times and prep prompts before the call.",
    icon: CalendarDays,
  },
];

export default function CoffeeChatsPage() {
  return (
    <div className="space-y-8 pb-10">
      <header className="rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6 shadow-lg">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
          <UsersRound className="h-4 w-4 text-[#8f3e2e]" />
          Under construction
        </p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-tight text-slate-100 md:text-5xl">
          Request coffee chats with real consultants.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
          This future feature will let candidates request coffee chats with verified
          consultants and professionals from a Hire Ground database, then get matched
          based on target industry, role, location, and conversation goals.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {requestFlow.map((step) => (
          <article
            key={step.title}
            className="rounded-2xl border border-slate-800/60 bg-[#fffaf2] p-5 shadow-lg"
          >
            <step.icon className="h-7 w-7 text-[#8f3e2e]" />
            <h2 className="mt-4 text-lg font-semibold text-slate-100">{step.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{step.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
