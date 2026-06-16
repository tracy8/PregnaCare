import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anon) {
  // Surfaces the most common setup mistake instead of a cryptic runtime crash.
  console.error(
    "Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env"
  );
}

export const supabase = createClient(url, anon);
