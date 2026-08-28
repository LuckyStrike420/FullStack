import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Untyped on purpose: the generic object engine builds queries against
// dynamic table names (from ObjectConfig.table) that don't fit Supabase's
// literal-union Database typing. src/types/database.ts still documents the
// real schema shape for reference.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component without a mutable cookie store
            // (e.g. during static rendering); the proxy refreshes the
            // session on every request, so this is safe to ignore.
          }
        },
      },
    },
  );
}
