"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/Button";
import { useToast } from "@/components/ToastProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { publish } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const supabase = getSupabaseBrowserClient();

    try {
      const redirectBase = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const nextPath = "/practice";

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${redirectBase}/auth/callback?next=${encodeURIComponent(
            nextPath,
          )}`,
        },
      });

      if (error) {
        throw error;
      }

      publish("Check your inbox for the magic login link.", "success");
    } catch (error) {
      publish(
        error instanceof Error
          ? error.message
          : "Something went wrong sending the email.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-300">
          Work or personal email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none"
          placeholder="you@example.com"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Sending magic link..." : "Send magic link"}
      </Button>
    </form>
  );
}
