import Link from "next/link";
import { redirect } from "next/navigation";

import LoginForm from "./login-form";
import { getOptionalServerSession } from "@/lib/auth-helpers";
import { buttonStyles } from "@/components/Button";

export default async function LoginPage() {
  const { session } = await getOptionalServerSession();

  if (session) {
    redirect("/practice");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 rounded-3xl border border-slate-800 bg-slate-950/70 p-10 text-slate-200 shadow">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-semibold text-slate-50">
          Log in to Interview Coach
        </h1>
        <p className="text-sm text-slate-400">
          We will email you a magic link. You must confirm the link on this device to
          access your dashboard and practice sessions.
        </p>
      </div>
      <LoginForm />
      <div className="text-center text-xs text-slate-500">
        By continuing you agree to our{" "}
        <Link href="#" className="text-indigo-300 hover:text-indigo-200">
          terms of service
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-indigo-300 hover:text-indigo-200">
          privacy policy
        </Link>
        .
      </div>
      <Link href="/" className={buttonStyles({ intent: "ghost" })}>
        Back to landing
      </Link>
    </div>
  );
}
