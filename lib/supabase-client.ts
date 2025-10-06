import {
  createBrowserClient,
  createServerComponentClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const missingEnvMessage =
  "Supabase environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.";

function resolveSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(missingEnvMessage);
  }

  return { url, anonKey };
}

export function getSupabaseBrowserClient() {
  const { url, anonKey } = resolveSupabaseEnv();
  return createBrowserClient(url, anonKey);
}

export function getSupabaseServerComponentClient<Database = Record<string, never>>() {
  const { url, anonKey } = resolveSupabaseEnv();
  return createServerComponentClient<Database>(
    {
      cookies,
    },
    {
      supabaseUrl: url,
      supabaseKey: anonKey,
    },
  );
}

export function getSupabaseRouteHandlerClient<Database = Record<string, never>>() {
  const { url, anonKey } = resolveSupabaseEnv();
  return createRouteHandlerClient<Database>(
    {
      cookies,
    },
    {
      supabaseUrl: url,
      supabaseKey: anonKey,
    },
  );
}

export type TypedSupabaseClient<Database = Record<string, never>> =
  SupabaseClient<Database>;
