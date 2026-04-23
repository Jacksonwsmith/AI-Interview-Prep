"use client";

import { Button } from "@/components/Button";

export default function AgentsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-100">
      <h2 className="text-lg font-semibold">Agents could not load</h2>
      <p className="mt-2 text-red-100/80">
        The agents caught this route failure and left a retry path.
      </p>
      <Button type="button" intent="secondary" className="mt-4" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
