import { redirect } from "next/navigation";
import type { Session } from "@supabase/auth-helpers-nextjs";
import type { TypedSupabaseClient } from "./supabase-client";
import {
  getSupabaseRouteHandlerClient,
  getSupabaseServerComponentClient,
} from "./supabase-client";

export async function requireServerSession() {
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
  const supabase = getSupabaseRouteHandlerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { session: session ?? null, supabase } as {
    session: Session | null;
    supabase: TypedSupabaseClient;
  };
}
