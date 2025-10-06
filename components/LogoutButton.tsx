"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, type ButtonProps } from "@/components/Button";
import { useToast } from "@/components/ToastProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";

export default function LogoutButton(props: Omit<ButtonProps, "onClick">) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { publish } = useToast();

  const handleClick = async () => {
    setLoading(true);
    const supabase = getSupabaseBrowserClient();

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      publish("Signed out successfully.", "success");
      router.push("/login");
    } catch (error) {
      publish(error instanceof Error ? error.message : "Unable to sign out.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button {...props} onClick={handleClick} disabled={loading || props.disabled}>
      {loading ? "Signing out" : (props.children ?? "Sign out")}
    </Button>
  );
}
