import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";

import "@/styles/globals.css";

import LogoutButton from "@/components/LogoutButton";
import { ToastProvider } from "@/components/ToastProvider";
import { buttonStyles } from "@/components/Button";
import { getOptionalServerSession } from "@/lib/auth-helpers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interview Coach",
  description: "AI-powered mock interview practice",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session } = await getOptionalServerSession();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-slate-100`}
      >
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
              <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
                <Link
                  href="/"
                  className="text-lg font-semibold tracking-tight text-white"
                >
                  Interview Coach
                </Link>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <Link
                    href="/practice"
                    className="text-slate-300 transition hover:text-white"
                  >
                    Practice
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-slate-300 transition hover:text-white"
                  >
                    Dashboard
                  </Link>
                  {session ? (
                    <LogoutButton intent="ghost" size="sm" />
                  ) : (
                    <Link
                      href="/login"
                      className={buttonStyles({ intent: "secondary", size: "sm" })}
                    >
                      Log in
                    </Link>
                  )}
                </div>
              </nav>
            </header>
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">{children}</main>
            <footer className="border-t border-slate-800 bg-slate-900/60 py-6">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  © {new Date().getFullYear()} Interview Coach. Built with Next.js,
                  Supabase, and OpenAI.
                </p>
                <p>
                  <Link
                    href="https://supabase.com"
                    className="hover:text-slate-300"
                    target="_blank"
                  >
                    Powered by Supabase
                  </Link>
                </p>
              </div>
            </footer>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
