import { redirect } from "next/navigation";
import type { Session } from "@supabase/auth-helpers-nextjs";
import type { TypedSupabaseClient } from "./supabase-server";
import {
  getSupabaseRouteHandlerClient,
  getSupabaseServerComponentClient,
} from "./supabase-server";

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function stubSession() {
  return {
    session: null as Session | null,
    supabase: null as unknown as TypedSupabaseClient,
  };
}

export async function requireServerSession() {
  if (!hasSupabaseEnv()) {
    // Allow unauthenticated access in dev mode when Supabase isn't configured yet.
    if (process.env.NEXT_PUBLIC_DEV_MODE === "1") {
      return stubSession();
    }

    throw new Error(
      "Supabase environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.",
    );
  }

  const supabase = getSupabaseServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return { session, supabase } as { session: Session; supabase: TypedSupabaseClient };
}

export async function getOptionalServerSession() {
  if (!hasSupabaseEnv()) {
    if (process.env.NEXT_PUBLIC_DEV_MODE === "1") {
      return stubSession();
    }

    throw new Error(
      "Supabase environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.",
    );
  }

  const supabase = getSupabaseServerComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { session: session ?? null, supabase } as {
    session: Session | null;
    supabase: TypedSupabaseClient;
  };
}

export async function getRouteHandlerSession() {
  if (!hasSupabaseEnv()) {
    if (process.env.NEXT_PUBLIC_DEV_MODE === "1") {
      return stubSession();
    }

    throw new Error(
      "Supabase environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.",
    );
  }

  const supabase = getSupabaseRouteHandlerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { session: session ?? null, supabase } as {
    session: Session | null;
    supabase: TypedSupabaseClient;
  };
}
