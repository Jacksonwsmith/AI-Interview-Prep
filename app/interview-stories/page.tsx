import { MessageCircle, Send, ThumbsUp } from "lucide-react";

import { Button } from "@/components/Button";
import { interviewStories } from "@/lib/interview-stories";

export const metadata = {
  title: "Interview Stories | Hire Ground",
  description: "Community-style interview posts and lessons from candidates.",
};

export default function InterviewStoriesPage() {
  return (
    <div className="space-y-8 pb-10">
      <header className="grid gap-6 rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6 shadow-lg lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Interview stories
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold leading-tight text-slate-100 md:text-5xl">
            A reddit-style board for real interview notes.
          </h1>
        </div>
        <p className="text-sm leading-6 text-slate-300">
          Candidates can share what they were asked, how they answered, what surprised
          them, and what they would do differently next time. The first version is a
          curated preview while posting and moderation are wired up.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.72fr]">
        <div className="space-y-4">
          {interviewStories.map((story) => (
            <article
              key={story.title}
              className="rounded-2xl border border-slate-800/60 bg-[#fffaf2] p-5 shadow-lg"
            >
              <div className="flex gap-4">
                <div className="flex w-12 shrink-0 flex-col items-center rounded-2xl border border-[#cdbca6] bg-[#f3e8d7] py-3 text-xs font-semibold text-[#8f3e2e]">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="mt-1">{story.votes}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    {story.role} · {story.companyType}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-100">
                    {story.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {story.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {story.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#cdbca6] bg-[#f3e8d7] px-2.5 py-1 text-xs font-medium text-[#261f19]"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-slate-500">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {story.replies} replies
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="rounded-3xl border border-slate-800/60 bg-slate-950/70 p-5 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-100">Post your interview</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Soon, candidates will be able to post anonymous interview recaps by role,
            industry, company type, question style, and outcome.
          </p>
          <form className="mt-5 space-y-3">
            <input
              disabled
              placeholder="Post title"
              className="w-full rounded-xl border border-slate-800/60 bg-[#fffaf2] px-3 py-2 text-sm"
            />
            <textarea
              disabled
              placeholder="What did they ask? What would you tell the next person?"
              className="min-h-32 w-full rounded-xl border border-slate-800/60 bg-[#fffaf2] px-3 py-2 text-sm"
            />
            <Button type="button" intent="primary" className="w-full" disabled>
              <Send className="h-4 w-4" />
              Posting coming soon
            </Button>
          </form>
        </aside>
      </section>
    </div>
  );
}
