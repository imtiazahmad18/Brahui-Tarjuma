import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isPlaceholder =
  !supabaseUrl ||
  supabaseUrl.includes("placeholder-project") ||
  !supabaseAnonKey ||
  supabaseAnonKey.includes("placeholder-anon-key");

export const isSupabaseConfigured = !isPlaceholder;

export const supabase = createClient(
  isConfiguredUrl(supabaseUrl) ? supabaseUrl : "https://placeholder-project.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

function isConfiguredUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
