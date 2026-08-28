import { createBrowserClient } from "@supabase/ssr";

// Untyped on purpose — see src/lib/supabase/server.ts.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
