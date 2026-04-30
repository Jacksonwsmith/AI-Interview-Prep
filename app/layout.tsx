import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

import "@/styles/globals.css";

import LogoutButton from "@/components/LogoutButton";
import LogoMark from "@/components/LogoMark";
import { ToastProvider } from "@/components/ToastProvider";
import { buttonStyles } from "@/components/Button";
import { getOptionalServerSession, isAdminEmail } from "@/lib/auth-helpers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hire Ground",
  description: "AI interview prep and job application tracking",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session } = await getOptionalServerSession();

  const navLinks = [
    { href: "/resume-review", label: "Resume" },
    { href: "/practice", label: "Practice" },
    { href: "/projects", label: "Projects" },
    { href: "/interview-stories", label: "Stories" },
    { href: "/coffee-chats", label: "Coffee chats" },
    { href: "/tracker", label: "Tracker" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  if (session) {
    navLinks.push({ href: "/history", label: "History" });
    navLinks.push({ href: "/jobs", label: "Job lab" });
    navLinks.push({ href: "/jobs/portal", label: "Job portal" });
    if (isAdminEmail(session.user.email)) {
      navLinks.push({ href: "/admin/jobs", label: "Admin" });
      navLinks.push({ href: "/admin/agents", label: "Agents" });
    }
  }

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} ${jetBrainsMono.variable} text-slate-100 antialiased`}
      >
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-900/65 backdrop-blur-xl">
              <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2.5 transition hover:text-[#a5543f]"
                >
                  <LogoMark />
                  <span className="font-display text-xl font-semibold tracking-tight">
                    Hire Ground
                  </span>
                </Link>
                <div className="flex max-w-[76vw] items-center gap-1 overflow-x-auto rounded-full border border-slate-800/60 bg-[#fffaf2]/70 p-1 text-sm font-medium shadow-sm">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="shrink-0 rounded-full px-3 py-1.5 text-slate-300 transition hover:bg-[#efe4d3] hover:text-[#261f19]"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {session ? (
                    <LogoutButton intent="ghost" size="sm">
                      Sign out
                    </LogoutButton>
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
            <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 md:py-14">
              {children}
            </main>
            <footer className="border-t border-slate-800/70 bg-slate-900/70 py-6">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  © {new Date().getFullYear()} Hire Ground. Prep with intention.
                </p>
                <p className="flex items-center gap-3">
                  <Link
                    href="/about"
                    className="transition hover:text-slate-300"
                  >
                    About
                  </Link>
                  <span className="text-slate-600">|</span>
                  <Link
                    href="/privacy"
                    className="transition hover:text-slate-300"
                  >
                    Privacy
                  </Link>
                  <span className="text-slate-600">|</span>
                  <Link
                    href="https://supabase.com"
                    className="transition hover:text-slate-300"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Powered by Supabase
                  </Link>
                  <span className="text-slate-600">|</span>
                  <Link
                    href="https://openai.com"
                    className="transition hover:text-slate-300"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Powered by OpenAI
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
